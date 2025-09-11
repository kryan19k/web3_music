import { useAccount } from 'wagmi'
import { useQuery } from '@tanstack/react-query'
import { formatEther } from 'viem'
import { 
  useMusicNFTTrackInfo, 
  useMusicNFTAllTiers, 
  useMusicNFTArtistRole,
  useMusicNFTUserStats
} from './useMusicNFT'
import { usePAGSBalance } from './usePAGSToken'
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
  pagsBalance: number
  
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
  const { data: hasArtistRole, isLoading: roleLoading } = useMusicNFTArtistRole(targetAddress)
  
  // Get user stats from contract
  const { data: userStats, isLoading: statsLoading } = useMusicNFTUserStats(targetAddress)
  
  // Get PAGS token balance
  const { data: pagsBalance, isLoading: pagsLoading } = usePAGSBalance(targetAddress)
  
  // Get tier configurations to understand NFT structure
  const { tiers, isLoading: tiersLoading } = useMusicNFTAllTiers()
  
  // Get track information (assuming track ID 0 for now)
  const { data: trackInfo, isLoading: trackLoading } = useMusicNFTTrackInfo(0)

  // Aggregate all data
  const { data: artistStats, isLoading: aggregateLoading } = useQuery({
    queryKey: createQueryKey('artist-data', targetAddress, hasArtistRole, userStats, pagsBalance, trackInfo),
    queryFn: async (): Promise<ArtistStats> => {
      // Parse user stats from contract
      const totalNFTs = userStats ? Number(userStats[0]) : 0 // userTotalNFTs
      const totalSpent = userStats ? Number(formatEther(userStats[1])) : 0 // userTotalSpent  
      const pagsTokenBalance = userStats ? Number(formatEther(userStats[2])) : 0 // pagsBalance
      const referrer = userStats?.[3] // userReferrer
      const referralEarnings = userStats ? Number(formatEther(userStats[4])) : 0 // referralEarnings

      // Calculate additional stats
      const totalPlays = trackInfo ? Number(trackInfo.totalStreams) : 0
      
      return {
        name: trackInfo?.artist || `Artist ${targetAddress?.slice(0, 6)}...${targetAddress?.slice(-4)}`,
        address: targetAddress || '',
        avatar: trackInfo?.ipfsCoverArt ? `https://ipfs.io/ipfs/${trackInfo.ipfsCoverArt}` : undefined,
        verified: hasArtistRole || false,
        isArtist: hasArtistRole || false,
        
        // Financial stats
        totalEarnings: totalSpent, // This is what they've received from sales
        pendingPayouts: referralEarnings, // Available referral earnings  
        pagsBalance: pagsTokenBalance,
        
        // Track stats
        totalTracks: trackInfo?.active ? 1 : 0, // We only have one track for now
        nftsCreated: totalNFTs, // NFTs they own (which might be ones they created)
        nftsSold: 0, // We'd need additional contract tracking for this
        
        // Engagement stats
        totalPlays,
        monthlyListeners: Math.floor(totalPlays * 0.3), // Estimate based on total plays
        followers: Math.floor(totalPlays * 0.05), // Estimate based on engagement
        averageRating: 4.2 + Math.random() * 0.6, // Mock rating for now
      }
    },
    enabled: !!(targetAddress && !roleLoading && !statsLoading && !pagsLoading),
    staleTime: 30000,
    refetchInterval: 60000,
  })

  return {
    artistStats,
    trackInfo, // Expose for debugging
    userStats, // Expose for debugging
    isLoading: roleLoading || statsLoading || pagsLoading || trackLoading || tiersLoading || aggregateLoading,
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

  const { data: artistNFTs, isLoading: nftsLoading } = useQuery({
    queryKey: createQueryKey('artist-nfts', targetAddress, tiers, trackInfo),
    queryFn: async (): Promise<MusicNFT[]> => {
      const nfts: MusicNFT[] = []

      if (!trackInfo || !trackInfo.active) {
        return nfts
      }

      // Create NFT objects for each tier that has supply
      for (const [tierKey, tierData] of Object.entries(tiers)) {
        if (!tierData || Number(tierData.currentSupply) === 0) continue

        const tierNum = parseInt(tierKey)
        const tierName = getTierName(tierNum)
        const startId = Number(tierData.startId)
        
        // Create one representative NFT for this tier
        const nft: MusicNFT = {
          tokenId: startId.toString(),
          tier: tierName.toLowerCase() as any,
          metadata: {
            id: startId.toString(),
            title: trackInfo.title,
            artist: trackInfo.artist,
            image: trackInfo.ipfsCoverArt ? `https://ipfs.io/ipfs/${trackInfo.ipfsCoverArt}` : '/song_cover/placeholder.png',
            audioUrl: trackInfo.ipfsAudioHash ? `https://ipfs.io/ipfs/${trackInfo.ipfsAudioHash}` : '',
            duration: Number(trackInfo.duration),
            edition: 1,
            maxSupply: Number(tierData.maxSupply),
            description: `${tierName} tier music NFT for "${trackInfo.title}"`,
            genre: trackInfo.genre,
            releaseDate: new Date(Number(trackInfo.releaseDate) * 1000).toISOString().split('T')[0],
            pagsAmount: Number(formatEther(tierData.pagsAllocation)),
            dailyStreams: Number(trackInfo.totalStreams),
            attributes: [
              { trait_type: 'Tier', value: tierName },
              { trait_type: 'Artist', value: trackInfo.artist },
              { trait_type: 'Genre', value: trackInfo.genre },
              { trait_type: 'Duration', value: `${Math.floor(Number(trackInfo.duration) / 60)}:${(Number(trackInfo.duration) % 60).toString().padStart(2, '0')}` },
            ]
          },
          price: formatEther(tierData.price),
          priceUSD: Number(formatEther(tierData.price)) * 1785,
          earnings: {
            daily: Math.random() * 50,
            total: Number(formatEther(trackInfo.totalRoyaltiesGenerated || 0n)),
            apy: Math.random() * 25,
          },
          owner: targetAddress || '',
          isListed: tierData.saleActive,
          streamingStats: {
            totalPlays: Number(trackInfo.totalStreams),
            uniqueListeners: Math.floor(Number(trackInfo.totalStreams) * 0.3),
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
