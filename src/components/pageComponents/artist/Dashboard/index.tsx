import { MusicNFTCard } from '@/src/components/nft/MusicNFTCard'
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/custom-tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select'
import { type Track, useAudioPlayer } from '@/src/hooks/useAudioPlayer'
import { useArtistData, useArtistNFTs, useArtistAnalytics } from '@/src/hooks/contracts/useArtistData'
import { useArtistCollections } from '@/src/hooks/contracts/useArtistCollections'
import { useArtistProfile } from '@/src/hooks/useArtistProfile'
import { TrackUploadModal } from '@/src/components/artist/TrackUpload/TrackUploadModal'
import { CollectionList } from '@/src/components/pageComponents/collections/CollectionList'
import type { MusicNFT } from '@/src/types/music-nft'
import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import React from 'react'
import { ContractDebugPanel } from '@/src/components/debug/ContractDebugPanel'
import {
  Award,
  BarChart3,
  Clock,
  DollarSign,
  Download,
  Edit3,
  Headphones,
  Heart,
  Music,
  PieChart,
  Play,
  Settings,
  Share2,
  Star,
  Target,
  Upload,
  Users,
  Zap,
} from 'lucide-react'
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
  blokEarned: 24851,
}

// Mock collections data - REPLACED WITH REAL CONTRACT DATA
// Now using useArtistCollections hook with transformation in component

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
      blokAmount: 1000,
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
      blokAmount: 500,
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

  // Fetch real artist data from contracts and database
  const { artistStats, isLoading: artistLoading, isArtist, trackInfo } = useArtistData()
  const { nfts: artistTracks, isLoading: nftsLoading, refetch: refetchArtistTracks } = useArtistNFTs()
  const { collections: rawCollections, isLoading: collectionsLoading, refetch: refetchCollections } = useArtistCollections()
  const { monthlyData } = useArtistAnalytics()
  
  // Get enhanced profile with database data
  const { 
    profile: enhancedProfile, 
    isLoading: profileLoading,
    dbProfile,
    dbTracks 
  } = useArtistProfile()

  // Transform raw collections data for CollectionList component
  const transformedCollections = React.useMemo(() => {
    if (!rawCollections || rawCollections.length === 0) return []
    
    // Group NFTs by collection ID to create collection objects
    const collectionsMap = new Map()
    
    rawCollections.forEach(nft => {
      const collectionId = nft.collectionId
      if (!collectionId) return
      
      if (!collectionsMap.has(collectionId)) {
        collectionsMap.set(collectionId, {
          id: collectionId,
          title: nft.collectionTitle || 'Untitled Collection',
          artist: nft.metadata.artist || 'Unknown Artist',
          description: nft.metadata.description || 'No description available',
          coverArt: nft.metadata.image || '/song_cover/placeholder.png',
          trackCount: 0,
          totalMinted: 0,
          totalSupply: nft.metadata.maxSupply || 1000,
          revenue: 0,
          createdAt: nft.metadata.releaseDate || new Date().toISOString(),
          isActive: nft.active || false,
          completionProgress: 0,
          tracks: []
        })
      }
      
      const collection = collectionsMap.get(collectionId)
      // Only count real tracks (not placeholders)
      if (!nft.tokenId.includes('placeholder')) {
        collection.trackCount++
        collection.tracks.push(nft)
        // Calculate approximate revenue (could enhance with real data)
        collection.revenue += parseFloat(nft.priceUSD.toString()) || 0
      }
      
      // Update completion progress based on finalization status
      collection.completionProgress = nft.finalized ? 100 : Math.min(80, collection.trackCount * 20)
    })
    
    return Array.from(collectionsMap.values()).sort((a, b) => b.id - a.id) // Sort by newest first
  }, [rawCollections])

  console.log('🎨 Artist Dashboard Data:', { 
    artistStats, 
    artistTracks, 
    trackInfo, 
    isArtist,
    enhancedProfile,
    dbProfile,
    dbTracks,
    rawCollections: rawCollections?.length,
    transformedCollections: transformedCollections?.length
  })

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
        pagsPerStream: nft.metadata.blokAmount ? nft.metadata.blokAmount / 1000 : undefined,
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

  // Show loading state
  if (artistLoading || nftsLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-lg">Loading artist dashboard...</p>
          <p className="text-sm text-muted-foreground">Fetching contract and profile data</p>
        </div>
      </div>
    )
  }

  // Show non-artist message
  if (!isArtist) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <Music className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Artist Dashboard</h2>
          <p className="text-muted-foreground mb-4">
            You need artist permissions to access this dashboard. Please complete artist verification first.
          </p>
          <Link to="/artist/signup">
            <Button>Start Artist Application</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Use enhanced profile data when available, fallback to contract data
  const artistData = {
    name: enhancedProfile?.displayName || artistStats?.name || 'Artist',
    avatar: enhancedProfile?.avatar || artistStats?.avatar,
    verified: enhancedProfile?.isVerified || artistStats?.verified || false,
    followers: artistStats?.followers || 0,
    totalPlays: enhancedProfile?.totalStreams || artistStats?.totalPlays || 0,
    monthlyListeners: artistStats?.monthlyListeners || 0,
    totalEarnings: enhancedProfile?.totalEarnings || artistStats?.totalEarnings || 0,
    pendingPayouts: artistStats?.pendingPayouts || 0,
    averageRating: artistStats?.averageRating || 0,
    totalTracks: enhancedProfile?.totalTracks || artistStats?.totalTracks || 0,
    nftsCreated: artistStats?.nftsCreated || 0,
    nftsSold: artistStats?.nftsSold || 0,
    blokBalance: artistStats?.blokBalance || 0,
    blokEarned: artistStats?.totalEarnings || 0, // Fix: Add blokEarned property
    
    // Additional database fields
    bio: dbProfile?.bio,
    location: dbProfile?.location,
    website: dbProfile?.website,
    socialLinks: dbProfile?.social_links,
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
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
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
                  <Star className="w-4 h-4 text-primary" />
                  <span>{artistData.averageRating} rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <Music className="w-4 h-4 text-primary" />
                  <span>{artistData.totalTracks} tracks</span>
                </div>
                <div className="flex items-center gap-1">
                  <Headphones className="w-4 h-4 text-primary" />
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
              <TrackUploadModal 
                buttonText="Upload Track"
                buttonVariant="default"
                onTrackCreated={() => {
                  console.log('🎵 [DASHBOARD] Track created, refreshing data...')
                  refetchArtistTracks()
                  refetchCollections()
                  toast.success('Track added to your collection!')
                }} 
              />
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
            <TabsList className="grid w-full max-w-lg grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="collections">Albums</TabsTrigger>
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
              {/* Debug Panel - Remove after fixing role issues 
              <ContractDebugPanel />*/}

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
                        <DollarSign className="w-8 h-8 text-primary" />
                        <Badge className="bg-primary/10 text-primary border-primary/20">
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
                        <Headphones className="w-8 h-8 text-primary" />
                        <Badge className="bg-primary/10 text-primary border-primary/20">
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
                        <Users className="w-8 h-8 text-primary" />
                        <Badge className="bg-primary/10 text-primary border-primary/20">
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
                        <Zap className="w-8 h-8 text-accent" />
                        <Badge className="bg-accent/10 text-accent border-accent/20">
                          BLOK
                        </Badge>
                      </div>
                      <p className="text-3xl font-bold">{artistData.blokEarned.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">BLOK Earned</p>
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
                                <DollarSign className="w-4 h-4 text-primary" />
                              )}
                              {activity.type === 'stream' && (
                                <Play className="w-4 h-4 text-primary" />
                              )}
                              {activity.type === 'follow' && (
                                <Users className="w-4 h-4 text-primary" />
                              )}
                              {activity.type === 'review' && (
                                <Star className="w-4 h-4 text-primary" />
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
                          <p className="text-3xl font-bold text-primary">
                            ${artistData.pendingPayouts.toFixed(2)}
                          </p>
                          <p className="text-sm text-muted-foreground">Available to withdraw</p>
                        </div>
                        <Button className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
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
                      <TrackUploadModal 
                        buttonVariant="outline"
                        fullWidth={true}
                        onTrackCreated={() => {
                          console.log('🎵 [DASHBOARD] Track created, refreshing data...')
                          refetchArtistTracks()
                          refetchCollections()
                          toast.success('Track added to your collection!')
                        }}
                      />
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

          {/* Collections (Albums) Tab */}
          <TabsContent value="collections">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">Your Albums</h2>
                  <p className="text-muted-foreground">Manage your music collections and track progress</p>
                </div>
                <Button asChild className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                  <Link to="/artist/upload">
                    <Music className="w-4 h-4 mr-2" />
                    Create New Album
                  </Link>
                </Button>
              </div>

              <CollectionList
                collections={transformedCollections}
                isLoading={collectionsLoading}
                showCreateButton={true}
                onCollectionSelect={(collection) => {
                  // Navigate to collection detail or open modal
                  toast.info(`Viewing ${collection.title} with ${collection.trackCount} tracks`)
                  // Could enhance: navigate to a detailed collection view
                }}
              />
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
                <TrackUploadModal 
                  onTrackCreated={() => {
                    // Track added successfully - refresh the data
                    console.log('🎵 [DASHBOARD] Track created, refreshing data...')
                    refetchArtistTracks()
                    refetchCollections()
                    toast.success('Track added to your collection!')
                  }} 
                />
              </div>

              {nftsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading your tracks...</p>
                  </div>
                </div>
              ) : artistTracks.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-center">
                    <Music className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                    <h3 className="text-lg font-medium mb-2">No tracks yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start your musical journey by uploading your first track
                    </p>
                    <TrackUploadModal 
                      buttonText="Upload Your First Track"
                      onTrackCreated={() => {
                        console.log('🎵 [DASHBOARD] First track created, refreshing data...')
                        refetchArtistTracks()
                        refetchCollections()
                        toast.success('Track added to your collection!')
                      }}
                    />
                  </div>
                </div>
              ) : (
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
              )}
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
