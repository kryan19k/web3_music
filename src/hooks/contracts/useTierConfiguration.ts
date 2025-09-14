/**
 * Hook for configuring NFT tiers on the smart contract
 */

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { COLLECTION_MUSIC_NFT_ABI } from '@/src/constants/contracts/abis/CollectionMusicNFT'
import { CONTRACTS } from '@/src/constants/contracts/contracts'
import { parseEther } from 'viem'
import { TrackTierConfig } from '@/src/types/artist'
import { useState } from 'react'

// Map tier names to tier numbers (as expected by the contract)
const TIER_NUMBERS = {
  bronze: 0,
  silver: 1, 
  gold: 2,
  platinum: 3,
} as const

export function useTierConfiguration() {
  const [isConfiguring, setIsConfiguring] = useState(false)
  
  const { writeContractAsync, data: hash, error } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const configureTier = async (tier: TrackTierConfig) => {
    if (!tier.enabled) return
    
    try {
      const tierNumber = TIER_NUMBERS[tier.tier]
      const priceInWei = parseEther(tier.price)
      
      console.log('🎯 [TIER_CONFIG] Configuring tier:', {
        tierNumber,
        tierName: tier.tier,
        price: tier.price,
        priceInWei: priceInWei.toString(),
        maxPerTrack: tier.maxSupply,
        active: tier.enabled
      })
      
      const result = await writeContractAsync({
        address: CONTRACTS.CollectionMusicNFT.address as `0x${string}`,
        abi: COLLECTION_MUSIC_NFT_ABI,
        functionName: 'setTier',
        args: [
          tierNumber,
          priceInWei,
          BigInt(tier.maxSupply),
          tier.enabled
        ],
      })
      
      console.log('✅ [TIER_CONFIG] Tier configuration submitted:', result)
      return result
      
    } catch (error) {
      console.error('❌ [TIER_CONFIG] Failed to configure tier:', error)
      throw error
    }
  }
  
  const configureAllTiers = async (tiers: TrackTierConfig[]) => {
    setIsConfiguring(true)
    
    try {
      const enabledTiers = tiers.filter(tier => tier.enabled)
      console.log('🚀 [TIER_CONFIG] Configuring all tiers:', enabledTiers.length)
      
      // Configure tiers one by one to avoid nonce issues
      for (const tier of enabledTiers) {
        await configureTier(tier)
        // Add small delay between transactions
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      
      console.log('🎉 [TIER_CONFIG] All tiers configured successfully!')
      
    } catch (error) {
      console.error('💥 [TIER_CONFIG] Failed to configure tiers:', error)
      throw error
    } finally {
      setIsConfiguring(false)
    }
  }

  return {
    configureTier,
    configureAllTiers,
    isConfiguring,
    isConfirming,
    isSuccess,
    error,
    hash
  }
}