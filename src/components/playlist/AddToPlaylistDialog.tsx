import { Button } from '@/src/components/ui/button'
import { Card, CardContent } from '@/src/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/components/ui/dialog'
import { Input } from '@/src/components/ui/input'
import { ScrollArea } from '@/src/components/ui/scroll-area'
import type { Track } from '@/src/hooks/useAudioPlayer'
import { usePlaylistManager } from '@/src/hooks/usePlaylistManager'
import { cn } from '@/src/lib/utils'
import type { Playlist } from '@/src/types/playlist'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Globe, Lock, Music, Plus, Search } from 'lucide-react'
import type * as React from 'react'
import { useMemo, useState } from 'react'
import { CreatePlaylistDialog } from './CreatePlaylistDialog'

interface AddToPlaylistDialogProps {
  track: Track
  trigger?: React.ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function AddToPlaylistDialog({
  track,
  trigger,
  isOpen,
  onOpenChange,
}: AddToPlaylistDialogProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [addingToPlaylist, setAddingToPlaylist] = useState<string | null>(null)

  const { playlists, addTrackToPlaylist, createPlaylist } = usePlaylistManager()

  const isControlled = isOpen !== undefined && onOpenChange !== undefined
  const currentOpen = isControlled ? isOpen : open
  const setCurrentOpen = isControlled ? onOpenChange : setOpen

  // Filter playlists based on search
  const filteredPlaylists = useMemo(() => {
    let filtered = playlists.filter((playlist) => {
      // Don't show system playlists like "Recently Played" for manual adding
      return playlist.id !== 'recently-played'
    })

    if (searchQuery) {
      filtered = filtered.filter(
        (playlist) =>
          playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          playlist.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    return filtered
  }, [playlists, searchQuery])

  const handleAddToPlaylist = async (playlist: Playlist) => {
    // Check if track is already in playlist
    if (playlist.tracks.some((t) => t.id === track.id)) {
      return // Track already exists
    }

    setAddingToPlaylist(playlist.id)
    try {
      await addTrackToPlaylist(playlist.id, track)
    } catch (error) {
      console.error('Failed to add track to playlist:', error)
    } finally {
      setAddingToPlaylist(null)
    }
  }

  const handleCreatePlaylist = (data: CreatePlaylistData) => {
    const newPlaylist = createPlaylist({
      ...data,
      tracks: [track], // Add the current track to new playlist
    })
    setShowCreateDialog(false)
    setCurrentOpen(false)
  }

  const isTrackInPlaylist = (playlist: Playlist) => {
    return playlist.tracks.some((t) => t.id === track.id)
  }

  return (
    <>
      <Dialog
        open={currentOpen}
        onOpenChange={setCurrentOpen}
      >
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Music className="w-5 h-5" />
              Add to Playlist
            </DialogTitle>
            <DialogDescription>Add "{track.title}" to one of your playlists</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Create New Playlist */}
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setShowCreateDialog(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Playlist
            </Button>

            {/* Search Playlists */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search playlists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Playlists List */}
            <ScrollArea className="h-64">
              <div className="space-y-2">
                <AnimatePresence>
                  {filteredPlaylists.map((playlist) => {
                    const isInPlaylist = isTrackInPlaylist(playlist)
                    const isAdding = addingToPlaylist === playlist.id

                    return (
                      <motion.div
                        key={playlist.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        layout
                      >
                        <Card
                          className={cn(
                            'transition-all cursor-pointer hover:shadow-md',
                            isInPlaylist && 'bg-primary/10 border-primary/50',
                          )}
                          onClick={() =>
                            !isInPlaylist && !isAdding && handleAddToPlaylist(playlist)
                          }
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              {/* Playlist Artwork */}
                              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                                {playlist.artwork ? (
                                  <img
                                    src={playlist.artwork}
                                    alt={playlist.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Music className="w-6 h-6 text-muted-foreground" />
                                )}
                              </div>

                              {/* Playlist Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium text-sm line-clamp-1">
                                    {playlist.name}
                                  </h4>
                                  {playlist.isPublic ? (
                                    <Globe className="w-3 h-3 text-muted-foreground" />
                                  ) : (
                                    <Lock className="w-3 h-3 text-muted-foreground" />
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {playlist.trackCount}{' '}
                                  {playlist.trackCount === 1 ? 'track' : 'tracks'}
                                </p>
                              </div>

                              {/* Status */}
                              <div className="flex items-center">
                                {isAdding ? (
                                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                ) : isInPlaylist ? (
                                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                    <Check className="w-3 h-3 text-primary-foreground" />
                                  </div>
                                ) : (
                                  <Plus className="w-5 h-5 text-muted-foreground" />
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>

                {filteredPlaylists.length === 0 && (
                  <div className="text-center py-8">
                    <Music className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {searchQuery ? 'No playlists found' : 'No playlists yet'}
                    </p>
                    {!searchQuery && (
                      <Button
                        variant="link"
                        className="mt-2"
                        onClick={() => setShowCreateDialog(true)}
                      >
                        Create your first playlist
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Playlist Dialog */}
      <CreatePlaylistDialog
        isOpen={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreatePlaylist}
      />
    </>
  )
}
