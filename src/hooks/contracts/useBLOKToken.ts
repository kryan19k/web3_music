import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther, type Address } from 'viem'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { BLOKTokenAbi } from '@/src/constants/contracts/abis/BLOKToken'
import { BLOK_TOKEN_ADDRESS } from '@/src/constants/contracts/contracts'

// ============================================
// READ HOOKS
// ============================================

export function useBLOKBalance(address?: Address) {
  return useReadContract({
    address: BLOK_TOKEN_ADDRESS,
    abi: BLOKTokenAbi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })
}

export function useBLOKTotalSupply() {
  return useReadContract({
    address: BLOK_TOKEN_ADDRESS,
    abi: BLOKTokenAbi,
    functionName: 'totalSupply',
  })
}

export function useBLOKCirculatingSupply() {
  return useReadContract({
    address: BLOK_TOKEN_ADDRESS,
    abi: BLOKTokenAbi,
    functionName: 'circulatingSupply',
  })
}

export function useBLOKRoyaltyInfo(address?: Address) {
  const { data: pendingRoyalties } = useReadContract({
    address: BLOK_TOKEN_ADDRESS,
    abi: BLOKTokenAbi,
    functionName: 'pendingRoyalties',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  const { data: lastClaimedPeriod } = useReadContract({
    address: BLOK_TOKEN_ADDRESS,
    abi: BLOKTokenAbi,
    functionName: 'lastClaimedPeriod',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  const { data: currentPeriod } = useReadContract({
    address: BLOK_TOKEN_ADDRESS,
    abi: BLOKTokenAbi,
    functionName: 'currentPeriod',
  })

  return {
    pendingRoyalties: pendingRoyalties ? formatEther(pendingRoyalties) : '0',
    lastClaimedPeriod: lastClaimedPeriod?.toString() || '0',
    currentPeriod: currentPeriod?.toString() || '0',
    unclaimedPeriods: currentPeriod && lastClaimedPeriod 
      ? Number(currentPeriod) - Number(lastClaimedPeriod)
      : 0,
  }
}

export function useBLOKStakingInfo(address?: Address) {
  const { data: stakes } = useReadContract({
    address: BLOK_TOKEN_ADDRESS,
    abi: BLOKTokenAbi,
    functionName: 'getStakes',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  const { data: totalStaked } = useReadContract({
    address: BLOK_TOKEN_ADDRESS,
    abi: BLOKTokenAbi,
    functionName: 'totalStaked',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  const { data: globalTotalStaked } = useReadContract({
    address: BLOK_TOKEN_ADDRESS,
    abi: BLOKTokenAbi,
    functionName: 'globalTotalStaked',
  })

  // Calculate pending rewards for each stake
  const stakesWithRewards = useQuery({
    queryKey: ['blok-stakes-rewards', address],
    queryFn: async () => {
      if (!stakes || !address) return []
      
      const stakesWithRewardsPromises = stakes.map(async (stake, index) => {
        // This would call calculateStakeReward for each stake
        // For now, we'll return the stake with a placeholder reward calculation
        return {
          ...stake,
          index,
          pendingReward: '0', // Would be calculated from contract
        }
      })
      
      return Promise.all(stakesWithRewardsPromises)
    },
    enabled: !!stakes && !!address,
  })

  return {
    stakes: stakesWithRewards.data || [],
    totalStaked: totalStaked ? formatEther(totalStaked) : '0',
    globalTotalStaked: globalTotalStaked ? formatEther(globalTotalStaked) : '0',
    activeStakes: stakes?.length || 0,
  }
}

export function useBLOKStakingTiers() {
  const tierIds = [1, 2, 3, 4]
  
  const tierQueries = tierIds.map(tierId =>
    useReadContract({
      address: BLOK_TOKEN_ADDRESS,
      abi: BLOKTokenAbi,
      functionName: 'stakingTiers',
      args: [BigInt(tierId)],
    })
  )

  const tiers = tierQueries.map((query, index) => ({
    id: tierIds[index],
    ...query.data,
    isLoading: query.isLoading,
    error: query.error,
  }))

  return { tiers }
}

// ============================================
// WRITE HOOKS
// ============================================

export function useBLOKStake() {
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })
  const queryClient = useQueryClient()

  const stake = useMutation({
    mutationFn: async ({ amount, tier, autoCompound }: {
      amount: string
      tier: number
      autoCompound: boolean
    }) => {
      return writeContract({
        address: BLOK_TOKEN_ADDRESS,
        abi: BLOKTokenAbi,
        functionName: 'stakeTokens',
        args: [parseEther(amount), BigInt(tier), autoCompound],
        // biome-ignore lint/suspicious/noExplicitAny: Wagmi type system requires any for complex contract interactions
      } as any)
    },
    onSuccess: () => {
      toast.success('Staking initiated! Waiting for confirmation...')
    },
    onError: (error) => {
      toast.error('Staking failed')
      console.error('Staking error:', error)
    },
  })

  // Invalidate queries after successful transaction
  if (isSuccess) {
    queryClient.invalidateQueries({ queryKey: ['blok-stakes'] })
    queryClient.invalidateQueries({ queryKey: ['blok-balance'] })
    toast.success('Tokens staked successfully!')
  }

  return {
    stake: stake.mutate,
    isLoading: isPending || isConfirming,
    isSuccess,
    hash,
  }
}

export function useBLOKUnstake() {
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })
  const queryClient = useQueryClient()

  const unstake = useMutation({
    mutationFn: async ({ stakeIndex }: { stakeIndex: number }) => {
      return writeContract({
        address: BLOK_TOKEN_ADDRESS,
        abi: BLOKTokenAbi,
        functionName: 'unstakeTokens',
        args: [BigInt(stakeIndex)],
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      } as any)
    },
    onSuccess: () => {
      toast.success('Unstaking initiated!')
    },
    onError: (error) => {
      toast.error('Unstaking failed')
      console.error('Unstaking error:', error)
    },
  })

  if (isSuccess) {
    queryClient.invalidateQueries({ queryKey: ['blok-stakes'] })
    queryClient.invalidateQueries({ queryKey: ['blok-balance'] })
    toast.success('Tokens unstaked successfully!')
  }

  return {
    unstake: unstake.mutate,
    isLoading: isPending || isConfirming,
    isSuccess,
    hash,
  }
}

export function useBLOKClaimStakingRewards() {
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })
  const queryClient = useQueryClient()

  const claimRewards = useMutation({
    mutationFn: async ({ stakeIndex }: { stakeIndex: number }) => {
      return writeContract({
        address: BLOK_TOKEN_ADDRESS,
        abi: BLOKTokenAbi,
        functionName: 'claimStakingRewards',
        args: [BigInt(stakeIndex)],
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      } as any)
      
    },
    onSuccess: () => {
      toast.success('Claiming rewards...')
    },
    onError: (error) => {
      toast.error('Claiming failed')
      console.error('Claim error:', error)
    },
  })

  if (isSuccess) {
    queryClient.invalidateQueries({ queryKey: ['blok-stakes'] })
    queryClient.invalidateQueries({ queryKey: ['blok-balance'] })
    toast.success('Rewards claimed successfully!')
  }

  return {
    claimRewards: claimRewards.mutate,
    isLoading: isPending || isConfirming,
    isSuccess,
    hash,
  }
}

export function useBLOKClaimRoyalties() {
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })
  const queryClient = useQueryClient()

  const claimRoyalties = useMutation({
    mutationFn: async () => {
      return writeContract({
        address: BLOK_TOKEN_ADDRESS,
        abi: BLOKTokenAbi,
        functionName: 'claimRoyalties',
        // biome-ignore lint/suspicious/noExplicitAny: Wagmi type system requires any for complex contract interactions
      } as any)
    },
    onSuccess: () => {
      toast.success('Claiming royalties...')
    },
    onError: (error) => {
      toast.error('Royalty claim failed')
      console.error('Royalty claim error:', error)
    },
  })

  if (isSuccess) {
    queryClient.invalidateQueries({ queryKey: ['blok-royalties'] })
    toast.success('Royalties claimed successfully!')
  }

  return {
    claimRoyalties: claimRoyalties.mutate,
    isLoading: isPending || isConfirming,
    isSuccess,
    hash,
  }
}

export function useBLOKDepositRoyalties() {
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })
  const queryClient = useQueryClient()

  const depositRoyalties = useMutation({
    mutationFn: async ({ amount }: { amount: string }) => {
      return writeContract({
        address: BLOK_TOKEN_ADDRESS,
        abi: BLOKTokenAbi,
        functionName: 'depositRoyalties',
        value: parseEther(amount),
        // biome-ignore lint/suspicious/noExplicitAny: Wagmi type system requires any for complex contract interactions
      } as any)
    },
    onSuccess: () => {
      toast.success('Depositing royalties...')
    },
    onError: (error) => {
      toast.error('Royalty deposit failed')
      console.error('Royalty deposit error:', error)
    },
  })

  if (isSuccess) {
    queryClient.invalidateQueries({ queryKey: ['blok-royalties'] })
    toast.success('Royalties deposited successfully!')
  }

  return {
    depositRoyalties: depositRoyalties.mutate,
    isLoading: isPending || isConfirming,
    isSuccess,
    hash,
  }
}

// ============================================
// GOVERNANCE HOOKS
// ============================================

export function useBLOKProposals() {
  const { data: proposalCount } = useReadContract({
    address: BLOK_TOKEN_ADDRESS,
    abi: BLOKTokenAbi,
    functionName: 'proposalCount',
  })

  return useQuery({
    queryKey: ['blok-proposals', proposalCount ? proposalCount.toString() : '0'],
    queryFn: async () => {
      if (!proposalCount) return []
      
      const proposals = []
      for (let i = 1; i <= Number(proposalCount); i++) {
        // Would fetch each proposal - this is a simplified version
        proposals.push({ id: i })
      }
      return proposals
    },
    enabled: !!proposalCount && Number(proposalCount) > 0,
  })
}

export function useBLOKCreateProposal() {
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const createProposal = useMutation({
    mutationFn: async ({ description }: { description: string }) => {
      return writeContract({
        address: BLOK_TOKEN_ADDRESS,
        abi: BLOKTokenAbi,
        functionName: 'createProposal',
        args: [description],
        // biome-ignore lint/suspicious/noExplicitAny: Wagmi type system requires any for complex contract interactions
      } as any)
    },
    onSuccess: () => {
      toast.success('Proposal created!')
    },
    onError: (error) => {
      toast.error('Failed to create proposal')
      console.error('Proposal error:', error)
    },
  })

  return {
    createProposal: createProposal.mutate,
    isLoading: isPending || isConfirming,
    isSuccess,
    hash,
  }
}

export function useBLOKVote() {
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const vote = useMutation({
    mutationFn: async ({ proposalId, support }: { proposalId: number; support: boolean }) => {
      return writeContract({
        address: BLOK_TOKEN_ADDRESS,
        abi: BLOKTokenAbi,
        functionName: 'vote',
        args: [BigInt(proposalId), support],
        // biome-ignore lint/suspicious/noExplicitAny: Wagmi type system requires any for complex contract interactions
      } as any)
    },
    onSuccess: () => {
      toast.success('Vote cast!')
    },
    onError: (error) => {
      toast.error('Voting failed')
      console.error('Vote error:', error)
    },
  })

  return {
    vote: vote.mutate,
    isLoading: isPending || isConfirming,
    isSuccess,
    hash,
  }
}

// ============================================
// COMBINED HOOKS
// ============================================

export function useBLOKUserData() {
  const { address } = useAccount()
  
  const balance = useBLOKBalance(address)
  const royaltyInfo = useBLOKRoyaltyInfo(address)
  const stakingInfo = useBLOKStakingInfo(address)

  return {
    address,
    balance: balance.data ? formatEther(balance.data) : '0',
    royalties: royaltyInfo,
    staking: stakingInfo,
    isLoading: balance.isLoading,
  }
}
