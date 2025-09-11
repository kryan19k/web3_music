// Export all BLOK Token hooks
export {
  useBLOKBalance,
  useBLOKTotalSupply,
  useBLOKCirculatingSupply,
  useBLOKRoyaltyInfo,
  useBLOKStakingInfo,
  useBLOKStakingTiers,
  useBLOKStake,
  useBLOKUnstake,
  useBLOKClaimStakingRewards,
  useBLOKClaimRoyalties,
  useBLOKDepositRoyalties,
  useBLOKProposals,
  useBLOKCreateProposal,
  useBLOKVote,
  useBLOKUserData,
} from './useBLOKToken'

// Legacy PAGS exports for backward compatibility
export {
  useBLOKBalance as usePAGSBalance,
  useBLOKTotalSupply as usePAGSTotalSupply,
  useBLOKCirculatingSupply as usePAGSCirculatingSupply,
  useBLOKRoyaltyInfo as usePAGSRoyaltyInfo,
  useBLOKStakingInfo as usePAGSStakingInfo,
  useBLOKStakingTiers as usePAGSStakingTiers,
  useBLOKStake as usePAGSStake,
  useBLOKUnstake as usePAGSUnstake,
  useBLOKClaimStakingRewards as usePAGSClaimStakingRewards,
  useBLOKClaimRoyalties as usePAGSClaimRoyalties,
  useBLOKDepositRoyalties as usePAGSDepositRoyalties,
  useBLOKProposals as usePAGSProposals,
  useBLOKCreateProposal as usePAGSCreateProposal,
  useBLOKVote as usePAGSVote,
  useBLOKUserData as usePAGSUserData,
} from './useBLOKToken'

// Export all Music NFT hooks
export {
  useMusicNFTTierConfig,
  useMusicNFTAllTiers,
  useMusicNFTSalePhase,
  useMusicNFTBalance,
  useMusicNFTTrackInfo,
  useMusicNFTTokenMetadata,

  useMusicNFTMint,
  useMusicNFTWhitelistMint,
  useMusicNFTSignatureMint,
  useMusicNFTAddTrack,
  useMusicNFTAddCollaborationTrack,
  useMusicNFTDepositRoyalties,
  useMusicNFTDistributeCollaboratorRoyalties,
  useMusicNFTClaimCollaboratorRoyalties,
  
  // Role management
  useMusicNFTHasRole,
  useMusicNFTArtistRole,
  useMusicNFTGrantRole,
  useMusicNFTGrantArtistRole,
  
  // Collection-based hooks
  useCreateCollection,
  useAddTrackToCollection,
  useFinalizeCollection,
  useMintAlbum,
  useGetCollection,
  useGetCollectionTracks,
  useGetUserCollectionProgress,
  
  useMusicNFTUserData,
  useMusicNFTMarketplaceData,
  Tier,
  SalePhase,
  getTierName,
  getTierColors,
} from './useMusicNFT'

// Export all utility hooks
export {
  useUserDashboard,
  usePortfolioAnalytics,
  useMarketplaceAnalytics,
  useEarningsCalculator,
  useTransactionHistory,
  useLeaderboard,
  useNotifications,
  contractUtils,
} from './useContractUtils'

// Export admin contract hooks
export {
  useAdminPlatformStats,
  useAdminRoleInfo,
  useAdminUpdatePlatformFee,
  useAdminSetSalePhase,
  useAdminTogglePause,
  useAdminSetDynamicPricing,
  useAdminUpdateTierConfig,
  useAdminDepositRoyalties,
  useAdminUpdateTrackStats,
  useAdminGrantRole,
  useAdminRevokeRole,
  useAdminEmergencyWithdraw,
  useAdminContractData,
} from './useAdminContract'

// Export admin artist management hooks
export {
  useAdminPendingArtists,
  useAdminRecentArtists,
  useAdminArtistStats,
  useAdminArtistById,
  useAdminApproveArtist,
  useAdminRejectArtist,
  useAdminUpdateArtistStats,
  useAdminArtistManagement,
} from './useAdminArtistManagement'

// Re-export contract constants
export {
  CONTRACT_ADDRESSES,
  CONTRACT_METADATA,
  getContractAddress,
} from '@/src/constants/contracts/contracts'
