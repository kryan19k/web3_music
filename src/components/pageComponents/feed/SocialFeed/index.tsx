import { ActivityItem } from '@/src/components/social/ActivityItem'
import { CompactFollowButton, FollowButton } from '@/src/components/social/FollowButton'
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/custom-tabs'
import { Input } from '@/src/components/ui/input'
import { Textarea } from '@/src/components/ui/textarea'
import type { ActivityItem as ActivityItemType, User } from '@/src/types/social'
import { Link } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Award,
  Bookmark,
  Clock,
  Eye,
  Filter,
  Flame,
  Globe,
  Headphones,
  Heart,
  Image as ImageIcon,
  MessageCircle,
  Music,
  Play,
  PlusCircle,
  RefreshCw,
  Search,
  Send,
  Share2,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react'
import * as React from 'react'
import { useEffect, useState } from 'react'

// Mock suggested users
const suggestedUsers: User[] = [
  {
    id: 'nova-sounds',
    username: 'nova-sounds',
    displayName: 'Nova Sounds',
    avatar: '/api/placeholder/50/50',
    bio: 'Creating cosmic beats and stellar soundscapes',
    verified: true,
    isArtist: true,
    walletAddress: '0x123...456',
    followers: 2547,
    following: 89,
    totalNFTs: 8,
    totalTracks: 24,
    isPrivate: false,
    showEmail: false,
    showWallet: true,
    joinedAt: '2024-02-01',
    lastActive: '2024-03-15',
  },
  {
    id: 'beat-collector',
    username: 'beat-collector',
    displayName: 'Beat Collector',
    avatar: '/api/placeholder/50/50',
    bio: 'Passionate music NFT collector and curator',
    verified: false,
    isArtist: false,
    walletAddress: '0x789...012',
    followers: 842,
    following: 234,
    totalNFTs: 47,
    isPrivate: false,
    showEmail: false,
    showWallet: true,
    joinedAt: '2024-01-20',
    lastActive: '2024-03-14',
  },
  {
    id: 'rhythm-master',
    username: 'rhythm-master',
    displayName: 'Rhythm Master',
    avatar: '/api/placeholder/50/50',
    bio: 'Experimental producer pushing musical boundaries',
    verified: true,
    isArtist: true,
    walletAddress: '0x345...678',
    followers: 5672,
    following: 156,
    totalNFTs: 15,
    totalTracks: 31,
    isPrivate: false,
    showEmail: false,
    showWallet: true,
    joinedAt: '2024-01-10',
    lastActive: '2024-03-15',
  },
]

// Mock trending tracks
const trendingTracks = [
  {
    id: 'trend-1',
    title: 'Digital Horizons',
    artist: 'Future Bass',
    plays: 45290,
    image: '/api/placeholder/60/60',
  },
  {
    id: 'trend-2',
    title: 'Neon Nights',
    artist: 'Synthwave Producer',
    plays: 38740,
    image: '/api/placeholder/60/60',
  },
  {
    id: 'trend-3',
    title: 'Quantum Beats',
    artist: 'Electronic Wizard',
    plays: 32180,
    image: '/api/placeholder/60/60',
  },
]

// Mock activity feed
const mockFeedActivity: ActivityItemType[] = [
  {
    id: 'feed-1',
    userId: 'luna-vista',
    user: {
      id: 'luna-vista',
      username: 'luna-vista',
      displayName: 'Luna Vista',
      avatar: '/api/placeholder/50/50',
      verified: true,
    },
    type: 'upload',
    timestamp: '2024-03-15T14:30:00Z',
    nftId: 'new-track-1',
    trackTitle: 'Ethereal Dawn',
    trackArtist: 'Luna Vista',
    trackImage: '/api/placeholder/300/300',
    metadata: { genre: 'Ambient' },
  },
  {
    id: 'feed-2',
    userId: 'alex-cooper',
    user: {
      id: 'alex-cooper',
      username: 'alex-cooper',
      displayName: 'Alex Cooper',
      avatar: '/api/placeholder/50/50',
      verified: false,
    },
    type: 'purchase',
    timestamp: '2024-03-15T12:15:00Z',
    nftId: 'purchase-1',
    trackTitle: 'Cosmic Journey',
    trackArtist: 'Space Sounds',
    trackImage: '/api/placeholder/300/300',
    metadata: { price: 892.5, currency: 'USD' },
  },
  {
    id: 'feed-3',
    userId: 'rhythm-master',
    user: {
      id: 'rhythm-master',
      username: 'rhythm-master',
      displayName: 'Rhythm Master',
      avatar: '/api/placeholder/50/50',
      verified: true,
    },
    type: 'like',
    timestamp: '2024-03-15T11:45:00Z',
    nftId: 'liked-track-1',
    trackTitle: 'Midnight Echoes',
    trackArtist: 'Luna Vista',
    trackImage: '/api/placeholder/300/300',
  },
  {
    id: 'feed-4',
    userId: 'nova-sounds',
    user: {
      id: 'nova-sounds',
      username: 'nova-sounds',
      displayName: 'Nova Sounds',
      avatar: '/api/placeholder/50/50',
      verified: true,
    },
    type: 'follow',
    timestamp: '2024-03-15T10:20:00Z',
    targetUserId: 'luna-vista',
    targetUserName: 'Luna Vista',
  },
  {
    id: 'feed-5',
    userId: 'beat-collector',
    user: {
      id: 'beat-collector',
      username: 'beat-collector',
      displayName: 'Beat Collector',
      avatar: '/api/placeholder/50/50',
      verified: false,
    },
    type: 'comment',
    timestamp: '2024-03-15T09:30:00Z',
    nftId: 'commented-track-1',
    trackTitle: 'Synthwave Dreams',
    trackArtist: 'Neon Producer',
    trackImage: '/api/placeholder/300/300',
    commentText: 'This track takes me straight back to the 80s! Amazing production quality 🎵✨',
  },
]

export function SocialFeed() {
  const [activeTab, setActiveTab] = useState('following')
  const [feedActivity, setFeedActivity] = useState<ActivityItemType[]>(mockFeedActivity)
  const [postText, setPostText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [followingUsers, setFollowingUsers] = useState<Set<string>>(new Set())

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const handlePost = async () => {
    if (!postText.trim()) return

    setIsLoading(true)

    // Simulate posting
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Add new post to feed
    const newPost: ActivityItemType = {
      id: `post-${Date.now()}`,
      userId: 'current-user',
      user: {
        id: 'current-user',
        username: 'you',
        displayName: 'You',
        avatar: '/api/placeholder/50/50',
        verified: false,
      },
      type: 'share',
      timestamp: new Date().toISOString(),
      metadata: { platform: 'Pags Music' },
    }

    setFeedActivity((prev) => [newPost, ...prev])
    setPostText('')
    setIsLoading(false)
  }

  const handleFollowChange = (userId: string, isFollowing: boolean) => {
    setFollowingUsers((prev) => {
      const newSet = new Set(prev)
      if (isFollowing) {
        newSet.add(userId)
      } else {
        newSet.delete(userId)
      }
      return newSet
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/95 backdrop-blur-xl sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Social Feed</h1>
                <p className="text-sm text-muted-foreground">Discover what's happening in music</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Trending & Suggestions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <Link to="/artist/upload">
                    <Button className="w-full justify-start bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Upload Track
                    </Button>
                  </Link>
                  <Link to="/marketplace">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Explore Music
                    </Button>
                  </Link>
                  <Link to="/portfolio">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <Music className="w-4 h-4 mr-2" />
                      My Collection
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Trending Tracks */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  Trending Now
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {trendingTracks.map((track, index) => (
                  <div
                    key={track.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-6 text-center text-sm font-bold text-muted-foreground">
                      #{index + 1}
                    </div>
                    <img
                      src={track.image}
                      alt={track.title}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{track.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Headphones className="w-3 h-3" />
                      {(track.plays / 1000).toFixed(0)}k
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Suggested Users */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  Suggested for You
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {suggestedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3"
                  >
                    <Link
                      to="/profile/$userId"
                      params={{ userId: user.id }}
                    >
                      <Avatar className="w-10 h-10 hover:ring-2 hover:ring-primary/20 transition-all">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.displayName[0]}</AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <Link
                          to="/profile/$userId"
                          params={{ userId: user.id }}
                          className="font-medium text-sm hover:underline truncate"
                        >
                          {user.displayName}
                        </Link>
                        {user.verified && <Award className="w-3 h-3 text-blue-500" />}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{user.bio}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.followers.toLocaleString()} followers
                      </p>
                    </div>
                    <CompactFollowButton
                      userId={user.id}
                      isFollowing={followingUsers.has(user.id)}
                      onFollowChange={handleFollowChange}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="/api/placeholder/50/50" />
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-4">
                    <Textarea
                      placeholder="Share your thoughts about music, discoveries, or latest purchases..."
                      value={postText}
                      onChange={(e) => setPostText(e.target.value)}
                      className="min-h-[100px] resize-none"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                        >
                          <ImageIcon className="w-4 h-4 mr-2" />
                          Image
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                        >
                          <Music className="w-4 h-4 mr-2" />
                          Track
                        </Button>
                      </div>
                      <Button
                        onClick={handlePost}
                        disabled={!postText.trim() || isLoading}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feed Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger
                  value="following"
                  className="flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Following
                </TabsTrigger>
                <TabsTrigger
                  value="discover"
                  className="flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Discover
                </TabsTrigger>
                <TabsTrigger
                  value="trending"
                  className="flex items-center gap-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  Trending
                </TabsTrigger>
              </TabsList>

              {/* Following Feed */}
              <TabsContent
                value="following"
                className="space-y-6 mt-6"
              >
                <AnimatePresence>
                  {feedActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ActivityItem
                        activity={activity}
                        showInteractions={true}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>

                {feedActivity.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">No activity yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Follow some artists to see their activity in your feed
                    </p>
                    <Link to="/marketplace">
                      <Button>
                        <Search className="w-4 h-4 mr-2" />
                        Discover Artists
                      </Button>
                    </Link>
                  </div>
                )}
              </TabsContent>

              {/* Discover Feed */}
              <TabsContent
                value="discover"
                className="mt-6"
              >
                <div className="text-center py-12">
                  <Sparkles className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">Discover Feed Coming Soon</h3>
                  <p className="text-muted-foreground">
                    AI-powered recommendations based on your listening history
                  </p>
                </div>
              </TabsContent>

              {/* Trending Feed */}
              <TabsContent
                value="trending"
                className="mt-6"
              >
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">Trending Feed Coming Soon</h3>
                  <p className="text-muted-foreground">
                    Popular tracks and activities from the community
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar - Statistics */}
          <div className="lg:col-span-1 space-y-6">
            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Community Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Artists</span>
                    <span className="font-semibold">2,847</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Tracks</span>
                    <span className="font-semibold">12,593</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">NFTs Minted</span>
                    <span className="font-semibold">45,298</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Volume</span>
                    <span className="font-semibold text-green-500">$2.4M</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">PAGS Circulating</span>
                    <span className="font-semibold text-yellow-500">1.2M</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-500" />
                  Latest Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                  <div className="text-2xl">🎵</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">First Purchase</p>
                    <p className="text-xs text-muted-foreground">Bought your first NFT</p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-xs"
                  >
                    New!
                  </Badge>
                </div>

                <div className="flex items-center gap-3 p-2 rounded-lg">
                  <div className="text-2xl">🔥</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Streak Master</p>
                    <p className="text-xs text-muted-foreground">7 days of listening</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2 rounded-lg">
                  <div className="text-2xl">💎</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Platinum Collector</p>
                    <p className="text-xs text-muted-foreground">Own a platinum NFT</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
