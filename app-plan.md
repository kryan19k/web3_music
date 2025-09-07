# PAGS Music Platform - Frontend Architecture Plan 🎵

## Design Philosophy
**Dark, Immersive, Premium** - Spotify's elegance meets OpenSea's Web3 power with SoundCloud's social DNA. Built with shadcn/ui for ultimate customization and modern aesthetics.

## Core Tech Stack

### From Your Boilerplate:
- **TypeScript + Vite**: Lightning-fast development
- **TanStack Router**: Type-safe file-based routing
- **TanStack Query**: Server state management
- **Wagmi + Viem**: Web3 interactions
- **ConnectKit**: Wallet connection modal
- **GraphQL**: Subgraph queries

### New Additions:
- **shadcn/ui**: Customizable component library
- **Tailwind CSS**: Utility-first styling
- **Radix UI**: Accessible component primitives
- **Framer Motion**: Smooth animations
- **Lucide Icons**: Beautiful icon set
- **React Hot Toast**: Notifications
- **Recharts**: Data visualization

## Installation Setup

```bash
# Install shadcn/ui CLI
pnpm dlx shadcn-ui@latest init

# Configure with:
# - TypeScript: Yes
# - Style: Default
# - Base color: Zinc
# - CSS variables: Yes

# Install essential shadcn components
pnpm dlx shadcn-ui@latest add button card dialog dropdown-menu tabs toast sheet slider progress badge avatar separator input label select command popover calendar form table pagination skeleton alert alert-dialog aspect-ratio hover-card menubar navigation-menu scroll-area tooltip

# Additional dependencies
pnpm add framer-motion recharts react-hot-toast @radix-ui/react-icons class-variance-authority clsx tailwind-merge react-intersection-observer react-use-measure wavesurfer.js
```

## Project Structure

```
src/
├── app/
│   ├── routes/                      # TanStack Router pages
│   │   ├── __root.tsx               # Root layout with player
│   │   ├── index.tsx                # Landing page
│   │   ├── marketplace/
│   │   │   ├── index.tsx            # Browse all music NFTs
│   │   │   ├── $songId.tsx          # Individual song page
│   │   │   └── _components/
│   │   │       ├── FilterSidebar.tsx
│   │   │       └── SongGrid.tsx
│   │   ├── portfolio/
│   │   │   ├── index.tsx            # User's collection
│   │   │   ├── analytics.tsx        # Earnings dashboard
│   │   │   └── _components/
│   │   │       ├── CollectionGrid.tsx
│   │   │       └── EarningsChart.tsx
│   │   ├── pags/
│   │   │   ├── index.tsx            # Token dashboard
│   │   │   ├── swap.tsx             # DEX interface
│   │   │   └── stake.tsx            # Staking portal
│   │   ├── artist/
│   │   │   ├── dashboard.tsx        # Artist control panel
│   │   │   └── upload.tsx           # New song minting
│   │   └── profile/
│   │       └── $address.tsx         # Public profiles
│   │
├── components/
│   ├── ui/                          # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ... (all shadcn components)
│   │
│   ├── music/
│   │   ├── MusicPlayer/
│   │   │   ├── index.tsx            # Main player component
│   │   │   ├── Controls.tsx         # Play/pause/skip
│   │   │   ├── ProgressBar.tsx      # Seek functionality
│   │   │   ├── VolumeControl.tsx    # Volume slider
│   │   │   └── Visualizer.tsx       # Audio visualization
│   │   ├── TrackCard.tsx            # Song NFT cards
│   │   ├── Waveform.tsx             # WaveSurfer integration
│   │   ├── PlaylistDrawer.tsx       # Queue management
│   │   └── MiniPlayer.tsx           # Persistent bottom bar
│   │
│   ├── nft/
│   │   ├── NFTCard/
│   │   │   ├── index.tsx            # 3D flip card
│   │   │   ├── FrontFace.tsx        # Album art side
│   │   │   └── BackFace.tsx         # Stats/info side
│   │   ├── TierBadge.tsx            # Bronze/Silver/Gold/Platinum
│   │   ├── MintDialog.tsx           # Purchase flow modal
│   │   ├── RarityIndicator.tsx      # Visual rarity display
│   │   └── QuickActions.tsx         # Buy/Sell/Transfer buttons
│   │
│   ├── token/
│   │   ├── PAGSBalance.tsx          # Live balance widget
│   │   ├── EarningsCard.tsx         # Royalty summary
│   │   ├── StakingInterface.tsx     # Lock tokens UI
│   │   ├── SwapWidget.tsx           # Uniswap integration
│   │   └── PriceChart.tsx           # Recharts implementation
│   │
│   ├── layout/
│   │   ├── Header/
│   │   │   ├── index.tsx            # Main navigation
│   │   │   ├── Logo.tsx             # Animated logo
│   │   │   ├── SearchCommand.tsx    # CMD+K search
│   │   │   └── WalletButton.tsx     # ConnectKit trigger
│   │   ├── Sidebar.tsx              # Desktop navigation
│   │   ├── MobileNav.tsx            # Mobile menu sheet
│   │   └── Footer.tsx               # Links & player space
│   │
│   └── shared/
│       ├── AnimatedCounter.tsx      # Number animations
│       ├── GradientText.tsx         # Gradient headlines
│       ├── LoadingState.tsx         # Skeleton screens
│       ├── EmptyState.tsx           # No data displays
│       ├── ErrorBoundary.tsx       # Error handling
│       └── MetaTags.tsx             # SEO components
│
├── lib/
│   ├── wagmi/
│   │   ├── config.ts                # Wagmi setup
│   │   ├── contracts/
│   │   │   ├── MusicNFT.ts         # NFT contract interface
│   │   │   ├── PAGSToken.ts        # Token contract
│   │   │   └── abi/                # Contract ABIs
│   │   └── hooks/
│   │       ├── useNFTMint.ts       # Minting hook
│   │       ├── useRoyalties.ts     # Earnings hook
│   │       └── usePAGSBalance.ts   # Token balance
│   │
│   ├── audio/
│   │   ├── AudioEngine.ts          # Core player logic
│   │   ├── Visualizer.ts           # WebGL visualizations
│   │   ├── WaveformGenerator.ts    # Audio analysis
│   │   └── PlaylistManager.ts      # Queue handling
│   │
│   ├── ipfs/
│   │   ├── client.ts                # IPFS connection
│   │   ├── upload.ts                # File uploading
│   │   └── gateway.ts               # Content retrieval
│   │
│   ├── api/
│   │   ├── spotify.ts               # Spotify analytics
│   │   ├── coingecko.ts            # Price feeds
│   │   └── opensea.ts              # NFT metadata
│   │
│   └── utils/
│       ├── cn.ts                    # Class name helper
│       ├── formatters.ts            # Number/address format
│       ├── constants.ts             # Platform constants
│       └── animations.ts            # Framer presets
│
├── styles/
│   ├── globals.css                  # Tailwind imports
│   └── fonts/                       # Local font files
│
├── hooks/
│   ├── useAudioPlayer.ts           # Player state
│   ├── usePortfolio.ts             # User NFTs
│   ├── useRoyaltyStream.ts         # Real-time earnings
│   └── useMarketData.ts            # Price/volume data
│
└── types/
    ├── music.ts                     # Music-related types
    ├── nft.ts                       # NFT interfaces
    ├── token.ts                     # Token types
    └── api.ts                       # API responses
```

## Component Architecture

### Global Layout with Persistent Player

```tsx
// src/app/routes/__root.tsx
import { Outlet } from '@tanstack/react-router'
import { Header } from '@/components/layout/Header'
import { MiniPlayer } from '@/components/music/MiniPlayer'
import { Toaster } from '@/components/ui/toaster'

export function RootLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-24"> {/* Space for player */}
        <Outlet />
      </main>
      <MiniPlayer />
      <Toaster />
    </div>
  )
}
```

### NFT Card Component with shadcn

```tsx
// src/components/nft/NFTCard/index.tsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Play, Pause, TrendingUp, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useAudioPlayer } from '@/hooks/useAudioPlayer'

interface NFTCardProps {
  tokenId: string
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  metadata: NFTMetadata
  price: string
  earnings: {
    daily: number
    total: number
    apy: number
  }
}

export function NFTCard({ tokenId, tier, metadata, price, earnings }: NFTCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const { play, pause, isPlaying, currentTrack } = useAudioPlayer()
  
  const isCurrentlyPlaying = currentTrack?.id === tokenId && isPlaying
  
  const tierConfig = {
    bronze: { color: 'bg-orange-500/20 text-orange-300 border-orange-500/50', glow: 'shadow-orange-500/25' },
    silver: { color: 'bg-slate-500/20 text-slate-300 border-slate-500/50', glow: 'shadow-slate-500/25' },
    gold: { color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50', glow: 'shadow-yellow-500/25' },
    platinum: { color: 'bg-purple-500/20 text-purple-300 border-purple-500/50', glow: 'shadow-purple-500/25' }
  }
  
  return (
    <motion.div
      className="relative w-full h-[420px] perspective-1000"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          className="w-full h-full"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Front Face */}
          <Card 
            className={cn(
              "absolute w-full h-full backface-hidden border-2 bg-card/50 backdrop-blur-sm transition-shadow duration-300",
              isHovered && `shadow-2xl ${tierConfig[tier].glow}`
            )}
          >
            <CardContent className="p-0 h-full flex flex-col">
              {/* Album Art Section */}
              <div className="relative aspect-square overflow-hidden rounded-t-lg">
                <img 
                  src={metadata.image} 
                  alt={metadata.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                
                {/* Overlay Controls */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="w-12 h-12 rounded-full bg-white/90 hover:bg-white"
                      onClick={() => isCurrentlyPlaying ? pause() : play(metadata.audioUrl)}
                    >
                      {isCurrentlyPlaying ? <Pause /> : <Play />}
                    </Button>
                    
                    <Badge className={cn("px-3 py-1", tierConfig[tier].color)}>
                      {tier.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                
                {/* Rarity Indicator */}
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1">
                    <Sparkles className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs text-white font-medium">
                      #{metadata.edition}/{ tier === 'platinum' ? '10' : tier === 'gold' ? '100' : tier === 'silver' ? '500' : '1000'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Info Section */}
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg line-clamp-1">{metadata.title}</h3>
                  <p className="text-sm text-muted-foreground">{metadata.artist}</p>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 my-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Daily Earnings</p>
                    <p className="text-sm font-semibold text-green-500">
                      ${earnings.daily.toFixed(2)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Total Earned</p>
                    <p className="text-sm font-semibold">
                      ${earnings.total.toFixed(2)}
                    </p>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
                    onClick={() => {/* Open mint dialog */}}
                  >
                    Buy ${price}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsFlipped(true)}
                  >
                    <TrendingUp className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Back Face - Stats & Details */}
          <Card 
            className={cn(
              "absolute w-full h-full backface-hidden border-2 bg-card/50 backdrop-blur-sm",
              "rotate-y-180",
              isHovered && `shadow-2xl ${tierConfig[tier].glow}`
            )}
          >
            <CardContent className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Token Stats</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFlipped(false)}
                >
                  Back
                </Button>
              </div>
              
              {/* Detailed Stats */}
              <div className="space-y-4 flex-1">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">PAGS Allocation</span>
                    <span className="font-mono font-semibold">{metadata.pagsAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">APY</span>
                    <span className="text-green-500 font-semibold">{earnings.apy}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Streams (24h)</span>
                    <span className="font-semibold">{metadata.dailyStreams}</span>
                  </div>
                </div>
                
                {/* Recent Activity */}
                <div className="border-t pt-4">
                  <p className="text-sm font-medium mb-2">Recent Sales</p>
                  <div className="space-y-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback>0x</AvatarFallback>
                        </Avatar>
                        <span className="text-muted-foreground">2 hours ago</span>
                        <span className="font-mono">${(parseFloat(price) * 1.1).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
```

### Music Player Component

```tsx
// src/components/music/MiniPlayer.tsx
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { 
  Play, Pause, SkipBack, SkipForward, 
  Volume2, Heart, Share2, Maximize2 
} from 'lucide-react'
import { useAudioPlayer } from '@/hooks/useAudioPlayer'
import { cn } from '@/lib/utils/cn'

export function MiniPlayer() {
  const { 
    currentTrack, 
    isPlaying, 
    progress, 
    volume,
    play, 
    pause, 
    seek, 
    setVolume,
    next,
    previous 
  } = useAudioPlayer()
  
  if (!currentTrack) return null
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        className="fixed bottom-0 left-0 right-0 z-50"
      >
        <Card className="rounded-none border-x-0 border-b-0 bg-background/95 backdrop-blur-xl">
          {/* Progress Bar */}
          <div className="h-1 bg-muted">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="px-4 py-3">
            <div className="flex items-center gap-4">
              {/* Album Art */}
              <div className="relative group">
                <img 
                  src={currentTrack.artwork} 
                  alt={currentTrack.title}
                  className="w-14 h-14 rounded-md object-cover"
                />
                <div className="absolute inset-0 bg-black/40 rounded-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Maximize2 className="w-4 h-4 text-white" />
                </div>
              </div>
              
              {/* Track Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{currentTrack.title}</p>
                <p className="text-sm text-muted-foreground truncate">{currentTrack.artist}</p>
              </div>
              
              {/* Center Controls */}
              <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost" onClick={previous}>
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button 
                  size="icon" 
                  className="w-10 h-10 rounded-full bg-white text-black hover:bg-white/90"
                  onClick={() => isPlaying ? pause() : play()}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </Button>
                <Button size="icon" variant="ghost" onClick={next}>
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Right Controls */}
              <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost">
                  <Share2 className="w-4 h-4" />
                </Button>
                
                {/* Volume */}
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-muted-foreground" />
                  <Slider 
                    value={[volume]} 
                    onValueChange={([v]) => setVolume(v)}
                    className="w-24"
                    max={100}
                  />
                </div>
              </div>
              
              {/* PAGS Earnings Indicator */}
              <div className="px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                <p className="text-xs text-green-500 font-semibold">
                  +{currentTrack.pagsPerStream} PAGS
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
```

### Landing Page

```tsx
// src/app/routes/index.tsx
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Music, DollarSign, Users, TrendingUp } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export function LandingPage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-background to-pink-900/20" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          
          {/* Floating Music Notes Animation */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-purple-500/30 rounded-full"
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 100
              }}
              animate={{ 
                y: -100,
                x: Math.random() * window.innerWidth
              }}
              transition={{ 
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-4" variant="secondary">
              <Music className="w-3 h-3 mr-1" />
              Web3 Music Revolution
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Own the Music
              </span>
              <br />
              <span className="text-white">Earn the Royalties</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Buy music NFTs, earn PAGS tokens, and share in the success of your favorite artists. 
              The first platform where fans become stakeholders.
            </p>
            
            <div className="flex gap-4 justify-center">
              <Link to="/marketplace">
                <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  Explore Music
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </motion.div>
          
          {/* Live Stats Ticker */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {[
              { icon: Music, label: "Songs Listed", value: "234", change: "+12" },
              { icon: Users, label: "Active Holders", value: "1,847", change: "+124" },
              { icon: DollarSign, label: "Total Earned", value: "$48.3K", change: "+$2.1K" },
              { icon: TrendingUp, label: "PAGS Price", value: "$0.024", change: "+8.4%" }
            ].map((stat, i) => (
              <Card key={i} className="p-4 bg-card/50 backdrop-blur-sm border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="w-4 h-4 text-muted-foreground" />
                  <Badge variant="secondary" className="text-xs">
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground">Three simple steps to start earning from music</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Choose Your Tier",
              description: "Select from Bronze, Silver, Gold, or Platinum NFTs based on your investment level",
              color: "from-orange-500 to-red-500"
            },
            {
              step: "02", 
              title: "Mint & Own",
              description: "Purchase the NFT to own the song and receive PAGS tokens for royalty rights",
              color: "from-purple-500 to-pink-500"
            },
            {
              step: "03",
              title: "Earn Forever",
              description: "Collect monthly royalties from streaming, sales, and licensing automatically",
              color: "from-blue-500 to-cyan-500"
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 h-full hover:shadow-xl transition-shadow">
                <div className={cn(
                  "w-12 h-12 rounded-full bg-gradient-to-r flex items-center justify-center text-white font-bold mb-4",
                  item.color
                )}>
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
```

## Tailwind Configuration

```js
// tailwind.config.js
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // Custom colors for tiers
        bronze: {
          500: "#CD7F32",
          600: "#B8702C",
        },
        silver: {
          500: "#C0C0C0",
          600: "#A8A8A8",
        },
        gold: {
          500: "#FFD700",
          600: "#E6C200",
        },
        platinum: {
          500: "#E5E4E2",
          600: "#CCCBC8",
        }
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "music-bars": {
          "0%, 100%": { height: "20%" },
          "50%": { height: "100%" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "music-bars": "music-bars 1s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
      },
      perspective: {
        '1000': '1000px',
      },
      transformStyle: {
        'preserve-3d': 'preserve-3d',
      },
      backfaceVisibility: {
        'hidden': 'hidden',
      },
      rotate: {
        'y-180': 'rotateY(180deg)',
      }
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function({ addUtilities }) {
      addUtilities({
        '.backface-hidden': {
          'backface-visibility': 'hidden',
        },
        '.perspective-1000': {
          'perspective': '1000px',
        },
        '.rotate-y-180': {
          'transform': 'rotateY(180deg)',
        },
      })
    }
  ],
}
```

## Web3 Hooks

```typescript
// src/hooks/useNFTMint.ts
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { toast } from 'react-hot-toast'
import { MUSIC_NFT_ABI, MUSIC_NFT_ADDRESS } from '@/lib/wagmi/contracts'

export function useNFTMint() {
  const { writeContract, data: hash } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })
  
  const mint = async (tier: number, price: string) => {
    try {
      await writeContract({
        address: MUSIC_NFT_ADDRESS,
        abi: MUSIC_NFT_ABI,
        functionName: 'purchaseTier',
        args: [tier],
        value: parseEther(price),
      })
      
      toast.success('NFT minting initiated!')
    } catch (error) {
      toast.error('Minting failed')
      console.error(error)
    }
  }
  
  return { mint, isConfirming, isSuccess }
}
```

## Performance Optimizations

### 1. Code Splitting
```tsx
// Lazy load heavy components
const Visualizer = lazy(() => import('@/components/music/Visualizer'))
const Analytics = lazy(() => import('@/components/token/Analytics'))
```

### 2. Image Optimization
```tsx
// Use next-gen formats with fallbacks
<picture>
  <source srcSet={`${artwork}.webp`} type="image/webp" />
  <img src={`${artwork}.jpg`} alt={title} loading="lazy" />
</picture>
```

### 3. Virtual Scrolling for Large Lists
```tsx
import { useVirtualizer } from '@tanstack/react-virtual'

export function VirtualNFTGrid({ items }) {
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 420,
    overscan: 5,
  })
  
  // Render only visible items
}
```

### 4. Optimistic Updates
```tsx
// Update UI immediately, rollback on error
const optimisticMint = () => {
  // Update UI
  setUserNFTs(prev => [...prev, newNFT])
  
  // Actual transaction
  mint().catch(() => {
    // Rollback on failure
    setUserNFTs(prev => prev.filter(nft => nft.id !== newNFT.id))
  })
}
```

## Mobile Responsiveness

```tsx
// Responsive grid layouts
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {nfts.map(nft => <NFTCard key={nft.id} {...nft} />)}
</div>

// Mobile-first navigation
<Sheet>
  <SheetTrigger asChild className="lg:hidden">
    <Button variant="ghost" size="icon">
      <Menu />
    </Button>
  </SheetTrigger>
  <SheetContent side="left">
    <MobileNav />
  </SheetContent>
</Sheet>
```

## SEO & Meta Tags

```tsx
// src/components/shared/MetaTags.tsx
import { Helmet } from 'react-helmet-async'

export function MetaTags({ title, description, image, audio }) {
  return (
    <Helmet>
      <title>{title} | PAGS Music Platform</title>
      <meta name="description" content={description} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:audio" content={audio} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  )
}
```

## Environment Variables

```env
# .env
VITE_WALLET_CONNECT_PROJECT_ID=your_project_id
VITE_ALCHEMY_API_KEY=your_alchemy_key
VITE_IPFS_GATEWAY=https://ipfs.io/ipfs/
VITE_MUSIC_NFT_ADDRESS=0x...
VITE_PAGS_TOKEN_ADDRESS=0x...
VITE_CHAIN_ID=1
VITE_SUBGRAPH_URL=https://api.thegraph.com/subgraphs/name/...
```

## Launch Roadmap

### Phase 1: Foundation (Week 1)
- [ ] Setup shadcn/ui components
- [ ] Implement routing structure
- [ ] Basic wallet connection
- [ ] Landing page
- [ ] NFT card components

### Phase 2: Core Features (Week 2)
- [ ] Music player implementation
- [ ] Marketplace grid & filters
- [ ] NFT minting flow
- [ ] IPFS integration
- [ ] Smart contract hooks

### Phase 3: Token Features (Week 3)
- [ ] PAGS dashboard
- [ ] Swap interface
- [ ] Portfolio page
- [ ] Earnings tracking
- [ ] Royalty claiming

### Phase 4: Advanced Features (Week 4)
- [ ] Audio visualizations
- [ ] Social features
- [ ] Analytics charts
- [ ] Staking interface
- [ ] Artist dashboard

### Phase 5: Polish & Launch (Week 5)
- [ ] Performance optimization
- [ ] Mobile testing
- [ ] SEO implementation
- [ ] Bug fixes
- [ ] Production deployment

## Key Differentiators

1. **Premium Dark UI** - Spotify-level polish with Web3 functionality
2. **Seamless Audio Experience** - Music-first, Web3-second approach  
3. **Real-time Earnings** - Live royalty accumulation display
4. **Social Proof** - Show what others are earning/playing
5. **Mobile-First** - Perfect experience on all devices

This architecture leverages shadcn/ui's customizability to create a unique, music-focused Web3 platform that stands out from typical DeFi interfaces!