import { Badge } from '@/src/components/ui/badge'
import { Card, CardContent } from '@/src/components/ui/card'
import { AnimatePresence, motion } from 'framer-motion'
import { 
  Play, 
  Pause, 
  Heart, 
  Share2, 
  TrendingUp, 
  Users, 
  Music,
  Star,
  Volume2,
  Zap,
  Flame,
  Eye,
  Headphones,
  MoreHorizontal,
  ChevronRight
} from 'lucide-react'
import { useState, useEffect } from 'react'

interface Artist {
  id: string
  name: string
  avatar: string
  genre: string
  followers: string
  verified: boolean
}

interface Song {
  id: string
  title: string
  artist: string
  price: string
  change: string
  plays: string
  cover: string
  duration: string
  isPlaying?: boolean
}

const featuredArtists: Artist[] = [
  {
    id: '1',
    name: 'Luna Echo',
    avatar: '/api/placeholder/60/60',
    genre: 'Electronic',
    followers: '234K',
    verified: true
  },
  {
    id: '2',
    name: 'Neon Waves',
    avatar: '/api/placeholder/60/60',
    genre: 'Synthwave',
    followers: '189K',
    verified: true
  },
  {
    id: '3',
    name: 'Digital Harmony',
    avatar: '/api/placeholder/60/60',
    genre: 'Lo-Fi',
    followers: '156K',
    verified: false
  }
]

const featuredSongs: Song[] = [
  {
    id: '1',
    title: 'Midnight Echoes',
    artist: 'Luna Echo',
    price: '0.08 ETH',
    change: '+12.5%',
    plays: '2.1M',
    cover: '/song_cover/midnight.png',
    duration: '3:42'
  },
  {
    id: '2',
    title: 'Urban Vibes',
    artist: 'City Beats',
    price: '0.12 ETH',
    change: '+8.3%',
    plays: '1.8M',
    cover: '/song_cover/urban.png',
    duration: '4:15'
  },
  {
    id: '3',
    title: 'Electric Dreams',
    artist: 'Synth Master',
    price: '0.06 ETH',
    change: '+15.7%',
    plays: '1.2M',
    cover: '/song_cover/electric.png',
    duration: '2:58'
  },
  {
    id: '4',
    title: 'Coffee Shop Blues',
    artist: 'Acoustic Soul',
    price: '0.04 ETH',
    change: '+22.1%',
    plays: '980K',
    cover: '/song_cover/coffee.png',
    duration: '3:21'
  }
]

export const FeaturedArtistsHero = () => {
  const [activeTab, setActiveTab] = useState<'artists' | 'songs'>('songs')
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [currentSongIndex, setCurrentSongIndex] = useState(0)

  // Auto-rotate between tabs
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab(prev => prev === 'artists' ? 'songs' : 'artists')
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  // Auto-cycle through songs for preview
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSongIndex(prev => (prev + 1) % featuredSongs.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handlePlay = (id: string) => {
    setPlayingId(playingId === id ? null : id)
  }

  const currentSong = featuredSongs[currentSongIndex]

  return (
    <div className="w-full max-w-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Hero Music Player Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative group"
      >
        <Card className="relative overflow-hidden bg-gradient-to-br from-card/90 to-card/40 backdrop-blur-2xl border-2 border-primary/20 shadow-2xl shadow-primary/25">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary" />
          
          <CardContent className="p-6">
            {/* Now Playing Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-muted-foreground font-medium">NOW TRENDING</span>
              </div>
              <div className="flex items-center gap-1">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-xs text-orange-500 font-bold">HOT</span>
              </div>
            </div>

            {/* Main Song Display */}
            <motion.div
              key={currentSongIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              {/* Album Art */}
              <div className="relative mb-4 group/art">
                <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-2xl shadow-primary/30 ring-2 ring-primary/20">
                  <img 
                    src={currentSong.cover} 
                    alt={currentSong.title}
                    className="w-full h-full object-cover group-hover/art:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Floating Play Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handlePlay(currentSong.id)}
                    className="absolute bottom-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl group-hover/art:bg-primary group-hover/art:text-white transition-all duration-300"
                  >
                    {playingId === currentSong.id ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6 ml-0.5" />
                    )}
                  </motion.button>

                  {/* Price Tag */}
                  <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-white text-sm font-bold">{currentSong.price}</span>
                  </div>

                  {/* Change Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-500/90 text-white border-0 shadow-lg">
                      {currentSong.change}
                    </Badge>
                  </div>
                </div>

                {/* Audio Visualizer */}
                {playingId === currentSong.id && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <motion.div
                        key={`visualizer-${currentSong.id}-${i}`}
                        className="w-1 bg-primary rounded-full"
                        animate={{
                          height: [4, 16, 4],
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Song Info */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-1">{currentSong.title}</h3>
                  <p className="text-muted-foreground">{currentSong.artist}</p>
                </div>

                {/* Stats Row */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{currentSong.plays}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Headphones className="w-4 h-4" />
                      <span>{currentSong.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-full bg-accent/20 hover:bg-accent/40 transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-full bg-accent/20 hover:bg-accent/40 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Progress Indicators */}
                <div className="flex gap-1 justify-center">
                  {featuredSongs.map((song, index) => (
                    <motion.div
                      key={song.id}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        index === currentSongIndex ? 'w-8 bg-primary' : 'w-2 bg-muted'
                      }`}
                      layout
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Right Column - Stats and Trending */}
      <div className="space-y-6">
        {/* Quick Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="bg-card/60 backdrop-blur-xl border border-border/30 shadow-xl">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-2xl font-bold text-foreground">234</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Tracks Listed</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-2xl font-bold text-foreground">1.8K</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Active Artists</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      {/* Trending Mini List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <Card className="bg-card/60 backdrop-blur-xl border border-border/30 shadow-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4 bg-gradient-to-r from-primary/5 to-transparent border-b border-border/20">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  Up Next
                </h3>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            
            <div className="space-y-0">
              {featuredSongs.slice(0, 3).map((song, index) => (
                <motion.div
                  key={song.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="p-3 hover:bg-accent/10 transition-all duration-300 border-b border-border/10 last:border-b-0 group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden ring-1 ring-border/20">
                      <img 
                        src={song.cover} 
                        alt={song.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground truncate">{song.title}</h4>
                      <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xs font-semibold text-foreground">{song.price}</p>
                      <p className="text-xs text-green-500">{song.change}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl text-white text-sm font-semibold transition-all duration-300 shadow-lg shadow-purple-500/25"
          >
            Explore All
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-3 bg-card/60 hover:bg-card/80 rounded-xl text-foreground text-sm font-medium transition-all duration-300 border-2 border-border/30"
          >
            <MoreHorizontal className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
      </div>
    </div>
  )
}