import { useQuery } from '@tanstack/react-query'
import { useMusicNFTTrackInfo } from './useMusicNFT'
import { createQueryKey } from '@/src/utils/bigint'

/**
 * Hook to fetch all available tracks from the contract
 * Since the contract doesn't have a getAllTracks function,
 * we'll try track IDs 0-99 and filter out inactive ones
 */
export function useMusicNFTAllTracks() {
  // We'll check track IDs 0-99 to find all active tracks
  const trackQueries = Array.from({ length: 100 }, (_, i) => {
    return useMusicNFTTrackInfo(i)
  })

  const { data: allTracks, isLoading, error } = useQuery({
    queryKey: createQueryKey('all-tracks', trackQueries.map(q => q.data)),
    queryFn: async () => {
      const activeTracks = []
      
      for (let i = 0; i < trackQueries.length; i++) {
        const trackData = trackQueries[i].data
        // Parse track data from tuple: [id, collectionId, title, ipfsHash, duration, active]
        if (trackData && trackData[5] && trackData[2] && trackData[2].length > 0) { // index 5 is active, index 2 is title
          activeTracks.push(trackData) // Keep the original tuple structure
        }
      }
      
      return activeTracks
    },
    enabled: trackQueries.some(q => !q.isLoading),
    staleTime: 30000,
  })

  const trackQueriesLoading = trackQueries.some(q => q.isLoading)

  return {
    tracks: allTracks || [],
    isLoading: isLoading || trackQueriesLoading,
    error,
    refetch: () => {
      // Refetch all track queries
      trackQueries.forEach(q => q.refetch?.())
    }
  }
}

/**
 * More efficient approach - fetch known track IDs only
 * This assumes we track track creation in sequence starting from 0
 */
export function useMusicNFTTracksSequential(maxTrackId: number = 10) {
  const trackIds = Array.from({ length: maxTrackId + 1 }, (_, i) => i)
  
  const trackQueries = trackIds.map(id => {
    const query = useMusicNFTTrackInfo(id)
    return {
      trackId: id,
      ...query
    }
  })

  const { data: tracks, isLoading, error } = useQuery({
    queryKey: createQueryKey('sequential-tracks', maxTrackId, trackQueries.map(q => q.data)),
    queryFn: async () => {
      const activeTracks = []
      
      for (const trackQuery of trackQueries) {
        const trackData = trackQuery.data
        // Parse track data from tuple: [id, collectionId, title, ipfsHash, duration, active]
        if (trackData && trackData[5] && trackData[2] && trackData[2].length > 0) { // index 5 is active, index 2 is title
          activeTracks.push(trackData) // Keep the original tuple structure
        }
      }
      
      return activeTracks
    },
    enabled: trackQueries.every(q => !q.isLoading),
    staleTime: 30000,
  })

  const queriesLoading = trackQueries.some(q => q.isLoading)

  return {
    tracks: tracks || [],
    isLoading: isLoading || queriesLoading,
    error,
    trackQueries,
    refetch: () => {
      trackQueries.forEach(q => q.refetch?.())
    }
  }
}
