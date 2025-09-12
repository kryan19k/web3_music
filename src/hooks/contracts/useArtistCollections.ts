import { useAccount, usePublicClient } from 'wagmi'
import { useQuery } from '@tanstack/react-query'
import { COLLECTION_MUSIC_NFT_ABI } from '@/src/constants/contracts/abis/CollectionMusicNFT'
import { CONTRACTS } from '@/src/constants/contracts/contracts'
import { createQueryKey } from '@/src/utils/bigint'
import { getIPFSUrl, debugIPFSAccess } from '@/src/utils/ipfs'
import type { MusicNFT } from '@/src/types/music-nft'

/**
 * Hook to fetch real collections and tracks created by an artist from the contract
 */
export function useArtistCollections(artistAddress?: string) {
  const { address: connectedAddress } = useAccount()
  const publicClient = usePublicClient()
  const targetAddress = artistAddress || connectedAddress

  const { data: artistNFTs, isLoading, error, refetch } = useQuery({
    queryKey: createQueryKey('artist-collections-real', targetAddress),
    queryFn: async (): Promise<MusicNFT[]> => {
      if (!targetAddress || !publicClient) return []

      const nfts: MusicNFT[] = []
      
      try {
        console.log('🔍 [ARTIST_COLLECTIONS] Fetching collections for artist:', targetAddress)

        // Get total number of collections to know the range
        const nextCollectionId = await publicClient.readContract({
          address: CONTRACTS.CollectionMusicNFT.address as `0x${string}`,
          abi: COLLECTION_MUSIC_NFT_ABI,
          functionName: 'nextCollectionId',
        }) as bigint

        const totalCollections = Number(nextCollectionId) - 1
        console.log('📊 [ARTIST_COLLECTIONS] Total collections to check:', totalCollections)

        // Iterate through all collection IDs to find artist's collections
        for (let collectionId = 1; collectionId <= totalCollections; collectionId++) {
          try {
            // Get collection data using the proper getter function
            const collectionData = await publicClient.readContract({
              address: CONTRACTS.CollectionMusicNFT.address as `0x${string}`,
              abi: COLLECTION_MUSIC_NFT_ABI,
              functionName: 'getCollection',
              args: [BigInt(collectionId)],
            }) as readonly [
              bigint, // id
              string, // title
              string, // artist  
              string, // description
              bigint, // totalTracks (or trackCount)
              boolean, // finalized
              boolean, // active
              bigint, // albumPrice
            ]

            // Get additional collection info for cover art and metadata
            const collectionFullData = await publicClient.readContract({
              address: CONTRACTS.CollectionMusicNFT.address as `0x${string}`,
              abi: COLLECTION_MUSIC_NFT_ABI,
              functionName: 'collections',
              args: [BigInt(collectionId)],
            }) as any // Use any to avoid type issues with the complex struct

            // Debug the structure we're getting back (can be removed after verification)
            console.log('🔍 [ARTIST_COLLECTIONS] Collection full data structure:', {
              type: typeof collectionFullData,
              isArray: Array.isArray(collectionFullData),
              keys: Object.keys(collectionFullData || {}),
              ipfsCoverArt: collectionFullData?.ipfsCoverArt,
              index4: collectionFullData?.[4],
              raw: collectionFullData
            })

            // Extract what we can safely from the complex struct
            const collectionArtistAddr = collectionFullData[9]?.toLowerCase() || collectionFullData.artistAddress?.toLowerCase()
            
            // Skip if this collection doesn't belong to our artist
            if (collectionArtistAddr !== targetAddress.toLowerCase()) {
              continue
            }

            // Extract from getCollection response
            const collectionTitle = collectionData[1] // title
            const artistName = collectionData[2] // artist
            const description = collectionData[3] // description 
            const totalTracks = Number(collectionData[4]) // totalTracks
            const finalized = collectionData[5] // finalized
            const active = collectionData[6] // active
            const albumPrice = collectionData[7] // albumPrice

            // Try to extract IPFS and other fields from the complex struct safely
            let ipfsCoverArt = ''
            let genre = 'Electronic'
            let releaseDate = new Date()

            try {
              // Try different ways to access the fields
              if (collectionFullData && typeof collectionFullData === 'object') {
                // Try direct property access first
                if (collectionFullData.ipfsCoverArt) {
                  ipfsCoverArt = String(collectionFullData.ipfsCoverArt).trim()
                }
                if (collectionFullData.genre && typeof collectionFullData.genre === 'string') {
                  genre = collectionFullData.genre
                }
                if (collectionFullData.releaseDate) {
                  releaseDate = new Date(Number(collectionFullData.releaseDate) * 1000)
                }

                // Try array index access as fallback
                if (!ipfsCoverArt && collectionFullData[4]) {
                  ipfsCoverArt = String(collectionFullData[4]).trim()
                }
                if (!genre && collectionFullData[7] && typeof collectionFullData[7] === 'string') {
                  genre = collectionFullData[7]
                }
                if (!releaseDate || releaseDate.getTime() === new Date().getTime()) {
                  if (collectionFullData[6]) {
                    releaseDate = new Date(Number(collectionFullData[6]) * 1000)
                  }
                }

                // Clean up invalid IPFS hashes
                if (ipfsCoverArt === '[object Object]' || ipfsCoverArt.includes('[object Object]')) {
                  console.warn('⚠️ [ARTIST_COLLECTIONS] Invalid IPFS hash object detected, setting to empty:', collectionFullData.ipfsCoverArt || collectionFullData[4])
                  ipfsCoverArt = ''
                }
              }
            } catch (error) {
              console.warn('⚠️ [ARTIST_COLLECTIONS] Error extracting additional fields:', error)
            }

            console.log('✅ [ARTIST_COLLECTIONS] Found artist collection:', {
              id: collectionId,
              title: collectionTitle,
              artist: artistName,
              totalTracks: totalTracks,
              finalized,
              active,
              ipfsCoverArt: ipfsCoverArt ? ipfsCoverArt.slice(0, 20) + '...' : 'none',
              genre,
              releaseDate: releaseDate.toISOString().split('T')[0]
            })

            // Get track IDs for this collection
            const trackIds = await publicClient.readContract({
              address: CONTRACTS.CollectionMusicNFT.address as `0x${string}`,
              abi: COLLECTION_MUSIC_NFT_ABI,
              functionName: 'getCollectionTracks',
              args: [BigInt(collectionId)],
            }) as readonly bigint[]

            console.log('🎵 [ARTIST_COLLECTIONS] Collection tracks:', trackIds.map(Number))

            // Create NFTs for each track in this collection
            for (const trackIdBigInt of trackIds) {
              const trackId = Number(trackIdBigInt)
              
              try {
                // Get track data using the getter function
                const trackData = await publicClient.readContract({
                  address: CONTRACTS.CollectionMusicNFT.address as `0x${string}`,
                  abi: COLLECTION_MUSIC_NFT_ABI,
                  functionName: 'getTrack',
                  args: [BigInt(trackId)],
                }) as readonly [
                  bigint, // id
                  bigint, // collectionId
                  string, // title
                  string, // ipfsHash
                  bigint, // duration
                  boolean, // active
                ]

                // Skip inactive tracks
                if (!trackData[5]) {
                  console.log('⏭️ [ARTIST_COLLECTIONS] Skipping inactive track:', trackId)
                  continue
                }

                const trackTitle = trackData[2]
                const ipfsHash = trackData[3]
                const duration = Number(trackData[4])

                console.log('🎶 [ARTIST_COLLECTIONS] Processing track:', {
                  id: trackId,
                  title: trackTitle,
                  duration: duration,
                  audioHash: ipfsHash.slice(0, 15) + '...',
                  coverArt: ipfsCoverArt.slice(0, 15) + '...',
                  audioUrl: ipfsHash ? getIPFSUrl(ipfsHash, 'w3s') : '',
                })

                // Debug IPFS access for this track (temporarily disabled to avoid rate limits)
                // TODO: Re-enable once we fix the object/string issue
                // if (process.env.NODE_ENV === 'development') {
                //   Promise.all([
                //     debugIPFSAccess(ipfsHash).catch(() => null),
                //     debugIPFSAccess(ipfsCoverArt).catch(() => null)
                //   ]).then(([audioDebug, imageDebug]) => {
                //     console.log('🔍 [IPFS_DEBUG] Track media access:', { audioDebug, imageDebug })
                //   })
                // }

                // Create NFT object from real contract data
                const nft: MusicNFT = {
                  tokenId: `collection-${collectionId}-track-${trackId}`,
                  tier: 'bronze', // Default tier - could enhance by checking tier data
                  metadata: {
                    id: `collection-${collectionId}-track-${trackId}`,
                    title: trackTitle || 'Untitled Track',
                    artist: artistName || 'Unknown Artist',
                    image: ipfsCoverArt ? getIPFSUrl(ipfsCoverArt, 'w3s') : '/song_cover/placeholder.png',
                    audioUrl: ipfsHash ? getIPFSUrl(ipfsHash, 'w3s') : '',
                    duration: duration || 180,
                    edition: 1,
                    maxSupply: 1000, // Default - could enhance with tier data
                    description: description || `Track "${trackTitle}" from album "${collectionTitle}"`,
                    genre: genre || 'Electronic',
                    releaseDate: releaseDate.toISOString().split('T')[0],
                    blokAmount: 100, // Default BLOK allocation - could enhance with tier data
                    dailyStreams: 0,
                    attributes: [
                      { trait_type: 'Collection', value: collectionTitle },
                      { trait_type: 'Artist', value: artistName },
                      { trait_type: 'Genre', value: genre || 'Electronic' },
                      { trait_type: 'Track ID', value: trackId.toString() },
                      { trait_type: 'Collection ID', value: collectionId.toString() },
                      { trait_type: 'Duration', value: `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}` },
                      { trait_type: 'Release Year', value: releaseDate.getFullYear().toString() },
                      { trait_type: 'Status', value: finalized ? 'Finalized' : 'Draft' },
                    ]
                  },
                  price: '0.01', // Default price - could enhance with tier data
                  priceUSD: 18.50,
                  earnings: {
                    daily: 0,
                    total: 0,
                    apy: 0,
                  },
                  owner: targetAddress,
                  isListed: active,
                  streamingStats: {
                    totalPlays: 0,
                    uniqueListeners: 0,
                    averageCompletion: 85,
                  },
                  // Additional collection info for UI
                  collectionId: collectionId,
                  collectionTitle: collectionTitle,
                  finalized: finalized,
                  active: active,
                }

                nfts.push(nft)

              } catch (trackError) {
                console.error(`❌ [ARTIST_COLLECTIONS] Error fetching track ${trackId}:`, trackError)
              }
            }

            // If collection has no tracks yet, create a placeholder
            if (trackIds.length === 0) {
              const placeholderNFT: MusicNFT = {
                tokenId: `collection-${collectionId}-placeholder`,
                tier: 'bronze',
                metadata: {
                  id: `collection-${collectionId}-placeholder`,
                  title: '(Collection Created - No Tracks Yet)',
                  artist: artistName || 'Unknown Artist',
                  image: ipfsCoverArt ? getIPFSUrl(ipfsCoverArt, 'w3s') : '/song_cover/placeholder.png',
                  audioUrl: '',
                  duration: 0,
                  edition: 1,
                  maxSupply: 1000,
                  description: description || `Empty collection "${collectionTitle}" - add tracks to get started`,
                  genre: genre,
                  releaseDate: releaseDate.toISOString().split('T')[0],
                  blokAmount: 0,
                  dailyStreams: 0,
                  attributes: [
                    { trait_type: 'Collection', value: collectionTitle },
                    { trait_type: 'Artist', value: artistName },
                    { trait_type: 'Status', value: 'Empty Collection' },
                  ]
                },
                price: '0.00',
                priceUSD: 0,
                earnings: { daily: 0, total: 0, apy: 0 },
                owner: targetAddress,
                isListed: false,
                streamingStats: { totalPlays: 0, uniqueListeners: 0, averageCompletion: 0 },
                collectionId: collectionId,
                collectionTitle: collectionTitle,
                finalized: finalized,
                active: active,
              }
              
              nfts.push(placeholderNFT)
            }

          } catch (collectionError: any) {
            // Check if it's a "collection doesn't exist" error
            if (collectionError?.message?.includes('execution reverted')) {
              console.log(`📝 [ARTIST_COLLECTIONS] Collection ${collectionId} doesn't exist, stopping search`)
              break // No more collections exist
            }
            console.error(`❌ [ARTIST_COLLECTIONS] Error fetching collection ${collectionId}:`, collectionError)
          }
        }

        console.log('🎯 [ARTIST_COLLECTIONS] Total NFTs found for artist:', nfts.length)
        
        // Sort by collection ID and track ID for consistent ordering
        nfts.sort((a, b) => {
          const aColId = a.collectionId || 0
          const bColId = b.collectionId || 0
          if (aColId !== bColId) return aColId - bColId
          
          // Extract track ID from tokenId for sorting within collection
          const aTrackMatch = a.tokenId.match(/track-(\d+)/)
          const bTrackMatch = b.tokenId.match(/track-(\d+)/)
          const aTrackId = aTrackMatch ? parseInt(aTrackMatch[1]) : 0
          const bTrackId = bTrackMatch ? parseInt(bTrackMatch[1]) : 0
          return aTrackId - bTrackId
        })

        return nfts

      } catch (error) {
        console.error('💥 [ARTIST_COLLECTIONS] Fatal error fetching artist collections:', error)
        return []
      }
    },
    enabled: !!(targetAddress && publicClient),
    staleTime: 30000, // Cache for 30 seconds
    refetchInterval: 60000, // Refetch every minute
  })

  return {
    collections: artistNFTs || [],
    isLoading,
    error,
    refetch,
  }
}

/**
 * Hook to get collection statistics for an artist
 */
export function useArtistCollectionStats(artistAddress?: string) {
  const { collections, isLoading } = useArtistCollections(artistAddress)

  const stats = {
    totalCollections: 0,
    totalTracks: 0,
    finalizedCollections: 0,
    draftCollections: 0,
    activeCollections: 0,
    totalDuration: 0,
  }

  if (!isLoading && collections) {
    const collectionIds = new Set()
    
    collections.forEach(nft => {
      if (nft.collectionId) {
        collectionIds.add(nft.collectionId)
      }
      
      // Only count real tracks (not placeholders)
      if (!nft.tokenId.includes('placeholder')) {
        stats.totalTracks++
        stats.totalDuration += nft.metadata.duration || 0
      }
      
      if (nft.finalized) stats.finalizedCollections++
      if (nft.active) stats.activeCollections++
    })
    
    stats.totalCollections = collectionIds.size
    stats.draftCollections = stats.totalCollections - stats.finalizedCollections
  }

  return {
    stats,
    isLoading,
  }
}
