import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import { UserService } from '@/src/services/user.service'
import { useMusicNFTUserData } from '@/src/hooks/contracts/useMusicNFT'
import { useArtistData } from '@/src/hooks/contracts/useArtistData'
import { createQueryKey } from '@/src/utils/bigint'
import type { UserProfile } from '@/src/services/user.service'
import type { User, UserStats, Achievement } from '@/src/types/social'
import type { MusicNFT } from '@/src/types/music-nft'

export interface EnhancedUserProfile extends User {
  // Database profile
  dbProfile: UserProfile | null
  
  // Contract data
  contractStats: any
  ownedNFTs: MusicNFT[]
  
  // Enhanced fields
  isVerified: boolean
  totalValue: number
  holderBenefits: any
}

/**
 * Hook to get comprehensive user profile combining database and contract data
 */
export function useEnhancedUserProfile(userId?: string) {
  const { address: connectedAddress } = useAccount()
  const targetAddress = (userId && userId.startsWith('0x')) ? userId : connectedAddress

  // Get contract data for the user
  const {
    ownedTokens,
    stats: contractStats,
    benefits: rawBenefits,
    collaboratorRoyalties,
    isLoading: contractLoading
  } = useMusicNFTUserData(targetAddress)

  // Get database profile
  const { data: dbProfile, isLoading: dbLoading } = useQuery({
    queryKey: createQueryKey('user-db-profile', targetAddress),
    queryFn: async () => {
      if (!targetAddress) return null
      
      try {
        const profile = await UserService.getByWalletAddress(targetAddress)
        return profile
      } catch (error) {
        console.log('User not found in database:', error)
        return null
      }
    },
    enabled: !!targetAddress,
    staleTime: 30000,
  })

  // Check if user is also an artist
  const { isArtist, artistStats } = useArtistData(targetAddress)

  // Combine all data into enhanced profile
  const enhancedProfile: EnhancedUserProfile | null = useMemo(() => {
    if (contractLoading || dbLoading) return null
    if (!targetAddress) return null

    // Parse benefits tuple: [hasAnyNFT, benefitsObject, highestTier]
    const [hasAnyNFT, benefitsObject, highestTier] = rawBenefits || [false, null, 0]

    // Parse contract stats: [userTotalNFTs, userTotalSpent, pagsBalance]
    const totalNFTs = contractStats ? Number(contractStats[0]) : 0
    const totalSpent = contractStats ? Number(contractStats[1]) / 1e18 : 0 // Convert from wei
    const pagsBalance = contractStats ? Number(contractStats[2]) / 1e18 : 0

    // Create display name
    const displayName = dbProfile?.display_name 
      || artistStats?.name 
      || `User ${targetAddress.slice(0, 6)}...${targetAddress.slice(-4)}`

    // Build comprehensive profile
    const profile: EnhancedUserProfile = {
      // Basic User interface fields
      id: userId || targetAddress.slice(-6),
      username: displayName.toLowerCase().replace(/\s+/g, ''),
      displayName,
      avatar: dbProfile?.avatar_url || artistStats?.avatar || '/api/placeholder/150/150',
      bio: dbProfile?.bio || 'Music lover and NFT collector',
      location: dbProfile?.location || undefined,
      website: dbProfile?.website || undefined,
      verified: isArtist || !!dbProfile,
      isArtist,
      walletAddress: targetAddress,
      followers: artistStats?.followers || 0,
      following: 0, // TODO: Implement following system
      totalTracks: isArtist ? (artistStats?.totalTracks || 0) : undefined,
      totalNFTs: totalNFTs,
      isPrivate: dbProfile?.is_private || false,
      showEmail: dbProfile?.show_email || false,
      showWallet: dbProfile?.show_wallet !== false,
      joinedAt: dbProfile?.created_at || new Date().toISOString(),
      lastActive: new Date().toISOString(),

      // Enhanced fields
      dbProfile,
      contractStats: {
        totalNFTs,
        totalSpent,
        pagsBalance,
        hasAnyNFT,
        collaboratorRoyalties: Number(collaboratorRoyalties || 0) / 1e18,
      },
      ownedNFTs: [], // TODO: Parse owned NFTs from contract
      isVerified: isArtist || !!dbProfile,
      totalValue: totalSpent,
      holderBenefits: benefitsObject,
    }

    return profile
  }, [
    targetAddress, 
    dbProfile, 
    contractStats, 
    rawBenefits, 
    collaboratorRoyalties, 
    isArtist, 
    artistStats, 
    contractLoading, 
    dbLoading, 
    userId
  ])

  return {
    profile: enhancedProfile,
    isLoading: contractLoading || dbLoading,
    error: null,
    
    // Raw data for debugging
    dbProfile,
    contractStats,
    isArtist,
    hasContractData: !!contractStats,
  }
}

/**
 * Hook to get just the database user profile (lighter version)
 */
export function useUserDBProfile(userAddress?: string) {
  const { address: connectedAddress } = useAccount()
  const targetAddress = userAddress || connectedAddress

  return useQuery({
    queryKey: createQueryKey('user-db-only', targetAddress),
    queryFn: async () => {
      if (!targetAddress) return null
      
      try {
        const profile = await UserService.getByWalletAddress(targetAddress)
        return profile
      } catch (error) {
        console.log('User not found in database:', error)
        return null
      }
    },
    enabled: !!targetAddress,
    staleTime: 30000,
  })
}

/**
 * Hook for user profile creation/update
 */
export function useUserProfileMutation() {
  return {
    createOrUpdateProfile: async (data: {
      walletAddress: string
      displayName?: string
      bio?: string
      location?: string
      website?: string
      socialLinks?: Record<string, string>
      avatarFile?: File
      privacySettings?: Record<string, boolean>
    }) => {
      return await UserService.upsertUser(data)
    },
    
    updateProfile: async (walletAddress: string, updates: any) => {
      return await UserService.updateProfile(walletAddress, updates)
    }
  }
}
