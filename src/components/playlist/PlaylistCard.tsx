import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent } from '@/src/components/ui/card'
import { cn } from '@/src/lib/utils'
import type { Playlist } from '@/src/types/playlist'
import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Clock, Globe, Lock, MoreHorizontal, Music, Pause, Play, Plus } from 'lucide-react'
import { useState } from 'react'

interface PlaylistCardProps {
  playlist: Playlist
  isPlaying?: boolean
  onPlay?: (playlist: Playlist) => void
  onPause?: () => void
  onEdit?: (playlist: Playlist) => void
  onDelete?: (playlistId: string) => void
  onAddToQueue?: (playlist: Playlist) => void
  className?: string
}

export function PlaylistCard({
  playlist,
  isPlaying = false,
  onPlay,
  onPause,
  onEdit,
  onDelete,
  onAddToQueue,
  className,
}: PlaylistCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes} min`
  }

  const handlePlayClick = () => {
    if (isPlaying) {
      onPause?.()
    } else {
      onPlay?.(playlist)
    }
  }

  return (
    <motion.div
      className={cn('w-full', className)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden border-2 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-xl">
        <CardContent className="p-0">
          {/* Playlist Artwork */}
          <div className="relative aspect-square overflow-hidden bg-muted">
            {playlist.artwork ? (
              <img
                src={playlist.artwork}
                alt={playlist.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                <Music className="w-12 h-12 text-muted-foreground" />
              </div>
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 flex items-center justify-center gap-2">
                <Button
                  size="icon"
                  className="w-12 h-12 rounded-full bg-white/90 hover:bg-white text-black hover:scale-110 transition-all"
                  onClick={handlePlayClick}
                  disabled={playlist.trackCount === 0}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </Button>

                {onAddToQueue && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white"
                    onClick={() => onAddToQueue(playlist)}
                    disabled={playlist.trackCount === 0}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Privacy Badge */}
              <div className="absolute top-3 left-3">
                <Badge
                  variant="secondary"
                  className="bg-black/60 text-white"
                >
                  {playlist.isPublic ? (
                    <>
                      <Globe className="w-3 h-3 mr-1" />
                      Public
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3 mr-1" />
                      Private
                    </>
                  )}
                </Badge>
              </div>

              {/* Actions Menu */}
              <div className="absolute top-3 right-3">
                <Button
                  size="icon"
                  variant="ghost"
                  className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white"
                  onClick={() => onEdit?.(playlist)}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Track Count */}
            <div className="absolute bottom-3 right-3">
              <Badge className="bg-black/60 text-white">
                {playlist.trackCount} {playlist.trackCount === 1 ? 'track' : 'tracks'}
              </Badge>
            </div>
          </div>

          {/* Playlist Info */}
          <div className="p-4 space-y-3">
            <div>
              <Link
                to="/playlist/$playlistId"
                params={{ playlistId: playlist.id }}
                className="block hover:text-primary transition-colors"
              >
                <h3 className="font-semibold text-lg line-clamp-1">{playlist.name}</h3>
              </Link>
              {playlist.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {playlist.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDuration(playlist.totalDuration)}
              </div>
              <div className="flex items-center gap-1">
                <Music className="w-3 h-3" />
                {playlist.trackCount} tracks
              </div>
            </div>

            {/* Creator Info */}
            <div className="flex items-center gap-2 pt-2 border-t">
              <Avatar className="w-6 h-6">
                <AvatarImage src={playlist.creator.avatar} />
                <AvatarFallback className="text-xs">
                  {playlist.creator.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">by {playlist.creator.name}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Link
                to="/playlist/$playlistId"
                params={{ playlistId: playlist.id }}
                className="flex-1"
              >
                <Button
                  variant="outline"
                  className="w-full"
                  size="sm"
                >
                  View Playlist
                </Button>
              </Link>
              {playlist.trackCount > 0 && (
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
                  onClick={handlePlayClick}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Play
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
