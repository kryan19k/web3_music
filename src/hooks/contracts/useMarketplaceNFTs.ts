import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { formatEther } from 'viem'
import { useMusicNFTAllTiers, useMusicNFTTrackInfo, Tier } from './useMusicNFT'
import { useMusicNFTTracksSequential } from './useMusicNFTTracks'
import { createQueryKey } from '@/src/utils/bigint'
import { MusicNFT } from '@/src/types/music-nft'

/**
 * Hook to fetch real marketplace NFTs from contracts
 * Combines tier data with track metadata to create complete NFT objects
 */
export function useMarketplaceNFTs() {
  const { tiers, isLoading: tiersLoading } = useMusicNFTAllTiers()

  // Query to build NFT marketplace data from contract
  const { data: marketplaceNFTs, isLoading: nftsLoading, error } = useQuery({
    queryKey: createQueryKey('marketplace-nfts', tiers),
    queryFn: async (): Promise<MusicNFT[]> => {
      const nfts: MusicNFT[] = []

      // Process each tier
      for (const [tierKey, tierData] of Object.entries(tiers)) {
        if (!tierData) continue

        const tierNum = parseInt(tierKey) as Tier
        const tierName = getTierName(tierNum)

        // Parse tier data from tuple: [name, price, blokAllocation, maxSupply, currentSupply, startId, saleActive, metadataURI, artistRoyalty]
        const currentSupply = Number(tierData[4] || 0) // index 4 is currentSupply
        const startId = Number(tierData[5] || 0) // index 5 is startId

        // Generate NFTs for existing supply
        for (let i = 0; i < Math.min(currentSupply, 20); i++) { // Limit to 20 for performance
          const tokenId = (startId + i).toString()
          
          // For now, we'll use track ID 0 since that's what the artist signup creates
          // In a real implementation, you'd track which tokenId maps to which trackId
          const trackId = 0

          try {
            // Create NFT object with available data
            const nft: MusicNFT = {
              tokenId,
              tier: tierName.toLowerCase() as any,
              metadata: {
                id: tokenId,
                title: `Track ${i + 1}`, // This would come from contract track data
                artist: 'Artist Name', // This would come from contract or profile data
                image: '/song_cover/placeholder.png', // IPFS hash from contract
                audioUrl: '', // IPFS audio hash from contract
                duration: 180, // From contract track data
                edition: i + 1,
                maxSupply: Number(tierData[3] || 0), // index 3 is maxSupply
                description: `${tierName} tier music NFT`,
                genre: 'Electronic', // From contract track data
                releaseDate: new Date().toISOString().split('T')[0],
                blokAmount: Number(formatEther(tierData[2] || 0n)), // index 2 is blokAllocation
                dailyStreams: Math.floor(Math.random() * 50000), // This would come from analytics
                attributes: [
                  { trait_type: 'Tier', value: tierName },
                  { trait_type: 'Edition', value: `${i + 1}/${tierData[3]}` }, // index 3 is maxSupply
                ]
              },
              price: formatEther(tierData[1] || 0n), // index 1 is price
              priceUSD: Number(formatEther(tierData[1] || 0n)) * 1785, // Approximate ETH to USD
              earnings: {
                daily: Math.random() * 50,
                total: Math.random() * 1000,
                apy: Math.random() * 25,
              },
              owner: '0x742...a5c2', // This would come from contract ownership data
              isListed: tierData[6] || false, // index 6 is saleActive
              streamingStats: {
                totalPlays: Math.floor(Math.random() * 100000),
                uniqueListeners: Math.floor(Math.random() * 10000),
                averageCompletion: Math.floor(Math.random() * 40) + 60,
              },
            }

            nfts.push(nft)
          } catch (error) {
            console.error(`Error creating NFT ${tokenId}:`, error)
          }
        }
      }

      return nfts
    },
    enabled: !tiersLoading && Object.keys(tiers).length > 0,
    staleTime: 30000, // Cache for 30 seconds
    refetchInterval: 60000, // Refetch every minute
  })

  return {
    nfts: marketplaceNFTs || [],
    isLoading: tiersLoading || nftsLoading,
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
                audioUrl: trackIpfsHash ? `https://ipfs.io/ipfs/${trackIpfsHash}` : '',
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

// Utility to get IPFS gateway URL
export function getIPFSUrl(hash: string): string {
  if (!hash) return ''
  if (hash.startsWith('http')) return hash
  return `https://ipfs.io/ipfs/${hash}`
}
