import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/src/components/ui/sheet'
import type { Track } from '@/src/hooks/useAudioPlayer'
import { cn } from '@/src/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import {
  GripVertical,
  List,
  Music,
  Pause,
  Play,
  Shuffle,
  SkipBack,
  SkipForward,
  Trash2,
  X,
} from 'lucide-react'
import type * as React from 'react'
import { useState } from 'react'

interface QueueManagerProps {
  queue: Track[]
  currentTrack: Track | null
  queuePosition: number
  isPlaying: boolean
  onPlay: (track: Track) => void
  onPause: () => void
  onNext: () => void
  onPrevious: () => void
  onRemoveFromQueue?: (index: number) => void
  onClearQueue?: () => void
  onShuffleQueue?: () => void
  onReorderQueue?: (startIndex: number, endIndex: number) => void
  trigger?: React.ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function QueueManager({
  queue,
  currentTrack,
  queuePosition,
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onRemoveFromQueue,
  onClearQueue,
  onShuffleQueue,
  onReorderQueue,
  trigger,
  isOpen,
  onOpenChange,
}: QueueManagerProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedIndex !== null && draggedIndex !== dropIndex && onReorderQueue) {
      onReorderQueue(draggedIndex, dropIndex)
    }
    setDraggedIndex(null)
  }

  const totalDuration = queue.reduce((sum, track) => sum + track.duration, 0)

  return (
    <Sheet
      open={isOpen}
      onOpenChange={onOpenChange}
    >
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}

      <SheetContent
        side="right"
        className="w-full sm:w-96"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <List className="w-5 h-5" />
            Queue ({queue.length})
          </SheetTitle>
          <SheetDescription>Manage your music queue and playback order</SheetDescription>
        </SheetHeader>

        <div className="h-full flex flex-col gap-4 py-6">
          {/* Queue Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onPrevious}
              disabled={queuePosition <= 0}
            >
              <SkipBack className="w-4 h-4" />
            </Button>

            <Button
              size="sm"
              onClick={isPlaying ? onPause : () => currentTrack && onPlay(currentTrack)}
              disabled={!currentTrack}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onNext}
              disabled={queuePosition >= queue.length - 1}
            >
              <SkipForward className="w-4 h-4" />
            </Button>

            {onShuffleQueue && (
              <Button
                variant="outline"
                size="sm"
                onClick={onShuffleQueue}
                disabled={queue.length <= 1}
              >
                <Shuffle className="w-4 h-4" />
              </Button>
            )}

            {onClearQueue && queue.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={onClearQueue}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Queue Stats */}
          {queue.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total tracks</p>
                    <p className="font-semibold">{queue.length}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total time</p>
                    <p className="font-semibold">{formatDuration(totalDuration)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Queue List */}
          <div className="flex-1 overflow-hidden">
            {queue.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <Music className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No tracks in queue</h3>
                <p className="text-sm text-muted-foreground">Add some music to get started</p>
              </div>
            ) : (
              <div className="h-full overflow-y-auto space-y-2">
                <AnimatePresence>
                  {queue.map((track, index) => {
                    const isCurrentTrack = index === queuePosition
                    const isPastTrack = index < queuePosition

                    return (
                      <motion.div
                        key={`${track.id}-${index}`}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                          'group flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer',
                          isCurrentTrack && 'bg-primary/10 border-primary/50',
                          isPastTrack && 'opacity-60',
                          'hover:bg-accent',
                        )}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                        onClick={() => onPlay(track)}
                      >
                        {/* Drag Handle */}
                        <GripVertical className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing" />

                        {/* Track Number / Playing Indicator */}
                        <div className="w-6 flex items-center justify-center">
                          {isCurrentTrack && isPlaying ? (
                            <div className="w-4 h-4 flex items-center justify-center">
                              <div className="flex gap-0.5">
                                <div className="w-0.5 h-3 bg-primary animate-pulse" />
                                <div
                                  className="w-0.5 h-4 bg-primary animate-pulse"
                                  style={{ animationDelay: '0.1s' }}
                                />
                                <div
                                  className="w-0.5 h-2 bg-primary animate-pulse"
                                  style={{ animationDelay: '0.2s' }}
                                />
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground font-mono">
                              {index + 1}
                            </span>
                          )}
                        </div>

                        {/* Track Info */}
                        <div className="flex-1 min-w-0">
                          <img
                            src={track.artwork}
                            alt={track.title}
                            className="w-10 h-10 rounded object-cover float-left mr-3"
                          />
                          <div className="space-y-1">
                            <p
                              className={cn(
                                'font-medium text-sm line-clamp-1',
                                isCurrentTrack && 'text-primary',
                              )}
                            >
                              {track.title}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {track.artist}
                            </p>
                          </div>
                        </div>

                        {/* Duration */}
                        <span className="text-xs text-muted-foreground font-mono">
                          {formatDuration(track.duration)}
                        </span>

                        {/* Remove Button */}
                        {onRemoveFromQueue && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation()
                              onRemoveFromQueue(index)
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
