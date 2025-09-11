export type MusicTier = 'bronze' | 'silver' | 'gold' | 'platinum'

export interface NFTMetadata {
  id: string
  title: string
  artist: string
  image: string
  audioUrl: string
  duration: number
  edition: number
  maxSupply: number
  description: string
  genre: string
  releaseDate: string
  blokAmount: number
  dailyStreams: number
  attributes: { trait_type: string; value: string }[]
}

export interface StreamingStats {
  totalPlays: number
  uniqueListeners: number
  averageCompletion: number
}

export interface MusicNFT {
  tokenId: string
  tier: MusicTier
  metadata: NFTMetadata
  price: string // ETH price
  priceUSD: number // USD price
  earnings: {
    daily: number
    total: number
    apy: number
  }
  owner: string
  isListed: boolean
  streamingStats: StreamingStats
}

export interface TierConfig {
  name: string
  color: string
  glow: string
  maxSupply: number
  blokMultiplier: number
  royaltyRate: number
  benefits: string[]
}
