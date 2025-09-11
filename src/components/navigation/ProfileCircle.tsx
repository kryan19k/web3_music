import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent } from '@/src/components/ui/card'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/src/components/ui/popover'
import { Badge } from '@/src/components/ui/badge'
import { Separator } from '@/src/components/ui/separator'
import { useAccount } from 'wagmi'
import { Link } from '@tanstack/react-router'
import { useArtistData } from '@/src/hooks/contracts/useArtistData'
import { useMusicNFTUserData } from '@/src/hooks/contracts/useMusicNFT'
import {
  User,
  Music,
  Headphones,
  DollarSign,
  Settings,
  LogOut,
  TrendingUp,
  Star,
  Award,
  Sparkles,
  ArrowRight,
  Crown,
  Wallet
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useBLOKBalance } from '@/src/hooks/contracts'

/**
 * Floating profile circle with stats popover
 * Displays artist stats when clicked and provides navigation to profile
 */
export function ProfileCircle() {
  const { address, isConnected } = useAccount()
  const [isOpen, setIsOpen] = useState(false)
  
  // Get artist data if user is an artist
  const { artistStats, isArtist, isLoading: artistLoading } = useArtistData()
  
  // Get user NFT data
  const { 
    ownedTokens, 
    stats: userStats, 
    benefits: rawBenefits, 
    collaboratorRoyalties,
    isLoading: userLoading 
  } = useMusicNFTUserData()

  // Note: useMusicNFTUserData is deprecated, using mock data for benefits
  // TODO: Replace with collection-specific benefits tracking
  const hasAnyNFT = false // Mock data since hook is deprecated
  const benefitsObject = null // Benefits are now handled at collection level
  const highestTier = 0

  if (!isConnected || !address) {
    return null
  }

  const isLoading = artistLoading || userLoading
  const displayName = artistStats?.name || `${address.slice(0, 6)}...${address.slice(-4)}`
  const avatar = artistStats?.avatar

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <Button
              size="icon"
              className="w-16 h-16 rounded-full shadow-2xl btn-primary border-2 border-white/20"
            >
              <Avatar className="w-12 h-12">
                <AvatarImage src={avatar} />
                <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                  {displayName[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
            
            {/* Status indicator */}
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-background flex items-center justify-center">
              {isLoading ? (
                <div className="w-3 h-3 animate-spin rounded-full border border-white border-t-transparent" />
              ) : isArtist ? (
                <div className="w-full h-full bg-accent rounded-full flex items-center justify-center">
                  <Crown className="w-2.5 h-2.5 text-white" />
                </div>
              ) : ownedTokens.length > 0 ? (
                <div className="w-full h-full bg-primary rounded-full flex items-center justify-center">
                  <Music className="w-2.5 h-2.5 text-white" />
                </div>
              ) : (
                <div className="w-full h-full bg-gray-500 rounded-full" />
              )}
            </div>
          </motion.div>
        </PopoverTrigger>
        
        <PopoverContent 
          className="w-80 p-0 bg-background/95 backdrop-blur-xl border-border/50" 
          align="end"
          side="left"
        >
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={avatar} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {displayName[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg truncate">{displayName}</h3>
                        {isArtist && (
                          <Badge className="bg-accent/20 text-accent border-accent/30">
                            <Crown className="w-3 h-3 mr-1" />
                            Artist
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground font-mono truncate">
                        {address}
                      </p>
                    </div>
                  </div>

                  <Separator className="mb-4" />

                  {/* Stats Section */}
                  {isLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Artist Stats */}
                      {isArtist && artistStats && (
                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                            <Music className="w-4 h-4" />
                            Artist Stats
                          </h4>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-muted/50 rounded-lg p-3 text-center">
                              <p className="text-lg font-bold text-accent">
                                {artistStats.totalTracks}
                              </p>
                              <p className="text-xs text-muted-foreground">Tracks</p>
                            </div>
                            <div className="bg-muted/50 rounded-lg p-3 text-center">
                              <p className="text-lg font-bold text-primary">
                                ${artistStats.totalEarnings.toFixed(2)}
                              </p>
                              <p className="text-xs text-muted-foreground">Earned</p>
                            </div>
                            <div className="bg-muted/50 rounded-lg p-3 text-center">
                              <p className="text-lg font-bold text-accent">
                                {artistStats.totalPlays.toLocaleString()}
                              </p>
                              <p className="text-xs text-muted-foreground">Plays</p>
                            </div>
                            <div className="bg-muted/50 rounded-lg p-3 text-center">
                              <p className="text-lg font-bold text-primary">
                                {artistStats.blokBalance.toFixed(0)}
                              </p>
                              <p className="text-xs text-muted-foreground">PAGS</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* User Stats */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Collection
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-muted/50 rounded-lg p-3 text-center">
                            <p className="text-lg font-bold text-accent">
                              {ownedTokens.length}
                            </p>
                            <p className="text-xs text-muted-foreground">NFTs Owned</p>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-3 text-center">
                            <p className="text-lg font-bold text-primary">
                              ${parseFloat(collaboratorRoyalties).toFixed(2)}
                            </p>
                            <p className="text-xs text-muted-foreground">Royalties</p>
                          </div>
                        </div>
                      </div>

                      {/* Benefits */}
                      {hasAnyNFT && benefitsObject && (
                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Benefits
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {/* Benefits temporarily disabled - TODO: Implement collection-based benefits */}
                            <Badge variant="secondary" className="text-xs">
                              <Star className="w-3 h-3 mr-1" />
                              Coming Soon
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-2">
                              Collection-based benefits will be available soon
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <Separator className="my-4" />

                  {/* Navigation Links */}
                  <div className="space-y-2">
                    {isArtist && (
                      <Link to="/artist/dashboard" className="block">
                        <Button variant="ghost" className="w-full justify-between">
                          <span className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Artist Dashboard
                          </span>
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    )}
                    
                    {/* Profile Links - show setup if no profile exists */}
                    <div className="space-y-2">
                      <Link to="/profile/$userId" params={{ userId: address }} className="block">
                        <Button variant="ghost" className="w-full justify-between">
                          <span className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            View Profile
                          </span>
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                      
                      <Link to="/profile/setup" className="block">
                        <Button variant="outline" size="sm" className="w-full justify-between">
                          <span className="flex items-center gap-2">
                            <Settings className="w-4 h-4" />
                            Setup Profile
                          </span>
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                    
                    <Link to="/portfolio" className="block">
                      <Button variant="ghost" className="w-full justify-between">
                        <span className="flex items-center gap-2">
                          <Wallet className="w-4 h-4" />
                          My Portfolio
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                    
                    <Link to="/profile/settings" className="block">
                      <Button variant="ghost" className="w-full justify-between">
                        <span className="flex items-center gap-2">
                          <Settings className="w-4 h-4" />
                          Settings
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </PopoverContent>
      </Popover>
    </div>
  )
}
