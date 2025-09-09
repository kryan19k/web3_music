import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther, type Address } from 'viem'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { MusicNFTAbi } from '@/src/constants/contracts/abis/MusicNFT'
import { CONTRACTS } from '@/src/constants/contracts/contracts'

// Use the address directly from CONTRACTS to avoid import issues
const MUSIC_NFT_ADDRESS = CONTRACTS.MusicNFT.address

export enum Tier {
  BRONZE = 0,
  SILVER = 1,
  GOLD = 2,
  PLATINUM = 3
}

export enum SalePhase {
  CLOSED = 0,
  WHITELIST = 1,
  PUBLIC = 2
}

// ============================================
// READ HOOKS - TIER & SALE INFO
// ============================================

export function useMusicNFTTierConfig(tier: Tier) {
  return useReadContract({
    address: MUSIC_NFT_ADDRESS,
    abi: MusicNFTAbi,
    functionName: 'tiers',
    args: [tier],
  })
}

export function useMusicNFTAllTiers() {
  const bronze = useMusicNFTTierConfig(Tier.BRONZE)
  const silver = useMusicNFTTierConfig(Tier.SILVER)
  const gold = useMusicNFTTierConfig(Tier.GOLD)
  const platinum = useMusicNFTTierConfig(Tier.PLATINUM)

  return {
    tiers: {
      [Tier.BRONZE]: bronze.data,
      [Tier.SILVER]: silver.data,
      [Tier.GOLD]: gold.data,
      [Tier.PLATINUM]: platinum.data,
    },
    isLoading: bronze.isLoading || silver.isLoading || gold.isLoading || platinum.isLoading,
  }
}

export function useMusicNFTTierStats(tier: Tier) {
  return useReadContract({
    address: MUSIC_NFT_ADDRESS,
    abi: MusicNFTAbi,
    functionName: 'getTierStats',
    args: [tier],
  })
}

export function useMusicNFTSalePhase() {
  return useReadContract({
    address: MUSIC_NFT_ADDRESS,
    abi: MusicNFTAbi,
    functionName: 'currentPhase',
  })
}

export function useMusicNFTDynamicPricing() {
  return useReadContract({
    address: MUSIC_NFT_ADDRESS,
    abi: MusicNFTAbi,
    functionName: 'dynamicPricingEnabled',
  })
}

// ============================================
// READ HOOKS - USER DATA
// ============================================

export function useMusicNFTBalance(tokenId: number, address?: Address) {
  return useReadContract({
    address: MUSIC_NFT_ADDRESS,
    abi: MusicNFTAbi,
    functionName: 'balanceOf',
    args: address && tokenId !== undefined ? [address, BigInt(tokenId)] : undefined,
    query: {
      enabled: !!address && tokenId !== undefined,
    },
  })
}

export function useMusicNFTOwnedTokens(address?: Address) {
  return useReadContract({
    address: MUSIC_NFT_ADDRESS,
    abi: MusicNFTAbi,
    functionName: 'getOwnedTokens',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })
}

export function useMusicNFTUserStats(address?: Address) {
  return useReadContract({
    address: MUSIC_NFT_ADDRESS,
    abi: MusicNFTAbi,
    functionName: 'getUserStats',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })
}

export function useMusicNFTHolderBenefits(address?: Address) {
  return useReadContract({
    address: MUSIC_NFT_ADDRESS,
    abi: MusicNFTAbi,
    functionName: 'getHolderBenefits',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })
}

// ============================================
// READ HOOKS - TRACK DATA
// ============================================

export function useMusicNFTTrackInfo(trackId: number) {
  return useReadContract({
    address: MUSIC_NFT_ADDRESS,
    abi: MusicNFTAbi,
    functionName: 'getTrackInfo',
    args: [BigInt(trackId)],
    query: {
      enabled: trackId !== undefined,
    },
  })
}

export function useMusicNFTTokenMetadata(tokenId: number) {
  const tokenToTier = useReadContract({
    address: MUSIC_NFT_ADDRESS,
    abi: MusicNFTAbi,
    functionName: 'tokenToTier',
    args: [BigInt(tokenId)],
  })

  const tokenToTrackId = useReadContract({
    address: MUSIC_NFT_ADDRESS,
    abi: MusicNFTAbi,
    functionName: 'tokenToTrackId',
    args: [BigInt(tokenId)],
  })

  const uri = useReadContract({
    address: MUSIC_NFT_ADDRESS,
    abi: MusicNFTAbi,
    functionName: 'uri',
    args: [BigInt(tokenId)],
  })

  return {
    tier: tokenToTier.data,
    trackId: tokenToTrackId.data,
    uri: uri.data,
    isLoading: tokenToTier.isLoading || tokenToTrackId.isLoading || uri.isLoading,
  }
}

// ============================================
// READ HOOKS - EXCLUSIVE CONTENT
// ============================================

// Note: getExclusiveContent function doesn't exist in current ABI
// This hook has been removed to fix compilation errors
// If this functionality is needed, implement it in the contract first

// ============================================
// READ HOOKS - ROYALTIES & COLLABORATION
// ============================================

export function useMusicNFTCollaboratorRoyalties(address?: Address) {
  return useReadContract({
    address: MUSIC_NFT_ADDRESS,
    abi: MusicNFTAbi,
    functionName: 'claimableRoyalties',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })
}

export function useMusicNFTTrackCollaborator(trackId: number, index: number) {
  return useReadContract({
    address: MUSIC_NFT_ADDRESS,
    abi: MusicNFTAbi,
    functionName: 'trackCollaborators',
    args: [BigInt(trackId), BigInt(index)],
    query: {
      enabled: trackId !== undefined && index !== undefined,
    },
  })
}

// ============================================
// WRITE HOOKS - MINTING
// ============================================

export function useMusicNFTMint() {
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })
  const queryClient = useQueryClient()

  const mint = useMutation({
    mutationFn: async ({ 
      tier, 
      quantity, 
      referrer 
    }: { 
      tier: Tier
      quantity: number
      referrer?: Address
    }) => {
      return writeContract({
        address: MUSIC_NFT_ADDRESS,
        abi: MusicNFTAbi,
        functionName: 'mintTier',
        args: [tier, BigInt(quantity), referrer || '0x0000000000000000000000000000000000000000'],
        // biome-ignore lint/suspicious/noExplicitAny: Wagmi type system requires any for complex contract interactions
      } as any)
    },
    onSuccess: () => {
      toast.success('NFT minting initiated!')
    },
    onError: (error) => {
      toast.error('Minting failed')
      console.error('Minting error:', error)
    },
  })

  if (isSuccess) {
    queryClient.invalidateQueries({ queryKey: ['music-nft-balance'] })
    queryClient.invalidateQueries({ queryKey: ['music-nft-owned'] })
    toast.success('NFT minted successfully!')
  }

  return {
    mint: mint.mutate,
    isLoading: isPending || isConfirming,
    isSuccess,
    hash,
  }
}

export function useMusicNFTWhitelistMint() {
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })
  const queryClient = useQueryClient()

  const whitelistMint = useMutation({
    mutationFn: async ({ 
      tier, 
      quantity, 
      merkleProof, 
      referrer,
      value
    }: { 
      tier: Tier
      quantity: number
      merkleProof: `0x${string}`[]
      referrer?: Address
      value: string
    }) => {
      return writeContract({
        address: MUSIC_NFT_ADDRESS,
        abi: MusicNFTAbi,
        functionName: 'whitelistMint',
        args: [tier, BigInt(quantity), merkleProof, referrer || '0x0000000000000000000000000000000000000000'],
        value: parseEther(value),
        // biome-ignore lint/suspicious/noExplicitAny: Wagmi type system requires any for complex contract interactions
      } as any)
    },
    onSuccess: () => {
      toast.success('Whitelist minting initiated!')
    },
    onError: (error) => {
      toast.error('Whitelist minting failed')
      console.error('Whitelist minting error:', error)
    },
  })

  if (isSuccess) {
    queryClient.invalidateQueries({ queryKey: ['music-nft-balance'] })
    queryClient.invalidateQueries({ queryKey: ['music-nft-owned'] })
    toast.success('Whitelist NFT minted successfully!')
  }

  return {
    whitelistMint: whitelistMint.mutate,
    isLoading: isPending || isConfirming,
    isSuccess,
    hash,
  }
}

export function useMusicNFTSignatureMint() {
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })
  const queryClient = useQueryClient()

  const signatureMint = useMutation({
    mutationFn: async ({ 
      tier, 
      quantity, 
      nonce, 
      signature, 
      referrer,
      value
    }: { 
      tier: Tier
      quantity: number
      nonce: number
      signature: `0x${string}`
      referrer?: Address
      value: string
    }) => {
      return writeContract({
        address: MUSIC_NFT_ADDRESS,
        abi: MusicNFTAbi,
        functionName: 'signatureMint',
        args: [tier, BigInt(quantity), BigInt(nonce), signature, referrer || '0x0000000000000000000000000000000000000000'],
        value: parseEther(value),
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      } as any)
    },
    onSuccess: () => {
      toast.success('Signature minting initiated!')
    },
    onError: (error) => {
      toast.error('Signature minting failed')
      console.error('Signature minting error:', error)
    },
  })

  if (isSuccess) {
    queryClient.invalidateQueries({ queryKey: ['music-nft-balance'] })
    queryClient.invalidateQueries({ queryKey: ['music-nft-owned'] })
    toast.success('Signature NFT minted successfully!')
  }

  return {
    signatureMint: signatureMint.mutate,
    isLoading: isPending || isConfirming,
    isSuccess,
    hash,
  }
}

// ============================================
// WRITE HOOKS - TRACK MANAGEMENT (ARTIST ONLY)
// ============================================

export function useMusicNFTAddTrack() {
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const addTrack = useMutation({
    mutationFn: async ({
      trackId,
      title,
      artist,
      album,
      ipfsAudioHash,
      ipfsCoverArt,
      duration,
      bpm,
      genre
    }: {
      trackId: number
      title: string
      artist: string
      album: string
      ipfsAudioHash: string
      ipfsCoverArt: string
      duration: number
      bpm: number
      genre: string
    }) => {
      return writeContract({
        address: MUSIC_NFT_ADDRESS,
        abi: MusicNFTAbi,
        functionName: 'addTrack',
        args: [BigInt(trackId), title, artist, album, ipfsAudioHash, ipfsCoverArt, BigInt(duration), BigInt(bpm), genre],
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      } as any)
    },
    onSuccess: () => {
      toast.success('Track added successfully!')
    },
    onError: (error) => {
      toast.error('Failed to add track')
      console.error('Add track error:', error)
    },
  })

  return {
    addTrack: addTrack.mutate,
    isLoading: isPending || isConfirming,
    isSuccess,
    hash,
  }
}

export function useMusicNFTAddCollaborationTrack() {
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const addCollaborationTrack = useMutation({
    mutationFn: async ({
      trackId,
      title,
      collaborators,
      shares
    }: {
      trackId: number
      title: string
      collaborators: Address[]
      shares: number[]
    }) => {
      return writeContract({
        address: MUSIC_NFT_ADDRESS,
        abi: MusicNFTAbi,
        functionName: 'addCollaborationTrack',
          args: [BigInt(trackId), title, collaborators, shares.map(share => BigInt(share))],
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      } as any)
    },
    onSuccess: () => {
      toast.success('Collaboration track added!')
    },
    onError: (error) => {
      toast.error('Failed to add collaboration')
      console.error('Collaboration error:', error)
    },
  })

  return {
    addCollaborationTrack: addCollaborationTrack.mutate,
    isLoading: isPending || isConfirming,
    isSuccess,
    hash,
  }
}

// ============================================
// WRITE HOOKS - ROYALTIES
// ============================================

export function useMusicNFTDepositRoyalties() {
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const depositRoyalties = useMutation({
    mutationFn: async ({ amount }: { amount: string }) => {
      return writeContract({
        address: MUSIC_NFT_ADDRESS,
        abi: MusicNFTAbi,
        functionName: 'depositRoyalties',
        value: parseEther(amount),
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      } as any)
    },
    onSuccess: () => {
      toast.success('Royalties deposited!')
    },
    onError: (error) => {
      toast.error('Royalty deposit failed')
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

export function useMusicNFTDistributeCollaboratorRoyalties() {
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const distributeRoyalties = useMutation({
    mutationFn: async ({ trackId, amount }: { trackId: number; amount: string }) => {
      return writeContract({
        address: MUSIC_NFT_ADDRESS,
        abi: MusicNFTAbi,
        functionName: 'distributeCollaboratorRoyalties',
        args: [BigInt(trackId)],
        value: parseEther(amount),
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      } as any)
    },
    onSuccess: () => {
      toast.success('Collaborator royalties distributed!')
    },
    onError: (error) => {
      toast.error('Distribution failed')
      console.error('Distribution error:', error)
    },
  })

  return {
    distributeRoyalties: distributeRoyalties.mutate,
    isLoading: isPending || isConfirming,
    isSuccess,
    hash,
  }
}

export function useMusicNFTClaimCollaboratorRoyalties() {
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const claimRoyalties = useMutation({
    mutationFn: async () => {
      return writeContract({
        address: MUSIC_NFT_ADDRESS,
        abi: MusicNFTAbi,
        functionName: 'claimCollaboratorRoyalties',
        // biome-ignore lint/suspicious/noExplicitAny: Wagmi type system requires any for complex contract interactions
      } as any)
    },
    onSuccess: () => {
      toast.success('Royalties claimed!')
    },
    onError: (error) => {
      toast.error('Claim failed')
      console.error('Claim error:', error)
    },
  })

  return {
    claimRoyalties: claimRoyalties.mutate,
    isLoading: isPending || isConfirming,
    isSuccess,
    hash,
  }
}

// ============================================
// WRITE HOOKS - BENEFITS & CONTENT
// ============================================

// Note: redeemBenefit and addExclusiveContent functions don't exist in current ABI
// These hooks have been removed to fix compilation errors
// If this functionality is needed, implement these functions in the contract first

// Example placeholder for when the functions are added to the contract:
// export function useMusicNFTRedeemBenefit() { ... }
// export function useMusicNFTAddExclusiveContent() { ... }

// ============================================
// COMBINED HOOKS
// ============================================

export function useMusicNFTUserData() {
  const { address } = useAccount()
  
  const ownedTokens = useMusicNFTOwnedTokens(address)
  const userStats = useMusicNFTUserStats(address)
  const holderBenefits = useMusicNFTHolderBenefits(address)
  const collaboratorRoyalties = useMusicNFTCollaboratorRoyalties(address)

  return {
    address,
    ownedTokens: ownedTokens.data || [],
    stats: userStats.data,
    benefits: holderBenefits.data,
    collaboratorRoyalties: collaboratorRoyalties.data ? formatEther(collaboratorRoyalties.data) : '0',
    isLoading: ownedTokens.isLoading || userStats.isLoading || holderBenefits.isLoading,
  }
}

export function useMusicNFTMarketplaceData() {
  const allTiers = useMusicNFTAllTiers()
  const salePhase = useMusicNFTSalePhase()
  const dynamicPricing = useMusicNFTDynamicPricing()

  return {
    tiers: allTiers.tiers,
    salePhase: salePhase.data,
    dynamicPricing: dynamicPricing.data,
    isLoading: allTiers.isLoading || salePhase.isLoading || dynamicPricing.isLoading,
  }
}

// Utility function to get tier name
export function getTierName(tier: Tier): string {
  switch (tier) {
    case Tier.BRONZE: return 'Bronze'
    case Tier.SILVER: return 'Silver'
    case Tier.GOLD: return 'Gold'
    case Tier.PLATINUM: return 'Platinum'
    default: return 'Unknown'
  }
}

// Utility function to get tier colors
export function getTierColors(tier: Tier) {
  switch (tier) {
    case Tier.BRONZE:
      return {
        primary: 'bg-orange-500',
        secondary: 'bg-orange-100',
        text: 'text-orange-900',
        border: 'border-orange-500',
      }
    case Tier.SILVER:
      return {
        primary: 'bg-gray-400',
        secondary: 'bg-gray-100',
        text: 'text-gray-900',
        border: 'border-gray-400',
      }
    case Tier.GOLD:
      return {
        primary: 'bg-yellow-500',
        secondary: 'bg-yellow-100',
        text: 'text-yellow-900',
        border: 'border-yellow-500',
      }
    case Tier.PLATINUM:
      return {
        primary: 'bg-purple-500',
        secondary: 'bg-purple-100',
        text: 'text-purple-900',
        border: 'border-purple-500',
      }
    default:
      return {
        primary: 'bg-gray-500',
        secondary: 'bg-gray-100',
        text: 'text-gray-900',
        border: 'border-gray-500',
      }
  }
}
