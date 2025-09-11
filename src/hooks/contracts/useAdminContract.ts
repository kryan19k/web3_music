import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { MUSIC_NFT_ABI } from '@/src/constants/contracts/abis/MusicNFT'
import { CONTRACTS } from '@/src/constants/contracts/contracts'
import type { Tier, SalePhase } from './useMusicNFT'
import type { Address } from 'viem'

// Use the address directly from CONTRACTS to avoid import issues
const MUSIC_NFT_ADDRESS = CONTRACTS.MusicNFT.address

// ============================================
// ADMIN READ HOOKS - PLATFORM STATS
// ============================================

export function useAdminPlatformStats() {
  const totalSupply = useReadContract({
    address: MUSIC_NFT_ADDRESS,
    abi: MUSIC_NFT_ABI,
    functionName: 'totalSupply',
  })

  const totalPlatformRevenue = useReadContract({
    address: MUSIC_NFT_ADDRESS,
    abi: MUSIC_NFT_ABI,
    functionName: 'totalPlatformRevenue',
  })

  const totalRoyaltiesReceived = useReadContract({
    address: MUSIC_NFT_ADDRESS,
    abi: MUSIC_NFT_ABI,
    functionName: 'totalRoyaltiesReceived',
  })

  const totalRoyaltiesDistributed = useReadContract({
    address: MUSIC_NFT_ADDRESS,
    abi: MUSIC_NFT_ABI,
    functionName: 'totalRoyaltiesDistributed',
  })

  const totalReferralRewards = useReadContract({
    address: MUSIC_NFT_ADDRESS,
    abi: MUSIC_NFT_ABI,
    functionName: 'totalReferralRewards',
  })

  const platformFeePercentage = useReadContract({
    address: MUSIC_NFT_ADDRESS,
    abi: MUSIC_NFT_ABI,
    functionName: 'platformFeePercentage',
  })

  const platformFeeRecipient = useReadContract({
    address: MUSIC_NFT_ADDRESS,
    abi: MUSIC_NFT_ABI,
    functionName: 'platformFeeRecipient',
  })

  const isPaused = useReadContract({
    address: MUSIC_NFT_ADDRESS,
    abi: MUSIC_NFT_ABI,
    functionName: 'paused',
  })

  return {
    totalSupply: totalSupply.data || 0n,
    totalPlatformRevenue: totalPlatformRevenue.data || 0n,
    totalRoyaltiesReceived: totalRoyaltiesReceived.data || 0n,
    totalRoyaltiesDistributed: totalRoyaltiesDistributed.data || 0n,
    totalReferralRewards: totalReferralRewards.data || 0n,
    platformFeePercentage: platformFeePercentage.data || 0n,
    platformFeeRecipient: platformFeeRecipient.data,
    isPaused: isPaused.data || false,
    isLoading: totalSupply.isLoading || totalPlatformRevenue.isLoading || 
               totalRoyaltiesReceived.isLoading || platformFeePercentage.isLoading
  }
}

// ============================================
// ADMIN READ HOOKS - ROLE MANAGEMENT
// ============================================

export function useAdminRoleInfo(address?: Address) {
  const defaultAdminRole = useReadContract({
    address: MUSIC_NFT_ADDRESS,
    abi: MUSIC_NFT_ABI,
    functionName: 'DEFAULT_ADMIN_ROLE',
    query: {
      retry: 3,
      retryDelay: 1000,
    }
  })

  const managerRole = useReadContract({
    address: MUSIC_NFT_ADDRESS,
    abi: MUSIC_NFT_ABI,
    functionName: 'MANAGER_ROLE',
    query: {
      retry: 3,
      retryDelay: 1000,
    }
  })

  const artistRole = useReadContract({
    address: MUSIC_NFT_ADDRESS,
    abi: MUSIC_NFT_ABI,
    functionName: 'ARTIST_ROLE',
    query: {
      retry: 3,
      retryDelay: 1000,
    }
  })

  const oracleRole = useReadContract({
    address: MUSIC_NFT_ADDRESS,
    abi: MUSIC_NFT_ABI,
    functionName: 'ORACLE_ROLE',
    query: {
      retry: 3,
      retryDelay: 1000,
    }
  })

  // Debug logging (temporary) - only log if not the deployer
  const DEPLOYER_ADDRESS = '0x53B7796D35fcD7fE5D31322AaE8469046a2bB034'
  const isDeployer = address?.toLowerCase() === DEPLOYER_ADDRESS.toLowerCase()
  
  if (!isDeployer && (defaultAdminRole.error || managerRole.error || artistRole.error)) {
    console.log('Admin Role Info Errors:', {
      contractAddress: MUSIC_NFT_ADDRESS,
      defaultAdminRole: defaultAdminRole.error?.message,
      managerRole: managerRole.error?.message,
      artistRole: artistRole.error?.message,
    })
  }

  const hasAdminRole = useReadContract({
    address: MUSIC_NFT_ADDRESS,
    abi: MUSIC_NFT_ABI,
    functionName: 'hasRole',
    args: address && defaultAdminRole.data ? [defaultAdminRole.data, address] : undefined,
    query: { enabled: !!address && !!defaultAdminRole.data }
  })

  const hasManagerRole = useReadContract({
    address: MUSIC_NFT_ADDRESS,
    abi: MUSIC_NFT_ABI,
    functionName: 'hasRole',
    args: address && managerRole.data ? [managerRole.data, address] : undefined,
    query: { enabled: !!address && !!managerRole.data }
  })

  // Debug admin hasRole calls for comparison
  const { chain } = useAccount()
  if (address && (hasAdminRole.data !== undefined || hasAdminRole.error)) {
    console.log('🔍 COMPREHENSIVE DEBUG (ADMIN PANEL):', {
      contractAddress: MUSIC_NFT_ADDRESS,
      chainId: chain?.id,
      chainName: chain?.name,
      adminRole: defaultAdminRole.data,
      managerRole: managerRole.data,
      artistRole: artistRole.data,
      address,
      abiLength: MUSIC_NFT_ABI.length,
      abiName: 'MUSIC_NFT_ABI',
      hasAdminResult: hasAdminRole.data,
      hasManagerResult: hasManagerRole.data,
      adminError: hasAdminRole.error?.message,
      managerError: hasManagerRole.error?.message,
      source: 'ADMIN_PANEL'
    })
  }

  return {
    roles: {
      admin: defaultAdminRole.data,
      manager: managerRole.data,
      artist: artistRole.data,
      oracle: oracleRole.data,
    },
    userRoles: {
      isAdmin: hasAdminRole.data || false,
      isManager: hasManagerRole.data || false,
    },
    isLoading: defaultAdminRole.isLoading || hasAdminRole.isLoading || managerRole.isLoading || artistRole.isLoading,
    errors: {
      defaultAdminRole: defaultAdminRole.error,
      managerRole: managerRole.error,
      artistRole: artistRole.error,
      oracleRole: oracleRole.error,
      hasAdminRole: hasAdminRole.error,
      hasManagerRole: hasManagerRole.error,
    }
  }
}

// ============================================
// ADMIN WRITE HOOKS - PLATFORM MANAGEMENT
// ============================================

export function useAdminUpdatePlatformFee() {
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })
  const queryClient = useQueryClient()

  const updatePlatformFee = useMutation({
    mutationFn: async ({ newPercentage }: { newPercentage: number }) => {
      return writeContract({
        address: MUSIC_NFT_ADDRESS,
        abi: MUSIC_NFT_ABI,
        functionName: 'updatePlatformFee',
        args: [BigInt(newPercentage * 100)], // Convert percentage to basis points
        // biome-ignore lint/suspicious/noExplicitAny: Wagmi type system requires any for complex contract interactions
      } as any)
    },
    onSuccess: () => {
      toast.success('Platform fee update initiated!')
      queryClient.invalidateQueries({ queryKey: ['admin-platform-stats'] })
    },
    onError: (error) => {
      toast.error('Failed to update platform fee')
      console.error('Platform fee update error:', error)
    },
  })

  return {
    updatePlatformFee: updatePlatformFee.mutate,
    isLoading: isPending || isConfirming,
    isSuccess,
    hash,
  }
}

export function useAdminSetSalePhase() {
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })
  const queryClient = useQueryClient()

  const setSalePhase = useMutation({
    mutationFn: async ({ phase }: { phase: SalePhase }) => {
      return writeContract({
        address: MUSIC_NFT_ADDRESS,
        abi: MUSIC_NFT_ABI,
        functionName: 'setSalePhase',
        args: [phase],
        // biome-ignore lint/suspicious/noExplicitAny: Wagmi type system requires any for complex contract interactions
      } as any)
    },
    onSuccess: () => {
      toast.success('Sale phase updated!')
      queryClient.invalidateQueries({ queryKey: ['music-nft-marketplace'] })
    },
    onError: (error) => {
      toast.error('Failed to update sale phase')
      console.error('Sale phase update error:', error)
    },
  })

  return {
    setSalePhase: setSalePhase.mutate,
    isLoading: isPending || isConfirming,
    isSuccess,
    hash,
  }
}

export function useAdminTogglePause() {
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })
  const queryClient = useQueryClient()

  const pause = useMutation({
    mutationFn: async () => {
      return writeContract({
        address: MUSIC_NFT_ADDRESS,
        abi: MUSIC_NFT_ABI,
        functionName: 'pause',
        // biome-ignore lint/suspicious/noExplicitAny: Wagmi type system requires any for complex contract interactions
      } as any)
    },
    onSuccess: () => {
      toast.success('Contract paused!')
      queryClient.invalidateQueries({ queryKey: ['admin-platform-stats'] })
    },
    onError: (error) => {
      toast.error('Failed to pause contract')
      console.error('Pause error:', error)
    },
  })

  const unpause = useMutation({
    mutationFn: async () => {
      return writeContract({
        address: MUSIC_NFT_ADDRESS,
        abi: MUSIC_NFT_ABI,
        functionName: 'unpause',
        // biome-ignore lint/suspicious/noExplicitAny: Wagmi type system requires any for complex contract interactions
      } as any)
    },
    onSuccess: () => {
      toast.success('Contract unpaused!')
      queryClient.invalidateQueries({ queryKey: ['admin-platform-stats'] })
    },
    onError: (error) => {
      toast.error('Failed to unpause contract')
      console.error('Unpause error:', error)
    },
  })

  return {
    pause: pause.mutate,
    unpause: unpause.mutate,
    isLoading: isPending || isConfirming,
    isSuccess,
    hash,
  }
}

export function useAdminSetDynamicPricing() {
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })
  const queryClient = useQueryClient()

  const setDynamicPricing = useMutation({
    mutationFn: async ({ enabled }: { enabled: boolean }) => {
      return writeContract({
        address: MUSIC_NFT_ADDRESS,
        abi: MUSIC_NFT_ABI,
        functionName: 'setDynamicPricing',
        args: [enabled],
        // biome-ignore lint/suspicious/noExplicitAny: Wagmi type system requires any for complex contract interactions
      } as any)
    },
    onSuccess: () => {
      toast.success('Dynamic pricing updated!')
      queryClient.invalidateQueries({ queryKey: ['music-nft-marketplace'] })
    },
    onError: (error) => {
      toast.error('Failed to update dynamic pricing')
      console.error('Dynamic pricing error:', error)
    },
  })

  return {
    setDynamicPricing: setDynamicPricing.mutate,
    isLoading: isPending || isConfirming,
    isSuccess,
    hash,
  }
}

// ============================================
// ADMIN WRITE HOOKS - TIER MANAGEMENT
// ============================================

export function useAdminUpdateTierConfig() {
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })
  const queryClient = useQueryClient()

  const updateTierConfig = useMutation({
    mutationFn: async ({ 
      tier, 
      price, 
      saleActive, 
      metadataURI 
    }: { 
      tier: Tier
      price: string
      saleActive: boolean
      metadataURI: string
    }) => {
      return writeContract({
        address: MUSIC_NFT_ADDRESS,
        abi: MUSIC_NFT_ABI,
        functionName: 'updateTierConfig',
        args: [tier, parseEther(price), saleActive, metadataURI],
        // biome-ignore lint/suspicious/noExplicitAny: Wagmi type system requires any for complex contract interactions
      } as any)
    },
    onSuccess: () => {
      toast.success('Tier configuration updated!')
      queryClient.invalidateQueries({ queryKey: ['music-nft-tiers'] })
    },
    onError: (error) => {
      toast.error('Failed to update tier config')
      console.error('Tier config error:', error)
    },
  })

  return {
    updateTierConfig: updateTierConfig.mutate,
    isLoading: isPending || isConfirming,
    isSuccess,
    hash,
  }
}

// ============================================
// ADMIN WRITE HOOKS - ROYALTY MANAGEMENT
// ============================================

export function useAdminDepositRoyalties() {
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })
  const queryClient = useQueryClient()

  const depositRoyalties = useMutation({
    mutationFn: async ({ amount }: { amount: string }) => {
      return writeContract({
        address: MUSIC_NFT_ADDRESS,
        abi: MUSIC_NFT_ABI,
        functionName: 'depositRoyalties',
        value: parseEther(amount),
        // biome-ignore lint/suspicious/noExplicitAny: Wagmi type system requires any for complex contract interactions
      } as any)
    },
    onSuccess: () => {
      toast.success('Royalties deposited successfully!')
      queryClient.invalidateQueries({ queryKey: ['admin-platform-stats'] })
    },
    onError: (error) => {
      toast.error('Failed to deposit royalties')
      console.error('Royalty deposit error:', error)
    },
  })

  return {
    depositRoyalties: depositRoyalties.mutate,
    isLoading: isPending || isConfirming,
    isSuccess,
    hash,
  }
}

export function useAdminUpdateTrackStats() {
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const updateTrackStats = useMutation({
    mutationFn: async ({ 
      trackId, 
      streams, 
      royalties 
    }: { 
      trackId: number
      streams: number
      royalties: string
    }) => {
      return writeContract({
        address: MUSIC_NFT_ADDRESS,
        abi: MUSIC_NFT_ABI,
        functionName: 'updateTrackStats',
        args: [BigInt(trackId), BigInt(streams), parseEther(royalties)],
        // biome-ignore lint/suspicious/noExplicitAny: Wagmi type system requires any for complex contract interactions
      } as any)
    },
    onSuccess: () => {
      toast.success('Track statistics updated!')
    },
    onError: (error) => {
      toast.error('Failed to update track stats')
      console.error('Track stats error:', error)
    },
  })

  return {
    updateTrackStats: updateTrackStats.mutate,
    isLoading: isPending || isConfirming,
    isSuccess,
    hash,
  }
}

// ============================================
// ADMIN WRITE HOOKS - ROLE MANAGEMENT
// ============================================

export function useAdminGrantRole() {
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const grantRole = useMutation({
    mutationFn: async ({ role, account }: { role: string, account: Address }) => {
      console.log('🔵 Grant role called with:', { role, account, contractAddress: MUSIC_NFT_ADDRESS })
      
      try {
        const result = await writeContract({
          address: MUSIC_NFT_ADDRESS,
          abi: MUSIC_NFT_ABI,
          functionName: 'grantRole',
          args: [role as `0x${string}`, account],
          // biome-ignore lint/suspicious/noExplicitAny: Wagmi type system requires any for complex contract interactions
        } as any)
        
        console.log('🟢 Grant role writeContract result:', result)
        return result
      } catch (error) {
        console.error('🔴 Grant role writeContract error:', error)
        throw error
      }
    },
    onSuccess: (data) => {
      console.log('🎉 Grant role onSuccess:', data)
      const hashStr = data != null ? String(data) : 'pending'
      toast.success(`Role granted successfully! Transaction hash: ${hashStr}`)
    },
    onError: (error) => {
      console.error('💥 Grant role onError:', error)
      toast.error('Failed to grant role: ' + (error instanceof Error ? error.message : 'Unknown error'))
    },
  })

  return {
    grantRole: grantRole.mutate,
    reset: grantRole.reset,
    isLoading: isPending || isConfirming,
    isSuccess,
    hash,
  }
}

export function useAdminRevokeRole() {
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const revokeRole = useMutation({
    mutationFn: async ({ role, account }: { role: string, account: Address }) => {
      return writeContract({
        address: MUSIC_NFT_ADDRESS,
        abi: MUSIC_NFT_ABI,
        functionName: 'revokeRole',
        args: [role as `0x${string}`, account],
        // biome-ignore lint/suspicious/noExplicitAny: Wagmi type system requires any for complex contract interactions
      } as any)
    },
    onSuccess: () => {
      toast.success('Role revoked successfully!')
    },
    onError: (error) => {
      toast.error('Failed to revoke role')
      console.error('Revoke role error:', error)
    },
  })

  return {
    revokeRole: revokeRole.mutate,
    isLoading: isPending || isConfirming,
    isSuccess,
    hash,
  }
}

// ============================================
// EMERGENCY FUNCTIONS
// ============================================

export function useAdminEmergencyWithdraw() {
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const emergencyWithdraw = useMutation({
    mutationFn: async () => {
      return writeContract({
        address: MUSIC_NFT_ADDRESS,
        abi: MUSIC_NFT_ABI,
        functionName: 'emergencyWithdraw',
        // biome-ignore lint/suspicious/noExplicitAny: Wagmi type system requires any for complex contract interactions
      } as any)
    },
    onSuccess: () => {
      toast.success('Emergency withdrawal executed!')
    },
    onError: (error) => {
      toast.error('Emergency withdrawal failed')
      console.error('Emergency withdrawal error:', error)
    },
  })

  return {
    emergencyWithdraw: emergencyWithdraw.mutate,
    isLoading: isPending || isConfirming,
    isSuccess,
    hash,
  }
}

// ============================================
// COMBINED ADMIN DATA HOOK
// ============================================

export function useAdminContractData() {
  const { address } = useAccount()
  const platformStats = useAdminPlatformStats()
  const roleInfo = useAdminRoleInfo(address)

  // Temporary: Allow the deployer address to access admin panel
  const DEPLOYER_ADDRESS = '0x53B7796D35fcD7fE5D31322AaE8469046a2bB034'
  const isDeployerAdmin = address?.toLowerCase() === DEPLOYER_ADDRESS.toLowerCase()

  // Override authorization for deployer to bypass contract role checks
  const isAuthorized = isDeployerAdmin || roleInfo.userRoles.isAdmin || roleInfo.userRoles.isManager

  return {
    address,
    platformStats,
    roleInfo: {
      ...roleInfo,
      userRoles: {
        ...roleInfo.userRoles,
        // Override roles for deployer
        isAdmin: isDeployerAdmin || roleInfo.userRoles.isAdmin,
        isManager: isDeployerAdmin || roleInfo.userRoles.isManager,
      }
    },
    // Skip loading for deployer since we're bypassing contract checks
    isLoading: isDeployerAdmin ? false : (platformStats.isLoading || roleInfo.isLoading),
    isAuthorized,
  }
}
