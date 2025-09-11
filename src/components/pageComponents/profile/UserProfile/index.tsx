import { MusicNFTCard } from '@/src/components/nft/MusicNFTCard'
import { ActivityItem } from '@/src/components/social/ActivityItem'
import { FollowButton } from '@/src/components/social/FollowButton'
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/custom-tabs'
import { Separator } from '@/src/components/ui/separator'
import { type Track, useAudioPlayer } from '@/src/hooks/useAudioPlayer'
import { useUserProfile, useUserActivity } from '@/src/hooks/contracts/useUserProfile'
import { useEnhancedUserProfile } from '@/src/hooks/useUserProfile'
import type { MusicNFT } from '@/src/types/music-nft'
import type {
  Achievement,
  ActivityItem as ActivityItemType,
  User,
  UserStats,
} from '@/src/types/social'
import { Link, useParams } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import {
  Award,
  Calendar,
  Clock,
  DollarSign,
  Eye,
  Globe,
  Headphones,
  Heart,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Music,
  Play,
  Settings,
  Share2,
  Star,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from 'lucide-react'
import * as React from 'react'
import { useState } from 'react'

// Mock user data - would come from API
const getUserData = (userId: string): User => ({
  id: userId,
  username: `user${userId}`,
  displayName:
    userId === 'luna-vista' ? 'Luna Vista' : userId === 'alex-cooper' ? 'Alex Cooper' : 'Music Fan',
  avatar: '/api/placeholder/150/150',
  bio:
    userId === 'luna-vista'
      ? 'Electronic music producer creating ambient soundscapes and ethereal beats. Love connecting with fellow music enthusiasts! 🎵✨'
      : userId === 'alex-cooper'
        ? 'Collector of unique music NFTs. Always looking for the next breakthrough artist. Vibing to beats 24/7 🎧'
        : 'Music lover and NFT collector',
  location: 'Los Angeles, CA',
  website: userId === 'luna-vista' ? 'https://lunavista.music' : undefined,
  verified: userId === 'luna-vista',
  isArtist: userId === 'luna-vista',
  walletAddress: '0x742d35Cc6841C759D9AB7C1234567890abcdef1234',
  followers: userId === 'luna-vista' ? 12847 : userId === 'alex-cooper' ? 342 : 87,
  following: userId === 'luna-vista' ? 156 : userId === 'alex-cooper' ? 89 : 45,
  totalTracks: userId === 'luna-vista' ? 24 : undefined,
  totalNFTs: userId === 'luna-vista' ? 12 : userId === 'alex-cooper' ? 47 : 15,
  isPrivate: false,
  showEmail: false,
  showWallet: true,
  joinedAt: '2024-01-15',
  lastActive: '2024-03-15',
})

const getUserStats = (userId: string): UserStats => ({
  totalSpent: userId === 'alex-cooper' ? 4250.5 : 892.3,
  totalEarned: userId === 'luna-vista' ? 18439.5 : 0,
  nftsOwned: userId === 'alex-cooper' ? 47 : 15,
  nftsCreated: userId === 'luna-vista' ? 12 : 0,
  totalPlays: userId === 'luna-vista' ? 2847632 : 15420,
  blokEarned: userId === 'luna-vista' ? 24851 : 847,
  achievementCount: userId === 'luna-vista' ? 8 : userId === 'alex-cooper' ? 5 : 2,
})

// Mock user's NFTs
const getUserNFTs = (userId: string): MusicNFT[] => {
  if (userId === 'luna-vista') {
    // Artist's created NFTs
    return [
      {
        tokenId: 'user-nft-1',
        tier: 'platinum',
        metadata: {
          id: 'user-nft-1',
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
        owner: userId,
        isListed: true,
        streamingStats: { totalPlays: 125430, uniqueListeners: 8940, averageCompletion: 87 },
      },
    ]
  }

  // Collector's owned NFTs
  return [
    {
      tokenId: 'collected-1',
      tier: 'gold',
      metadata: {
        id: 'collected-1',
        title: 'Synthwave Dreams',
        artist: 'Neon Producer',
        image: '/api/placeholder/300/300',
        audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        duration: 198,
        edition: 23,
        maxSupply: 100,
        description: 'Retro-futuristic synthwave vibes',
        genre: 'Synthwave',
        releaseDate: '2024-02-10',
        pagsAmount: 750,
        dailyStreams: 8940,
        attributes: [],
      },
      price: '0.25',
      priceUSD: 445.75,
      earnings: { daily: 8.9, total: 445.6, apy: 12.3 },
      owner: userId,
      isListed: false,
      streamingStats: { totalPlays: 45680, uniqueListeners: 3240, averageCompletion: 92 },
    },
  ]
}

// Mock activity
const getUserActivity = (userId: string): ActivityItemType[] => [
  {
    id: 'activity-1',
    userId,
    user: getUserData(userId),
    type: userId === 'luna-vista' ? 'upload' : 'purchase',
    timestamp: '2024-03-15T10:30:00Z',
    nftId: 'nft-123',
    trackTitle: userId === 'luna-vista' ? 'New Ambient Track' : 'Synthwave Dreams',
    trackArtist: userId === 'luna-vista' ? 'Luna Vista' : 'Neon Producer',
    trackImage: '/api/placeholder/300/300',
    metadata: userId === 'luna-vista' ? { genre: 'Ambient' } : { price: 445.75, currency: 'USD' },
  },
  {
    id: 'activity-2',
    userId,
    user: getUserData(userId),
    type: 'like',
    timestamp: '2024-03-14T15:45:00Z',
    nftId: 'nft-456',
    trackTitle: 'Cosmic Journey',
    trackArtist: 'Space Sounds',
    trackImage: '/api/placeholder/300/300',
  },
]

// Mock achievements
const getUserAchievements = (userId: string): Achievement[] => {
  const baseAchievements = [
    {
      id: 'first-nft',
      name: 'First NFT',
      description: 'Purchased your first music NFT',
      icon: '🎵',
      rarity: 'common' as const,
      unlockedAt: '2024-01-20T00:00:00Z',
    },
    {
      id: 'music-lover',
      name: 'Music Lover',
      description: 'Listened to 100 hours of music',
      icon: '❤️',
      rarity: 'rare' as const,
      unlockedAt: '2024-02-15T00:00:00Z',
    },
  ]

  if (userId === 'luna-vista') {
    return [
      ...baseAchievements,
      {
        id: 'verified-artist',
        name: 'Verified Artist',
        description: 'Became a verified music creator',
        icon: '✅',
        rarity: 'epic' as const,
        unlockedAt: '2024-01-15T00:00:00Z',
      },
      {
        id: 'top-creator',
        name: 'Top Creator',
        description: 'Earned over $10k from music NFTs',
        icon: '👑',
        rarity: 'legendary' as const,
        unlockedAt: '2024-03-01T00:00:00Z',
      },
    ]
  }

  return baseAchievements
}

export function UserProfile() {
  const { userId } = useParams({ from: '/profile/$userId' })
  const [isFollowing, setIsFollowing] = useState(false)
  const [activeTab, setActiveTab] = useState('nfts')
  const { play, pause, currentTrack, isPlaying } = useAudioPlayer()

  // Get enhanced user profile (database + contract data)
  const {
    profile: enhancedProfile,
    isLoading: enhancedLoading,
    dbProfile,
    hasContractData
  } = useEnhancedUserProfile(userId)

  // Get legacy contract data for compatibility  
  const { 
    userProfile: contractProfile, 
    isLoading: contractLoading, 
    benefits, 
    collaboratorRoyalties, 
    ownedTokens 
  } = useUserProfile(userId)
  
  const { activities } = useUserActivity(userId)

  console.log('👤 User Profile Data:', { 
    enhancedProfile, 
    contractProfile, 
    dbProfile, 
    benefits, 
    ownedTokens, 
    userId,
    hasContractData 
  })

  // Show loading state
  if (enhancedLoading || contractLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-lg">Loading profile...</p>
          <p className="text-sm text-muted-foreground">Fetching database and contract data</p>
        </div>
      </div>
    )
  }

  // Show error state if no profile found
  if (!enhancedProfile && !contractProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The user profile you're looking for doesn't exist or hasn't been set up yet.
          </p>
          <Link to="/marketplace">
            <Button>Explore Marketplace</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Use enhanced profile when available, fallback to contract data, then mock data
  const user = enhancedProfile || contractProfile || getUserData(userId)
  const userStats = enhancedProfile?.contractStats ? {
    totalSpent: enhancedProfile.contractStats.totalSpent,
    totalEarned: enhancedProfile.contractStats.collaboratorRoyalties,
    nftsOwned: enhancedProfile.contractStats.totalNFTs,
    nftsCreated: enhancedProfile.isArtist ? (enhancedProfile.totalTracks || 0) : 0,
    totalPlays: 0, // TODO: Get from contract
    blokEarned: enhancedProfile.contractStats.pagsBalance,
    achievementCount: 0, // TODO: Implement achievements
  } : (contractProfile?.stats || getUserStats(userId))
  
  const userNFTs = enhancedProfile?.ownedNFTs || contractProfile?.ownedNFTs || getUserNFTs(userId)
  const userActivity = activities || []
  const userAchievements = enhancedProfile ? [] : getUserAchievements(userId) // TODO: Implement real achievements

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

  const handlePurchase = (tokenId: string) => {
    console.log('Purchase NFT:', tokenId)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Cover/Header Section */}
      <div className="relative h-48 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="container mx-auto">
            <div className="flex items-end gap-6">
              {/* Avatar */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative"
              >
                <Avatar className="w-24 h-24 border-4 border-background shadow-xl">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-2xl">{user.displayName[0]}</AvatarFallback>
                </Avatar>
                {user.verified && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center border-2 border-background">
                    <Award className="w-3 h-3 text-white" />
                  </div>
                )}
              </motion.div>

              {/* Basic Info */}
              <div className="flex-1">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-white">{user.displayName}</h1>
                    {user.verified && (
                      <Badge className="bg-accent/20 text-accent-foreground border-accent/30">
                        {user.isArtist ? 'Verified Artist' : 'Verified'}
                      </Badge>
                    )}
                  </div>
                  <p className="text-white/80 mb-2">@{user.username}</p>
                  <div className="flex items-center gap-4 text-sm text-white/70">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{user.followers.toLocaleString()} followers</span>
                    </div>
                    <span>·</span>
                    <div className="flex items-center gap-1">
                      <span>{user.following.toLocaleString()} following</span>
                    </div>
                    <span>·</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {new Date(user.joinedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Action Buttons */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex gap-3"
              >
                <FollowButton
                  userId={user.id}
                  isFollowing={isFollowing}
                  onFollowChange={(_, following) => setIsFollowing(following)}
                />
                <Button
                  variant="outline"
                  size="sm"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Bio & Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Bio */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">About</h3>
                <p className="text-sm text-muted-foreground mb-4">{user.bio}</p>

                <div className="space-y-2 text-sm">
                  {user.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  {user.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <a
                        href={user.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline truncate"
                      >
                        {user.website.replace('https://', '')}
                      </a>
                    </div>
                  )}
                  {user.showWallet && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                        {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">NFTs Owned</span>
                    <span className="font-semibold">{userStats.nftsOwned}</span>
                  </div>
                  {user.isArtist && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">NFTs Created</span>
                      <span className="font-semibold">{userStats.nftsCreated}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Plays</span>
                    <span className="font-semibold">{userStats.totalPlays.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">PAGS Earned</span>
                    <span className="font-semibold text-accent">{userStats.blokEarned}</span>
                  </div>
                  {user.isArtist && (
                    <div className="flex items-center justify-between col-span-2">
                      <span className="text-muted-foreground">Total Earned</span>
                      <span className="font-semibold text-primary">
                        ${userStats.totalEarned.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {!user.isArtist && (
                    <div className="flex items-center justify-between col-span-2">
                      <span className="text-muted-foreground">Total Spent</span>
                      <span className="font-semibold">
                        ${userStats.totalSpent.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-accent" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {userAchievements.slice(0, 4).map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`
                        p-3 rounded-lg border text-center
                        ${
                          achievement.rarity === 'legendary'
                            ? 'bg-gradient-to-br from-accent/10 to-primary/10 border-accent/30'
                            : achievement.rarity === 'epic'
                              ? 'bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30'
                              : achievement.rarity === 'rare'
                                ? 'bg-gradient-to-br from-accent/10 to-primary/10 border-accent/30'
                                : 'bg-muted/50 border-border'
                        }
                      `}
                    >
                      <div className="text-lg mb-1">{achievement.icon}</div>
                      <div className="text-xs font-medium">{achievement.name}</div>
                    </div>
                  ))}
                </div>
                {userAchievements.length > 4 && (
                  <div className="mt-3 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                    >
                      View All ({userAchievements.length})
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Tabs */}
          <div className="lg:col-span-3">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger
                  value="nfts"
                  className="flex items-center gap-2"
                >
                  <Music className="w-4 h-4" />
                  {user.isArtist ? 'Created' : 'Collection'} ({userNFTs.length})
                </TabsTrigger>
                <TabsTrigger
                  value="activity"
                  className="flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  Activity
                </TabsTrigger>
                <TabsTrigger
                  value="playlists"
                  className="flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Playlists
                </TabsTrigger>
                <TabsTrigger
                  value="followers"
                  className="flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Social
                </TabsTrigger>
              </TabsList>

              {/* NFTs Tab */}
              <TabsContent
                value="nfts"
                className="mt-6"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                      {user.isArtist ? 'Created NFTs' : 'NFT Collection'}
                    </h2>
                    <Badge variant="secondary">{userNFTs.length} items</Badge>
                  </div>

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
                          onPurchase={handlePurchase}
                        />
                      </motion.div>
                    ))}
                  </div>

                  {userNFTs.length === 0 && (
                    <div className="text-center py-12">
                      <Music className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-semibold mb-2">
                        {user.isArtist ? 'No tracks created yet' : 'No NFTs collected yet'}
                      </h3>
                      <p className="text-muted-foreground">
                        {user.isArtist
                          ? 'Start creating music NFTs to build your collection'
                          : 'Explore the marketplace to start collecting'}
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent
                value="activity"
                className="mt-6"
              >
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Recent Activity</h2>

                  {userActivity.map((activity) => (
                    <ActivityItem
                      key={activity.id}
                      activity={activity}
                      showInteractions={false}
                    />
                  ))}

                  {userActivity.length === 0 && (
                    <div className="text-center py-12">
                      <Clock className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-semibold mb-2">No recent activity</h3>
                      <p className="text-muted-foreground">
                        Activity will appear here as the user interacts with the platform
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Playlists Tab */}
              <TabsContent
                value="playlists"
                className="mt-6"
              >
                <div className="text-center py-12">
                  <Play className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">Playlists Coming Soon</h3>
                  <p className="text-muted-foreground">
                    Create and share curated playlists of your favorite tracks
                  </p>
                </div>
              </TabsContent>

              {/* Followers Tab */}
              <TabsContent
                value="followers"
                className="mt-6"
              >
                <div className="text-center py-12">
                  <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">Social Features Coming Soon</h3>
                  <p className="text-muted-foreground">
                    View followers, following, and social connections
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
