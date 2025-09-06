export interface User {
  id: string
  username: string
  displayName: string
  avatar: string
  bio?: string
  location?: string
  website?: string
  verified: boolean
  isArtist: boolean
  walletAddress: string

  // Social stats
  followers: number
  following: number
  totalTracks?: number
  totalNFTs: number

  // Preferences
  isPrivate: boolean
  showEmail: boolean
  showWallet: boolean

  // Timestamps
  joinedAt: string
  lastActive: string
}

export interface Follow {
  id: string
  followerId: string
  followingId: string
  createdAt: string
}

export interface ActivityItem {
  id: string
  userId: string
  user: Pick<User, 'id' | 'username' | 'displayName' | 'avatar' | 'verified'>
  type: 'purchase' | 'like' | 'follow' | 'comment' | 'upload' | 'play' | 'share'
  timestamp: string

  // Content references
  nftId?: string
  trackTitle?: string
  trackArtist?: string
  trackImage?: string
  targetUserId?: string
  targetUserName?: string
  commentText?: string

  // Metadata
  metadata?: {
    price?: number
    currency?: string
    platform?: string
    genre?: string
    [key: string]: unknown
  }
}

export interface SocialInteraction {
  id: string
  userId: string
  targetType: 'nft' | 'user' | 'comment' | 'track'
  targetId: string
  type: 'like' | 'share' | 'bookmark' | 'report'
  createdAt: string
}

export interface Comment {
  id: string
  userId: string
  user: Pick<User, 'id' | 'username' | 'displayName' | 'avatar' | 'verified'>
  targetType: 'nft' | 'track'
  targetId: string
  content: string
  likes: number
  isLiked: boolean
  parentId?: string // for replies
  replies?: Comment[]
  createdAt: string
  updatedAt?: string
}

export interface UserStats {
  totalSpent: number
  totalEarned: number
  nftsOwned: number
  nftsCreated: number
  totalPlays: number
  pagsEarned: number
  achievementCount: number
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlockedAt?: string
}
