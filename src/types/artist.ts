/**
 * Artist-related types and interfaces
 */

import { Address } from 'viem'

export interface ArtistProfile {
  address: Address
  displayName: string
  bio?: string
  avatarUrl?: string
  coverImageUrl?: string
  website?: string
  socialLinks: {
    twitter?: string
    instagram?: string
    spotify?: string
    soundcloud?: string
    youtube?: string
  }
  verified: boolean
  joinedAt: Date
  totalTracks: number
  totalEarnings: string // in ETH
  followers: number
}

export interface TrackMetadata {
  // Basic Info
  title: string
  artist: string
  album?: string
  genre: string
  description?: string
  
  // Technical Details
  duration: number // in seconds
  bpm?: number
  key?: string // Musical key
  
  // Media Assets
  audioFile: File
  coverArtFile: File
  lyricsFile?: File
  
  // IPFS Hashes (filled after upload)
  ipfsAudioHash?: string
  ipfsCoverArt?: string
  ipfsLyrics?: string
  
  // Release Info
  releaseDate: Date
  tags: string[]
  
  // Rights & Collaboration
  isExplicit: boolean
  rightsCleared: boolean
  collaborators: CollaboratorInfo[]
  
  // NFT Configuration
  tiers: TrackTierConfig[]
}

export interface CollaboratorInfo {
  address: Address
  name: string
  role: 'producer' | 'songwriter' | 'vocalist' | 'musician' | 'mixer' | 'other'
  sharePercentage: number // 0-100
}

export interface TrackTierConfig {
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  enabled: boolean
  price: string // in ETH
  maxSupply: number
  benefits: TierBenefits
  customMetadata?: string
}

export interface TierBenefits {
  // Access Rights
  hasBackstageAccess: boolean
  hasRemixRights: boolean
  hasStemAccess: boolean
  hasExclusiveContent: boolean
  
  // Rewards
  merchDiscount: number // 0-100 percentage
  concertPriority: number // 1-4, lower is better
  maxGuestListSpots: number
  
  // Governance
  hasGovernanceRights: boolean
}

export interface TrackUploadState {
  // File Upload Progress
  audioUpload: {
    progress: number
    status: 'idle' | 'uploading' | 'success' | 'error'
    cid?: string
    error?: string
  }
  
  coverArtUpload: {
    progress: number
    status: 'idle' | 'uploading' | 'success' | 'error'
    cid?: string
    error?: string
  }
  
  lyricsUpload?: {
    progress: number
    status: 'idle' | 'uploading' | 'success' | 'error'
    cid?: string
    error?: string
  }
  
  // Smart Contract Deployment
  contractDeployment: {
    status: 'idle' | 'pending' | 'success' | 'error'
    txHash?: string
    error?: string
  }
  
  // Overall Progress
  overallProgress: number
  currentStep: TrackUploadStep
  isComplete: boolean
}

export type TrackUploadStep = 
  | 'metadata'
  | 'audio-upload'
  | 'cover-upload'
  | 'lyrics-upload'
  | 'tier-config'
  | 'contract-deploy'
  | 'complete'

export interface ArtistDashboardStats {
  totalTracks: number
  totalSales: number
  totalRevenue: string // in ETH
  totalRoyalties: string // in ETH
  topTrack: {
    title: string
    sales: number
    revenue: string
  }
  recentActivity: ArtistActivity[]
}

export interface ArtistActivity {
  id: string
  type: 'sale' | 'royalty' | 'collaboration' | 'track_added'
  timestamp: Date
  description: string
  amount?: string // in ETH if applicable
  txHash?: string
}

export interface ArtistOnboardingState {
  currentStep: ArtistOnboardingStep
  isComplete: boolean
  profile: Partial<ArtistProfile>
  verificationStatus: 'pending' | 'approved' | 'rejected'
}

export type ArtistOnboardingStep =
  | 'wallet-connect'
  | 'profile-setup'
  | 'verification'
  | 'first-track'
  | 'complete'

// Form validation types
export interface TrackMetadataFormData extends Omit<TrackMetadata, 'audioFile' | 'coverArtFile' | 'lyricsFile'> {
  // Form-specific fields
}

export interface ArtistProfileFormData extends Omit<ArtistProfile, 'address' | 'verified' | 'joinedAt' | 'totalTracks' | 'totalEarnings' | 'followers'> {
  // Form-specific fields
}

// Utility types
export type TrackStatus = 'draft' | 'uploading' | 'processing' | 'live' | 'paused' | 'error'
export type ArtistVerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected'

// Constants
export const SUPPORTED_AUDIO_FORMATS = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/flac', 'audio/aac', 'audio/ogg']
export const SUPPORTED_IMAGE_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
export const MAX_AUDIO_SIZE = 100 * 1024 * 1024 // 100MB
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB

export const GENRE_OPTIONS = [
  'Pop', 'Rock', 'Hip Hop', 'Electronic', 'Jazz', 'Classical', 'Blues', 'Country',
  'Reggae', 'Folk', 'R&B', 'Funk', 'Disco', 'House', 'Techno', 'Dubstep',
  'Trap', 'Lo-Fi', 'Ambient', 'Experimental', 'World', 'Latin', 'Afrobeats', 'Other'
]

export const COLLABORATOR_ROLES = [
  'producer', 'songwriter', 'vocalist', 'musician', 'mixer', 'other'
] as const

export const DEFAULT_TIER_CONFIGS: TrackTierConfig[] = [
  {
    tier: 'bronze',
    enabled: true,
    price: '0.001',
    maxSupply: 1000,
    benefits: {
      hasBackstageAccess: false,
      hasRemixRights: false,
      hasStemAccess: false,
      hasExclusiveContent: true,
      merchDiscount: 10,
      concertPriority: 4,
      maxGuestListSpots: 0,
      hasGovernanceRights: false,
    }
  },
  {
    tier: 'silver',
    enabled: true,
    price: '0.01',
    maxSupply: 500,
    benefits: {
      hasBackstageAccess: false,
      hasRemixRights: false,
      hasStemAccess: true,
      hasExclusiveContent: true,
      merchDiscount: 20,
      concertPriority: 3,
      maxGuestListSpots: 1,
      hasGovernanceRights: true,
    }
  },
  {
    tier: 'gold',
    enabled: false,
    price: '0.05',
    maxSupply: 100,
    benefits: {
      hasBackstageAccess: true,
      hasRemixRights: false,
      hasStemAccess: true,
      hasExclusiveContent: true,
      merchDiscount: 30,
      concertPriority: 2,
      maxGuestListSpots: 2,
      hasGovernanceRights: true,
    }
  },
  {
    tier: 'platinum',
    enabled: false,
    price: '0.5',
    maxSupply: 10,
    benefits: {
      hasBackstageAccess: true,
      hasRemixRights: true,
      hasStemAccess: true,
      hasExclusiveContent: true,
      merchDiscount: 50,
      concertPriority: 1,
      maxGuestListSpots: 4,
      hasGovernanceRights: true,
    }
  },
]
