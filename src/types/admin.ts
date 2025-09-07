export interface AdminUser {
  id: string
  email: string
  role: 'super_admin' | 'admin' | 'moderator'
  permissions: AdminPermission[]
  lastLogin: Date
  isActive: boolean
}

export type AdminPermission =
  | 'users:read'
  | 'users:write'
  | 'users:delete'
  | 'nfts:read'
  | 'nfts:write'
  | 'nfts:delete'
  | 'transactions:read'
  | 'transactions:write'
  | 'settings:read'
  | 'settings:write'
  | 'analytics:read'
  | 'content:moderate'
  | 'blockchain:monitor'

export interface PlatformUser {
  id: string
  walletAddress: string
  username?: string
  email?: string
  avatar?: string
  joinDate: Date
  lastActive: Date
  isVerified: boolean
  isBanned: boolean
  totalNFTs: number
  totalEarnings: number
  role: 'user' | 'artist' | 'verified_artist'
}

export interface AdminNFT {
  id: string
  tokenId: string
  title: string
  artist: string
  artistId: string
  contractAddress: string
  status: 'pending' | 'approved' | 'rejected' | 'flagged'
  mintPrice: number
  currentPrice: number
  totalSales: number
  createdAt: Date
  lastModified: Date
  flaggedReasons?: string[]
  moderatorNotes?: string
}

export interface BlockchainTransaction {
  id: string
  type: 'mint' | 'sale' | 'transfer' | 'royalty_payment' | 'token_swap'
  hash: string
  blockNumber: number
  timestamp: Date
  from: string
  to: string
  value: number
  gasUsed: number
  gasPrice: number
  status: 'pending' | 'confirmed' | 'failed'
  nftId?: string
  tokenSymbol: string
}

export interface PlatformStats {
  totalUsers: number
  totalNFTs: number
  totalVolume: number
  totalTransactions: number
  activeUsers24h: number
  newUsers24h: number
  topPerformingNFTs: AdminNFT[]
  recentTransactions: BlockchainTransaction[]
  revenueBreakdown: {
    nftSales: number
    royalties: number
    platformFees: number
  }
}

export interface SystemAlert {
  id: string
  type: 'error' | 'warning' | 'info' | 'success'
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  severity: 'low' | 'medium' | 'high' | 'critical'
  category: 'blockchain' | 'users' | 'nfts' | 'system' | 'security'
}

export interface PlatformSettings {
  general: {
    platformName: string
    description: string
    supportEmail: string
    maintenanceMode: boolean
  }
  fees: {
    platformFeePercentage: number
    royaltyCapPercentage: number
    minimumRoyaltyPercentage: number
  }
  blockchain: {
    supportedChains: string[]
    defaultChain: string
    gasLimitMultiplier: number
  }
  content: {
    maxFileSize: number
    allowedFileTypes: string[]
    requireModeration: boolean
    autoApproveVerifiedArtists: boolean
  }
  security: {
    maxLoginAttempts: number
    sessionTimeout: number
    requireTwoFactor: boolean
  }
}
