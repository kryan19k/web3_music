import * as React from 'react'
import { useMemo, useState, useEffect } from 'react'
import { Waveform } from '@/src/components/music/Waveform'
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Progress } from '@/src/components/ui/progress'
import { Separator } from '@/src/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/custom-tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog'
import { type Track, useAudioPlayer } from '@/src/hooks/useAudioPlayer'
import { useMusicNFTMint, useMusicNFTMarketplaceData, Tier } from '@/src/hooks/contracts/useMusicNFT'
import { useArtistCollections } from '@/src/hooks/contracts/useArtistCollections'
import { useWeb3Status } from '@/src/hooks/useWeb3Status'
import type { MusicNFT } from '@/src/types/music-nft'
import { Link, useParams } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  TrendingUp,
  Users,
  Headphones,
  Play,
  Pause,
  Volume2,
  Heart,
  Share2,
  Sparkles,
  DollarSign,
  Clock,
  Star,
  Award,
  Zap,
  Shield,
  CheckCircle,
  AlertTriangle,
  Coins,
  Wallet,
  Loader2,
  ExternalLink,
  Music,
  BarChart3,
  Target,
  TrendingDown,
  ChevronUp,
  ChevronDown,
  Lock,
  Unlock,
  Globe,
  MessageSquare,
  Flame,
  LineChart,
  PieChart,
} from 'lucide-react'
import { toast } from 'sonner'

// Enhanced mock data with more detailed information
const mockNFTData: Record<string, MusicNFT & {
  marketAnalytics: {
    priceHistory: Array<{ date: string; price: number }>
    volumeHistory: Array<{ date: string; volume: number }>
    holders: number
    trades24h: number
    avgHoldTime: number
    topBuyer: string
    roi90d: number
  }
  earningsProjection: {
    conservative: number
    optimistic: number
    historical: Array<{ month: string; earnings: number }>
  }
  riskAnalysis: {
    volatility: 'low' | 'medium' | 'high'
    liquidity: number
    marketCap: number
    riskScore: number
  }
  benefits: Array<{
    title: string
    description: string
    icon: string
    unlocked: boolean
  }>
  exclusiveContent: Array<{
    title: string
    type: 'audio' | 'video' | 'text' | 'image'
    description: string
    locked: boolean
  }>
}> = {
  '1': {
    tokenId: '1',
    tier: 'platinum',
    metadata: {
      id: '1',
      title: 'Midnight Echoes',
      artist: 'Luna Vista',
      image: '/song_cover/midnight.png',
      audioUrl: 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav',
      duration: 245,
      edition: 3,
      maxSupply: 10,
      description: 'An ethereal journey through ambient soundscapes that captures the essence of late-night introspection. Featuring layered synthesizers, atmospheric strings, and subtle field recordings that transport listeners to a world between dreams and reality. This platinum edition includes exclusive stems, remix rights, and access to the original studio session.',
      genre: 'Ambient Electronic',
      releaseDate: '2024-01-15',
      blokAmount: 2500,
      dailyStreams: 15420,
      attributes: [
        { trait_type: 'Mood', value: 'Ethereal' },
        { trait_type: 'Tempo', value: '65 BPM' },
        { trait_type: 'Key', value: 'D Minor' },
        { trait_type: 'Instruments', value: 'Synthesizer, Strings, Pads' },
        { trait_type: 'Vocals', value: 'Instrumental' },
        { trait_type: 'Production Style', value: 'Atmospheric' },
        { trait_type: 'Master Quality', value: '24-bit/96kHz' },
        { trait_type: 'Exclusive Rights', value: 'Remix Permitted' },
      ],
    },
    price: '0.5',
    priceUSD: 1247.50,
    earnings: {
      daily: 34.20,
      total: 2890.45,
      apy: 22.5,
    },
    owner: '0x742d35Cc6676C4532CAce807A5c2A5c27a5c2',
    isListed: true,
    streamingStats: {
      totalPlays: 125430,
      uniqueListeners: 8940,
      averageCompletion: 87,
    },
    marketAnalytics: {
      priceHistory: [
        { date: '2024-01-01', price: 1100 },
        { date: '2024-01-07', price: 1150 },
        { date: '2024-01-14', price: 1220 },
        { date: '2024-01-21', price: 1247.50 },
      ],
      volumeHistory: [
        { date: '2024-01-01', volume: 15000 },
        { date: '2024-01-07', volume: 23000 },
        { date: '2024-01-14', volume: 31000 },
        { date: '2024-01-21', volume: 28500 },
      ],
      holders: 147,
      trades24h: 8,
      avgHoldTime: 45,
      topBuyer: '0x1234...5678',
      roi90d: 18.2,
    },
    earningsProjection: {
      conservative: 28.50,
      optimistic: 42.80,
      historical: [
        { month: 'Oct 2023', earnings: 24.50 },
        { month: 'Nov 2023', earnings: 28.20 },
        { month: 'Dec 2023', earnings: 31.80 },
        { month: 'Jan 2024', earnings: 34.20 },
      ],
    },
    riskAnalysis: {
      volatility: 'low',
      liquidity: 0.85,
      marketCap: 1247500,
      riskScore: 3.2,
    },
    benefits: [
      {
        title: 'Exclusive Studio Stems',
        description: 'Access to individual instrument tracks for remixing',
        icon: 'music',
        unlocked: true,
      },
      {
        title: 'Virtual Meet & Greet',
        description: 'Monthly virtual session with Luna Vista',
        icon: 'video',
        unlocked: true,
      },
      {
        title: 'Physical Vinyl Edition',
        description: 'Limited edition vinyl shipped to your address',
        icon: 'award',
        unlocked: true,
      },
      {
        title: 'Producer Credits',
        description: 'Listed as executive producer on future releases',
        icon: 'star',
        unlocked: true,
      },
    ],
    exclusiveContent: [
      {
        title: 'Behind the Scenes Documentary',
        type: 'video',
        description: '45-minute documentary about the creation process',
        locked: false,
      },
      {
        title: 'Remix Contest Stems',
        type: 'audio',
        description: 'High-quality stems for official remix competitions',
        locked: false,
      },
      {
        title: 'Artist Voice Notes',
        type: 'audio',
        description: 'Personal voice memos from Luna Vista about the track',
        locked: false,
      },
    ],
  },
}

const tierConfigs = {
  bronze: {
    name: 'Bronze',
    color: 'from-muted to-muted',
    textColor: 'text-muted-foreground',
    borderColor: 'border-border',
    bgColor: 'bg-muted/10',
    glow: 'shadow-muted/25',
    benefits: ['Basic NFT ownership', 'Monthly royalties', 'Community access'],
    apyRange: '6-8%',
    maxSupply: 1000,
    royaltyShare: '0.5%',
  },
  silver: {
    name: 'Silver',
    color: 'from-gray-400 to-gray-300',
    textColor: 'text-gray-300',
    borderColor: 'border-gray-500/50',
    bgColor: 'bg-gray-500/10',
    glow: 'shadow-gray-500/25',
    benefits: ['Premium ownership', 'Higher royalties', 'VIP community', 'Exclusive content'],
    apyRange: '10-12%',
    maxSupply: 500,
    royaltyShare: '1.2%',
  },
  gold: {
    name: 'Gold',
    color: 'from-accent to-accent',
    textColor: 'text-accent-foreground',
    borderColor: 'border-accent/50',
    bgColor: 'bg-accent/10',
    glow: 'hover-glow-accent',
    benefits: ['Gold ownership', 'Premium royalties', 'Artist meetups', 'Governance rights'],
    apyRange: '15-18%',
    maxSupply: 100,
    royaltyShare: '2.5%',
  },
  platinum: {
    name: 'Platinum',
    color: 'from-primary to-primary',
    textColor: 'text-primary-foreground',
    borderColor: 'border-primary/50',
    bgColor: 'bg-primary/10',
    glow: 'hover-glow-primary',
    benefits: ['Ultimate ownership', 'Maximum royalties', 'All perks', 'Revenue sharing'],
    apyRange: '20-25%',
    maxSupply: 10,
    royaltyShare: '5.0%',
  },
}

type PurchaseStep = 'analyze' | 'confirm' | 'processing' | 'success' | 'error'

export function NFTPurchasePage() {
  const params = useParams({ from: '/marketplace/purchase/$nftId' })
  const nftId = params.nftId
  const [selectedTab, setSelectedTab] = useState('overview')
  const [isLiked, setIsLiked] = useState(false)
  const [purchaseStep, setPurchaseStep] = useState<PurchaseStep>('analyze')
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [showAdvancedAnalytics, setShowAdvancedAnalytics] = useState(false)

  const { play, pause, currentTrack, isPlaying } = useAudioPlayer()
  const { isWalletConnected, address } = useWeb3Status()
  const { mint, isLoading: isMinting } = useMusicNFTMint()
  const { tiers, isLoading: isLoadingTiers } = useMusicNFTMarketplaceData()

  // Get real NFT data from contracts
  const { collections: allNFTs, isLoading: nftsLoading } = useArtistCollections()
  
  // Find the specific NFT by tokenId
  const nft = React.useMemo(() => {
    console.log('🔍 [NFT_PURCHASE] Looking for NFT:', { nftId, allNFTsLength: allNFTs?.length })
    if (!allNFTs || !nftId) return null
    
    const foundNFT = allNFTs.find(nft => nft.tokenId === nftId)
    console.log('🔍 [NFT_PURCHASE] Found NFT:', foundNFT ? 'YES' : 'NO', foundNFT?.tokenId)
    console.log('🔍 [NFT_PURCHASE] Available tokenIds:', allNFTs.map(nft => nft.tokenId))
    
    // If real NFT found, enhance it with mock analytics data for demo purposes
    if (foundNFT) {
      return {
        ...foundNFT,
        marketAnalytics: mockNFTData['1']?.marketAnalytics || {},
        earningsProjection: mockNFTData['1']?.earningsProjection || {},
        riskAnalysis: mockNFTData['1']?.riskAnalysis || {},
        benefits: mockNFTData['1']?.benefits || [],
        exclusiveContent: mockNFTData['1']?.exclusiveContent || []
      }
    }
    
    return null
  }, [allNFTs, nftId])

  // Memoize current track check
  const isCurrentlyPlaying = useMemo(
    () => currentTrack?.id === nftId && isPlaying,
    [currentTrack?.id, nftId, isPlaying],
  )

  // Auto-scroll to purchase on wallet connect
  useEffect(() => {
    if (isWalletConnected && !address) {
      // Scroll to purchase section
      document.getElementById('purchase-section')?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [isWalletConnected, address])

  // Show loading state
  if (nftsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-lg">Loading track...</p>
        </div>
      </div>
    )
  }

  if (!nft) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Track Not Found</h1>
          <p className="text-muted-foreground">The requested track could not be found or may have been removed.</p>
          <Link to="/marketplace" className="inline-block mt-4">
            <Button>Back to Marketplace</Button>
          </Link>
        </div>
      </div>
    )
  }

  const tierConfig = tierConfigs[nft.tier as keyof typeof tierConfigs]
  const completionPercentage = (nft.metadata.edition / nft.metadata.maxSupply) * 100
  const remainingSupply = nft.metadata.maxSupply - nft.metadata.edition

  const handlePlay = () => {
    const track: Track = {
      id: nft.tokenId,
      title: nft.metadata.title,
      artist: nft.metadata.artist,
      artwork: nft.metadata.image,
      audioUrl: nft.metadata.audioUrl,
      duration: nft.metadata.duration,
      pagsPerStream: nft.metadata.blokAmount / 1000,
    }
    play(track)
  }

  const handlePause = () => {
    pause()
  }

  const handlePurchase = async () => {
    if (!isWalletConnected) {
      toast.error('Please connect your wallet first')
      return
    }

    try {
      setPurchaseStep('processing')
      setIsPurchaseModalOpen(true)

      // Convert tier to enum value
      let tierEnum: Tier
      switch (nft.tier) {
        case 'bronze':
          tierEnum = Tier.BRONZE
          break
        case 'silver':
          tierEnum = Tier.SILVER
          break
        case 'gold':
          tierEnum = Tier.GOLD
          break
        case 'platinum':
          tierEnum = Tier.PLATINUM
          break
        default:
          tierEnum = Tier.BRONZE
      }

      await mint({
        tier: tierEnum,
        quantity,
      })

      setPurchaseStep('success')
      toast.success('NFT purchased successfully!')
    } catch (error) {
      setPurchaseStep('error')
      toast.error('Purchase failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value)
  }

  const riskColor = nft.riskAnalysis.volatility === 'low' ? 'text-green-500' : 
                   nft.riskAnalysis.volatility === 'medium' ? 'text-yellow-500' : 'text-red-500'

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="relative border-b border-border/50 bg-background/95 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/marketplace">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Marketplace
              </Button>
            </Link>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <Badge className={`px-3 py-1 bg-gradient-to-r ${tierConfig.color} text-white font-semibold`}>
                  {tierConfig.name.toUpperCase()}
                </Badge>
                <Badge variant="outline" className="bg-black/20">
                  #{nft.metadata.edition}/{nft.metadata.maxSupply}
                </Badge>
              </div>
              <h1 className="text-2xl font-bold mt-2">{nft.metadata.title}</h1>
              <p className="text-muted-foreground">by {nft.metadata.artist}</p>
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
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
            </div>
          </div>

          {/* Key Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'Price', value: formatCurrency(nft.priceUSD), icon: DollarSign, color: 'text-green-500' },
              { label: 'Daily Earnings', value: `$${nft.earnings.daily}`, icon: TrendingUp, color: 'text-blue-500' },
              { label: 'APY', value: `${nft.earnings.apy}%`, icon: BarChart3, color: 'text-purple-500' },
              { label: '90d ROI', value: `${nft.marketAnalytics.roi90d}%`, icon: TrendingUp, color: 'text-green-500' },
              { label: 'Risk Score', value: `${nft.riskAnalysis.riskScore}/10`, icon: Shield, color: riskColor },
            ].map((metric) => (
              <Card key={metric.label} className="p-4 bg-card/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-1">
                  <metric.icon className={`w-4 h-4 ${metric.color}`} />
                  <span className="text-xs text-muted-foreground">{metric.label}</span>
                </div>
                <div className={`text-lg font-bold ${metric.color}`}>{metric.value}</div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Media & Analysis */}
          <div className="xl:col-span-2 space-y-6">
            {/* Album Art & Waveform */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-2 gap-6"
            >
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-square relative group">
                    <img
                      src={nft.metadata.image}
                      alt={nft.metadata.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button
                          size="lg"
                          className="w-20 h-20 rounded-full bg-white/90 hover:bg-white text-black hover:scale-110 transition-all"
                          onClick={isCurrentlyPlaying ? handlePause : handlePlay}
                        >
                          {isCurrentlyPlaying ? <Volume2 className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                        </Button>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-black/60 backdrop-blur-sm text-white border-white/20">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Rare
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Audio Preview</h3>
                    <Waveform
                      audioUrl={nft.metadata.audioUrl}
                      isPlaying={isCurrentlyPlaying}
                      onPlay={handlePlay}
                      onPause={handlePause}
                      height={120}
                      waveColor="#4a5568"
                      progressColor="#8b5cf6"
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Duration</span>
                      <span>{formatTime(nft.metadata.duration)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Genre</span>
                      <span>{nft.metadata.genre}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Quality</span>
                      <span className="text-green-500">24-bit/96kHz</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Advanced Analytics Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="benefits">Benefits</TabsTrigger>
                  <TabsTrigger value="risks">Risk Analysis</TabsTrigger>
                  <TabsTrigger value="community">Community</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Music className="w-5 h-5" />
                        Track Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        {nft.metadata.description}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                          { label: 'Total Plays', value: nft.streamingStats.totalPlays.toLocaleString(), icon: Headphones },
                          { label: 'Unique Listeners', value: nft.streamingStats.uniqueListeners.toLocaleString(), icon: Users },
                          { label: 'Completion Rate', value: `${nft.streamingStats.averageCompletion}%`, icon: Target },
                          { label: 'Daily Streams', value: nft.metadata.dailyStreams.toLocaleString(), icon: TrendingUp },
                        ].map((stat) => (
                          <div key={stat.label} className="text-center p-4 bg-muted/30 rounded-lg">
                            <div className="flex items-center justify-center mb-2">
                              <stat.icon className="w-6 h-6 text-primary" />
                            </div>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <div className="text-xs text-muted-foreground">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Track Attributes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {nft.metadata.attributes.map((attr) => (
                          <div key={`${attr.trait_type}-${attr.value}`} className="p-3 bg-muted/50 rounded-lg">
                            <div className="text-xs text-muted-foreground">{attr.trait_type}</div>
                            <div className="font-semibold">{attr.value}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <LineChart className="w-5 h-5" />
                          Market Analytics
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowAdvancedAnalytics(!showAdvancedAnalytics)}
                        >
                          {showAdvancedAnalytics ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {[
                          { label: 'Holders', value: nft.marketAnalytics.holders, icon: Users, trend: '+12%' },
                          { label: '24h Trades', value: nft.marketAnalytics.trades24h, icon: TrendingUp, trend: '+5%' },
                          { label: 'Avg Hold Time', value: `${nft.marketAnalytics.avgHoldTime}d`, icon: Clock, trend: '+8d' },
                          { label: 'Market Cap', value: formatCurrency(nft.riskAnalysis.marketCap), icon: PieChart, trend: '+15%' },
                        ].map((metric) => (
                          <div key={metric.label} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <metric.icon className="w-4 h-4 text-muted-foreground" />
                              <span className="text-xs text-green-500">{metric.trend}</span>
                            </div>
                            <div className="font-bold">{metric.value}</div>
                            <div className="text-xs text-muted-foreground">{metric.label}</div>
                          </div>
                        ))}
                      </div>

                      <AnimatePresence>
                        {showAdvancedAnalytics && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-4"
                          >
                            <Separator />
                            <div>
                              <h4 className="font-semibold mb-3">Earnings Projection</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-green-500/10 border-green-500/20 border rounded-lg">
                                  <div className="text-green-500 font-semibold">Conservative</div>
                                  <div className="text-2xl font-bold">${nft.earningsProjection.conservative}/day</div>
                                  <div className="text-sm text-muted-foreground">Based on historical minimums</div>
                                </div>
                                <div className="p-4 bg-blue-500/10 border-blue-500/20 border rounded-lg">
                                  <div className="text-blue-500 font-semibold">Optimistic</div>
                                  <div className="text-2xl font-bold">${nft.earningsProjection.optimistic}/day</div>
                                  <div className="text-sm text-muted-foreground">Based on growth trends</div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="benefits" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        Tier Benefits
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {nft.benefits.map((benefit) => (
                          <div key={benefit.title} className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                            <div className={`p-2 rounded-full ${benefit.unlocked ? 'bg-green-500/20' : 'bg-gray-500/20'}`}>
                              {benefit.unlocked ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <Lock className="w-4 h-4 text-gray-500" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">{benefit.title}</h4>
                              <p className="text-sm text-muted-foreground">{benefit.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Exclusive Content</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {nft.exclusiveContent.map((content) => (
                          <div key={content.title} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-full ${content.locked ? 'bg-gray-500/20' : 'bg-primary/20'}`}>
                                {content.locked ? (
                                  <Lock className="w-4 h-4 text-gray-500" />
                                ) : (
                                  <Unlock className="w-4 h-4 text-primary" />
                                )}
                              </div>
                              <div>
                                <div className="font-medium">{content.title}</div>
                                <div className="text-sm text-muted-foreground">{content.description}</div>
                              </div>
                            </div>
                            <Badge variant={content.locked ? 'secondary' : 'default'}>
                              {content.type}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="risks" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Risk Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Overall Risk Score</span>
                            <span className={`font-bold ${riskColor}`}>{nft.riskAnalysis.riskScore}/10</span>
                          </div>
                          <Progress value={nft.riskAnalysis.riskScore * 10} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">Lower is better</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-4 border rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <TrendingDown className="w-4 h-4" />
                              <span className="font-medium">Volatility</span>
                            </div>
                            <Badge variant={nft.riskAnalysis.volatility === 'low' ? 'default' : nft.riskAnalysis.volatility === 'medium' ? 'secondary' : 'destructive'}>
                              {nft.riskAnalysis.volatility.toUpperCase()}
                            </Badge>
                          </div>

                          <div className="p-4 border rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <BarChart3 className="w-4 h-4" />
                              <span className="font-medium">Liquidity</span>
                            </div>
                            <div className="text-lg font-bold">{(nft.riskAnalysis.liquidity * 100).toFixed(0)}%</div>
                          </div>

                          <div className="p-4 border rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Globe className="w-4 h-4" />
                              <span className="font-medium">Market Cap</span>
                            </div>
                            <div className="text-lg font-bold">{formatCurrency(nft.riskAnalysis.marketCap)}</div>
                          </div>
                        </div>

                        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                            <div>
                              <h4 className="font-semibold text-yellow-500">Investment Notice</h4>
                              <p className="text-sm text-muted-foreground">
                                All investments carry risk. Past performance does not guarantee future results. 
                                Only invest what you can afford to lose.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="community" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        Community Sentiment
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="font-semibold mb-2">Community Features Coming Soon</h3>
                        <p className="text-sm text-muted-foreground">
                          Connect with other holders, share insights, and participate in governance.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          {/* Right Column - Purchase & Actions */}
          <div className="space-y-6" id="purchase-section">
            {/* Purchase Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="top-24"
            >
              <Card className={`border-2 ${tierConfig.borderColor} bg-gradient-to-br ${tierConfig.bgColor} backdrop-blur-sm`}>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <DollarSign className="w-8 h-8 text-green-500" />
                      <div className="text-4xl font-bold">${nft.priceUSD.toLocaleString()}</div>
                    </div>
                    <div className="text-muted-foreground">{nft.price} ETH</div>
                    <Badge className={`mt-2 bg-gradient-to-r ${tierConfig.color} text-white`}>
                      {tierConfig.name} Edition
                    </Badge>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="p-3 bg-background/50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Supply Progress</span>
                        <span className="text-sm font-medium">{remainingSupply} remaining</span>
                      </div>
                      <Progress value={completionPercentage} className="h-2 mt-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-background/50 rounded-lg">
                        <div className="text-green-500 font-bold">${nft.earnings.daily}</div>
                        <div className="text-xs text-muted-foreground">Daily Earnings</div>
                      </div>
                      <div className="text-center p-3 bg-background/50 rounded-lg">
                        <div className="text-blue-500 font-bold">{nft.earnings.apy}%</div>
                        <div className="text-xs text-muted-foreground">APY</div>
                      </div>
                    </div>

                    <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Coins className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium">BLOKs Rewards</span>
                      </div>
                      <div className="text-lg font-bold">{nft.metadata.pagsAmount} BLOK</div>
                      <div className="text-xs text-muted-foreground">Earned per purchase</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {!isWalletConnected ? (
                      <Button className="w-full btn-primary">
                        <Wallet className="w-4 h-4 mr-2" />
                        Connect Wallet to Purchase
                      </Button>
                    ) : (
                      <Button
                        className="w-full btn-primary"
                        onClick={handlePurchase}
                        disabled={!nft.isListed || isMinting}
                      >
                        {isMinting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 mr-2" />
                            {nft.isListed ? 'Purchase NFT' : 'Not Available'}
                          </>
                        )}
                      </Button>
                    )}

                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">
                        + Network fees (~$12.50) + Platform fee (2.5%)
                      </div>
                      <div className="text-sm font-semibold mt-1">
                        Total: ~${(nft.priceUSD + 12.5 + nft.priceUSD * 0.025).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Current Owner</span>
                      <Link to={`/profile/${nft.owner}`} className="font-mono hover:text-primary transition-colors">
                        {nft.owner.slice(0, 6)}...{nft.owner.slice(-4)}
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
                    Artist Spotlight
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
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs text-muted-foreground">4.8/5 from 1.2k reviews</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    Ambient and atmospheric music producer with over 50M streams worldwide. 
                    Known for ethereal soundscapes and innovative production techniques.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 text-center mb-4">
                    <div className="p-2 bg-muted/30 rounded">
                      <div className="font-bold">50M+</div>
                      <div className="text-xs text-muted-foreground">Total Streams</div>
                    </div>
                    <div className="p-2 bg-muted/30 rounded">
                      <div className="font-bold">1.2M</div>
                      <div className="text-xs text-muted-foreground">Monthly Listeners</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Heart className="w-4 h-4 mr-1" />
                      Follow
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flame className="w-5 h-5" />
                    Market Pulse
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: 'Hotness Score', value: '🔥 Hot', color: 'text-orange-500' },
                      { label: 'Trending Rank', value: '#12', color: 'text-green-500' },
                      { label: 'Social Buzz', value: '87%', color: 'text-blue-500' },
                      { label: 'Whale Activity', value: 'High', color: 'text-purple-500' },
                    ].map((stat) => (
                      <div key={stat.label} className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{stat.label}</span>
                        <span className={`font-semibold ${stat.color}`}>{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Purchase Processing Modal */}
      <Dialog open={isPurchaseModalOpen} onOpenChange={setIsPurchaseModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Purchase NFT</DialogTitle>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {purchaseStep === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-4"
              >
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
                <div>
                  <h3 className="font-semibold">Processing Transaction</h3>
                  <p className="text-sm text-muted-foreground">
                    Please confirm the transaction in your wallet...
                  </p>
                </div>
              </motion.div>
            )}

            {purchaseStep === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-4"
              >
                <div className="w-16 h-16 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-500">Purchase Successful!</h3>
                  <p className="text-sm text-muted-foreground">
                    Congratulations! You now own this music NFT.
                  </p>
                </div>
                <Button className="w-full" onClick={() => setIsPurchaseModalOpen(false)}>
                  View in Portfolio
                </Button>
              </motion.div>
            )}

            {purchaseStep === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-4"
              >
                <div className="w-16 h-16 mx-auto bg-red-500/10 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-500">Transaction Failed</h3>
                  <p className="text-sm text-muted-foreground">
                    The transaction was cancelled or failed. Please try again.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setIsPurchaseModalOpen(false)}>
                    Close
                  </Button>
                  <Button onClick={() => setPurchaseStep('analyze')}>Try Again</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  )
}
