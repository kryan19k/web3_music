import { MusicNFTCard } from '@/components/nft/MusicNFTCard'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { type Track, useAudioPlayer } from '@/hooks/useAudioPlayer'
import type { MusicNFT } from '@/types/music-nft'
import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import {
  Award,
  BarChart3,
  Calendar,
  Clock,
  DollarSign,
  Download,
  Edit3,
  Eye,
  Globe,
  Headphones,
  Heart,
  MoreHorizontal,
  Music,
  PieChart,
  Play,
  Settings,
  Share2,
  Star,
  Target,
  TrendingUp,
  Upload,
  Users,
  Zap,
} from 'lucide-react'
import * as React from 'react'
import { useState } from 'react'

// Mock artist data
const artistData = {
  name: 'Luna Vista',
  avatar: '/api/placeholder/100/100',
  verified: true,
  followers: 12847,
  totalPlays: 2847632,
  monthlyListeners: 45673,
  totalEarnings: 18439.5,
  pendingPayouts: 1247.83,
  averageRating: 4.8,
  totalTracks: 24,
  nftsCreated: 12,
  nftsSold: 847,
  pagsEarned: 24851,
}

// Mock track data for artist
const artistTracks: MusicNFT[] = [
  {
    tokenId: 'artist-1',
    tier: 'platinum',
    metadata: {
      id: 'artist-1',
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
      attributes: [],
    },
    price: '0.5',
    priceUSD: 892.5,
    earnings: { daily: 24.5, total: 1250.0, apy: 18.5 },
    owner: '0x742...a5c2',
    isListed: true,
    streamingStats: { totalPlays: 125430, uniqueListeners: 8940, averageCompletion: 87 },
  },
  {
    tokenId: 'artist-2',
    tier: 'gold',
    metadata: {
      id: 'artist-2',
      title: 'Neon Dreams',
      artist: 'Luna Vista',
      image: '/api/placeholder/300/300',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      duration: 198,
      edition: 47,
      maxSupply: 100,
      description: 'Synthwave vibes with modern production',
      genre: 'Synthwave',
      releaseDate: '2024-02-03',
      pagsAmount: 500,
      dailyStreams: 32100,
      attributes: [],
    },
    price: '0.15',
    priceUSD: 267.75,
    earnings: { daily: 8.9, total: 445.6, apy: 12.3 },
    owner: '0x1a3...f8d1',
    isListed: true,
    streamingStats: { totalPlays: 98750, uniqueListeners: 12300, averageCompletion: 92 },
  },
]

// Mock analytics data
const monthlyData = [
  { month: 'Jan', streams: 45000, earnings: 1250, sales: 45 },
  { month: 'Feb', streams: 52000, earnings: 1480, sales: 67 },
  { month: 'Mar', streams: 48000, earnings: 1320, sales: 52 },
  { month: 'Apr', streams: 61000, earnings: 1780, sales: 83 },
  { month: 'May', streams: 58000, earnings: 1650, sales: 74 },
  { month: 'Jun', streams: 67000, earnings: 1920, sales: 95 },
]

const recentActivity = [
  {
    id: '1',
    type: 'sale',
    track: 'Midnight Echoes',
    amount: 892.5,
    buyer: '0x1234...5678',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    type: 'stream',
    track: 'Neon Dreams',
    amount: 2.45,
    location: 'United States',
    timestamp: '5 hours ago',
  },
  {
    id: '3',
    type: 'follow',
    user: 'MusicLover2024',
    timestamp: '1 day ago',
  },
  {
    id: '4',
    type: 'review',
    track: 'Midnight Echoes',
    rating: 5,
    user: 'AmbientFan',
    timestamp: '2 days ago',
  },
]

export function ArtistDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview')
  const [timeRange, setTimeRange] = useState('30d')
  const { play, pause, currentTrack, isPlaying } = useAudioPlayer()

  const handlePlay = (audioUrl: string) => {
    const nft = artistTracks.find((n) => n.metadata.audioUrl === audioUrl)
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

  const handleTrackAction = (tokenId: string) => {
    console.log('Track action:', tokenId)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/95 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-6">
            {/* Artist Avatar */}
            <div className="relative">
              <Avatar className="w-20 h-20">
                <AvatarImage src={artistData.avatar} />
                <AvatarFallback className="text-2xl">{artistData.name[0]}</AvatarFallback>
              </Avatar>
              {artistData.verified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <Award className="w-3 h-3 text-white" />
                </div>
              )}
            </div>

            {/* Artist Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold">{artistData.name}</h1>
                {artistData.verified && (
                  <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                    Verified Artist
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground mb-3">
                Electronic Music Producer • {artistData.followers.toLocaleString()} followers
              </p>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{artistData.averageRating} rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <Music className="w-4 h-4" />
                  <span>{artistData.totalTracks} tracks</span>
                </div>
                <div className="flex items-center gap-1">
                  <Headphones className="w-4 h-4" />
                  <span>{artistData.monthlyListeners.toLocaleString()} monthly listeners</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Link to="/artist/upload">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Track
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
        >
          <div className="flex items-center justify-between mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tracks">Tracks</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="fans">Fans</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-3">
              <Select
                value={timeRange}
                onValueChange={setTimeRange}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 3 months</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <DollarSign className="w-8 h-8 text-green-500" />
                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                          +12.4%
                        </Badge>
                      </div>
                      <p className="text-3xl font-bold">
                        ${artistData.totalEarnings.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Earnings</p>
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
                        <Headphones className="w-8 h-8 text-blue-500" />
                        <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                          +8.2%
                        </Badge>
                      </div>
                      <p className="text-3xl font-bold">{artistData.totalPlays.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Total Plays</p>
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
                        <Users className="w-8 h-8 text-purple-500" />
                        <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                          +15.7%
                        </Badge>
                      </div>
                      <p className="text-3xl font-bold">{artistData.nftsSold}</p>
                      <p className="text-sm text-muted-foreground">NFTs Sold</p>
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
                      <p className="text-3xl font-bold">{artistData.pagsEarned.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">PAGS Earned</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentActivity.map((activity) => (
                          <div
                            key={activity.id}
                            className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              {activity.type === 'sale' && (
                                <DollarSign className="w-4 h-4 text-green-500" />
                              )}
                              {activity.type === 'stream' && (
                                <Play className="w-4 h-4 text-blue-500" />
                              )}
                              {activity.type === 'follow' && (
                                <Users className="w-4 h-4 text-purple-500" />
                              )}
                              {activity.type === 'review' && (
                                <Star className="w-4 h-4 text-yellow-500" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              {activity.type === 'sale' && (
                                <>
                                  <p className="font-medium">NFT Sale</p>
                                  <p className="text-sm text-muted-foreground truncate">
                                    {activity.track} sold for ${activity.amount} to {activity.buyer}
                                  </p>
                                </>
                              )}
                              {activity.type === 'stream' && (
                                <>
                                  <p className="font-medium">Stream Revenue</p>
                                  <p className="text-sm text-muted-foreground">
                                    {activity.track} • ${activity.amount} from {activity.location}
                                  </p>
                                </>
                              )}
                              {activity.type === 'follow' && (
                                <>
                                  <p className="font-medium">New Follower</p>
                                  <p className="text-sm text-muted-foreground">
                                    {activity.user} started following you
                                  </p>
                                </>
                              )}
                              {activity.type === 'review' && (
                                <>
                                  <p className="font-medium">New Review</p>
                                  <p className="text-sm text-muted-foreground">
                                    {activity.rating}⭐ rating on {activity.track} by{' '}
                                    {activity.user}
                                  </p>
                                </>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {activity.timestamp}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions & Pending */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Pending Payouts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center space-y-4">
                        <div>
                          <p className="text-3xl font-bold text-green-500">
                            ${artistData.pendingPayouts.toFixed(2)}
                          </p>
                          <p className="text-sm text-muted-foreground">Available to withdraw</p>
                        </div>
                        <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                          <Download className="w-4 h-4 mr-2" />
                          Withdraw
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Link to="/artist/upload">
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload New Track
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Profile
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Account Settings
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Tracks Tab */}
          <TabsContent value="tracks">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">Your Tracks</h2>
                  <p className="text-muted-foreground">{artistTracks.length} tracks created</p>
                </div>
                <Link to="/artist/upload">
                  <Button>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload New Track
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {artistTracks.map((track, index) => (
                  <motion.div
                    key={track.tokenId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <MusicNFTCard
                      nft={track}
                      isPlaying={currentTrack?.id === track.tokenId && isPlaying}
                      onPlay={handlePlay}
                      onPause={handlePause}
                      onPurchase={handleTrackAction}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Performance Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <PieChart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">Detailed Analytics Coming Soon</h3>
                    <p className="text-sm text-muted-foreground">
                      Advanced charts and insights for your music performance, revenue trends, and
                      audience analytics.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Fans Tab */}
          <TabsContent value="fans">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Fan Engagement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">Fan Dashboard Coming Soon</h3>
                    <p className="text-sm text-muted-foreground">
                      Connect with your fans, view demographics, and engage with your community.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
