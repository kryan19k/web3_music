import type { Track } from '@/src/hooks/useAudioPlayer'
import type {
  CreatePlaylistData,
  Playlist,
  PlaylistFilters,
  PlaylistMetadata,
  UpdatePlaylistData,
} from '@/src/types/playlist'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

// Storage keys
const PLAYLISTS_STORAGE_KEY = 'music_playlists'
const PLAYLIST_PREFERENCES_KEY = 'playlist_preferences'

interface PlaylistManagerState {
  playlists: Playlist[]
  currentPlaylist: Playlist | null
  isLoading: boolean
  filters: PlaylistFilters
}

// Mock user data
const MOCK_USER = {
  id: 'user-1',
  name: 'You',
  avatar: '/api/placeholder/32/32',
}

export function usePlaylistManager() {
  const [state, setState] = useState<PlaylistManagerState>({
    playlists: [],
    currentPlaylist: null,
    isLoading: true,
    filters: {
      sortBy: 'updated',
      sortOrder: 'desc',
    },
  })

  // Load playlists from localStorage
  useEffect(() => {
    const loadPlaylists = () => {
      try {
        const stored = localStorage.getItem(PLAYLISTS_STORAGE_KEY)
        const preferences = localStorage.getItem(PLAYLIST_PREFERENCES_KEY)

        const playlists = stored ? JSON.parse(stored) : getDefaultPlaylists()
        const filters = preferences ? JSON.parse(preferences) : state.filters

        // Parse dates
        const parsedPlaylists = playlists.map(
          (playlist: Playlist & { createdAt: string | Date; updatedAt: string | Date }) => ({
            ...playlist,
            createdAt: new Date(playlist.createdAt),
            updatedAt: new Date(playlist.updatedAt),
          }),
        )

        setState((prev) => ({
          ...prev,
          playlists: parsedPlaylists,
          filters,
          isLoading: false,
        }))
      } catch (error) {
        console.error('Failed to load playlists:', error)
        setState((prev) => ({
          ...prev,
          playlists: getDefaultPlaylists(),
          isLoading: false,
        }))
      }
    }

    loadPlaylists()
  }, [state.filters])

  // Save playlists to localStorage
  const savePlaylists = useCallback((playlists: Playlist[]) => {
    try {
      localStorage.setItem(PLAYLISTS_STORAGE_KEY, JSON.stringify(playlists))
    } catch (error) {
      console.error('Failed to save playlists:', error)
      toast.error('Failed to save playlists')
    }
  }, [])

  // Save preferences to localStorage
  const savePreferences = useCallback((filters: PlaylistFilters) => {
    try {
      localStorage.setItem(PLAYLIST_PREFERENCES_KEY, JSON.stringify(filters))
    } catch (error) {
      console.error('Failed to save preferences:', error)
    }
  }, [])

  // Create new playlist
  const createPlaylist = useCallback(
    (data: CreatePlaylistData): Playlist => {
      const now = new Date()
      const newPlaylist: Playlist = {
        id: `playlist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: data.name,
        description: data.description,
        artwork: data.artwork,
        tracks: data.tracks || [],
        createdAt: now,
        updatedAt: now,
        isPublic: data.isPublic || false,
        creator: MOCK_USER,
        totalDuration: (data.tracks || []).reduce((sum, track) => sum + track.duration, 0),
        trackCount: (data.tracks || []).length,
      }

      const updatedPlaylists = [...state.playlists, newPlaylist]
      setState((prev) => ({ ...prev, playlists: updatedPlaylists }))
      savePlaylists(updatedPlaylists)
      toast.success(`Playlist "${data.name}" created successfully`)

      return newPlaylist
    },
    [state.playlists, savePlaylists],
  )

  // Update playlist
  const updatePlaylist = useCallback(
    (playlistId: string, data: UpdatePlaylistData) => {
      const updatedPlaylists = state.playlists.map((playlist) =>
        playlist.id === playlistId
          ? {
              ...playlist,
              ...data,
              updatedAt: new Date(),
            }
          : playlist,
      )

      setState((prev) => ({ ...prev, playlists: updatedPlaylists }))
      savePlaylists(updatedPlaylists)
      toast.success('Playlist updated successfully')
    },
    [state.playlists, savePlaylists],
  )

  // Delete playlist
  const deletePlaylist = useCallback(
    (playlistId: string) => {
      const playlist = state.playlists.find((p) => p.id === playlistId)
      if (!playlist) return

      const updatedPlaylists = state.playlists.filter((p) => p.id !== playlistId)
      setState((prev) => ({ ...prev, playlists: updatedPlaylists }))
      savePlaylists(updatedPlaylists)
      toast.success(`Playlist "${playlist.name}" deleted`)
    },
    [state.playlists, savePlaylists],
  )

  // Add track to playlist
  const addTrackToPlaylist = useCallback(
    (playlistId: string, track: Track) => {
      const updatedPlaylists = state.playlists.map((playlist) =>
        playlist.id === playlistId
          ? {
              ...playlist,
              tracks: [...playlist.tracks, track],
              trackCount: playlist.trackCount + 1,
              totalDuration: playlist.totalDuration + track.duration,
              updatedAt: new Date(),
            }
          : playlist,
      )

      setState((prev) => ({ ...prev, playlists: updatedPlaylists }))
      savePlaylists(updatedPlaylists)

      const playlist = state.playlists.find((p) => p.id === playlistId)
      toast.success(`Added "${track.title}" to "${playlist?.name}"`)
    },
    [state.playlists, savePlaylists],
  )

  // Remove track from playlist
  const removeTrackFromPlaylist = useCallback(
    (playlistId: string, trackId: string) => {
      const updatedPlaylists = state.playlists.map((playlist) =>
        playlist.id === playlistId
          ? {
              ...playlist,
              tracks: playlist.tracks.filter((track) => track.id !== trackId),
              trackCount: playlist.trackCount - 1,
              totalDuration:
                playlist.totalDuration -
                (playlist.tracks.find((t) => t.id === trackId)?.duration || 0),
              updatedAt: new Date(),
            }
          : playlist,
      )

      setState((prev) => ({ ...prev, playlists: updatedPlaylists }))
      savePlaylists(updatedPlaylists)
      toast.success('Track removed from playlist')
    },
    [state.playlists, savePlaylists],
  )

  // Reorder tracks in playlist
  const reorderPlaylistTracks = useCallback(
    (playlistId: string, startIndex: number, endIndex: number) => {
      const updatedPlaylists = state.playlists.map((playlist) => {
        if (playlist.id !== playlistId) return playlist

        const newTracks = [...playlist.tracks]
        const [removed] = newTracks.splice(startIndex, 1)
        newTracks.splice(endIndex, 0, removed)

        return {
          ...playlist,
          tracks: newTracks,
          updatedAt: new Date(),
        }
      })

      setState((prev) => ({ ...prev, playlists: updatedPlaylists }))
      savePlaylists(updatedPlaylists)
    },
    [state.playlists, savePlaylists],
  )

  // Get playlist by ID
  const getPlaylistById = useCallback(
    (playlistId: string): Playlist | undefined => {
      return state.playlists.find((playlist) => playlist.id === playlistId)
    },
    [state.playlists],
  )

  // Get filtered playlists
  const getFilteredPlaylists = useCallback((): Playlist[] => {
    let filtered = [...state.playlists]

    // Search filter
    if (state.filters.search) {
      const search = state.filters.search.toLowerCase()
      filtered = filtered.filter(
        (playlist) =>
          playlist.name.toLowerCase().includes(search) ||
          playlist.description?.toLowerCase().includes(search) ||
          playlist.tracks.some(
            (track) =>
              track.title.toLowerCase().includes(search) ||
              track.artist.toLowerCase().includes(search),
          ),
      )
    }

    // Public only filter
    if (state.filters.showPublicOnly) {
      filtered = filtered.filter((playlist) => playlist.isPublic)
    }

    // Sort
    filtered.sort((a, b) => {
      const { sortBy, sortOrder } = state.filters
      let comparison = 0

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'created':
          comparison = a.createdAt.getTime() - b.createdAt.getTime()
          break
        case 'updated':
          comparison = a.updatedAt.getTime() - b.updatedAt.getTime()
          break
        case 'tracks':
          comparison = a.trackCount - b.trackCount
          break
        case 'duration':
          comparison = a.totalDuration - b.totalDuration
          break
      }

      return sortOrder === 'desc' ? -comparison : comparison
    })

    return filtered
  }, [state.playlists, state.filters])

  // Update filters
  const updateFilters = useCallback(
    (newFilters: Partial<PlaylistFilters>) => {
      const updatedFilters = { ...state.filters, ...newFilters }
      setState((prev) => ({ ...prev, filters: updatedFilters }))
      savePreferences(updatedFilters)
    },
    [state.filters, savePreferences],
  )

  // Set current playlist
  const setCurrentPlaylist = useCallback((playlist: Playlist | null) => {
    setState((prev) => ({ ...prev, currentPlaylist: playlist }))
  }, [])

  return {
    ...state,
    filteredPlaylists: getFilteredPlaylists(),
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    reorderPlaylistTracks,
    getPlaylistById,
    updateFilters,
    setCurrentPlaylist,
  }
}

// Default playlists for new users
function getDefaultPlaylists(): Playlist[] {
  const now = new Date()

  return [
    {
      id: 'favorites',
      name: 'Liked Songs',
      description: 'Your favorite tracks',
      artwork: '/api/placeholder/300/300',
      tracks: [],
      createdAt: now,
      updatedAt: now,
      isPublic: false,
      creator: MOCK_USER,
      totalDuration: 0,
      trackCount: 0,
    },
    {
      id: 'recently-played',
      name: 'Recently Played',
      description: "Tracks you've listened to recently",
      artwork: '/api/placeholder/300/300',
      tracks: [],
      createdAt: now,
      updatedAt: now,
      isPublic: false,
      creator: MOCK_USER,
      totalDuration: 0,
      trackCount: 0,
    },
  ]
}
