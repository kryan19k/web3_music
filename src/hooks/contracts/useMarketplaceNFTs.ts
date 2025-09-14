import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { formatEther } from 'viem'
import { usePublicClient } from 'wagmi'
import { useMusicNFTAllTiers, useMusicNFTTrackInfo, Tier } from './useMusicNFT'
import { useMusicNFTTracksSequential } from './useMusicNFTTracks'
import { useArtistCollections } from './useArtistCollections'
import { getIPFSUrl } from '@/src/utils/ipfs'
import { MusicNFT } from '@/src/types/music-nft'
import { COLLECTION_MUSIC_NFT_V2_ABI } from '@/src/constants/contracts/abis/CollectionMusicNFTV2'
import { CONTRACTS } from '@/src/constants/contracts/contracts'

/**
 * Hook to fetch real marketplace NFTs from all collections across all artists
 * This fetches ALL finalized and active collections for the marketplace using V2 contracts
 */
export function useMarketplaceNFTs() {
  const publicClient = usePublicClient()

  const { data: marketplaceNFTs, isLoading: nftsLoading, error } = useQuery({
    queryKey: ['marketplace-nfts-v2'],
    queryFn: async (): Promise<MusicNFT[]> => {
      try {
        console.log('🏪 [MARKETPLACE] Fetching all marketplace NFTs from V2 contracts...')

        if (!publicClient) {
          console.warn('⚠️ [MARKETPLACE] No public client available')
          return []
        }

        const nfts: MusicNFT[] = []

        // V2 contracts don't have nextCollectionId, so we iterate until we find no more collections
        console.log('🔍 [MARKETPLACE] Starting V2 collection scan...')

        let collectionId = 1
        const MAX_COLLECTIONS = 100 // Safety limit

        // Iterate through collection IDs to find active collections
        while (collectionId <= MAX_COLLECTIONS) {
          try {
            // Get collection data from V2 contract (different structure than V1)
            const collectionData = await publicClient.readContract({
              address: CONTRACTS.CollectionMusicNFT.address as `0x${string}`,
              abi: COLLECTION_MUSIC_NFT_V2_ABI,
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

            // Extract V2 collection data structure
            const collectionTitle = collectionData[0] // title
            const artistName = collectionData[1] // artistName
            const description = collectionData[2] // description
            const ipfsCoverArt = collectionData[3] // coverIpfs
            const genre = collectionData[4] // genre
            const artistAddress = collectionData[5] // artistOwner
            const finalized = collectionData[6] // finalized
            const active = collectionData[7] // active

            // Only include finalized and active collections in marketplace
            if (!finalized || !active) {
              collectionId++
              continue
            }

            console.log('🎯 [MARKETPLACE] Found active V2 collection:', {
              id: collectionId,
              title: collectionTitle,
              artist: artistName
            })

            // V2 doesn't have getCollectionTracks, so we need to iterate through tracks
            // and find ones that belong to this collection
            let trackId = 1
            const MAX_TRACKS = 50 // Safety limit per collection

            while (trackId <= MAX_TRACKS) {
              try {
                const trackData = await publicClient.readContract({
                  address: CONTRACTS.CollectionMusicNFT.address as `0x${string}`,
                  abi: COLLECTION_MUSIC_NFT_V2_ABI,
                  functionName: 'tracks',
                  args: [BigInt(trackId)],
                }) as readonly [
                  bigint, // collectionId
                  string, // title
                  string, // ipfsHash
                  boolean, // active
                  `0x${string}`, // artist
                ]

                const trackCollectionId = Number(trackData[0])

                // If this track doesn't belong to our collection, skip it
                if (trackCollectionId !== collectionId) {
                  trackId++
                  continue
                }

                // Skip inactive tracks
                if (!trackData[3]) {
                  trackId++
                  continue
                }

                const trackTitle = trackData[1]
                const ipfsHash = trackData[2]
                const duration = 180 // Default duration since V2 doesn't store it in tracks

                // Create marketplace NFT from V2 contract data
                const nft: MusicNFT = {
                  tokenId: `marketplace-v2-${collectionId}-${trackId}`,
                  tier: 'bronze', // Default tier
                  metadata: {
                    id: `marketplace-v2-${collectionId}-${trackId}`,
                    title: trackTitle || 'Untitled Track',
                    artist: artistName || 'Unknown Artist',
                    image: ipfsCoverArt ? getIPFSUrl(ipfsCoverArt, 'w3s') : '/song_cover/placeholder.png',
                    audioUrl: ipfsHash ? getIPFSUrl(ipfsHash, 'w3s') : '',
                    duration: duration,
                    edition: 1,
                    maxSupply: 1000,
                    description: description || `"${trackTitle}" from the album "${collectionTitle}" by ${artistName}`,
                    genre: genre || 'Electronic',
                    releaseDate: new Date().toISOString().split('T')[0], // V2 doesn't store release date
                    blokAmount: 100,
                    dailyStreams: Math.floor(Math.random() * 10000),
                    attributes: [
                      { trait_type: 'Collection', value: collectionTitle },
                      { trait_type: 'Artist', value: artistName },
                      { trait_type: 'Genre', value: genre || 'Electronic' },
                      { trait_type: 'Track ID', value: trackId.toString() },
                      { trait_type: 'Collection ID', value: collectionId.toString() },
                      { trait_type: 'Duration', value: `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}` },
                    ]
                  },
                  price: '0.01', // Default price
                  priceUSD: 18.50,
                  earnings: {
                    daily: Math.random() * 10,
                    total: Math.random() * 100,
                    apy: Math.random() * 15 + 5,
                  },
                  owner: artistAddress,
                  isListed: true, // All marketplace items are listed
                  streamingStats: {
                    totalPlays: Math.floor(Math.random() * 50000),
                    uniqueListeners: Math.floor(Math.random() * 5000),
                    averageCompletion: Math.floor(Math.random() * 30) + 70,
                  },
                  // Collection info for marketplace
                  collectionId: collectionId,
                  collectionTitle: collectionTitle,
                  finalized: true,
                  active: true,
                }

                nfts.push(nft)
                trackId++

              } catch (trackError) {
                // No more tracks or track doesn't exist for this trackId
                break
              }
            }

            collectionId++

          } catch (collectionError: any) {
            // No more collections exist
            console.log(`📝 [MARKETPLACE] No more collections found at ID ${collectionId}, stopping search`)
            break
          }
        }

        console.log('🎯 [MARKETPLACE] Total V2 marketplace NFTs found:', nfts.length)

        // Sort by collection ID and track ID for consistent ordering
        nfts.sort((a, b) => {
          if (a.collectionId !== b.collectionId) {
            return (b.collectionId || 0) - (a.collectionId || 0)
          }
          return b.tokenId.localeCompare(a.tokenId)
        })

        return nfts

      } catch (error) {
        console.error('💥 [MARKETPLACE] Fatal error fetching V2 marketplace NFTs:', error)
        return []
      }
    },
    enabled: !!publicClient,
    staleTime: 30000, // Cache for 30 seconds
    refetchInterval: 120000, // Refetch every 2 minutes (marketplace can be less frequent)
  })

  return {
    nfts: marketplaceNFTs || [],
    isLoading: nftsLoading,
    error,
  }
}

/**
 * Enhanced hook that also fetches track metadata for NFTs
 * This version attempts to get real track data from contracts
 */
export function useEnhancedMarketplaceNFTs() {
  const { tiers, isLoading: tiersLoading } = useMusicNFTAllTiers()

  // Get all available tracks instead of just track 0
  const { tracks: allTracks, isLoading: tracksLoading } = useMusicNFTTracksSequential(20) // Check first 20 track IDs

  const { data: marketplaceNFTs, isLoading: nftsLoading, error } = useQuery({
    queryKey: ['enhanced-marketplace-nfts-v2', Object.keys(tiers).length, allTracks?.length || 0],
    queryFn: async (): Promise<MusicNFT[]> => {
      const nfts: MusicNFT[] = []

      // Return empty if no tracks
      if (!allTracks || allTracks.length === 0) {
        return nfts
      }

      // Create NFTs for each track that has minted tokens
      for (const track of allTracks) {
        // Parse track data from tuple: [id, collectionId, title, ipfsHash, duration, active]
        if (!track[5]) continue // index 5 is active

        const trackTitle = track[2] // index 2 is title
        const trackIpfsHash = track[3] // index 3 is ipfsHash
        const trackDuration = Number(track[4]) // index 4 is duration
        const trackId = Number(track[0]) // index 0 is id

        for (const [tierKey, tierData] of Object.entries(tiers)) {
          if (!tierData) continue

          const tierNum = parseInt(tierKey) as Tier
          const tierName = getTierName(tierNum)
          // Parse tier data from tuple: [name, price, blokAllocation, maxSupply, currentSupply, startId, saleActive, metadataURI, artistRoyalty]
          const currentSupply = Number(tierData[4] || 0) // index 4 is currentSupply
          const startId = Number(tierData[5] || 0) // index 5 is startId

          // Only create NFTs if this tier has minted tokens
          if (currentSupply === 0) continue

          for (let i = 0; i < Math.min(currentSupply, 10); i++) { // Limit for performance
            const tokenId = (startId + i).toString()

            const nft: MusicNFT = {
              tokenId,
              tier: tierName.toLowerCase() as any,
              metadata: {
                id: tokenId,
                title: trackTitle || 'Unknown Track',
                artist: 'Unknown Artist', // TODO: Get from collection metadata
                image: '/song_cover/placeholder.png', // TODO: Get from collection metadata
                audioUrl: trackIpfsHash ? getIPFSUrl(trackIpfsHash, 'w3s') : '',
                duration: trackDuration || 180,
                edition: i + 1,
                maxSupply: Number(tierData[3] || 0), // index 3 is maxSupply
                description: `${tierName} tier music NFT for "${trackTitle}"`,
                genre: 'Electronic', // TODO: Get from collection metadata
                releaseDate: new Date().toISOString().split('T')[0], // TODO: Get from collection metadata
                blokAmount: Number(formatEther(tierData[2] || 0n)), // index 2 is blokAllocation
                dailyStreams: 0, // TODO: Implement streaming stats
                attributes: [
                  { trait_type: 'Tier', value: tierName },
                  { trait_type: 'Artist', value: 'Unknown Artist' },
                  { trait_type: 'Genre', value: 'Electronic' },
                  { trait_type: 'Track ID', value: trackId.toString() },
                  { trait_type: 'Edition', value: `${i + 1}/${tierData[3]}` }, // index 3 is maxSupply
                  { trait_type: 'BLOK Allocation', value: `${formatEther(tierData[2] || 0n)} BLOK` }, // index 2 is blokAllocation
                ]
              },
              price: formatEther(tierData[1] || 0n), // index 1 is price
              priceUSD: Number(formatEther(tierData[1] || 0n)) * 1785,
              earnings: {
                daily: Math.random() * 50,
                total: 0, // TODO: Implement earnings tracking
                apy: Math.random() * 25,
              },
              owner: '0x742...a5c2',
              isListed: tierData[6] || false, // index 6 is saleActive
              streamingStats: {
                totalPlays: 0, // TODO: Implement streaming stats
                uniqueListeners: Math.floor(Math.random() * 10000),
                averageCompletion: Math.floor(Math.random() * 40) + 60,
              },
            }

            nfts.push(nft)
          }
        }
      }

      return nfts.filter(nft => nft.metadata.audioUrl) // Only return NFTs with valid audio
    },
    enabled: !tiersLoading && !tracksLoading && Object.keys(tiers).length > 0,
    staleTime: 30000,
    refetchInterval: 60000,
  })

  return {
    nfts: marketplaceNFTs || [],
    isLoading: tiersLoading || nftsLoading || tracksLoading,
    error,
    tracks: allTracks, // Expose tracks for debugging
  }
}

function getTierName(tier: Tier): string {
  switch (tier) {
    case Tier.BRONZE: return 'Bronze'
    case Tier.SILVER: return 'Silver'
    case Tier.GOLD: return 'Gold'
    case Tier.PLATINUM: return 'Platinum'
    default: return 'Unknown'
  }
}

// Utility to check if NFT has valid playback data
export function hasValidAudio(nft: MusicNFT): boolean {
  return !!(nft.metadata.audioUrl && nft.metadata.audioUrl.length > 0)
}

// IPFS gateway URL utility moved to src/utils/ipfs.ts
// Use getIPFSUrl from there for better gateway selection