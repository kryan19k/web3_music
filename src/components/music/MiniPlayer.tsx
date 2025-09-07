import { AddToPlaylistDialog } from '@/src/components/playlist/AddToPlaylistDialog'
import { QueueManager } from '@/src/components/playlist/QueueManager'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent } from '@/src/components/ui/card'
import { Slider } from '@/src/components/ui/slider'
import { useAudioPlayer } from '@/src/hooks/useAudioPlayer'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Heart,
  List,
  Maximize2,
  Music,
  Pause,
  Play,
  Share2,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react'
import * as React from 'react'

export function MiniPlayer() {
  const {
    currentTrack,
    isPlaying,
    progress,
    volume,
    currentTime,
    duration,
    isLoading,
    queue,
    queuePosition,
    seek,
    setVolume,
    next,
    previous,
    togglePlayPause,
    pause,
    play,
  } = useAudioPlayer()

  const [showVolumeSlider, setShowVolumeSlider] = React.useState(false)
  const [showQueue, setShowQueue] = React.useState(false)
  const [isMuted, setIsMuted] = React.useState(false)
  const [previousVolume, setPreviousVolume] = React.useState(volume)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleVolumeToggle = () => {
    if (isMuted) {
      setVolume(previousVolume)
      setIsMuted(false)
    } else {
      setPreviousVolume(volume)
      setVolume(0)
      setIsMuted(true)
    }
  }

  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0]
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  if (!currentTrack) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        className="fixed bottom-0 left-0 right-0 z-50"
      >
        <Card className="rounded-none border-x-0 border-b-0 bg-background/95 backdrop-blur-xl shadow-2xl">
          {/* Progress Bar */}
          <div
            className="h-1 bg-muted cursor-pointer"
            role="slider"
            tabIndex={0}
            aria-label="Seek position"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const x = e.clientX - rect.left
              const percentage = (x / rect.width) * 100
              seek(percentage)
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') {
                seek(Math.max(0, progress - 5))
              } else if (e.key === 'ArrowRight') {
                seek(Math.min(100, progress + 5))
              }
            }}
          >
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 hover:opacity-100 transition-opacity" />
            </div>
          </div>

          <CardContent className="px-4 py-3">
            <div className="flex items-center gap-4">
              {/* Album Art & Track Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative group cursor-pointer">
                  <img
                    src={currentTrack.artwork}
                    alt={currentTrack.title}
                    className="w-14 h-14 rounded-lg object-cover shadow-lg"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize2 className="w-4 h-4 text-white" />
                  </div>
                  {isLoading && (
                    <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate text-sm">{currentTrack.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
                </div>

                {/* PAGS Earnings Indicator */}
                {currentTrack.pagsPerStream && (
                  <Badge className="bg-green-500/10 border-green-500/20 text-green-500 text-xs px-2 py-1">
                    +{currentTrack.pagsPerStream} PAGS
                  </Badge>
                )}
              </div>

              {/* Center Controls */}
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={previous}
                  className="hidden sm:flex w-8 h-8"
                >
                  <SkipBack className="w-4 h-4" />
                </Button>

                <Button
                  size="icon"
                  className="w-10 h-10 rounded-full bg-white text-black hover:bg-white/90 hover:scale-105 transition-all"
                  onClick={togglePlayPause}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 ml-0.5" />
                  )}
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={next}
                  className="hidden sm:flex w-8 h-8"
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>

              {/* Time Display */}
              <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground font-mono">
                <span>{formatTime(currentTime)}</span>
                <span>/</span>
                <span>{formatTime(duration)}</span>
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="hidden lg:flex w-8 h-8"
                >
                  <Heart className="w-4 h-4" />
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  className="hidden lg:flex w-8 h-8"
                >
                  <Share2 className="w-4 h-4" />
                </Button>

                {currentTrack && (
                  <AddToPlaylistDialog
                    track={currentTrack}
                    trigger={
                      <Button
                        size="icon"
                        variant="ghost"
                        className="hidden lg:flex w-8 h-8"
                      >
                        <Music className="w-4 h-4" />
                      </Button>
                    }
                  />
                )}

                <Button
                  size="icon"
                  variant="ghost"
                  className="hidden sm:flex w-8 h-8"
                  onClick={() => setShowQueue(true)}
                >
                  <List className="w-4 h-4" />
                </Button>

                {/* Volume Control */}
                <div
                  className="hidden md:flex items-center gap-2 relative"
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  onMouseLeave={() => setShowVolumeSlider(false)}
                >
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleVolumeToggle}
                    className="w-8 h-8"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </Button>

                  <AnimatePresence>
                    {showVolumeSlider && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="w-24"
                      >
                        <Slider
                          value={[volume]}
                          onValueChange={handleVolumeChange}
                          max={100}
                          step={1}
                          className="cursor-pointer"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Queue Manager */}
        <QueueManager
          queue={queue}
          currentTrack={currentTrack}
          queuePosition={queuePosition}
          isPlaying={isPlaying}
          onPlay={play}
          onPause={pause}
          onNext={next}
          onPrevious={previous}
          isOpen={showQueue}
          onOpenChange={setShowQueue}
        />
      </motion.div>
    </AnimatePresence>
  )
}
