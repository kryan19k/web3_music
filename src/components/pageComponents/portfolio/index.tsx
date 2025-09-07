import { MusicNFTCard } from '@/src/components/nft/MusicNFTCard'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/custom-tabs'
import { Progress } from '@/src/components/ui/progress'
import { type Track, useAudioPlayer } from '@/src/hooks/useAudioPlayer'
import type { MusicNFT } from '@/src/types/music-nft'
import { motion } from 'framer-motion'
import {
  ArrowDownRight,
  ArrowUpRight,
  Award,
  BarChart3,
  Calendar,
  DollarSign,
  Headphones,
  Music,
  PieChart,
  Target,
  TrendingUp,
  Wallet,
  Zap,
} from 'lucide-react'
import { useState } from 'react'

// Mock user portfolio data
const userPortfolio = {
  totalValue: 2847.5,
  totalEarnings: 892.3,
  monthlyEarnings: 156.7,
  totalNFTs: 12,
  pagsBalance: 15420,
  pendingRewards: 47.85,
  performance: {
    thisMonth: 12.4,
    lastMonth: 8.7,
    allTime: 34.2,
  },
}

const userNFTs: MusicNFT[] = [
  {
    tokenId: 'user-1',
    tier: 'platinum',
    metadata: {
      id: 'user-1',
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
    isListed: false,
    streamingStats: {
      totalPlays: 125430,
      uniqueListeners: 8940,
      averageCompletion: 87,
    },
  },
  {
    tokenId: 'user-2',
    tier: 'gold',
    metadata: {
      id: 'user-2',
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
    tokenId: 'user-3',
    tier: 'silver',
    metadata: {
      id: 'user-3',
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
    isListed: false,
    streamingStats: {
      totalPlays: 156780,
      uniqueListeners: 18950,
      averageCompletion: 78,
    },
  },
]

// Mock earnings history
const earningsHistory = [
  { month: 'Jan 2024', earnings: 145.3, growth: 12.4 },
  { month: 'Feb 2024', earnings: 167.8, growth: 15.5 },
  { month: 'Mar 2024', earnings: 189.2, growth: 12.7 },
  { month: 'Apr 2024', earnings: 234.6, growth: 24.0 },
  { month: 'May 2024', earnings: 198.4, growth: -15.4 },
  { month: 'Jun 2024', earnings: 221.7, growth: 11.7 },
]

export function PortfolioPage() {
  const [selectedTab, setSelectedTab] = useState('overview')
  const { play, pause, currentTrack, isPlaying } = useAudioPlayer()

  const handlePlay = (audioUrl: string) => {
    const nft = userNFTs.find((n) => n.metadata.audioUrl === audioUrl)
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

  const handleSellNFT = (tokenId: string) => {
    console.log('List NFT for sale:', tokenId)
    // In a real app, this would open the listing modal
  }

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
            <div className="flex items-center justify-center gap-2 mb-4">
              <Wallet className="w-8 h-8 text-primary" />
              <h1 className="text-5xl md:text-6xl font-bold">
                My{' '}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Portfolio
                </span>
              </h1>
            </div>
            <p className="text-xl text-muted-foreground mb-8">
              Track your music NFT investments, earnings, and performance in one place
            </p>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Overview */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <DollarSign className="w-8 h-8 text-green-500" />
                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      {userPortfolio.performance.thisMonth}%
                    </Badge>
                  </div>
                  <p className="text-3xl font-bold">${userPortfolio.totalValue.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <TrendingUp className="w-8 h-8 text-blue-500" />
                    <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                      Monthly
                    </Badge>
                  </div>
                  <p className="text-3xl font-bold">${userPortfolio.monthlyEarnings.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">This Month's Earnings</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Music className="w-8 h-8 text-purple-500" />
                    <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                      Owned
                    </Badge>
                  </div>
                  <p className="text-3xl font-bold">{userPortfolio.totalNFTs}</p>
                  <p className="text-sm text-muted-foreground">Music NFTs Owned</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Zap className="w-8 h-8 text-yellow-500" />
                    <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                      PAGS
                    </Badge>
                  </div>
                  <p className="text-3xl font-bold">{userPortfolio.pagsBalance.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">PAGS Token Balance</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Tabs Navigation */}
          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
          >
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="collection">Collection</TabsTrigger>
              <TabsTrigger value="earnings">Earnings</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Earnings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Recent Earnings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {earningsHistory.slice(-3).map((month, index) => (
                        <div
                          key={month.month}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-primary rounded-full" />
                            <span className="font-medium">{month.month}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">${month.earnings.toFixed(2)}</span>
                            <Badge
                              variant={month.growth > 0 ? 'secondary' : 'outline'}
                              className="text-xs"
                            >
                              {month.growth > 0 ? (
                                <ArrowUpRight className="w-3 h-3 mr-1 text-green-500" />
                              ) : (
                                <ArrowDownRight className="w-3 h-3 mr-1 text-red-500" />
                              )}
                              {Math.abs(month.growth)}%
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Top Performing NFTs */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Top Performers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userNFTs
                        .sort((a, b) => b.earnings.apy - a.earnings.apy)
                        .slice(0, 3)
                        .map((nft) => (
                          <div
                            key={nft.tokenId}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={nft.metadata.image || '/api/placeholder/40/40'}
                                alt={nft.metadata.title}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                              <div>
                                <p className="font-medium">{nft.metadata.title}</p>
                                <p className="text-sm text-muted-foreground">
                                  {nft.metadata.artist}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-green-500">
                                {nft.earnings.apy.toFixed(1)}% APY
                              </p>
                              <p className="text-sm text-muted-foreground">
                                ${nft.earnings.daily.toFixed(2)}/day
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Collection Tab */}
            <TabsContent value="collection">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userNFTs.map((nft, index) => (
                  <motion.div
                    key={nft.tokenId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <MusicNFTCard
                      nft={nft}
                      isPlaying={currentTrack?.id === nft.tokenId && isPlaying}
                      onPlay={handlePlay}
                      onPause={handlePause}
                      onPurchase={handleSellNFT}
                    />
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Earnings Tab */}
            <TabsContent value="earnings">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Earnings History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {earningsHistory.map((month) => (
                          <div
                            key={month.month}
                            className="flex items-center justify-between p-4 border border-border rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <Calendar className="w-5 h-5 text-muted-foreground" />
                              <span className="font-medium">{month.month}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="font-semibold">${month.earnings.toFixed(2)}</span>
                              <Badge variant={month.growth > 0 ? 'secondary' : 'outline'}>
                                {month.growth > 0 ? '+' : ''}
                                {month.growth}%
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Pending Rewards
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-green-500">
                        ${userPortfolio.pendingRewards.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">Available to claim</p>
                      <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                        Claim Rewards
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Total Lifetime</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">
                        ${userPortfolio.totalEarnings.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">All-time earnings</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-5 h-5" />
                      Portfolio Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {['Platinum', 'Gold', 'Silver', 'Bronze'].map((tier, index) => {
                        const count = userNFTs.filter(
                          (nft) => nft.tier === tier.toLowerCase(),
                        ).length
                        const percentage = count > 0 ? (count / userNFTs.length) * 100 : 0
                        return (
                          <div key={tier}>
                            <div className="flex justify-between mb-2">
                              <span className="font-medium">{tier} NFTs</span>
                              <span className="text-sm text-muted-foreground">
                                {count} ({percentage.toFixed(0)}%)
                              </span>
                            </div>
                            <Progress
                              value={percentage}
                              className="h-2"
                            />
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Headphones className="w-5 h-5" />
                      Streaming Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userNFTs.map((nft) => (
                        <div
                          key={nft.tokenId}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={nft.metadata.image || '/api/placeholder/32/32'}
                              alt={nft.metadata.title}
                              className="w-8 h-8 rounded object-cover"
                            />
                            <span className="font-medium text-sm">{nft.metadata.title}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-sm">
                              {nft.streamingStats.totalPlays.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">plays</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
