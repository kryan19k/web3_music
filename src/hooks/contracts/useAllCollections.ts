import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { COLLECTION_MUSIC_NFT_V2_ABI } from '@/src/constants/contracts/abis/CollectionMusicNFTV2'
import { CONTRACTS } from '@/src/constants/contracts/contracts'
import { getIPFSUrl } from '@/src/utils/ipfs'
import type { MusicNFT } from '@/src/types/music-nft'

export interface Collection {
  id: number
  title: string
  artist: string
  artistAddress: string
  description: string
  coverArt: string
  trackCount: number
  totalMinted: number
  totalSupply: number
  revenue: number
  createdAt: string
  isActive: boolean
  finalized: boolean
  completionProgress: number
  genre: string
  tags: string[]
  averageRating: number
  totalPlays: number
  isVerified: boolean
  isTrending: boolean
  price: { min: number; max: number }
  tracks: MusicNFT[]
}

/**
 * Hook to fetch ALL collections and their tracks from the blockchain
 * This replaces demo data with real contract data
 */
export function useAllCollections() {
  const publicClient = usePublicClient()

  const { data: collections, isLoading, error, refetch } = useQuery({
    queryKey: ['all-collections-v2', publicClient?.chain?.id || 0], // Simple key with chain ID
    queryFn: async (): Promise<Collection[]> => {
      if (!publicClient) return []

      const collections: Collection[] = []
      
      try {
        console.log('🌍 [ALL_COLLECTIONS] Fetching all collections globally...')

        // Get total number of collections using nextCollectionId (V2 contracts have this function)
        const nextCollectionId = await publicClient.readContract({
          address: CONTRACTS.CollectionMusicNFT.address as `0x${string}`,
          abi: COLLECTION_MUSIC_NFT_V2_ABI,
          functionName: 'nextCollectionId',
        }) as bigint

        const totalCollections = Number(nextCollectionId) - 1
        console.log('📊 [ALL_COLLECTIONS] nextCollectionId:', nextCollectionId, 'totalCollections:', totalCollections)

        // Iterate through all collection IDs
        for (let collectionId = 1; collectionId <= totalCollections; collectionId++) {
          try {
            // Get collection data from V2 contract
            const collectionData = await publicClient.readContract({
              address: CONTRACTS.CollectionMusicNFT.address as `0x${string}`,
              abi: COLLECTION_MUSIC_NFT_V2_ABI,
              functionName: 'collections',
              args: [BigInt(collectionId)],
            }) as readonly [
              string, // title (0)
              string, // artistName (1)
              string, // description (2)
              string, // coverIpfs (3)
              string, // genre (4)
              `0x${string}`, // artistOwner (5)
              boolean, // finalized (6)
              boolean, // active (7)
              number, // albumDiscountBps (8)
              // Note: tracks array and mapping albumPriceByTier are NOT returned by public getter
            ]

            // Extract from V2 collections response (9 fields only)
            const title = collectionData[0] // title
            const artistName = collectionData[1] // artistName
            const description = collectionData[2] // description
            let ipfsCoverArt = collectionData[3] // coverIpfs
            let genre = collectionData[4] || 'Electronic' // genre
            const artistAddress = collectionData[5] // artistOwner
            const finalized = collectionData[6] // finalized
            const active = collectionData[7] // active
            const albumDiscountBps = collectionData[8] // albumDiscountBps

            let releaseDate = new Date() // V1 doesn't store release date

            // Clean up IPFS hash if needed
            if (ipfsCoverArt === '[object Object]' || ipfsCoverArt.includes('[object Object]')) {
              ipfsCoverArt = ''
            }
            ipfsCoverArt = String(ipfsCoverArt || '').trim()

            console.log('📁 [ALL_COLLECTIONS] Processing collection:', {
              id: collectionId,
              title,
              artist: artistName,
              finalized,
              active
            })

            // Since tracks array is not returned by public getter, use nextTrackId approach
            const nextTrackId = await publicClient.readContract({
              address: CONTRACTS.CollectionMusicNFT.address as `0x${string}`,
              abi: COLLECTION_MUSIC_NFT_V2_ABI,
              functionName: 'nextTrackId',
            }) as bigint

            const totalTracks = Number(nextTrackId) - 1
            const collectionTracks: MusicNFT[] = []

            // Iterate through all tracks to find ones belonging to this collection
            for (let trackId = 1; trackId <= totalTracks; trackId++) {
              try {
                const trackData = await publicClient.readContract({
                  address: CONTRACTS.CollectionMusicNFT.address as `0x${string}`,
                  abi: COLLECTION_MUSIC_NFT_V2_ABI,
                  functionName: 'tracks',
                  args: [BigInt(trackId)],
                }) as readonly [
                  bigint, // collectionId (0)
                  string, // title (1)
                  string, // ipfsHash (2)
                  boolean, // active (3)
                  `0x${string}`, // artist (4) - only 5 fields returned
                ]

                const trackCollectionId = Number(trackData[0])
                const trackTitle = trackData[1]
                const ipfsHash = trackData[2]
                const trackActive = trackData[3]
                const trackArtist = trackData[4] // artist is at index 4 in actual return

                // Skip tracks that don't belong to this collection
                if (trackCollectionId !== collectionId) {
                  continue
                }

                // Skip inactive tracks
                if (!trackActive) {
                  continue
                }

                const duration = 180 // Default duration since V2 doesn't store duration in track

                const nft: MusicNFT = {
                  tokenId: `collection-${collectionId}-track-${trackId}`,
                  tier: 'bronze',
                  metadata: {
                    id: `collection-${collectionId}-track-${trackId}`,
                      title: trackTitle || 'Untitled Track',
                      artist: artistName || 'Unknown Artist',
                      image: ipfsCoverArt ? getIPFSUrl(ipfsCoverArt, 'w3s') : '/song_cover/placeholder.png',
                      audioUrl: ipfsHash ? getIPFSUrl(ipfsHash, 'w3s') : '',
                      duration: duration,
                      edition: 1,
                      maxSupply: 1000,
                      description: description || `Track "${trackTitle}" from album "${title}"`,
                      genre: genre || 'Electronic',
                      releaseDate: releaseDate.toISOString().split('T')[0],
                      blokAmount: 100,
                      dailyStreams: Math.floor(Math.random() * 10000),
                      attributes: [
                        { trait_type: 'Collection', value: title },
                        { trait_type: 'Artist', value: artistName },
                        { trait_type: 'Genre', value: genre || 'Electronic' },
                        { trait_type: 'Track ID', value: trackId.toString() },
                        { trait_type: 'Collection ID', value: collectionId.toString() },
                        { trait_type: 'Duration', value: `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}` },
                        { trait_type: 'Release Year', value: releaseDate.getFullYear().toString() },
                        { trait_type: 'Status', value: finalized ? 'Finalized' : 'Draft' },
                      ]
                    },
                    price: '0.01',
                    priceUSD: 18.50,
                    earnings: {
                      daily: Math.random() * 10,
                      total: Math.random() * 100,
                      apy: Math.random() * 15 + 5,
                    },
                    owner: artistAddress,
                    isListed: active && finalized, // Only show finalized and active as listed
                    streamingStats: {
                      totalPlays: Math.floor(Math.random() * 50000),
                      uniqueListeners: Math.floor(Math.random() * 5000),
                      averageCompletion: Math.floor(Math.random() * 30) + 70,
                    },
                    collectionId: collectionId,
                    collectionTitle: title,
                    finalized: finalized,
                    active: active,
                  }

                collectionTracks.push(nft)
              } catch (trackError) {
                // Track doesn't exist or error reading, continue to next track
                console.log(`📝 [ALL_COLLECTIONS] Track ${trackId} error reading track data`)
              }
            }

            // Create collection object
            const collection: Collection = {
              id: collectionId,
              title: title || 'Untitled Collection',
              artist: artistName || 'Unknown Artist',
              artistAddress: artistAddress,
              description: description || `Music collection "${title}" by ${artistName}`,
              coverArt: ipfsCoverArt ? getIPFSUrl(ipfsCoverArt, 'w3s') : '/song_cover/placeholder.png',
              trackCount: collectionTracks.length,
              totalMinted: collectionTracks.length * 10, // Estimated
              totalSupply: collectionTracks.length * 100, // Estimated
              revenue: collectionTracks.length * 50, // Estimated
              createdAt: releaseDate.toISOString(),
              isActive: active,
              finalized: finalized,
              completionProgress: finalized ? 100 : 75,
              genre: genre || 'Electronic',
              tags: [genre || 'Electronic', 'Music', 'NFT'],
              averageRating: 4.5 + Math.random() * 0.5, // Random rating 4.5-5.0
              totalPlays: collectionTracks.reduce((sum, track) => sum + (track.streamingStats?.totalPlays || 0), 0),
              isVerified: finalized, // Consider finalized collections as verified
              isTrending: Math.random() > 0.7, // 30% chance of trending
              price: {
                min: Math.min(...collectionTracks.map(t => parseFloat(t.price))),
                max: Math.max(...collectionTracks.map(t => parseFloat(t.price)))
              },
              tracks: collectionTracks
            }

            // Debug collection data
            console.log(`📋 [ALL_COLLECTIONS] Collection ${collectionId} (${title}):`, {
              finalized,
              active,
              trackCount: collectionTracks.length,
              hasTitle: !!title,
              hasArtist: !!artistName
            })

            // Include all collections (even without tracks for debugging)
            collections.push(collection)

          } catch (collectionError: any) {
            console.error(`❌ [ALL_COLLECTIONS] Error fetching collection ${collectionId}:`, collectionError)
            // Continue to next collection instead of breaking
          }
        }

        console.log('✅ [ALL_COLLECTIONS] Total collections found:', collections.length)
        console.log('📋 [ALL_COLLECTIONS] Collections summary:', collections.map(c => ({
          id: c.id,
          title: c.title,
          finalized: c.finalized,
          isActive: c.isActive,
          trackCount: c.tracks?.length || 0
        })))
        
        // Sort by creation date (newest first) and activity
        collections.sort((a, b) => {
          // Prioritize finalized and active collections
          if (a.finalized && a.isActive && (!b.finalized || !b.isActive)) return -1
          if (b.finalized && b.isActive && (!a.finalized || !a.isActive)) return 1
          
          // Then by creation date
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        })

        return collections

      } catch (error) {
        console.error('💥 [ALL_COLLECTIONS] Fatal error fetching collections:', error)
        return []
      }
    },
    enabled: !!publicClient,
    staleTime: 30000, // Cache for 30 seconds
    refetchInterval: 120000, // Refetch every 2 minutes
  })

  // Separate function to get all tracks from all collections
  const allTracks: MusicNFT[] = collections?.flatMap(collection => collection.tracks) || []

  // Get only finalized and active collections for marketplace
  const marketplaceCollections = collections?.filter(collection => {
    const isEligible = collection.finalized && collection.isActive
    console.log(`🏪 [MARKETPLACE] Collection "${collection.title}" eligible:`, {
      finalized: collection.finalized,
      isActive: collection.isActive,
      eligible: isEligible,
      trackCount: collection.tracks?.length || 0
    })
    return isEligible
  }) || []

  return {
    collections: collections || [],
    marketplaceCollections,
    allTracks,
    isLoading,
    error,
    refetch,
  }
}

/**
 * Hook to get collection statistics globally
 */
export function useGlobalCollectionStats() {
  const { collections, allTracks, isLoading } = useAllCollections()

  const stats = {
    totalCollections: collections.length,
    finalizedCollections: collections.filter(c => c.finalized).length,
    activeCollections: collections.filter(c => c.isActive).length,
    totalTracks: allTracks.length,
    totalVolume: allTracks.reduce((sum, track) => sum + (track.priceUSD || 0), 0),
    averagePrice: allTracks.length > 0 ? allTracks.reduce((sum, track) => sum + (track.priceUSD || 0), 0) / allTracks.length : 0,
    topGenres: getTopGenres(collections),
  }

  return {
    stats,
    isLoading,
  }
}

function getTopGenres(collections: Collection[]): string[] {
  const genreCounts = collections.reduce((acc, collection) => {
    acc[collection.genre] = (acc[collection.genre] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return Object.entries(genreCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([genre]) => genre)
}