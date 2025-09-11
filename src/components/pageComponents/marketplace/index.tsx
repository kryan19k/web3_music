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
import { useEnhancedMarketplaceNFTs, hasValidAudio } from '@/src/hooks/contracts/useMarketplaceNFTs'
import type { MusicNFT } from '@/src/types/music-nft'
import { AnimatePresence, motion } from 'framer-motion'
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
  Star,
  Flame,
  Crown,
  Award,
  PlayCircle,
  Users,
  Eye,
  Zap,
  ChevronRight,
  Heart,
  Share2,
  Plus,
  Shuffle,
  MoreHorizontal,
  Disc3,
  Album,
  Mic,
  Radio
} from 'lucide-react'
import * as React from 'react'
import { useState } from 'react'

// Featured Collections Data
const featuredCollections = [
  {
    id: '1',
    name: 'Midnight Sessions',
    description: 'Late night ambient tracks for deep focus',
    cover: '/song_cover/midnight.png',
    trackCount: 12,
    totalValue: '5.8 ETH',
    growth: '+24.5%',
    artist: 'Luna Vista',
    verified: true
  },
  {
    id: '2', 
    name: 'Urban Chronicles',
    description: 'Raw hip-hop from the streets',
    cover: '/song_cover/urban.png',
    trackCount: 8,
    totalValue: '3.2 ETH',
    growth: '+18.3%',
    artist: 'Street Symphony',
    verified: true
  },
  {
    id: '3',
    name: 'Electric Futures',
    description: 'Synthwave & cyberpunk anthems',
    cover: '/song_cover/electric.png',
    trackCount: 15,
    totalValue: '7.1 ETH',
    growth: '+31.2%',
    artist: 'Neon Pulse',
    verified: true
  },
  {
    id: '4',
    name: 'Coffee House Acoustics',
    description: 'Relaxing acoustic melodies',
    cover: '/song_cover/coffee.png',
    trackCount: 10,
    totalValue: '2.4 ETH',
    growth: '+12.8%',
    artist: 'Mellow Mornings',
    verified: false
  }
]

// Featured Artists Data
const featuredArtists = [
  {
    id: '1',
    name: 'Luna Vista',
    genre: 'Ambient / Chillout',
    avatar: '/song_cover/midnight.png',
    followers: '12.8K',
    totalTracks: 23,
    totalValue: '15.2 ETH',
    verified: true,
    monthlyListeners: '450K'
  },
  {
    id: '2',
    name: 'Neon Pulse',
    genre: 'Synthwave / Electronic',
    avatar: '/song_cover/electric.png', 
    followers: '8.9K',
    totalTracks: 18,
    totalValue: '11.7 ETH',
    verified: true,
    monthlyListeners: '320K'
  },
  {
    id: '3',
    name: 'Street Symphony',
    genre: 'Hip-Hop / Rap',
    avatar: '/song_cover/urban.png',
    followers: '15.3K',
    totalTracks: 31,
    totalValue: '18.9 ETH',
    verified: true,
    monthlyListeners: '680K'
  },
  {
    id: '4',
    name: 'Mellow Mornings',
    genre: 'Acoustic / Folk',
    avatar: '/song_cover/coffee.png',
    followers: '6.2K',
    totalTracks: 14,
    totalValue: '7.8 ETH',
    verified: false,
    monthlyListeners: '180K'
  }
]

// Trending Albums Data
const trendingAlbums = [
  {
    id: '1',
    title: 'Neon Dreams',
    artist: 'Cyber Phoenix',
    cover: '/song_cover/electric.png',
    trackCount: 12,
    price: '1.8 ETH',
    streams: '2.1M',
    growth: '+45%'
  },
  {
    id: '2',
    title: 'Urban Legends',
    artist: 'Metro Beats',
    cover: '/song_cover/urban.png',
    trackCount: 10,
    price: '1.2 ETH',
    streams: '1.8M',
    growth: '+32%'
  },
  {
    id: '3',
    title: 'Midnight Cafe',
    artist: 'Jazz Collective',
    cover: '/song_cover/coffee.png',
    trackCount: 8,
    price: '0.9 ETH',
    streams: '980K',
    growth: '+28%'
  }
]

// Extended demo data for marketplace
const marketplaceNFTs: MusicNFT[] = [
  {
    tokenId: '1',
    tier: 'platinum',
    metadata: {
      id: '1',
      title: 'Midnight Echoes',
      artist: 'Luna Vista',
      image: '/song_cover/midnight.png',
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
      image: '/song_cover/electric.png',
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
      image: '/song_cover/urban.png',
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
      image: '/song_cover/coffee.png',
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
      image: '/song_cover/ocean.jpg',
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
      image: '/song_cover/electric.png',
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
  const [activeSection, setActiveSection] = useState('featured')
  const { play, pause, currentTrack, isPlaying } = useAudioPlayer()

  // Fetch real NFTs from contracts
  const { nfts: marketplaceNFTs, isLoading: nftsLoading, error: nftsError, trackInfo } = useEnhancedMarketplaceNFTs()

  console.log('🎵 Real marketplace data:', { marketplaceNFTs, trackInfo, nftsLoading, nftsError })

  // Filter and sort NFTs - only show NFTs with valid audio
  const filteredNFTs = marketplaceNFTs
    .filter((nft) => hasValidAudio(nft)) // Only show NFTs with audio
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
          return (a.priceUSD || 0) - (b.priceUSD || 0)
        case 'price-high':
          return (b.priceUSD || 0) - (a.priceUSD || 0)
        case 'apy':
          return (b.earnings?.apy || 0) - (a.earnings?.apy || 0)
        case 'newest':
          return (
            new Date(b.metadata.releaseDate).getTime() - new Date(a.metadata.releaseDate).getTime()
          )
        default:
          return (b.streamingStats?.totalPlays || 0) - (a.streamingStats?.totalPlays || 0) // trending
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
      <section className="relative py-16 bg-gradient-to-br from-purple-900/10 via-background to-pink-900/10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        
        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 8 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/20 rounded-full"
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                y: Math.random() * 600,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-6xl mx-auto"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/30">
                <Radio className="w-4 h-4 mr-2" />
                LIVE MARKETPLACE
              </Badge>
              <Badge className="bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-400 border-orange-500/30">
                <Flame className="w-4 h-4 mr-2" />
                HOT DROPS
              </Badge>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              The Future of{' '}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Music Ownership
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
              Discover exclusive collections, invest in rising artists, and earn from the music you love. 
              <span className="text-primary font-semibold"> Join 12.8K+ collectors </span>
              building the future of music.
            </p>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
              {[
                { icon: Album, label: 'Collections', value: '1,247', change: '+12%', color: 'text-purple-400' },
                { icon: DollarSign, label: 'Volume (24h)', value: '$2.4M', change: '+18%', color: 'text-green-400' },
                { icon: Users, label: 'Active Collectors', value: '12.8K', change: '+8%', color: 'text-blue-400' },
                { icon: TrendingUp, label: 'Floor Price', value: '0.05 ETH', change: '+24%', color: 'text-cyan-400' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  <Card className="p-6 bg-card/50 backdrop-blur-xl border-border/30 hover:bg-card/70 transition-all duration-300 group">
                    <CardContent className="p-0 text-center">
                      <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color} group-hover:scale-110 transition-transform duration-300`} />
                      <p className="text-3xl font-bold mb-1">{stat.value}</p>
                      <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                      <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                        {stat.change}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-xl shadow-purple-500/25 px-8 py-4 text-lg group"
              >
                <PlayCircle className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                Explore Collections
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-border/30 text-foreground hover:bg-accent/20 backdrop-blur-xl px-8 py-4 text-lg"
              >
                <Mic className="mr-2 w-5 h-5" />
                Discover Artists
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="sticky top-16 z-40 bg-background/95 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Section Navigation */}
            <div className="flex items-center gap-2 bg-card/30 backdrop-blur-sm rounded-full p-1">
              {[
                { id: 'featured', label: 'Featured', icon: Star },
                { id: 'collections', label: 'Collections', icon: Album },
                { id: 'artists', label: 'Artists', icon: Mic },
                { id: 'trending', label: 'Trending', icon: Flame },
                { id: 'explore', label: 'Explore All', icon: Search },
              ].map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeSection === tab.id ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveSection(tab.id)}
                  className="rounded-full px-6 py-2"
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </Button>
              ))}
            </div>

            {/* Quick Search */}
            <div className="relative w-80">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search collections, artists, tracks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card/30 backdrop-blur-sm border-border/30"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections Section */}
      {activeSection === 'featured' && (
        <section className="py-16 bg-gradient-to-b from-background to-purple-950/5">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Featured{' '}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Collections
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Handpicked collections from top artists with exceptional growth potential
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {featuredCollections.map((collection, index) => (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Card className="overflow-hidden bg-card/50 backdrop-blur-xl border-border/30 hover:bg-card/70 transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-primary/20">
                    <div className="relative">
                      <div className="aspect-square overflow-hidden">
                        <img 
                          src={collection.cover} 
                          alt={collection.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        
                        {/* Overlay Info */}
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center justify-between text-white mb-2">
                            <Badge className="bg-black/60 text-white border-0">
                              {collection.trackCount} tracks
                            </Badge>
                            <Badge className="bg-green-500/80 text-white border-0">
                              {collection.growth}
                            </Badge>
                          </div>
                        </div>

                        {/* Hover Play Button */}
                        <motion.button
                          initial={{ scale: 0 }}
                          whileHover={{ scale: 1 }}
                          className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <PlayCircle className="w-16 h-16 text-white" />
                        </motion.button>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                          {collection.name}
                        </h3>
                        {collection.verified && (
                          <Crown className="w-5 h-5 text-yellow-500" />
                        )}
                      </div>
                      
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {collection.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground">by {collection.artist}</p>
                          <p className="text-lg font-bold text-primary">{collection.totalValue}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" className="p-2">
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="p-2">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                        View Collection
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Trending Albums */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-16"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-bold flex items-center gap-2">
                  <Flame className="w-8 h-8 text-orange-500" />
                  Trending Albums
                </h3>
                <Button variant="outline" className="group">
                  View All
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {trendingAlbums.map((album, index) => (
                  <motion.div
                    key={album.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <Card className="p-6 bg-gradient-to-br from-card/50 to-card/20 backdrop-blur-xl border-border/30 hover:bg-card/70 transition-all duration-300 group">
                      <CardContent className="p-0">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-20 h-20 rounded-xl overflow-hidden">
                              <img 
                                src={album.cover} 
                                alt={album.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            >
                              <PlayCircle className="w-8 h-8 text-white" />
                            </motion.button>
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="text-lg font-bold mb-1">{album.title}</h4>
                            <p className="text-muted-foreground text-sm mb-2">{album.artist}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{album.trackCount} tracks</span>
                              <span>{album.streams} streams</span>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-lg font-bold text-primary mb-1">{album.price}</p>
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              {album.growth}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Featured Artists */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-bold flex items-center gap-2">
                  <Award className="w-8 h-8 text-purple-500" />
                  Featured Artists
                </h3>
                <Button variant="outline" className="group">
                  View All
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredArtists.map((artist, index) => (
                  <motion.div
                    key={artist.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                  >
                    <Card className="p-6 bg-card/50 backdrop-blur-xl border-border/30 hover:bg-card/70 transition-all duration-300 text-center group">
                      <CardContent className="p-0">
                        <div className="relative mb-4">
                          <div className="w-24 h-24 rounded-full overflow-hidden mx-auto ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                            <img 
                              src={artist.avatar} 
                              alt={artist.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          {artist.verified && (
                            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-background">
                              <Star className="w-4 h-4 text-white fill-white" />
                            </div>
                          )}
                        </div>
                        
                        <h4 className="text-lg font-bold mb-1">{artist.name}</h4>
                        <p className="text-muted-foreground text-sm mb-3">{artist.genre}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Followers</p>
                            <p className="font-bold">{artist.followers}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Value</p>
                            <p className="font-bold text-primary">{artist.totalValue}</p>
                          </div>
                        </div>
                        
                        <Button size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <Plus className="w-4 h-4 mr-2" />
                          Follow
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* NFT Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {nftsLoading ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center gap-2 text-lg">
                <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
                Loading NFTs from blockchain...
              </div>
              <p className="text-muted-foreground mt-2">Fetching live contract data</p>
            </div>
          ) : nftsError ? (
            <div className="text-center py-20">
              <Music className="w-16 h-16 mx-auto mb-4 text-red-500" />
              <h3 className="text-xl font-semibold mb-2 text-red-500">Failed to Load NFTs</h3>
              <p className="text-muted-foreground">{nftsError.message || 'Unable to fetch NFT data from contracts'}</p>
              <Button 
                className="mt-4" 
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Retry
              </Button>
            </div>
          ) : filteredNFTs.length === 0 && marketplaceNFTs.length === 0 ? (
            <div className="text-center py-20">
              <Music className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No NFTs Available</h3>
              <p className="text-muted-foreground mb-4">No music NFTs have been minted yet or no tracks with audio are available</p>
              {trackInfo && (
                <div className="bg-muted/50 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-sm text-muted-foreground">Debug info:</p>
                  <p className="text-sm">Track found: {trackInfo.title || 'No title'}</p>
                  <p className="text-sm">Audio hash: {trackInfo.ipfsAudioHash || 'No audio hash'}</p>
                </div>
              )}
            </div>
          ) : filteredNFTs.length === 0 ? (
            <div className="text-center py-20">
              <Music className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No NFTs Match Your Filters</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search query</p>
              <p className="text-sm text-muted-foreground mt-2">Found {marketplaceNFTs.length} total NFTs</p>
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
