/**
 * Hook to fetch contract fee information for creating collections and adding tracks
 */

import { useReadContract, useBalance, useAccount } from 'wagmi'
import { COLLECTION_MUSIC_NFT_ABI } from '@/src/constants/contracts/abis/CollectionMusicNFT'
import { CONTRACTS } from '@/src/constants/contracts/contracts'
import { formatEther, parseEther } from 'viem'

export function useContractFees() {
  const { address } = useAccount()
  
  // Get wallet balance
  const { data: balance } = useBalance({
    address,
  })

  // Read fee configuration
  const { data: chargeCreateCollection } = useReadContract({
    address: CONTRACTS.CollectionMusicNFT.address as `0x${string}`,
    abi: COLLECTION_MUSIC_NFT_ABI,
    functionName: 'chargeCreateCollection',
  })

  const { data: feeCreateCollectionWei } = useReadContract({
    address: CONTRACTS.CollectionMusicNFT.address as `0x${string}`,
    abi: COLLECTION_MUSIC_NFT_ABI,
    functionName: 'feeCreateCollectionWei',
  })

  const { data: chargeAddTrack } = useReadContract({
    address: CONTRACTS.CollectionMusicNFT.address as `0x${string}`,
    abi: COLLECTION_MUSIC_NFT_ABI,
    functionName: 'chargeAddTrack',
  })

  const { data: feeAddTrackWei } = useReadContract({
    address: CONTRACTS.CollectionMusicNFT.address as `0x${string}`,
    abi: COLLECTION_MUSIC_NFT_ABI,
    functionName: 'feeAddTrackWei',
  })

  // Read album deposit configuration
  const { data: albumDepositEnabled } = useReadContract({
    address: CONTRACTS.CollectionMusicNFT.address as `0x${string}`,
    abi: COLLECTION_MUSIC_NFT_ABI,
    functionName: 'albumDepositEnabled',
  })

  const { data: albumDepositWei } = useReadContract({
    address: CONTRACTS.CollectionMusicNFT.address as `0x${string}`,
    abi: COLLECTION_MUSIC_NFT_ABI,
    functionName: 'albumDepositWei',
  })

  const { data: albumRefundMintsThreshold } = useReadContract({
    address: CONTRACTS.CollectionMusicNFT.address as `0x${string}`,
    abi: COLLECTION_MUSIC_NFT_ABI,
    functionName: 'albumRefundMintsThreshold',
  })

  // Calculate fees
  const creationFeeEnabled = Boolean(chargeCreateCollection)
  const creationFeeWei = feeCreateCollectionWei || 0n
  const creationFeeEth = formatEther(creationFeeWei)

  const trackFeeEnabled = Boolean(chargeAddTrack)
  const trackFeeWei = feeAddTrackWei || 0n
  const trackFeeEth = formatEther(trackFeeWei)

  const depositEnabled = Boolean(albumDepositEnabled)
  const depositWei = albumDepositWei || 0n
  const depositEth = formatEther(depositWei)

  const totalFeeWei = creationFeeWei + (depositEnabled ? depositWei : 0n)
  const totalFeeEth = formatEther(totalFeeWei)

  const refundThreshold = Number(albumRefundMintsThreshold || 0n)

  // Check if user has sufficient balance
  const walletBalanceWei = balance?.value || 0n
  const hasEnoughBalance = walletBalanceWei >= totalFeeWei

  const balanceAfterFees = walletBalanceWei >= totalFeeWei 
    ? formatEther(walletBalanceWei - totalFeeWei)
    : '0'

  return {
    // Creation fees
    creationFeeEnabled,
    creationFeeWei,
    creationFeeEth,
    
    // Track fees
    trackFeeEnabled,
    trackFeeWei,
    trackFeeEth,
    
    // Deposits
    depositEnabled,
    depositWei,
    depositEth,
    refundThreshold,
    
    // Totals
    totalFeeWei,
    totalFeeEth,
    
    // Balance info
    walletBalance: balance?.formatted || '0',
    walletBalanceSymbol: balance?.symbol || 'ETH',
    hasEnoughBalance,
    balanceAfterFees,
    
    // Loading states
    isLoading: !chargeCreateCollection && !feeCreateCollectionWei
  }
}