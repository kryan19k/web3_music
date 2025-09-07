import { AddToPlaylistDialog } from '@/src/components/playlist/AddToPlaylistDialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent } from '@/src/components/ui/card'
import { Progress } from '@/src/components/ui/progress'
import type { Track } from '@/src/hooks/useAudioPlayer'
import { cn } from '@/src/lib/utils'
import type { MusicNFT, TierConfig } from '@/src/types/music-nft'
import { Link } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Clock,
  Coins,
  DollarSign,
  Heart,
  MoreHorizontal,
  Music,
  Pause,
  Play,
  Plus,
  Share2,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react'
import { useState } from 'react'

const tierConfigs: Record<string, TierConfig> = {
  bronze: {
    name: 'Bronze',
    color: 'bg-orange-500/20 text-orange-300 border-orange-500/50',
    glow: 'shadow-orange-500/25',
    maxSupply: 1000,
    pagsMultiplier: 1,
    royaltyRate: 0.5,
    benefits: ['Basic streaming rights', 'Community access'],
  },
  silver: {
    name: 'Silver',
    color: 'bg-slate-500/20 text-slate-300 border-slate-500/50',
    glow: 'shadow-slate-500/25',
    maxSupply: 500,
    pagsMultiplier: 2,
    royaltyRate: 1.0,
    benefits: ['Enhanced streaming', 'Early access', 'Discord perks'],
  },
  gold: {
    name: 'Gold',
    color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
    glow: 'shadow-yellow-500/25',
    maxSupply: 100,
    pagsMultiplier: 5,
    royaltyRate: 2.5,
    benefits: ['Premium streaming', 'Exclusive content', 'Artist meetups'],
  },
  platinum: {
    name: 'Platinum',
    color: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
    glow: 'shadow-purple-500/25',
    maxSupply: 10,
    pagsMultiplier: 10,
    royaltyRate: 5.0,
    benefits: ['VIP streaming', 'Private concerts', 'Royalty sharing', 'Producer credits'],
  },
}

interface MusicNFTCardProps {
  nft: MusicNFT
  isPlaying?: boolean
  onPlay?: (audioUrl: string) => void
  onPause?: () => void
  onPurchase?: (tokenId: string) => void
  className?: string
}

export function MusicNFTCard({
  nft,
  isPlaying = false,
  onPlay,
  onPause,
  onPurchase,
  className,
}: MusicNFTCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  const tierConfig = tierConfigs[nft.tier] || tierConfigs.bronze
  const completionPercentage = (nft.metadata.edition / nft.metadata.maxSupply) * 100

  const handlePlayClick = () => {
    if (isPlaying) {
      onPause?.()
    } else {
      onPlay?.(nft.metadata.audioUrl)
    }
  }

  // Convert NFT to Track format for playlist operations
  const nftAsTrack: Track = {
    id: nft.tokenId,
    title: nft.metadata.title,
    artist: nft.metadata.artist,
    artwork: nft.metadata.image || '/api/placeholder/300/300',
    audioUrl: nft.metadata.audioUrl,
    duration: nft.metadata.duration,
    pagsPerStream: nft.metadata.pagsAmount ? nft.metadata.pagsAmount / 1000 : undefined,
  }

  return (
    <motion.div
      className={cn('relative w-full max-w-sm mx-auto', className)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="wait">
        {!isFlipped ? (
          /* Front Side - Main NFT Card */
          <motion.div
            key="front"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              className={cn(
                'overflow-hidden border-2 bg-card/50 backdrop-blur-sm transition-all duration-300',
                isHovered && `shadow-2xl ${tierConfig.glow}`,
                'hover:border-primary/50',
                tierConfig.color.includes('border-') && tierConfig.color.split(' ')[2],
              )}
            >
              <CardContent className="p-0">
                {/* Album Art Section */}
                <div className="relative aspect-square overflow-hidden">
                  <motion.img
                    src={nft.metadata.image || '/api/placeholder/400/400'}
                    alt={nft.metadata.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button
                        size="icon"
                        className="w-16 h-16 rounded-full bg-white/90 hover:bg-white text-black hover:scale-110 transition-all"
                        onClick={handlePlayClick}
                      >
                        {isPlaying ? (
                          <Pause className="w-6 h-6" />
                        ) : (
                          <Play className="w-6 h-6 ml-1" />
                        )}
                      </Button>
                    </div>

                    <div className="absolute top-4 right-4 flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white"
                        onClick={() => setIsLiked(!isLiked)}
                      >
                        <Heart className={cn('w-4 h-4', isLiked && 'fill-red-500 text-red-500')} />
                      </Button>
                      <AddToPlaylistDialog
                        track={nftAsTrack}
                        trigger={
                          <Button
                            size="icon"
                            variant="ghost"
                            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        }
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Tier Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge className={cn('px-3 py-1 font-semibold', tierConfig.color)}>
                      {tierConfig.name.toUpperCase()}
                    </Badge>
                  </div>

                  {/* Rarity Indicator */}
                  <div className="absolute bottom-4 left-4">
                    <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1">
                      <Sparkles className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs text-white font-medium">
                        #{nft.metadata.edition}/{nft.metadata.maxSupply}
                      </span>
                    </div>
                  </div>

                  {/* Audio Visualizer */}
                  {isPlaying && (
                    <div className="absolute bottom-4 right-4">
                      <div className="flex items-end gap-0.5">
                        {[1, 2, 3, 4].map((i) => (
                          <motion.div
                            key={i}
                            className="w-1 bg-white rounded-full"
                            animate={{ height: [4, 12, 8, 16, 6, 10] }}
                            transition={{
                              duration: 0.8,
                              repeat: Number.POSITIVE_INFINITY,
                              delay: i * 0.1,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Info Section */}
                <div className="p-4 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg line-clamp-1">{nft.metadata.title}</h3>
                      <p className="text-sm text-muted-foreground">{nft.metadata.artist}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8"
                      onClick={() => setIsFlipped(true)}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {Math.floor(nft.metadata.duration / 60)}:
                      {(nft.metadata.duration % 60).toString().padStart(2, '0')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {nft.streamingStats?.uniqueListeners?.toLocaleString() || '0'}
                    </div>
                  </div>

                  {/* Earnings */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm font-semibold text-green-500">
                        ${nft.earnings?.daily?.toFixed(2) || '0.00'}
                      </p>
                      <p className="text-xs text-muted-foreground">Daily</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm font-semibold text-blue-500">
                        {nft.earnings?.apy?.toFixed(1) || '0.0'}%
                      </p>
                      <p className="text-xs text-muted-foreground">APY</p>
                    </div>
                  </div>

                  {/* PAGS Allocation */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">PAGS Allocation</span>
                      <span className="text-xs font-medium">
                        {nft.metadata.pagsAmount || 0} PAGS
                      </span>
                    </div>
                    <Progress
                      value={completionPercentage}
                      className="h-2"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link
                      to="/marketplace/$nftId"
                      params={{ nftId: nft.tokenId }}
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        className="w-full"
                      >
                        View Details
                      </Button>
                    </Link>
                    <Button
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
                      onClick={() => onPurchase?.(nft.tokenId)}
                      disabled={!nft.isListed}
                    >
                      <DollarSign className="w-4 h-4 mr-2" />${nft.priceUSD?.toFixed(0) || '0'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          /* Back Side - Analytics */

          <motion.div
            key="back"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              className={cn(
                'border-2 bg-card/50 backdrop-blur-sm',
                isHovered && `shadow-2xl ${tierConfig.glow}`,
              )}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Music className="w-5 h-5" />
                    Token Analytics
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFlipped(false)}
                  >
                    Back
                  </Button>
                </div>

                {/* Detailed Stats */}
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Earnings</span>
                        <span className="font-semibold">
                          ${nft.earnings?.total?.toFixed(2) || '0.00'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Streams</span>
                        <span className="font-semibold">
                          {nft.streamingStats?.totalPlays?.toLocaleString() || '0'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Completion Rate</span>
                        <span className="font-semibold">
                          {nft.streamingStats?.averageCompletion || 0}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Royalty Rate</span>
                        <span className="font-semibold">{tierConfig.royaltyRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">PAGS Multiplier</span>
                        <span className="font-semibold">{tierConfig.pagsMultiplier}x</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Genre</span>
                        <span className="font-semibold">{nft.metadata?.genre || 'Unknown'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Recent Sales
                    </p>
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src="/api/placeholder/24/24" />
                              <AvatarFallback className="text-xs">0x</AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-muted-foreground">
                              {i === 1 ? '2 hours ago' : i === 2 ? '1 day ago' : '3 days ago'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Coins className="w-3 h-3 text-yellow-500" />
                            <span className="text-xs font-mono">
                              ${((nft.priceUSD || 0) * (1 + Math.random() * 0.2)).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Attributes */}
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium mb-3">Attributes</p>
                    <div className="grid grid-cols-2 gap-2">
                      {nft.metadata?.attributes?.slice(0, 4).map((attr) => (
                        <div
                          key={`${attr.trait_type}-${attr.value}`}
                          className="bg-muted/50 rounded p-2"
                        >
                          <p className="text-xs text-muted-foreground">{attr.trait_type}</p>
                          <p className="text-sm font-medium">{attr.value}</p>
                        </div>
                      )) || []}
                    </div>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 mt-6"
                    onClick={() => onPurchase?.(nft.tokenId)}
                    disabled={!nft.isListed}
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    {nft.isListed
                      ? `Purchase for $${nft.priceUSD?.toFixed(2) || '0.00'}`
                      : 'Not Available'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
