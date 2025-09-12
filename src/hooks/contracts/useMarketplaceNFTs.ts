import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { formatEther } from 'viem'
import { useMusicNFTAllTiers, useMusicNFTTrackInfo, Tier } from './useMusicNFT'
import { useMusicNFTTracksSequential } from './useMusicNFTTracks'
import { useArtistCollections } from './useArtistCollections'
import { createQueryKey } from '@/src/utils/bigint'
import { getIPFSUrl } from '@/src/utils/ipfs'
import { MusicNFT } from '@/src/types/music-nft'

/**
 * Hook to fetch real marketplace NFTs from all collections across all artists
 * This fetches ALL finalized and active collections for the marketplace
 */
export function useMarketplaceNFTs() {
  const { data: marketplaceNFTs, isLoading: nftsLoading, error } = useQuery({
    queryKey: createQueryKey('marketplace-nfts-real'),
    queryFn: async (): Promise<MusicNFT[]> => {
      try {
        console.log('🏪 [MARKETPLACE] Fetching all marketplace NFTs from contracts...')
        
        // Import the hooks we need inside the query function
        const { usePublicClient } = await import('wagmi')
        const { COLLECTION_MUSIC_NFT_ABI } = await import('@/src/constants/contracts/abis/CollectionMusicNFT')
        const { CONTRACTS } = await import('@/src/constants/contracts/contracts')
        
        const client = usePublicClient()
        if (!client) return []

        const nfts: MusicNFT[] = []

        // Get total number of collections to know the range
        const nextCollectionId = await client.readContract({
          address: CONTRACTS.CollectionMusicNFT.address as `0x${string}`,
          abi: COLLECTION_MUSIC_NFT_ABI,
          functionName: 'nextCollectionId',
        }) as bigint

        const totalCollections = Number(nextCollectionId) - 1
        console.log('🔍 [MARKETPLACE] Total collections to check:', totalCollections)

        // Iterate through all collection IDs to find active collections
        for (let collectionId = 1; collectionId <= totalCollections; collectionId++) {
          try {
            // Get collection data
            const collectionData = await client.readContract({
              address: CONTRACTS.CollectionMusicNFT.address as `0x${string}`,
              abi: COLLECTION_MUSIC_NFT_ABI,
              functionName: 'collections',
              args: [BigInt(collectionId)],
            }) as readonly [
              bigint, // collectionId
              string, // title
              string, // artist
              string, // description
              string, // ipfsCoverArt
              string, // ipfsMetadata
              bigint, // releaseDate
              string, // genre
              bigint, // totalTracks
              string, // artistAddress
              boolean, // finalized
              boolean, // active
              bigint, // albumPrice
              bigint, // albumDiscount
            ]

            const finalized = collectionData[10]
            const active = collectionData[11]
            
            // Only include finalized and active collections in marketplace
            if (!finalized || !active) {
              continue
            }

            const collectionTitle = collectionData[1]
            const artistName = collectionData[2]
            const description = collectionData[3]
            const ipfsCoverArt = collectionData[4]
            const genre = collectionData[7]
            const releaseDate = new Date(Number(collectionData[6]) * 1000)
            const artistAddress = collectionData[9]

            console.log('🎯 [MARKETPLACE] Found active collection:', {
              id: collectionId,
              title: collectionTitle,
              artist: artistName,
              totalTracks: Number(collectionData[8])
            })

            // Get track IDs for this collection
            const trackIds = await client.readContract({
              address: CONTRACTS.CollectionMusicNFT.address as `0x${string}`,
              abi: COLLECTION_MUSIC_NFT_ABI,
              functionName: 'getCollectionTracks',
              args: [BigInt(collectionId)],
            }) as readonly bigint[]

            // Add all tracks from this collection to marketplace
            for (const trackIdBigInt of trackIds) {
              const trackId = Number(trackIdBigInt)
              
              try {
                // Get track data
                const trackData = await client.readContract({
                  address: CONTRACTS.CollectionMusicNFT.address as `0x${string}`,
                  abi: COLLECTION_MUSIC_NFT_ABI,
                  functionName: 'tracks',
                  args: [BigInt(trackId)],
                }) as readonly [
                  bigint, // trackId
                  bigint, // collectionId
                  string, // title
                  string, // ipfsHash
                  bigint, // duration
                  boolean, // active
                ]

                // Skip inactive tracks
                if (!trackData[5]) continue

                const trackTitle = trackData[2]
                const ipfsHash = trackData[3]
                const duration = Number(trackData[4])

                // Create marketplace NFT from real contract data
                const nft: MusicNFT = {
                  tokenId: `marketplace-${collectionId}-${trackId}`,
                  tier: 'bronze', // Default tier
                  metadata: {
                    id: `marketplace-${collectionId}-${trackId}`,
                    title: trackTitle || 'Untitled Track',
                    artist: artistName || 'Unknown Artist',
                    image: ipfsCoverArt ? getIPFSUrl(ipfsCoverArt, 'w3s') : '/song_cover/placeholder.png',
                    audioUrl: ipfsHash ? getIPFSUrl(ipfsHash, 'w3s') : '',
                    duration: duration || 180,
                    edition: 1,
                    maxSupply: 1000,
                    description: description || `"${trackTitle}" from the album "${collectionTitle}" by ${artistName}`,
                    genre: genre || 'Electronic',
                    releaseDate: releaseDate.toISOString().split('T')[0],
                    blokAmount: 100,
                    dailyStreams: Math.floor(Math.random() * 10000),
                    attributes: [
                      { trait_type: 'Collection', value: collectionTitle },
                      { trait_type: 'Artist', value: artistName },
                      { trait_type: 'Genre', value: genre || 'Electronic' },
                      { trait_type: 'Track ID', value: trackId.toString() },
                      { trait_type: 'Collection ID', value: collectionId.toString() },
                      { trait_type: 'Duration', value: `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}` },
                      { trait_type: 'Release Year', value: releaseDate.getFullYear().toString() },
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

              } catch (trackError) {
                console.error(`❌ [MARKETPLACE] Error fetching track ${trackId}:`, trackError)
              }
            }

          } catch (collectionError: any) {
            // Check if it's a "collection doesn't exist" error
            if (collectionError?.message?.includes('execution reverted')) {
              console.log(`📝 [MARKETPLACE] Collection ${collectionId} doesn't exist, stopping search`)
              break // No more collections exist
            }
            console.error(`❌ [MARKETPLACE] Error fetching collection ${collectionId}:`, collectionError)
          }
        }

        console.log('🎯 [MARKETPLACE] Total marketplace NFTs found:', nfts.length)
        
        // Sort by release date (newest first) then by collection and track
        nfts.sort((a, b) => {
          const dateA = new Date(a.metadata.releaseDate)
          const dateB = new Date(b.metadata.releaseDate)
          return dateB.getTime() - dateA.getTime()
        })

        return nfts

      } catch (error) {
        console.error('💥 [MARKETPLACE] Fatal error fetching marketplace NFTs:', error)
        return []
      }
    },
    enabled: true,
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
    queryKey: createQueryKey('enhanced-marketplace-nfts', tiers, allTracks),
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
