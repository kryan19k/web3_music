import { Waveform } from '@/src/components/music/Waveform'
import { MusicNFTCard } from '@/src/components/nft/MusicNFTCard'
import { PurchaseModal } from '@/src/components/nft/PurchaseModal'
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/custom-tabs'
import { Separator } from '@/src/components/ui/separator'
import { type Track, useAudioPlayer } from '@/src/hooks/useAudioPlayer'
import type { MusicNFT } from '@/src/types/music-nft'
import { Link, useParams } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Award,
  BarChart3,
  Calendar,
  Clock,
  DollarSign,
  ExternalLink,
  Flag,
  Headphones,
  Heart,
  MessageSquare,
  Music,
  Play,
  Share2,
  Star,
  TrendingUp,
  Users,
  Volume2,
  Zap,
} from 'lucide-react'
import * as React from 'react'
import { useMemo, useState } from 'react'

// Mock data - in real app this would come from API/blockchain
const mockNFTData: Record<string, MusicNFT> = {
  '1': {
    tokenId: '1',
    tier: 'platinum',
    metadata: {
      id: '1',
      title: 'Midnight Echoes',
      artist: 'Luna Vista',
      image: '/api/placeholder/400/400',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      duration: 245,
      edition: 3,
      maxSupply: 10,
      description:
        'An ethereal journey through ambient soundscapes that captures the essence of late-night introspection. Featuring layered synthesizers, atmospheric strings, and subtle field recordings that transport listeners to a world between dreams and reality.',
      genre: 'Ambient',
      releaseDate: '2024-01-15',
      pagsAmount: 1000,
      dailyStreams: 15420,
      attributes: [
        { trait_type: 'Mood', value: 'Ethereal' },
        { trait_type: 'Tempo', value: 'Slow' },
        { trait_type: 'Key', value: 'D Minor' },
        { trait_type: 'Instruments', value: 'Synthesizer, Strings' },
        { trait_type: 'Vocals', value: 'Instrumental' },
        { trait_type: 'Production Style', value: 'Atmospheric' },
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
}

// Mock related NFTs
const relatedNFTs: MusicNFT[] = [
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
      ],
    },
    price: '0.15',
    priceUSD: 267.75,
    earnings: { daily: 8.9, total: 445.6, apy: 12.3 },
    owner: '0x1a3...f8d1',
    isListed: true,
    streamingStats: { totalPlays: 98750, uniqueListeners: 12300, averageCompletion: 92 },
  },
]

// Mock comments
const mockComments = [
  {
    id: '1',
    user: { address: '0x1234...5678', avatar: '/api/placeholder/32/32', name: 'MusicLover' },
    content:
      'This track is absolutely incredible! The ambient layers create such a beautiful atmosphere.',
    timestamp: '2024-01-20T10:30:00Z',
    likes: 24,
    isLiked: false,
  },
  {
    id: '2',
    user: { address: '0x9876...5432', avatar: '/api/placeholder/32/32', name: 'AmbientFan' },
    content:
      'Been holding this NFT for 3 months now and the royalties have been amazing. Plus the music is just pure art.',
    timestamp: '2024-01-18T14:22:00Z',
    likes: 18,
    isLiked: true,
  },
]

const tierConfigs = {
  bronze: {
    name: 'Bronze',
    color: 'bg-orange-500/20 text-orange-300 border-orange-500/50',
    glow: 'shadow-orange-500/25',
  },
  silver: {
    name: 'Silver',
    color: 'bg-slate-500/20 text-slate-300 border-slate-500/50',
    glow: 'shadow-slate-500/25',
  },
  gold: {
    name: 'Gold',
    color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
    glow: 'shadow-yellow-500/25',
  },
  platinum: {
    name: 'Platinum',
    color: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
    glow: 'shadow-purple-500/25',
  },
}

export function NFTDetailPage() {
  const params = useParams({ from: '/marketplace/$nftId' })
  const nftId = params.nftId
  const [selectedTab, setSelectedTab] = useState('overview')
  const [isLiked, setIsLiked] = useState(false)
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false)
  const { play, pause, currentTrack, isPlaying } = useAudioPlayer()

  // Get NFT data
  const nft = mockNFTData[nftId]

  // Memoize current track check
  const isCurrentlyPlaying = useMemo(
    () => currentTrack?.id === nftId && isPlaying,
    [currentTrack?.id, nftId, isPlaying],
  )

  if (!nft) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">NFT Not Found</h1>
          <p className="text-muted-foreground">The requested NFT could not be found.</p>
          <Link
            to="/marketplace"
            className="inline-block mt-4"
          >
            <Button>Back to Marketplace</Button>
          </Link>
        </div>
      </div>
    )
  }

  const tierConfig = tierConfigs[nft.tier as keyof typeof tierConfigs]

  const handlePlay = () => {
    const track: Track = {
      id: nft.tokenId,
      title: nft.metadata.title,
      artist: nft.metadata.artist,
      artwork: nft.metadata.image,
      audioUrl: nft.metadata.audioUrl,
      duration: nft.metadata.duration,
      pagsPerStream: nft.metadata.pagsAmount / 1000,
    }
    play(track)
  }

  const handlePause = () => {
    pause()
  }

  const handlePurchase = async (tokenId: string, tier: string) => {
    console.log('Purchasing NFT:', tokenId, tier)
    // In real app, this would call smart contract
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/95 backdrop-blur-xl sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/marketplace">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold truncate">{nft.metadata.title}</h1>
              <p className="text-sm text-muted-foreground">by {nft.metadata.artist}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                {isLiked ? 'Liked' : 'Like'}
              </Button>
              <Button
                variant="outline"
                size="sm"
              >
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Media & Waveform */}
          <div className="lg:col-span-2 space-y-6">
            {/* Album Art & Basic Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-square relative group">
                    <img
                      src={nft.metadata.image}
                      alt={nft.metadata.title}
                      className="w-full h-full object-cover"
                    />

                    {/* Play Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button
                          size="lg"
                          className="w-20 h-20 rounded-full bg-white/90 hover:bg-white text-black hover:scale-110 transition-all"
                          onClick={isCurrentlyPlaying ? handlePause : handlePlay}
                        >
                          {isCurrentlyPlaying ? (
                            <Volume2 className="w-8 h-8" />
                          ) : (
                            <Play className="w-8 h-8 ml-1" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Tier Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge className={`px-3 py-1 font-semibold ${tierConfig.color}`}>
                        {tierConfig.name.toUpperCase()}
                      </Badge>
                    </div>

                    {/* Edition Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-black/60 backdrop-blur-sm text-white border-white/20">
                        #{nft.metadata.edition}/{nft.metadata.maxSupply}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Waveform */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <Waveform
                    audioUrl={nft.metadata.audioUrl}
                    isPlaying={isCurrentlyPlaying}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    height={120}
                    waveColor="#4a5568"
                    progressColor="#8b5cf6"
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Tabs Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Tabs
                value={selectedTab}
                onValueChange={setSelectedTab}
              >
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="attributes">Attributes</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="comments">Comments</TabsTrigger>
                </TabsList>

                <TabsContent
                  value="overview"
                  className="space-y-6 mt-6"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Music className="w-5 h-5" />
                        About This Track
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {nft.metadata.description}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {formatTime(nft.metadata.duration)}
                          </div>
                          <div className="text-sm text-muted-foreground">Duration</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{nft.metadata.genre}</div>
                          <div className="text-sm text-muted-foreground">Genre</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {new Date(nft.metadata.releaseDate).getFullYear()}
                          </div>
                          <div className="text-sm text-muted-foreground">Release Year</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {nft.streamingStats.averageCompletion}%
                          </div>
                          <div className="text-sm text-muted-foreground">Completion</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        Streaming Stats
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                            <Headphones className="w-6 h-6 text-blue-500" />
                          </div>
                          <div>
                            <div className="font-semibold">
                              {nft.streamingStats.totalPlays.toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">Total Plays</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-green-500" />
                          </div>
                          <div>
                            <div className="font-semibold">
                              {nft.streamingStats.uniqueListeners.toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">Unique Listeners</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-purple-500" />
                          </div>
                          <div>
                            <div className="font-semibold">
                              {nft.metadata.dailyStreams.toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">Daily Streams</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent
                  value="attributes"
                  className="mt-6"
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {nft.metadata.attributes.map((attr) => (
                          <div
                            key={`${attr.trait_type}-${attr.value}`}
                            className="p-4 bg-muted/50 rounded-lg"
                          >
                            <div className="text-sm text-muted-foreground">{attr.trait_type}</div>
                            <div className="font-semibold">{attr.value}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent
                  value="activity"
                  className="mt-6"
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center py-8">
                        <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="font-semibold mb-2">Activity Feed Coming Soon</h3>
                        <p className="text-sm text-muted-foreground">
                          View all sales, transfers, and other activities for this NFT.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent
                  value="comments"
                  className="mt-6"
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        {mockComments.map((comment) => (
                          <div
                            key={comment.id}
                            className="flex gap-3"
                          >
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={comment.user.avatar} />
                              <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">{comment.user.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(comment.timestamp).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {comment.content}
                              </p>
                              <div className="flex items-center gap-4 text-xs">
                                <button
                                  type="button"
                                  className={`flex items-center gap-1 ${comment.isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                  <Heart
                                    className={`w-3 h-3 ${comment.isLiked ? 'fill-current' : ''}`}
                                  />
                                  {comment.likes}
                                </button>
                                <button
                                  type="button"
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  Reply
                                </button>
                                <button
                                  type="button"
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  <Flag className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          {/* Right Column - Purchase & Info */}
          <div className="space-y-6">
            {/* Purchase Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className={`${tierConfig.glow} border-2`}>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold">${nft.priceUSD.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">{nft.price} ETH</div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-sm">Daily Earnings</span>
                      <span className="text-sm font-semibold text-green-500">
                        ${nft.earnings.daily.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">APY</span>
                      <span className="text-sm font-semibold text-blue-500">
                        {nft.earnings.apy.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">PAGS Allocation</span>
                      <span className="text-sm font-semibold">{nft.metadata.pagsAmount} PAGS</span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    onClick={() => setIsPurchaseModalOpen(true)}
                    disabled={!nft.isListed}
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    {nft.isListed ? 'Purchase NFT' : 'Not Available'}
                  </Button>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Current Owner</span>
                      <Link
                        to={`/profile/${nft.owner}`}
                        className="font-mono hover:text-primary transition-colors"
                      >
                        {nft.owner}
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Artist Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback>{nft.metadata.artist[0]}</AvatarFallback>
                    </Avatar>
                    Artist Info
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="text-lg">{nft.metadata.artist[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{nft.metadata.artist}</div>
                      <div className="text-sm text-muted-foreground">Electronic Music Producer</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Ambient and atmospheric music producer with over 50M streams worldwide.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      Follow
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Related NFTs */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Similar NFTs</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {relatedNFTs.slice(0, 2).map((relatedNFT) => (
                      <Link
                        key={relatedNFT.tokenId}
                        to={`/marketplace/${relatedNFT.tokenId}`}
                      >
                        <div className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <img
                            src={relatedNFT.metadata.image}
                            alt={relatedNFT.metadata.title}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">
                              {relatedNFT.metadata.title}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {relatedNFT.metadata.artist}
                            </div>
                            <div className="text-xs font-medium">
                              ${relatedNFT.priceUSD.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      <PurchaseModal
        nft={nft}
        isOpen={isPurchaseModalOpen}
        onOpenChange={setIsPurchaseModalOpen}
        onPurchase={handlePurchase}
      />
    </div>
  )
}
