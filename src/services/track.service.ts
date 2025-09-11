/**
 * Track Database Service
 * Handles all track-related database operations with Supabase
 */

import { supabase, uploadFile, STORAGE_BUCKETS } from '@/src/lib/supabase'
import type { Track, TrackInsert, TrackUpdate, NFTTier, NFTTierInsert, TierBenefits } from '@/src/types/supabase'
import { ArtistService } from './artist.service'
import { toast } from 'sonner'

export class TrackService {
  /**
   * Create a new track with NFT tiers
   */
  static async createTrack(data: {
    artistId: string
    title: string
    description?: string
    genre: string
    duration?: number
    bpm?: number
    key?: string
    isExplicit: boolean
    rightsCleared: boolean
    releaseDate: Date
    tags?: string[]
    audioFile?: File
    coverArtFile?: File
    lyricsFile?: File
    tiers: Array<{
      tierName: 'bronze' | 'silver' | 'gold' | 'platinum'
      priceEth: string
      maxSupply: number
      enabled: boolean
      benefits: TierBenefits
    }>
  }): Promise<{ track: Track | null; error?: string }> {
    try {
      let audioUrl: string | null = null
      let coverArtUrl: string | null = null
      let lyricsUrl: string | null = null
      let ipfsAudioHash: string | null = null
      let ipfsCoverHash: string | null = null
      let ipfsLyricsHash: string | null = null

      const { artist } = await ArtistService.getArtistById(data.artistId)
      if (!artist) {
        return { track: null, error: 'Artist not found' }
      }

      const walletAddress = artist.wallet_address

      // Upload audio file
      if (data.audioFile) {
        const audioPath = `${walletAddress}/${data.title}/audio-${Date.now()}.${data.audioFile.name.split('.').pop()}`
        const uploadResult = await uploadFile(STORAGE_BUCKETS.AUDIO_FILES, audioPath, data.audioFile)
        
        if (uploadResult) {
          const { data: urlData } = supabase.storage
            .from(STORAGE_BUCKETS.AUDIO_FILES)
            .getPublicUrl(audioPath)
          audioUrl = urlData.publicUrl
        }
      }

      // Upload cover art
      if (data.coverArtFile) {
        const coverPath = `${walletAddress}/${data.title}/cover-${Date.now()}.${data.coverArtFile.name.split('.').pop()}`
        const uploadResult = await uploadFile(STORAGE_BUCKETS.COVER_ART, coverPath, data.coverArtFile)
        
        if (uploadResult) {
          const { data: urlData } = supabase.storage
            .from(STORAGE_BUCKETS.COVER_ART)
            .getPublicUrl(coverPath)
          coverArtUrl = urlData.publicUrl
        }
      }

      // Upload lyrics file
      if (data.lyricsFile) {
        const lyricsPath = `${walletAddress}/${data.title}/lyrics-${Date.now()}.txt`
        const uploadResult = await uploadFile(STORAGE_BUCKETS.ASSETS, lyricsPath, data.lyricsFile)
        
        if (uploadResult) {
          const { data: urlData } = supabase.storage
            .from(STORAGE_BUCKETS.ASSETS)
            .getPublicUrl(lyricsPath)
          lyricsUrl = urlData.publicUrl
        }
      }

      // TODO: Upload to IPFS via Storacha
      // For now, we'll use the Supabase URLs
      ipfsAudioHash = audioUrl
      ipfsCoverHash = coverArtUrl
      ipfsLyricsHash = lyricsUrl

      const trackData: TrackInsert = {
        artist_id: data.artistId,
        title: data.title,
        description: data.description || null,
        genre: data.genre,
        duration: data.duration || null,
        bpm: data.bpm || null,
        key: data.key || null,
        audio_url: audioUrl,
        cover_art_url: coverArtUrl,
        lyrics_url: lyricsUrl,
        ipfs_audio_hash: ipfsAudioHash,
        ipfs_cover_hash: ipfsCoverHash,
        ipfs_lyrics_hash: ipfsLyricsHash,
        is_explicit: data.isExplicit,
        rights_cleared: data.rightsCleared,
        release_date: data.releaseDate.toISOString(),
        tags: data.tags || null,
        total_streams: 0,
        total_earnings: '0',
        status: 'draft'
      }

      const { data: track, error } = await supabase
        .from('tracks')
        .insert(trackData)
        .select()
        .single()

      if (error) {
        console.error('Track creation error:', error)
        return { track: null, error: error.message }
      }

      // Create NFT tiers
      const tierInserts: NFTTierInsert[] = data.tiers.map(tier => ({
        track_id: track.id,
        tier_name: tier.tierName,
        price_eth: tier.priceEth,
        max_supply: tier.maxSupply,
        current_supply: 0,
        enabled: tier.enabled,
        benefits: tier.benefits as any
      }))

      const { error: tiersError } = await supabase
        .from('nft_tiers')
        .insert(tierInserts)

      if (tiersError) {
        console.error('NFT tiers creation error:', tiersError)
        // Clean up the track if tier creation fails
        await supabase.from('tracks').delete().eq('id', track.id)
        return { track: null, error: `Failed to create NFT tiers: ${tiersError.message}` }
      }

      // Increment artist track count
      await ArtistService.incrementStats(data.artistId, { tracks: 1 })

      toast.success('Track created successfully!')
      return { track }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create track'
      console.error('Track creation error:', error)
      toast.error('Failed to create track', { description: errorMessage })
      return { track: null, error: errorMessage }
    }
  }

  /**
   * Get track by ID with tiers
   */
  static async getTrackById(trackId: string): Promise<{ 
    track: Track | null
    tiers: NFTTier[]
    error?: string 
  }> {
    try {
      const { data: track, error: trackError } = await supabase
        .from('tracks')
        .select('*')
        .eq('id', trackId)
        .single()

      if (trackError) {
        console.error('Get track error:', trackError)
        return { track: null, tiers: [], error: trackError.message }
      }

      const { data: tiers, error: tiersError } = await supabase
        .from('nft_tiers')
        .select('*')
        .eq('track_id', trackId)
        .order('tier_name')

      if (tiersError) {
        console.error('Get tiers error:', tiersError)
        return { track, tiers: [], error: tiersError.message }
      }

      return { track, tiers: tiers || [] }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch track'
      console.error('Get track error:', error)
      return { track: null, tiers: [], error: errorMessage }
    }
  }

  /**
   * Get tracks by artist
   */
  static async getTracksByArtist(
    artistId: string,
    status?: 'draft' | 'processing' | 'live' | 'paused'
  ): Promise<{ tracks: Track[]; error?: string }> {
    try {
      let query = supabase
        .from('tracks')
        .select('*')
        .eq('artist_id', artistId)
        .order('created_at', { ascending: false })

      if (status) {
        query = query.eq('status', status)
      }

      const { data: tracks, error } = await query

      if (error) {
        console.error('Get tracks by artist error:', error)
        return { tracks: [], error: error.message }
      }

      return { tracks: tracks || [] }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch tracks'
      console.error('Get tracks by artist error:', error)
      return { tracks: [], error: errorMessage }
    }
  }

  /**
   * Update track status
   */
  static async updateTrackStatus(
    trackId: string,
    status: 'draft' | 'processing' | 'live' | 'paused',
    contractTrackId?: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const updateData: Partial<TrackUpdate> = {
        status,
        updated_at: new Date().toISOString()
      }

      if (contractTrackId !== undefined) {
        updateData.contract_track_id = contractTrackId
      }

      const { error } = await supabase
        .from('tracks')
        .update(updateData)
        .eq('id', trackId)

      if (error) {
        console.error('Update track status error:', error)
        return { success: false, error: error.message }
      }

      toast.success(`Track status updated to ${status}`)
      return { success: true }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update track status'
      console.error('Update track status error:', error)
      toast.error('Failed to update track status', { description: errorMessage })
      return { success: false, error: errorMessage }
    }
  }

  /**
   * Search tracks
   */
  static async searchTracks(
    query: string,
    genre?: string,
    limit = 20
  ): Promise<{ tracks: Track[]; error?: string }> {
    try {
      let supabaseQuery = supabase
        .from('tracks')
        .select('*')
        .eq('status', 'live')
        .or(`title.ilike.%${query}%,tags.cs.{${query}}`)
        .order('total_streams', { ascending: false })
        .limit(limit)

      if (genre) {
        supabaseQuery = supabaseQuery.eq('genre', genre)
      }

      const { data: tracks, error } = await supabaseQuery

      if (error) {
        console.error('Search tracks error:', error)
        return { tracks: [], error: error.message }
      }

      return { tracks: tracks || [] }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to search tracks'
      console.error('Search tracks error:', error)
      return { tracks: [], error: errorMessage }
    }
  }

  /**
   * Get trending tracks
   */
  static async getTrendingTracks(limit = 20): Promise<{ tracks: Track[]; error?: string }> {
    try {
      const { data: tracks, error } = await supabase
        .from('tracks')
        .select('*')
        .eq('status', 'live')
        .order('total_streams', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Get trending tracks error:', error)
        return { tracks: [], error: error.message }
      }

      return { tracks: tracks || [] }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch trending tracks'
      console.error('Get trending tracks error:', error)
      return { tracks: [], error: errorMessage }
    }
  }

  /**
   * Increment track streams
   */
  static async incrementStreams(trackId: string, count = 1): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: track, error: fetchError } = await supabase
        .from('tracks')
        .select('total_streams, artist_id')
        .eq('id', trackId)
        .single()

      if (fetchError) {
        return { success: false, error: fetchError.message }
      }

      // Update track streams
      const { error: updateError } = await supabase
        .from('tracks')
        .update({
          total_streams: track.total_streams + count,
          updated_at: new Date().toISOString()
        })
        .eq('id', trackId)

      if (updateError) {
        return { success: false, error: updateError.message }
      }

      // Update artist total streams
      await ArtistService.incrementStats(track.artist_id, { streams: count })

      return { success: true }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to increment streams'
      console.error('Increment streams error:', error)
      return { success: false, error: errorMessage }
    }
  }
}

