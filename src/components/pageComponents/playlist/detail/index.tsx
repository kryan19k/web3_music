import { AddToPlaylistDialog } from '@/src/components/playlist/AddToPlaylistDialog'
import { CreatePlaylistDialog } from '@/src/components/playlist/CreatePlaylistDialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent } from '@/src/components/ui/card'
import { Input } from '@/src/components/ui/input'
import { useAudioPlayer } from '@/src/hooks/useAudioPlayer'
import { usePlaylistManager } from '@/src/hooks/usePlaylistManager'
import { cn } from '@/src/lib/utils'
import { useParams, useRouter } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Clock,
  Edit,
  Globe,
  GripVertical,
  Heart,
  Lock,
  MoreHorizontal,
  Music,
  Pause,
  Play,
  Plus,
  Search,
  Share2,
  Shuffle,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'

export function PlaylistDetailPage() {
  const { playlistId } = useParams({ from: '/playlist/$playlistId' })
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const {
    getPlaylistById,
    updatePlaylist,
    deletePlaylist,
    removeTrackFromPlaylist,
    reorderPlaylistTracks,
  } = usePlaylistManager()

  const { play, pause, playQueue, addToQueue, currentTrack, isPlaying } = useAudioPlayer()

  const playlist = getPlaylistById(playlistId)

  if (!playlist) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Music className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Playlist not found</h1>
          <p className="text-muted-foreground mb-6">
            The playlist you're looking for doesn't exist or has been deleted.
          </p>
          <Button onClick={() => router.history.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const filteredTracks = playlist.tracks.filter(
    (track) =>
      searchQuery === '' ||
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handlePlayPlaylist = () => {
    if (playlist.tracks.length > 0) {
      playQueue(playlist.tracks, 0)
    }
  }

  const handlePlayTrack = (track: Track, index: number) => {
    playQueue(playlist.tracks, index)
  }

  const handleDeletePlaylist = () => {
    deletePlaylist(playlist.id)
    router.navigate({ to: '/playlists' })
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
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      reorderPlaylistTracks(playlist.id, draggedIndex, dropIndex)
    }
    setDraggedIndex(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Playlist Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-8">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Playlist Artwork */}
                <div className="w-48 h-48 mx-auto lg:mx-0 rounded-xl overflow-hidden shadow-2xl bg-muted flex items-center justify-center">
                  {playlist.artwork ? (
                    <img
                      src={playlist.artwork}
                      alt={playlist.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Music className="w-20 h-20 text-muted-foreground" />
                  )}
                </div>

                {/* Playlist Info */}
                <div className="flex-1 space-y-4 text-center lg:text-left">
                  <div className="flex items-center gap-2 justify-center lg:justify-start">
                    <Badge variant={playlist.isPublic ? 'default' : 'secondary'}>
                      {playlist.isPublic ? (
                        <>
                          <Globe className="w-3 h-3 mr-1" />
                          Public Playlist
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3 mr-1" />
                          Private Playlist
                        </>
                      )}
                    </Badge>
                  </div>

                  <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {playlist.name}
                  </h1>

                  {playlist.description && (
                    <p className="text-lg text-muted-foreground max-w-2xl">
                      {playlist.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 justify-center lg:justify-start">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={playlist.creator.avatar} />
                      <AvatarFallback>{playlist.creator.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{playlist.creator.name}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{playlist.trackCount} tracks</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">
                      {Math.floor(playlist.totalDuration / 60)} min
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 justify-center lg:justify-start">
                    <Button
                      size="lg"
                      onClick={handlePlayPlaylist}
                      disabled={playlist.trackCount === 0}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Play
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      disabled={playlist.trackCount === 0}
                    >
                      <Shuffle className="w-5 h-5 mr-2" />
                      Shuffle
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                    >
                      <Heart className="w-5 h-5" />
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                    >
                      <Share2 className="w-5 h-5" />
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Track Search */}
        <div className="mb-6 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search in playlist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Button
            variant="outline"
            onClick={() => addToQueue(playlist.tracks[0])}
            disabled={playlist.trackCount === 0}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add All to Queue
          </Button>
        </div>

        {/* Tracks List */}
        <Card>
          <CardContent className="p-0">
            {filteredTracks.length === 0 ? (
              <div className="p-12 text-center">
                {playlist.trackCount === 0 ? (
                  <>
                    <Music className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No tracks yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Start building your playlist by adding some tracks
                    </p>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Browse Music
                    </Button>
                  </>
                ) : (
                  <>
                    <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No tracks found</h3>
                    <p className="text-muted-foreground">Try adjusting your search terms</p>
                  </>
                )}
              </div>
            ) : (
              <div className="divide-y">
                <AnimatePresence>
                  {filteredTracks.map((track, index) => {
                    const isCurrentTrack = currentTrack?.id === track.id
                    const actualIndex = playlist.tracks.findIndex((t) => t.id === track.id)

                    return (
                      <motion.div
                        key={`${track.id}-${index}`}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.02 }}
                        className={cn(
                          'group flex items-center gap-4 p-4 hover:bg-accent transition-colors cursor-pointer',
                          isCurrentTrack && 'bg-primary/10',
                        )}
                        draggable
                        onDragStart={(e) => handleDragStart(e, actualIndex)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, actualIndex)}
                        onClick={() => handlePlayTrack(track, actualIndex)}
                      >
                        {/* Drag Handle */}
                        <GripVertical className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing" />

                        {/* Track Number / Playing Indicator */}
                        <div className="w-8 flex items-center justify-center">
                          {isCurrentTrack && isPlaying ? (
                            <div className="flex gap-0.5">
                              <div className="w-0.5 h-4 bg-primary animate-pulse" />
                              <div
                                className="w-0.5 h-3 bg-primary animate-pulse"
                                style={{ animationDelay: '0.1s' }}
                              />
                              <div
                                className="w-0.5 h-5 bg-primary animate-pulse"
                                style={{ animationDelay: '0.2s' }}
                              />
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground font-mono group-hover:hidden">
                              {actualIndex + 1}
                            </span>
                          )}
                          <Play className="w-4 h-4 text-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        {/* Track Info */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <img
                            src={track.artwork}
                            alt={track.title}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p
                              className={cn(
                                'font-medium line-clamp-1',
                                isCurrentTrack && 'text-primary',
                              )}
                            >
                              {track.title}
                            </p>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {track.artist}
                            </p>
                          </div>
                        </div>

                        {/* PAGS Earnings */}
                        {track.pagsPerStream && (
                          <Badge className="bg-green-500/10 border-green-500/20 text-green-500">
                            +{track.pagsPerStream} PAGS
                          </Badge>
                        )}

                        {/* Duration */}
                        <span className="text-sm text-muted-foreground font-mono min-w-[3rem] text-right">
                          {formatDuration(track.duration)}
                        </span>

                        {/* Actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="w-8 h-8"
                            onClick={(e) => {
                              e.stopPropagation()
                              addToQueue(track)
                            }}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>

                          <AddToPlaylistDialog
                            track={track}
                            trigger={
                              <Button
                                size="icon"
                                variant="ghost"
                                className="w-8 h-8"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Music className="w-4 h-4" />
                              </Button>
                            }
                          />

                          <Button
                            size="icon"
                            variant="ghost"
                            className="w-8 h-8"
                          >
                            <Heart className="w-4 h-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            className="w-8 h-8 text-destructive hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeTrackFromPlaylist(playlist.id, track.id)
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Playlist Dialog */}
        <CreatePlaylistDialog
          isOpen={isEditing}
          onOpenChange={setIsEditing}
          onSubmit={(data) => {
            updatePlaylist(playlist.id, data)
            setIsEditing(false)
          }}
          initialData={playlist}
          isEditing={true}
        />
      </div>
    </div>
  )
}
