/**
 * Artist Database Service
 * Handles all artist-related database operations with Supabase
 */

import { supabase, uploadFile, STORAGE_BUCKETS } from '@/src/lib/supabase'
import type { Artist, ArtistInsert, ArtistUpdate, SocialLinks } from '@/src/types/supabase'
import { toast } from 'sonner'

export class ArtistService {
  /**
   * Create a new artist profile
   */
  static async createArtist(data: {
    walletAddress: string
    displayName: string
    bio: string
    website?: string
    socialLinks?: SocialLinks
    genres?: string[]
    avatarFile?: File
  }): Promise<{ artist: Artist; error?: string }> {
    try {
      let avatarUrl: string | null = null

      // Upload avatar if provided - skip for now until buckets are created
      if (data.avatarFile) {
        try {
          const avatarPath = `${data.walletAddress}/avatar-${Date.now()}.${data.avatarFile.name.split('.').pop()}`
          const uploadResult = await uploadFile(STORAGE_BUCKETS.AVATARS, avatarPath, data.avatarFile)
          
          if (uploadResult) {
            const { data: urlData } = supabase.storage
              .from(STORAGE_BUCKETS.AVATARS)
              .getPublicUrl(avatarPath)
            avatarUrl = urlData.publicUrl
          }
        } catch (error) {
          console.warn('Avatar upload failed, continuing without avatar:', error)
          // Continue without avatar for now
        }
      }

      const artistData: ArtistInsert = {
        wallet_address: data.walletAddress.toLowerCase(),
        display_name: data.displayName,
        bio: data.bio,
        website: data.website || null,
        social_links: data.socialLinks || null,
        genres: data.genres || null,
        avatar_url: avatarUrl,
        verification_status: 'pending',
        total_earnings: '0',
        total_tracks: 0,
        total_streams: 0,
        followers_count: 0,
        verified: false,
      }

      const { data: artist, error } = await supabase
        .from('artists')
        .insert(artistData)
        .select()
        .single()

      if (error) {
        console.error('Artist creation error:', error)
        return { artist: null as any, error: error.message }
      }

      toast.success('Artist profile created successfully!')
      return { artist }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create artist profile'
      console.error('Artist creation error:', error)
      toast.error('Failed to create artist profile', { description: errorMessage })
      return { artist: null as any, error: errorMessage }
    }
  }

  /**
   * Get artist by wallet address
   */
  static async getArtistByWallet(walletAddress: string): Promise<{ artist: Artist | null; error?: string }> {
    try {
      const { data: artist, error } = await supabase
        .from('artists')
        .select('*')
        .eq('wallet_address', walletAddress.toLowerCase())
        .single()

      if (error && error.code !== 'PGRST116') { // Not found error is OK
        console.error('Get artist error:', error)
        return { artist: null, error: error.message }
      }

      return { artist }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch artist'
      console.error('Get artist error:', error)
      return { artist: null, error: errorMessage }
    }
  }

  /**
   * Update artist profile
   */
  static async updateArtist(
    artistId: string, 
    updates: Partial<ArtistUpdate>,
    avatarFile?: File
  ): Promise<{ artist: Artist | null; error?: string }> {
    try {
      let updateData = { ...updates }

      // Upload new avatar if provided
      if (avatarFile) {
        const artist = await this.getArtistById(artistId)
        if (artist.artist) {
          const avatarPath = `${artist.artist.wallet_address}/avatar-${Date.now()}.${avatarFile.name.split('.').pop()}`
          const uploadResult = await uploadFile(STORAGE_BUCKETS.AVATARS, avatarPath, avatarFile, { upsert: true })
          
          if (uploadResult) {
            const { data: urlData } = supabase.storage
              .from(STORAGE_BUCKETS.AVATARS)
              .getPublicUrl(avatarPath)
            updateData.avatar_url = urlData.publicUrl
          }
        }
      }

      updateData.updated_at = new Date().toISOString()

      const { data: artist, error } = await supabase
        .from('artists')
        .update(updateData)
        .eq('id', artistId)
        .select()
        .single()

      if (error) {
        console.error('Artist update error:', error)
        return { artist: null, error: error.message }
      }

      toast.success('Artist profile updated successfully!')
      return { artist }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update artist profile'
      console.error('Artist update error:', error)
      toast.error('Failed to update artist profile', { description: errorMessage })
      return { artist: null, error: errorMessage }
    }
  }

  /**
   * Get artist by ID
   */
  static async getArtistById(artistId: string): Promise<{ artist: Artist | null; error?: string }> {
    try {
      const { data: artist, error } = await supabase
        .from('artists')
        .select('*')
        .eq('id', artistId)
        .single()

      if (error) {
        console.error('Get artist by ID error:', error)
        return { artist: null, error: error.message }
      }

      return { artist }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch artist'
      console.error('Get artist by ID error:', error)
      return { artist: null, error: errorMessage }
    }
  }

  /**
   * Search artists by name or genre
   */
  static async searchArtists(query: string, limit = 20): Promise<{ artists: Artist[]; error?: string }> {
    try {
      const { data: artists, error } = await supabase
        .from('artists')
        .select('*')
        .or(`display_name.ilike.%${query}%,genres.cs.{${query}}`)
        .eq('verified', true)
        .order('followers_count', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Search artists error:', error)
        return { artists: [], error: error.message }
      }

      return { artists: artists || [] }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to search artists'
      console.error('Search artists error:', error)
      return { artists: [], error: errorMessage }
    }
  }

  /**
   * Get trending artists
   */
  static async getTrendingArtists(limit = 10): Promise<{ artists: Artist[]; error?: string }> {
    try {
      const { data: artists, error } = await supabase
        .from('artists')
        .select('*')
        .eq('verified', true)
        .order('total_streams', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Get trending artists error:', error)
        return { artists: [], error: error.message }
      }

      return { artists: artists || [] }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch trending artists'
      console.error('Get trending artists error:', error)
      return { artists: [], error: errorMessage }
    }
  }

  /**
   * Update artist verification status
   */
  static async updateVerificationStatus(
    artistId: string, 
    status: 'pending' | 'approved' | 'rejected'
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('artists')
        .update({ 
          verification_status: status,
          verified: status === 'approved',
          updated_at: new Date().toISOString()
        })
        .eq('id', artistId)

      if (error) {
        console.error('Update verification error:', error)
        return { success: false, error: error.message }
      }

      const statusText = status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'pending'
      toast.success(`Verification status updated to ${statusText}`)
      return { success: true }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update verification status'
      console.error('Update verification error:', error)
      toast.error('Failed to update verification status', { description: errorMessage })
      return { success: false, error: errorMessage }
    }
  }

  /**
   * Increment artist stats (tracks, earnings, streams, followers)
   */
  static async incrementStats(
    artistId: string,
    updates: {
      tracks?: number
      earnings?: string
      streams?: number
      followers?: number
    }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: artist, error: fetchError } = await supabase
        .from('artists')
        .select('total_tracks, total_earnings, total_streams, followers_count')
        .eq('id', artistId)
        .single()

      if (fetchError) {
        return { success: false, error: fetchError.message }
      }

      const updateData: Partial<ArtistUpdate> = {
        updated_at: new Date().toISOString()
      }

      if (updates.tracks !== undefined) {
        updateData.total_tracks = artist.total_tracks + updates.tracks
      }

      if (updates.earnings !== undefined) {
        const currentEarnings = parseFloat(artist.total_earnings)
        const additionalEarnings = parseFloat(updates.earnings)
        updateData.total_earnings = (currentEarnings + additionalEarnings).toString()
      }

      if (updates.streams !== undefined) {
        updateData.total_streams = artist.total_streams + updates.streams
      }

      if (updates.followers !== undefined) {
        updateData.followers_count = artist.followers_count + updates.followers
      }

      const { error } = await supabase
        .from('artists')
        .update(updateData)
        .eq('id', artistId)

      if (error) {
        console.error('Increment stats error:', error)
        return { success: false, error: error.message }
      }

      return { success: true }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update artist stats'
      console.error('Increment stats error:', error)
      return { success: false, error: errorMessage }
    }
  }

  // ============================================
  // ADMIN-SPECIFIC METHODS
  // ============================================

  /**
   * Get artists by verification status (admin function)
   */
  static async getArtistsByVerificationStatus(
    status: 'pending' | 'approved' | 'rejected'
  ): Promise<{ artists: Artist[]; error?: string }> {
    try {
      const { data: artists, error } = await supabase
        .from('artists')
        .select('*')
        .eq('verification_status', status)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Get artists by status error:', error)
        return { artists: [], error: error.message }
      }

      return { artists: artists || [] }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch artists by status'
      console.error('Get artists by status error:', error)
      return { artists: [], error: errorMessage }
    }
  }

  /**
   * Get all artists (admin function)
   */
  static async getAllArtists(): Promise<{ artists: Artist[]; error?: string }> {
    try {
      const { data: artists, error } = await supabase
        .from('artists')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Get all artists error:', error)
        return { artists: [], error: error.message }
      }

      return { artists: artists || [] }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch all artists'
      console.error('Get all artists error:', error)
      return { artists: [], error: errorMessage }
    }
  }

  /**
   * Get recent artists (admin function)
   */
  static async getRecentArtists(limit = 10): Promise<{ artists: Artist[]; error?: string }> {
    try {
      const { data: artists, error } = await supabase
        .from('artists')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Get recent artists error:', error)
        return { artists: [], error: error.message }
      }

      return { artists: artists || [] }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch recent artists'
      console.error('Get recent artists error:', error)
      return { artists: [], error: errorMessage }
    }
  }

  /**
   * Get artist application details with social verification data
   */
  static async getArtistApplicationDetails(artistId: string): Promise<{ 
    artist: Artist | null
    socialVerification: {
      twitter?: { verified: boolean, followers?: number }
      instagram?: { verified: boolean, followers?: number }
      spotify?: { verified: boolean, monthlyListeners?: number }
    }
    error?: string 
  }> {
    try {
      const { artist, error } = await this.getArtistById(artistId)
      if (error || !artist) {
        return { artist: null, socialVerification: {}, error: error || 'Artist not found' }
      }

      // In a real implementation, you'd verify social accounts here
      // For now, we'll mock some verification data
      const socialLinks = (artist.social_links as any) || {}
      const socialVerification = {
        twitter: socialLinks.twitter ? { verified: true, followers: Math.floor(Math.random() * 10000) } : undefined,
        instagram: socialLinks.instagram ? { verified: true, followers: Math.floor(Math.random() * 15000) } : undefined,
        spotify: socialLinks.spotify ? { verified: true, monthlyListeners: Math.floor(Math.random() * 50000) } : undefined,
      }

      return { artist, socialVerification }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch application details'
      console.error('Get application details error:', error)
      return { artist: null, socialVerification: {}, error: errorMessage }
    }
  }

  /**
   * Fix inconsistent artist state (approved in DB but no blockchain role)
   */
  static async fixInconsistentArtistState(
    artistId: string, 
    action: 'revert_to_pending' | 'mark_as_blockchain_pending'
  ): Promise<{ success: boolean; error?: string }> {
    try {
      let updateData: Partial<ArtistUpdate> = {
        updated_at: new Date().toISOString()
      }

      if (action === 'revert_to_pending') {
        updateData.verification_status = 'pending'
        updateData.verified = false
      } else if (action === 'mark_as_blockchain_pending') {
        // Keep as approved but add a note (you could add a new field for this)
        // For now, we'll just update the timestamp
        updateData.verification_status = 'approved'
        updateData.verified = true
      }

      const { error } = await supabase
        .from('artists')
        .update(updateData)
        .eq('id', artistId)

      if (error) {
        console.error('Fix inconsistent state error:', error)
        return { success: false, error: error.message }
      }

      const actionText = action === 'revert_to_pending' ? 'reverted to pending' : 'marked for blockchain role grant'
      toast.success(`Artist status ${actionText}`)
      return { success: true }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fix artist state'
      console.error('Fix inconsistent state error:', error)
      toast.error('Failed to fix artist state', { description: errorMessage })
      return { success: false, error: errorMessage }
    }
  }
}
