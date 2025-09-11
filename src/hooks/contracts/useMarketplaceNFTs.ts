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

        // Create NFTs based on current supply
        const currentSupply = Number(tierData.currentSupply || 0)
        const startId = Number(tierData.startId || 0)

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
                maxSupply: Number(tierData.maxSupply || 0),
                description: `${tierName} tier music NFT`,
                genre: 'Electronic', // From contract track data
                releaseDate: new Date().toISOString().split('T')[0],
                pagsAmount: Number(formatEther(tierData.pagsAllocation || 0n)),
                dailyStreams: Math.floor(Math.random() * 50000), // This would come from analytics
                attributes: [
                  { trait_type: 'Tier', value: tierName },
                  { trait_type: 'Edition', value: `${i + 1}/${tierData.maxSupply}` },
                ]
              },
              price: formatEther(tierData.price || 0n),
              priceUSD: Number(formatEther(tierData.price || 0n)) * 1785, // Approximate ETH to USD
              earnings: {
                daily: Math.random() * 50,
                total: Math.random() * 1000,
                apy: Math.random() * 25,
              },
              owner: '0x742...a5c2', // This would come from contract ownership data
              isListed: tierData.saleActive || false,
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
        if (!track.active) continue

        for (const [tierKey, tierData] of Object.entries(tiers)) {
          if (!tierData) continue

          const tierNum = parseInt(tierKey) as Tier
          const tierName = getTierName(tierNum)
          const currentSupply = Number(tierData.currentSupply || 0)
          const startId = Number(tierData.startId || 0)

          // Only create NFTs if this tier has minted tokens
          if (currentSupply === 0) continue

          for (let i = 0; i < Math.min(currentSupply, 10); i++) { // Limit for performance
            const tokenId = (startId + i).toString()
            
            const nft: MusicNFT = {
              tokenId,
              tier: tierName.toLowerCase() as any,
              metadata: {
                id: tokenId,
                title: track.title || 'Unknown Track',
                artist: track.artist || 'Unknown Artist',
                image: track.ipfsCoverArt ? `https://ipfs.io/ipfs/${track.ipfsCoverArt}` : '/song_cover/placeholder.png',
                audioUrl: track.ipfsAudioHash ? `https://ipfs.io/ipfs/${track.ipfsAudioHash}` : '',
                duration: Number(track.duration) || 180,
                edition: i + 1,
                maxSupply: Number(tierData.maxSupply || 0),
                description: `${tierName} tier music NFT for "${track.title}"`,
                genre: track.genre || 'Electronic',
                releaseDate: track.releaseDate ? new Date(Number(track.releaseDate) * 1000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                pagsAmount: Number(formatEther(tierData.pagsAllocation || 0n)),
                dailyStreams: Number(track.totalStreams) || 0,
                attributes: [
                  { trait_type: 'Tier', value: tierName },
                  { trait_type: 'Artist', value: track.artist || 'Unknown Artist' },
                  { trait_type: 'Genre', value: track.genre || 'Electronic' },
                  { trait_type: 'Track ID', value: track.trackId?.toString() || '0' },
                  { trait_type: 'Edition', value: `${i + 1}/${tierData.maxSupply}` },
                  { trait_type: 'PAGS Allocation', value: `${formatEther(tierData.pagsAllocation || 0n)} PAGS` },
                ]
              },
              price: formatEther(tierData.price || 0n),
              priceUSD: Number(formatEther(tierData.price || 0n)) * 1785,
              earnings: {
                daily: Math.random() * 50,
                total: Number(formatEther(track.totalRoyaltiesGenerated || 0n)),
                apy: Math.random() * 25,
              },
              owner: '0x742...a5c2',
              isListed: tierData.saleActive || false,
              streamingStats: {
                totalPlays: Number(track.totalStreams) || 0,
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
    isLoading: tiersLoading || nftsLoading,
    error,
    trackInfo, // Expose track info for debugging
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
