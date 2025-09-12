import { useAccount } from 'wagmi'
import { useQuery } from '@tanstack/react-query'
import { formatEther } from 'viem'
import { 
  useMusicNFTTrackInfo, 
  useMusicNFTAllTiers, 
  useMusicNFTArtistRole
} from './useMusicNFT'
import { useBLOKBalance } from './useBLOKToken'
import { createQueryKey } from '@/src/utils/bigint'
import type { MusicNFT } from '@/src/types/music-nft'

export interface ArtistStats {
  name: string
  address: string
  avatar?: string
  verified: boolean
  isArtist: boolean
  
  // Financial stats
  totalEarnings: number
  pendingPayouts: number
  blokBalance: number
  
  // Track stats
  totalTracks: number
  nftsCreated: number
  nftsSold: number
  
  // Engagement stats  
  totalPlays: number
  monthlyListeners: number
  followers: number
  averageRating: number
}

/**
 * Hook to fetch comprehensive artist data from contracts and profile
 */
export function useArtistData(artistAddress?: string) {
  const { address: connectedAddress } = useAccount()
  const targetAddress = artistAddress || connectedAddress

  // Check if user has artist role
  const { data: hasArtistRole, isLoading: roleLoading } = useMusicNFTArtistRole(targetAddress as `0x${string}`)
  
  // Get BLOK token balance
  const { data: blokBalance, isLoading: blokLoading } = useBLOKBalance(targetAddress as `0x${string}`)
  
  // Get tier configurations to understand NFT structure
  const { tiers, isLoading: tiersLoading } = useMusicNFTAllTiers()
  
  // Get track information (assuming track ID 0 for now)
  const { data: trackInfo, isLoading: trackLoading } = useMusicNFTTrackInfo(0)

  // Aggregate all data
  const { data: artistStats, isLoading: aggregateLoading } = useQuery({
    queryKey: createQueryKey('artist-data', targetAddress, hasArtistRole, blokBalance, trackInfo),
    queryFn: async (): Promise<ArtistStats> => {
      // Get BLOK token balance
      const blokTokenBalance = blokBalance ? Number(formatEther(blokBalance)) : 0

      // Parse track data from tuple: [id, collectionId, title, ipfsHash, duration, active]
      const trackTitle = trackInfo ? trackInfo[2] : '' // index 2 is title
      const trackActive = trackInfo ? trackInfo[5] : false // index 5 is active
      
      return {
        name: trackTitle || `Artist ${targetAddress?.slice(0, 6)}...${targetAddress?.slice(-4)}`,
        address: targetAddress || '',
        avatar: undefined, // TODO: Get from collection metadata
        verified: hasArtistRole || false,
        isArtist: hasArtistRole || false,
        
        // Financial stats
        totalEarnings: 0, // TODO: Implement collection-based earnings tracking
        pendingPayouts: 0, // TODO: Implement collection-based payouts
        blokBalance: blokTokenBalance,
        
        // Track stats
        totalTracks: trackActive ? 1 : 0, // TODO: Update for collections
        nftsCreated: 0, // TODO: Implement collection-based NFT tracking
        nftsSold: 0, // TODO: Implement collection-based sales tracking
        
        // Engagement stats
        totalPlays: 0, // TODO: Implement streaming stats in collection contract
        monthlyListeners: 0, // TODO: Implement streaming stats
        followers: 0, // TODO: Implement follower system
        averageRating: 4.2 + Math.random() * 0.6, // Mock rating for now
      }
    },
    enabled: !!(targetAddress && !roleLoading && !blokLoading),
    staleTime: 30000,
    refetchInterval: 60000,
  })

  return {
    artistStats,
    trackInfo, // Expose for debugging
    isLoading: roleLoading || blokLoading || trackLoading || tiersLoading || aggregateLoading,
    isArtist: hasArtistRole,
    error: null,
  }
}

/**
 * Hook to get artist's created NFTs/tracks
 */
export function useArtistNFTs(artistAddress?: string) {
  const { address: connectedAddress } = useAccount()
  const targetAddress = artistAddress || connectedAddress
  
  const { tiers, isLoading: tiersLoading } = useMusicNFTAllTiers()
  const { data: trackInfo } = useMusicNFTTrackInfo(0)

  const { data: artistNFTs, isLoading: nftsLoading, refetch } = useQuery({
    queryKey: createQueryKey('artist-nfts', targetAddress, tiers, trackInfo),
    queryFn: async (): Promise<MusicNFT[]> => {
      const nfts: MusicNFT[] = []

      // Parse track data from tuple: [id, collectionId, title, ipfsHash, duration, active]
      if (!trackInfo || !trackInfo[5]) { // index 5 is active
        return nfts
      }

      const trackTitle = trackInfo[2] // index 2 is title
      const trackIpfsHash = trackInfo[3] // index 3 is ipfsHash  
      const trackDuration = Number(trackInfo[4]) // index 4 is duration

      // Create NFT objects for each tier that has supply
      for (const [tierKey, tierData] of Object.entries(tiers)) {
        // Parse tier data from tuple: [name, price, blokAllocation, maxSupply, currentSupply, startId, saleActive, metadataURI, artistRoyalty]
        if (!tierData || Number(tierData[4]) === 0) continue // index 4 is currentSupply

        const tierNum = parseInt(tierKey)
        const tierName = getTierName(tierNum)
        const startId = Number(tierData[5]) // index 5 is startId
        
        // Create one representative NFT for this tier
        const nft: MusicNFT = {
          tokenId: startId.toString(),
          tier: tierName.toLowerCase() as any,
          metadata: {
            id: startId.toString(),
            title: trackTitle,
            artist: 'Unknown Artist', // TODO: Get from collection metadata
            image: '/song_cover/placeholder.png', // TODO: Get from collection metadata
            audioUrl: trackIpfsHash ? `https://ipfs.io/ipfs/${trackIpfsHash}` : '',
            duration: trackDuration,
            edition: 1,
            maxSupply: Number(tierData[3]), // index 3 is maxSupply
            description: `${tierName} tier music NFT for "${trackTitle}"`,
            genre: 'Unknown', // TODO: Get from collection metadata
            releaseDate: new Date().toISOString().split('T')[0], // TODO: Get from collection metadata
            blokAmount: Number(formatEther(tierData[2])), // index 2 is blokAllocation
            dailyStreams: 0, // TODO: Implement streaming stats
            attributes: [
              { trait_type: 'Tier', value: tierName },
              { trait_type: 'Artist', value: 'Unknown Artist' },
              { trait_type: 'Genre', value: 'Unknown' },
              { trait_type: 'Duration', value: `${Math.floor(trackDuration / 60)}:${(trackDuration % 60).toString().padStart(2, '0')}` },
            ]
          },
          price: formatEther(tierData[1]), // index 1 is price
          priceUSD: Number(formatEther(tierData[1])) * 1785,
          earnings: {
            daily: Math.random() * 50,
            total: 0, // TODO: Implement earnings tracking
            apy: Math.random() * 25,
          },
          owner: targetAddress || '',
          isListed: tierData[6], // index 6 is saleActive
          streamingStats: {
            totalPlays: 0, // TODO: Implement streaming stats
            uniqueListeners: 0,
            averageCompletion: 80 + Math.floor(Math.random() * 15),
          },
        }

        nfts.push(nft)
      }

      return nfts
    },
    enabled: !tiersLoading && !!trackInfo,
    staleTime: 30000,
  })

  return {
    nfts: artistNFTs || [],
    isLoading: tiersLoading || nftsLoading,
    refetch,
  }
}

function getTierName(tier: number): string {
  switch (tier) {
    case 0: return 'Bronze'
    case 1: return 'Silver' 
    case 2: return 'Gold'
    case 3: return 'Platinum'
    default: return 'Unknown'
  }
}

/**
 * Generate mock monthly analytics data
 * In a real app, this would come from an analytics service
 */
export function useArtistAnalytics(artistAddress?: string) {
  const { artistStats } = useArtistData(artistAddress)

  const monthlyData = [
    { month: 'Jan', streams: Math.floor((artistStats?.totalPlays || 0) * 0.12), earnings: Math.floor((artistStats?.totalEarnings || 0) * 0.08), sales: Math.floor((artistStats?.nftsSold || 0) * 0.15) },
    { month: 'Feb', streams: Math.floor((artistStats?.totalPlays || 0) * 0.15), earnings: Math.floor((artistStats?.totalEarnings || 0) * 0.12), sales: Math.floor((artistStats?.nftsSold || 0) * 0.18) },
    { month: 'Mar', streams: Math.floor((artistStats?.totalPlays || 0) * 0.13), earnings: Math.floor((artistStats?.totalEarnings || 0) * 0.10), sales: Math.floor((artistStats?.nftsSold || 0) * 0.16) },
    { month: 'Apr', streams: Math.floor((artistStats?.totalPlays || 0) * 0.18), earnings: Math.floor((artistStats?.totalEarnings || 0) * 0.15), sales: Math.floor((artistStats?.nftsSold || 0) * 0.22) },
    { month: 'May', streams: Math.floor((artistStats?.totalPlays || 0) * 0.16), earnings: Math.floor((artistStats?.totalEarnings || 0) * 0.14), sales: Math.floor((artistStats?.nftsSold || 0) * 0.19) },
    { month: 'Jun', streams: Math.floor((artistStats?.totalPlays || 0) * 0.20), earnings: Math.floor((artistStats?.totalEarnings || 0) * 0.18), sales: Math.floor((artistStats?.nftsSold || 0) * 0.25) },
  ]

  return { monthlyData }
}
