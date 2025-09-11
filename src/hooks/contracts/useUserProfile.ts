import { useQuery } from '@tanstack/react-query'
import { formatEther, type Address } from 'viem'
import { 
  useMusicNFTUserData
} from './useMusicNFT'
import { useBLOKBalance } from './useBLOKToken'
import { useArtistData } from './useArtistData'
import { createQueryKey } from '@/src/utils/bigint'
import type { MusicNFT } from '@/src/types/music-nft'
import type { User, UserStats, Achievement } from '@/src/types/social'
import { useAccount } from 'wagmi'

export interface UserProfile extends User {
  stats: UserStats
  achievements: Achievement[]
  ownedNFTs: MusicNFT[]
  blokBalance: number
  isArtist: boolean
  avatar: string
}

/**
 * Hook to get comprehensive user profile data from contracts
 */
export function useUserProfile(userId: string) {
  const { address: connectedAddress } = useAccount()
  // Try to interpret userId as an address or get from params
  const userAddress = userId?.startsWith('0x') ? userId as Address : connectedAddress
  
  // Get basic user data
  const { 
    ownedTokens, 
    stats: contractStats, 
    benefits, 
    collaboratorRoyalties,
    isLoading: userDataLoading 
  } = useMusicNFTUserData()
  
  // Get BLOK balance
  const { data: blokBalance, isLoading: blokLoading } = useBLOKBalance(userAddress)
  
  // Check if user is also an artist
  const { artistStats, isArtist  } = useArtistData(userAddress)

  // Build comprehensive profile data
  const { data: userProfile, isLoading: profileLoading } = useQuery({
    queryKey: createQueryKey('user-profile', userId, contractStats, blokBalance, artistStats),
    queryFn: async (): Promise<UserProfile> => {
      const address = userAddress || ''
      const displayName = artistStats?.name || `User ${address.slice(0, 6)}...${address.slice(-4)}`
      
      // Parse contract stats
      const totalNFTs = contractStats ? Number(contractStats[0]) : 0
      const totalSpent = contractStats ? Number(formatEther(contractStats[1])) : 0
      const tokenBalance = contractStats ? Number(formatEther(contractStats[2])) : 0
      const referrer = contractStats?.[3]
      const referralEarnings = contractStats ? Number(formatEther(contractStats[4])) : 0

      const user: User = {
        id: userId,
        username: displayName.toLowerCase().replace(/\s+/g, '-'),
        displayName,
        avatar: artistStats?.avatar || '/default-avatar.png',
        bio: isArtist 
          ? `Music artist with ${artistStats?.totalTracks || 0} tracks and ${artistStats?.totalPlays?.toLocaleString() || '0'} plays` 
          : `Music NFT collector with ${totalNFTs} NFTs in collection`,
        location: undefined, // Would come from off-chain profile data
        website: undefined, // Would come from off-chain profile data
        verified: isArtist || false,
        isArtist: isArtist || false,
        walletAddress: address,
        followers: artistStats?.followers || Math.floor(totalNFTs * 10), // Estimate
        following: Math.floor((artistStats?.followers || totalNFTs) * 0.2), // Estimate
        totalTracks: artistStats?.totalTracks,
        totalNFTs,
        isPrivate: false,
        showEmail: false,
        showWallet: true,
        joinedAt: '2024-01-01', // Would need to track contract interaction history
        lastActive: new Date().toISOString().split('T')[0],
      }

      const stats: UserStats = {
        totalSpent,
        totalEarned: referralEarnings + (artistStats?.totalEarnings || 0),
        nftsOwned: totalNFTs,
        nftsCreated: isArtist ? artistStats?.nftsCreated || 0 : 0,
        totalPlays: artistStats?.totalPlays || 0,
        blokEarned: tokenBalance,
        achievementCount: calculateAchievements(totalNFTs, totalSpent, isArtist || false).length,
      }

      const achievements = calculateAchievements(totalNFTs, totalSpent, isArtist || false)

      // For now, owned NFTs would need to be fetched separately
      // This is a placeholder - in reality we'd need to get NFT metadata for each owned token
      const ownedNFTs: MusicNFT[] = []

      return {
        ...user,
        stats,
        achievements,
        ownedNFTs,
        blokBalance: Number(blokBalance || 0),
        isArtist: isArtist || false,
        avatar: user.avatar,
      }
    },
    enabled: !userDataLoading && !blokLoading,
    staleTime: 30000,
  })

  return {
    userProfile,
    isLoading: userDataLoading || blokLoading || profileLoading,
    error: null,
    benefits, // Expose benefits for display
    collaboratorRoyalties, // Expose royalties
    ownedTokens, // Expose raw token IDs
  }
}

/**
 * Calculate user achievements based on their activity
 */
function calculateAchievements(nftsOwned: number, totalSpent: number, isArtist: boolean): Achievement[] {
  const achievements: Achievement[] = []

  // Collector achievements
  if (nftsOwned >= 1) {
    achievements.push({
      id: 'first-nft',
      name: 'First Collection',
      description: 'Purchased your first music NFT',
      icon: 'music',
      rarity: 'common',
      unlockedAt: '2024-01-15',
    })
  }

  if (nftsOwned >= 5) {
    achievements.push({
      id: 'collector',
      name: 'Collector',
      description: 'Own 5 music NFTs',
      icon: 'trophy',
      rarity: 'rare',
      unlockedAt: '2024-02-01',
    })
  }

  if (nftsOwned >= 10) {
    achievements.push({
      id: 'connoisseur',
      name: 'Music Connoisseur',
      description: 'Own 10 music NFTs',
      icon: 'award',
      rarity: 'epic',
      unlockedAt: '2024-02-15',
    })
  }

  if (nftsOwned >= 25) {
    achievements.push({
      id: 'curator',
      name: 'Curator',
      description: 'Own 25 music NFTs',
      icon: 'crown',
      rarity: 'legendary',
      unlockedAt: '2024-03-01',
    })
  }

  // Spending achievements
  if (totalSpent >= 100) {
    achievements.push({
      id: 'supporter',
      name: 'Artist Supporter',
      description: 'Spent $100+ supporting artists',
      icon: 'heart',
      rarity: 'common',
      unlockedAt: '2024-01-20',
    })
  }

  if (totalSpent >= 1000) {
    achievements.push({
      id: 'patron',
      name: 'Music Patron',
      description: 'Spent $1000+ supporting artists',
      icon: 'star',
      rarity: 'epic',
      unlockedAt: '2024-02-10',
    })
  }

  // Artist achievements
  if (isArtist) {
    achievements.push({
      id: 'artist-verified',
      name: 'Verified Artist',
      description: 'Verified as an artist on the platform',
      icon: 'check',
      rarity: 'epic',
      unlockedAt: '2024-01-01',
    })
  }

  return achievements
}

/**
 * Get activity feed for a user (mock implementation)
 * In reality, this would track on-chain events and user interactions
 */
export function useUserActivity(userId: string) {
  const activities = [
    {
      id: '1',
      type: 'purchase' as const,
      description: 'Purchased Midnight Echoes (Gold Edition)',
      amount: '$267.75',
      timestamp: '2 hours ago',
      metadata: { nftId: 'gold-1', tierColor: 'text-yellow-500' }
    },
    {
      id: '2', 
      type: 'like' as const,
      description: 'Liked Electric Dreams by Neon Pulse',
      timestamp: '5 hours ago',
      metadata: { trackId: 'track-2' }
    },
    {
      id: '3',
      type: 'follow' as const,
      description: 'Started following Luna Vista',
      timestamp: '1 day ago',
      metadata: { userId: 'luna-vista' }
    },
    {
      id: '4',
      type: 'royalty' as const,
      description: 'Received royalty payment',
      amount: '+$12.45',
      timestamp: '2 days ago',
      metadata: { nftId: 'silver-3' }
    }
  ]

  return { activities }
}
