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
            // Get collection data using the collections mapping
            const collectionData = await publicClient.readContract({
              address: CONTRACTS.CollectionMusicNFT.address as `0x${string}`,
              abi: COLLECTION_MUSIC_NFT_ABI,
              functionName: 'collections',
              args: [BigInt(collectionId)],
            }) as readonly [
              string, // title
              string, // artistName
              string, // description
              string, // coverIpfs
              string, // genre
              `0x${string}`, // artistOwner
              boolean, // finalized
              boolean, // active
              number, // albumDiscountBps
            ]

            // Extract from collections response
            const collectionTitle = collectionData[0] // title
            const artistName = collectionData[1] // artistName
            const description = collectionData[2] // description 
            let ipfsCoverArt = collectionData[3] // coverIpfs
            let genre = collectionData[4] || 'Electronic' // genre
            const artistOwner = collectionData[5] // artistOwner
            const finalized = collectionData[6] // finalized
            const active = collectionData[7] // active
            const albumDiscountBps = collectionData[8] // albumDiscountBps

            console.log('🔍 [ARTIST_COLLECTIONS] Collection data:', {
              collectionId,
              collectionTitle,
              artistName,
              description,
              ipfsCoverArt,
              genre,
              finalized,
              active,
              albumDiscountBps
            })
            
            // Skip if this collection doesn't belong to our artist
            if (artistOwner.toLowerCase() !== targetAddress.toLowerCase()) {
              continue
            }

            let releaseDate = new Date()

            // Clean up invalid IPFS hashes
            if (ipfsCoverArt === '[object Object]' || ipfsCoverArt.includes('[object Object]')) {
              console.warn('⚠️ [ARTIST_COLLECTIONS] Invalid IPFS hash object detected, setting to empty:', ipfsCoverArt)
              ipfsCoverArt = ''
            }
            
            // Clean up string values
            ipfsCoverArt = String(ipfsCoverArt || '').trim()
            genre = String(genre || 'Electronic').trim()

            console.log('✅ [ARTIST_COLLECTIONS] Found artist collection:', {
              id: collectionId,
              title: collectionTitle,
              artist: artistName,
              finalized,
              active,
              ipfsCoverArt: ipfsCoverArt ? ipfsCoverArt.slice(0, 20) + '...' : 'none',
              genre,
              releaseDate: releaseDate.toISOString().split('T')[0]
            })

            // Get tracks for this collection by iterating through all tracks
            // In V2 contract, we need to check each track's collectionId to find matches
            const nextTrackId = await publicClient.readContract({
              address: CONTRACTS.CollectionMusicNFT.address as `0x${string}`,
              abi: COLLECTION_MUSIC_NFT_ABI,
              functionName: 'nextTrackId',
            }) as bigint

            const collectionTracks: Array<{id: number, data: readonly [bigint, string, string, boolean, string]}> = []
            const totalTracks = Number(nextTrackId) - 1

            // Iterate through all tracks to find ones belonging to this collection
            for (let trackId = 1; trackId <= totalTracks; trackId++) {
              try {
                const trackData = await publicClient.readContract({
                  address: CONTRACTS.CollectionMusicNFT.address as `0x${string}`,
                  abi: COLLECTION_MUSIC_NFT_ABI,
                  functionName: 'tracks',
                  args: [BigInt(trackId)],
                }) as readonly [
                  bigint, // collectionId
                  string, // title
                  string, // ipfsHash
                  boolean, // active
                  string, // artist (address)
                ]

                const trackCollectionId = Number(trackData[0])
                if (trackCollectionId === collectionId) {
                  collectionTracks.push({ id: trackId, data: trackData })
                }
              } catch (error) {
                // Track doesn't exist, stop checking
                break
              }
            }

            console.log('🎵 [ARTIST_COLLECTIONS] Collection tracks found:', collectionTracks.map(t => t.id))

            // Create NFTs for each track in this collection
            for (const track of collectionTracks) {
              const trackId = track.id
              const trackData = track.data
              
              try {
                // Extract V2 track data structure
                const trackCollectionId = Number(trackData[0]) // collectionId
                const trackTitle = trackData[1] // title
                const ipfsHash = trackData[2] // ipfsHash
                const trackActive = trackData[3] // active
                const trackArtist = trackData[4] // artist (address)

                // Skip inactive tracks
                if (!trackActive) {
                  console.log('⏭️ [ARTIST_COLLECTIONS] Skipping inactive track:', trackId)
                  continue
                }

                const duration = 180 // Default duration since V2 doesn't store duration in track

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
            if (collectionTracks.length === 0) {
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
    staleTime: 5000, // Cache for 5 seconds (more responsive)
    refetchInterval: 30000, // Refetch every 30 seconds
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
