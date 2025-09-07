import { MusicNFTCard } from '@/src/components/nft/MusicNFTCard'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent } from '@/src/components/ui/card'
import { Input } from '@/src/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select'
import { type Track, useAudioPlayer } from '@/src/hooks/useAudioPlayer'
import type { MusicNFT } from '@/src/types/music-nft'
import { motion } from 'framer-motion'
import {
  Clock,
  DollarSign,
  Filter,
  Grid3X3,
  Headphones,
  List,
  Music,
  Search,
  TrendingUp,
} from 'lucide-react'
import * as React from 'react'
import { useState } from 'react'

// Extended demo data for marketplace
const marketplaceNFTs: MusicNFT[] = [
  {
    tokenId: '1',
    tier: 'platinum',
    metadata: {
      id: '1',
      title: 'Midnight Echoes',
      artist: 'Luna Vista',
      image: '/api/placeholder/300/300',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      duration: 245,
      edition: 3,
      maxSupply: 10,
      description: 'An ethereal journey through ambient soundscapes',
      genre: 'Ambient',
      releaseDate: '2024-01-15',
      pagsAmount: 1000,
      dailyStreams: 15420,
      attributes: [
        { trait_type: 'Mood', value: 'Ethereal' },
        { trait_type: 'Tempo', value: 'Slow' },
        { trait_type: 'Key', value: 'D Minor' },
        { trait_type: 'Instruments', value: 'Synthesizer, Strings' },
      ],
    },
    price: '0.5',
    priceUSD: 892.5,
    earnings: {
      daily: 24.5,
      total: 1250.0,
      apy: 18.5,
    },
    owner: '0x742...a5c2',
    isListed: true,
    streamingStats: {
      totalPlays: 125430,
      uniqueListeners: 8940,
      averageCompletion: 87,
    },
  },
  {
    tokenId: '2',
    tier: 'gold',
    metadata: {
      id: '2',
      title: 'Electric Dreams',
      artist: 'Neon Pulse',
      image: '/api/placeholder/300/300',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      duration: 198,
      edition: 47,
      maxSupply: 100,
      description: 'High-energy synthwave with retro vibes',
      genre: 'Synthwave',
      releaseDate: '2024-02-03',
      pagsAmount: 500,
      dailyStreams: 32100,
      attributes: [
        { trait_type: 'Mood', value: 'Energetic' },
        { trait_type: 'Tempo', value: 'Fast' },
        { trait_type: 'Key', value: 'E Major' },
        { trait_type: 'Instruments', value: 'Synthesizer, Drums' },
      ],
    },
    price: '0.15',
    priceUSD: 267.75,
    earnings: {
      daily: 8.9,
      total: 445.6,
      apy: 12.3,
    },
    owner: '0x1a3...f8d1',
    isListed: true,
    streamingStats: {
      totalPlays: 98750,
      uniqueListeners: 12300,
      averageCompletion: 92,
    },
  },
  {
    tokenId: '3',
    tier: 'silver',
    metadata: {
      id: '3',
      title: 'Urban Jungle',
      artist: 'Street Symphony',
      image: '/api/placeholder/300/300',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      duration: 312,
      edition: 234,
      maxSupply: 500,
      description: 'Raw hip-hop beats from the concrete streets',
      genre: 'Hip Hop',
      releaseDate: '2024-01-28',
      pagsAmount: 250,
      dailyStreams: 45600,
      attributes: [
        { trait_type: 'Mood', value: 'Aggressive' },
        { trait_type: 'Tempo', value: 'Medium' },
        { trait_type: 'Key', value: 'G Minor' },
        { trait_type: 'Instruments', value: 'Drums, Bass, Vocals' },
      ],
    },
    price: '0.08',
    priceUSD: 142.8,
    earnings: {
      daily: 4.2,
      total: 189.5,
      apy: 9.8,
    },
    owner: '0x9c7...b2e4',
    isListed: true,
    streamingStats: {
      totalPlays: 156780,
      uniqueListeners: 18950,
      averageCompletion: 78,
    },
  },
  {
    tokenId: '4',
    tier: 'bronze',
    metadata: {
      id: '4',
      title: 'Coffee Shop Vibes',
      artist: 'Mellow Mornings',
      image: '/api/placeholder/300/300',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      duration: 187,
      edition: 678,
      maxSupply: 1000,
      description: 'Relaxing acoustic melodies for peaceful moments',
      genre: 'Acoustic',
      releaseDate: '2024-02-10',
      pagsAmount: 100,
      dailyStreams: 28340,
      attributes: [
        { trait_type: 'Mood', value: 'Relaxing' },
        { trait_type: 'Tempo', value: 'Slow' },
        { trait_type: 'Key', value: 'C Major' },
        { trait_type: 'Instruments', value: 'Guitar, Piano' },
      ],
    },
    price: '0.025',
    priceUSD: 44.63,
    earnings: {
      daily: 1.85,
      total: 67.2,
      apy: 6.2,
    },
    owner: '0x4f1...d9a3',
    isListed: true,
    streamingStats: {
      totalPlays: 89430,
      uniqueListeners: 14200,
      averageCompletion: 94,
    },
  },
  // Additional NFTs for variety
  {
    tokenId: '5',
    tier: 'gold',
    metadata: {
      id: '5',
      title: 'Ocean Depths',
      artist: 'Aqua Resonance',
      image: '/api/placeholder/300/300',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      duration: 367,
      edition: 23,
      maxSupply: 100,
      description: 'Deep, immersive underwater soundscape',
      genre: 'Ambient',
      releaseDate: '2024-02-14',
      pagsAmount: 750,
      dailyStreams: 18900,
      attributes: [
        { trait_type: 'Mood', value: 'Meditative' },
        { trait_type: 'Tempo', value: 'Very Slow' },
        { trait_type: 'Key', value: 'F Minor' },
        { trait_type: 'Instruments', value: 'Synthesizer, Field Recording' },
      ],
    },
    price: '0.22',
    priceUSD: 392.6,
    earnings: {
      daily: 15.3,
      total: 678.9,
      apy: 14.2,
    },
    owner: '0x8e5...c7f2',
    isListed: true,
    streamingStats: {
      totalPlays: 78560,
      uniqueListeners: 6750,
      averageCompletion: 91,
    },
  },
  {
    tokenId: '6',
    tier: 'silver',
    metadata: {
      id: '6',
      title: 'Neon Nights',
      artist: 'Cyber Phoenix',
      image: '/api/placeholder/300/300',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      duration: 203,
      edition: 156,
      maxSupply: 500,
      description: 'Cyberpunk-inspired electronic beats',
      genre: 'Electronic',
      releaseDate: '2024-01-22',
      pagsAmount: 300,
      dailyStreams: 52400,
      attributes: [
        { trait_type: 'Mood', value: 'Futuristic' },
        { trait_type: 'Tempo', value: 'Fast' },
        { trait_type: 'Key', value: 'B Minor' },
        { trait_type: 'Instruments', value: 'Synthesizer, Drums, Samples' },
      ],
    },
    price: '0.12',
    priceUSD: 214.2,
    earnings: {
      daily: 6.8,
      total: 298.4,
      apy: 11.6,
    },
    owner: '0x2d4...b1a8',
    isListed: true,
    streamingStats: {
      totalPlays: 143520,
      uniqueListeners: 22100,
      averageCompletion: 83,
    },
  },
]

export function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTier, setSelectedTier] = useState('all')
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [sortBy, setSortBy] = useState('trending')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const { play, pause, currentTrack, isPlaying } = useAudioPlayer()

  // Filter and sort NFTs
  const filteredNFTs = marketplaceNFTs
    .filter((nft) => {
      const matchesSearch =
        nft.metadata.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nft.metadata.artist.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesTier = selectedTier === 'all' || nft.tier === selectedTier
      const matchesGenre = selectedGenre === 'all' || nft.metadata.genre === selectedGenre
      return matchesSearch && matchesTier && matchesGenre
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.priceUSD - b.priceUSD
        case 'price-high':
          return b.priceUSD - a.priceUSD
        case 'apy':
          return b.earnings.apy - a.earnings.apy
        case 'newest':
          return (
            new Date(b.metadata.releaseDate).getTime() - new Date(a.metadata.releaseDate).getTime()
          )
        default:
          return b.streamingStats.totalPlays - a.streamingStats.totalPlays // trending
      }
    })

  const handlePlay = (audioUrl: string) => {
    const nft = marketplaceNFTs.find((n) => n.metadata.audioUrl === audioUrl)
    if (nft) {
      const track: Track = {
        id: nft.tokenId,
        title: nft.metadata.title,
        artist: nft.metadata.artist,
        artwork: nft.metadata.image || '/api/placeholder/300/300',
        audioUrl: nft.metadata.audioUrl,
        duration: nft.metadata.duration,
        pagsPerStream: nft.metadata.pagsAmount / 1000,
      }
      play(track)
    }
  }

  const handlePause = () => {
    pause()
  }

  const handlePurchase = (tokenId: string) => {
    console.log('Purchase NFT:', tokenId)
    // In a real app, this would open the purchase modal
  }

  // Get unique genres for filter
  const genres = Array.from(new Set(marketplaceNFTs.map((nft) => nft.metadata.genre)))

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-purple-900/20 via-background to-pink-900/20">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Music{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Marketplace
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover, collect, and earn from exclusive music NFTs. Own a piece of your favorite
              tracks and share in their success.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[
                { icon: Music, label: 'Total NFTs', value: marketplaceNFTs.length.toString() },
                { icon: DollarSign, label: 'Volume', value: '$2.4M' },
                { icon: Headphones, label: 'Active Users', value: '12.8K' },
                { icon: TrendingUp, label: '24h Growth', value: '+8.4%' },
              ].map((stat) => (
                <Card
                  key={stat.label}
                  className="p-4 bg-card/50 backdrop-blur-sm"
                >
                  <CardContent className="p-0 text-center">
                    <stat.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="sticky top-16 z-40 bg-background/95 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, artist, or genre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2 items-center">
              <Select
                value={selectedTier}
                onValueChange={setSelectedTier}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="platinum">Platinum</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                  <SelectItem value="bronze">Bronze</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={selectedGenre}
                onValueChange={setSelectedGenre}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genres</SelectItem>
                  {genres.map((genre) => (
                    <SelectItem
                      key={genre}
                      value={genre}
                    >
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={sortBy}
                onValueChange={setSortBy}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trending">Trending</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="apy">Highest APY</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <div className="flex border border-border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedTier !== 'all' || selectedGenre !== 'all' || searchQuery) && (
            <div className="flex gap-2 mt-3">
              {searchQuery && (
                <Badge
                  variant="secondary"
                  className="gap-1"
                >
                  Search: "{searchQuery}"
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedTier !== 'all' && (
                <Badge
                  variant="secondary"
                  className="gap-1"
                >
                  Tier: {selectedTier}
                  <button
                    type="button"
                    onClick={() => setSelectedTier('all')}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedGenre !== 'all' && (
                <Badge
                  variant="secondary"
                  className="gap-1"
                >
                  Genre: {selectedGenre}
                  <button
                    type="button"
                    onClick={() => setSelectedGenre('all')}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
      </section>

      {/* NFT Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {filteredNFTs.length === 0 ? (
            <div className="text-center py-20">
              <Music className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No NFTs Found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search query</p>
            </div>
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-4'
              }
            >
              {filteredNFTs.map((nft, index) => (
                <motion.div
                  key={nft.tokenId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={viewMode === 'list' ? 'w-full max-w-md mx-auto lg:max-w-none' : ''}
                >
                  <MusicNFTCard
                    nft={nft}
                    isPlaying={currentTrack?.id === nft.tokenId && isPlaying}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onPurchase={handlePurchase}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
