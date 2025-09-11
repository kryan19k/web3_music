import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import { ArtistService } from '@/src/services/artist.service'
import { TrackService } from '@/src/services/track.service'
import { useArtistData } from '@/src/hooks/contracts/useArtistData'
import type { Artist } from '@/src/types/supabase'

export interface EnhancedArtistProfile {
  // Database data
  profile: Artist | null
  tracks: any[]
  
  // Contract data
  contractStats: any
  contractNFTs: any[]
  
  // Combined/computed fields
  displayName: string
  avatar?: string
  isVerified: boolean
  totalTracks: number
  totalEarnings: number
  totalStreams: number
}

/**
 * Hook to fetch comprehensive artist profile from both database and contracts
 * Combines Supabase artist data with blockchain statistics
 */
export function useArtistProfile(artistAddress?: string) {
  const { address: connectedAddress } = useAccount()
  const targetAddress = artistAddress || connectedAddress

  // Get contract data
  const { 
    artistStats: contractStats, 
    isArtist,
    isLoading: contractLoading 
  } = useArtistData(targetAddress)

  // Get database profile
  const { data: dbProfile, isLoading: dbLoading } = useQuery({
    queryKey: ['artist-profile-db', targetAddress],
    queryFn: async () => {
      if (!targetAddress) return null
      
      try {
        const artist = await ArtistService.getByWalletAddress(targetAddress)
        return artist
      } catch (error) {
        console.log('Artist not found in database:', error)
        return null
      }
    },
    enabled: !!targetAddress,
    staleTime: 30000,
  })

  // Get artist's tracks from database
  const { data: dbTracks, isLoading: tracksLoading } = useQuery({
    queryKey: ['artist-tracks-db', dbProfile?.id],
    queryFn: async () => {
      if (!dbProfile?.id) return []
      
      try {
        const tracks = await TrackService.getByArtistId(dbProfile.id)
        return tracks || []
      } catch (error) {
        console.log('Error fetching artist tracks:', error)
        return []
      }
    },
    enabled: !!dbProfile?.id,
    staleTime: 30000,
  })

  // Combine all data
  const enhancedProfile: EnhancedArtistProfile | null = useMemo(() => {
    if (contractLoading || dbLoading) return null

    const displayName = dbProfile?.stage_name || contractStats?.name || 'Artist'
    const avatar = dbProfile?.avatar_url || contractStats?.avatar
    
    return {
      profile: dbProfile,
      tracks: dbTracks || [],
      contractStats,
      contractNFTs: [], // This would come from the contract NFTs
      
      // Combined fields
      displayName,
      avatar,
      isVerified: isArtist && !!dbProfile,
      totalTracks: Math.max(dbTracks?.length || 0, contractStats?.totalTracks || 0),
      totalEarnings: contractStats?.totalEarnings || 0,
      totalStreams: contractStats?.totalPlays || 0,
    }
  }, [dbProfile, dbTracks, contractStats, isArtist, contractLoading, dbLoading])

  return {
    profile: enhancedProfile,
    isLoading: contractLoading || dbLoading || tracksLoading,
    error: null,
    
    // Raw data for debugging
    dbProfile,
    dbTracks,
    contractStats,
    isArtist,
  }
}

/**
 * Hook to get just the database artist profile (lighter version)
 */
export function useArtistDBProfile(artistAddress?: string) {
  const { address: connectedAddress } = useAccount()
  const targetAddress = artistAddress || connectedAddress

  return useQuery({
    queryKey: ['artist-db-only', targetAddress],
    queryFn: async () => {
      if (!targetAddress) return null
      
      try {
        const artist = await ArtistService.getByWalletAddress(targetAddress)
        return artist
      } catch (error) {
        console.log('Artist not found in database:', error)
        return null
      }
    },
    enabled: !!targetAddress,
    staleTime: 30000,
  })
}

/**
 * Hook to get artist tracks from database
 */
export function useArtistTracks(artistId?: string) {
  return useQuery({
    queryKey: ['artist-tracks', artistId],
    queryFn: async () => {
      if (!artistId) return []
      
      try {
        const tracks = await TrackService.getByArtistId(artistId)
        return tracks || []
      } catch (error) {
        console.log('Error fetching tracks:', error)
        return []
      }
    },
    enabled: !!artistId,
    staleTime: 30000,
  })
}
