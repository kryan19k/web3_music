import { CreatePlaylistDialog } from '@/src/components/playlist/CreatePlaylistDialog'
import { PlaylistCard } from '@/src/components/playlist/PlaylistCard'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/custom-tabs'
import { Input } from '@/src/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select'
import { useAudioPlayer } from '@/src/hooks/useAudioPlayer'
import type { Track } from '@/src/hooks/useAudioPlayer'
import { usePlaylistManager } from '@/src/hooks/usePlaylistManager'
import { cn } from '@/src/lib/utils'
import type { Playlist, PlaylistSortBy, PlaylistSortOrder } from '@/src/types/playlist'
import { AnimatePresence, motion } from 'framer-motion'
import { Grid3X3, List, Music, Plus, Search, SortAsc, SortDesc } from 'lucide-react'
import { useState } from 'react'

type ViewMode = 'grid' | 'list'

export function PlaylistsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const {
    filteredPlaylists,
    filters,
    updateFilters,
    createPlaylist,
    deletePlaylist,
    setCurrentPlaylist,
    isLoading,
  } = usePlaylistManager()

  const { playQueue, currentTrack, isPlaying, pause, addToQueue } = useAudioPlayer()

  const handlePlayPlaylist = (playlist: Playlist) => {
    if (playlist.tracks.length > 0) {
      setCurrentPlaylist(playlist)
      playQueue(playlist.tracks, 0)
    }
  }

  const handleAddToQueue = (playlist: Playlist) => {
    for (const track of playlist.tracks) {
      addToQueue(track)
    }
  }

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-') as [PlaylistSortBy, PlaylistSortOrder]
    updateFilters({ sortBy, sortOrder })
  }

  const currentSortValue = `${filters.sortBy}-${filters.sortOrder}`

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading playlists...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              Your Playlists
            </motion.h1>
            <p className="text-muted-foreground mt-2">
              Manage your music collections and discover new sounds
            </p>
          </div>

          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Playlist
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Playlists</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-500">{filteredPlaylists.length}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Tracks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-pink-500">
                  {filteredPlaylists.reduce((sum, p) => sum + p.trackCount, 0)}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-500">
                  {Math.floor(
                    filteredPlaylists.reduce((sum, p) => sum + p.totalDuration, 0) / 3600,
                  )}
                  h
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filters and View Controls */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search playlists..."
                  value={filters.search || ''}
                  onChange={(e) => updateFilters({ search: e.target.value })}
                  className="pl-9"
                />
              </div>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <Select
                  value={currentSortValue}
                  onValueChange={handleSortChange}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="updated-desc">Recently Updated</SelectItem>
                    <SelectItem value="created-desc">Recently Created</SelectItem>
                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                    <SelectItem value="tracks-desc">Most Tracks</SelectItem>
                    <SelectItem value="duration-desc">Longest Duration</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode Toggle */}
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Playlists Content */}
        <Tabs
          value="all"
          onValueChange={() => {}}
          className="space-y-6"
        >
          <TabsList>
            <TabsTrigger value="all">All Playlists</TabsTrigger>
            <TabsTrigger value="public">Public</TabsTrigger>
            <TabsTrigger value="private">Private</TabsTrigger>
          </TabsList>

          <TabsContent
            value="all"
            className="space-y-6"
          >
            <PlaylistGrid
              playlists={filteredPlaylists}
              viewMode={viewMode}
              onPlay={handlePlayPlaylist}
              onPause={pause}
              onAddToQueue={handleAddToQueue}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
            />
          </TabsContent>

          <TabsContent
            value="public"
            className="space-y-6"
          >
            <PlaylistGrid
              playlists={filteredPlaylists.filter((p) => p.isPublic)}
              viewMode={viewMode}
              onPlay={handlePlayPlaylist}
              onPause={pause}
              onAddToQueue={handleAddToQueue}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
            />
          </TabsContent>

          <TabsContent
            value="private"
            className="space-y-6"
          >
            <PlaylistGrid
              playlists={filteredPlaylists.filter((p) => !p.isPublic)}
              viewMode={viewMode}
              onPlay={handlePlayPlaylist}
              onPause={pause}
              onAddToQueue={handleAddToQueue}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
            />
          </TabsContent>
        </Tabs>

        {/* Create Playlist Dialog */}
        <CreatePlaylistDialog
          isOpen={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onSubmit={(data) => {
            createPlaylist(data)
            setShowCreateDialog(false)
          }}
        />
      </div>
    </div>
  )
}

interface PlaylistGridProps {
  playlists: Playlist[]
  viewMode: ViewMode
  onPlay: (playlist: Playlist) => void
  onPause: () => void
  onAddToQueue: (playlist: Playlist) => void
  currentTrack: Track | null
  isPlaying: boolean
}

function PlaylistGrid({
  playlists,
  viewMode,
  onPlay,
  onPause,
  onAddToQueue,
  currentTrack,
  isPlaying,
}: PlaylistGridProps) {
  if (playlists.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center">
          <Music className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No playlists found</h3>
          <p className="text-muted-foreground mb-6">
            Create your first playlist to organize your music
          </p>
          <CreatePlaylistDialog
            trigger={
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Playlist
              </Button>
            }
            onSubmit={(data) => {
              // This will be handled by the parent component
            }}
          />
        </div>
      </Card>
    )
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {playlists.map((playlist, index) => (
            <motion.div
              key={playlist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <PlaylistCard
                playlist={playlist}
                isPlaying={isPlaying && currentTrack?.id === playlist.tracks[0]?.id}
                onPlay={onPlay}
                onPause={onPause}
                onAddToQueue={onAddToQueue}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    )
  }

  // List view
  return (
    <div className="space-y-4">
      <AnimatePresence>
        {playlists.map((playlist, index) => (
          <motion.div
            key={playlist.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  {/* Playlist Artwork */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                    {playlist.artwork ? (
                      <img
                        src={playlist.artwork}
                        alt={playlist.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Music className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>

                  {/* Playlist Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg line-clamp-1">{playlist.name}</h3>
                    {playlist.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                        {playlist.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{playlist.trackCount} tracks</span>
                      <span>{Math.floor(playlist.totalDuration / 60)} min</span>
                      <Badge variant={playlist.isPublic ? 'default' : 'secondary'}>
                        {playlist.isPublic ? 'Public' : 'Private'}
                      </Badge>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAddToQueue(playlist)}
                      disabled={playlist.trackCount === 0}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onPlay(playlist)}
                      disabled={playlist.trackCount === 0}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
                    >
                      <Music className="w-4 h-4 mr-2" />
                      Play
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
