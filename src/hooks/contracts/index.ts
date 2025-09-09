// Export all PAGS Token hooks
export {
  usePAGSBalance,
  usePAGSTotalSupply,
  usePAGSCirculatingSupply,
  usePAGSRoyaltyInfo,
  usePAGSStakingInfo,
  usePAGSStakingTiers,
  usePAGSStake,
  usePAGSUnstake,
  usePAGSClaimStakingRewards,
  usePAGSClaimRoyalties,
  usePAGSDepositRoyalties,
  usePAGSProposals,
  usePAGSCreateProposal,
  usePAGSVote,
  usePAGSUserData,
} from './usePAGSToken'

// Export all Music NFT hooks
export {
  useMusicNFTTierConfig,
  useMusicNFTAllTiers,
  useMusicNFTTierStats,
  useMusicNFTSalePhase,
  useMusicNFTDynamicPricing,
  useMusicNFTBalance,
  useMusicNFTOwnedTokens,
  useMusicNFTUserStats,
  useMusicNFTHolderBenefits,
  useMusicNFTTrackInfo,
  useMusicNFTTokenMetadata,
  useMusicNFTExclusiveContent,
  useMusicNFTCollaboratorRoyalties,
  useMusicNFTTrackCollaborators,
  useMusicNFTMint,
  useMusicNFTWhitelistMint,
  useMusicNFTSignatureMint,
  useMusicNFTAddTrack,
  useMusicNFTAddCollaborationTrack,
  useMusicNFTDepositRoyalties,
  useMusicNFTDistributeCollaboratorRoyalties,
  useMusicNFTClaimCollaboratorRoyalties,
  useMusicNFTRedeemBenefit,
  useMusicNFTAddExclusiveContent,
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

// Re-export contract constants
export {
  CONTRACT_ADDRESSES,
  CONTRACT_METADATA,
  getContractAddress,
} from '@/src/constants/contracts/contracts'
