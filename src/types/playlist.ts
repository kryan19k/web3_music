import type { Track } from '@/src/hooks/useAudioPlayer'

export interface Playlist {
  id: string
  name: string
  description?: string
  artwork?: string
  tracks: Track[]
  createdAt: Date
  updatedAt: Date
  isPublic: boolean
  creator: {
    id: string
    name: string
    avatar?: string
  }
  totalDuration: number
  trackCount: number
}

export interface PlaylistMetadata {
  id: string
  name: string
  description?: string
  artwork?: string
  trackCount: number
  totalDuration: number
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

export type PlaylistSortBy = 'name' | 'created' | 'updated' | 'tracks' | 'duration'
export type PlaylistSortOrder = 'asc' | 'desc'

export interface PlaylistFilters {
  search?: string
  sortBy: PlaylistSortBy
  sortOrder: PlaylistSortOrder
  showPublicOnly?: boolean
}

export interface CreatePlaylistData {
  name: string
  description?: string
  artwork?: string
  isPublic?: boolean
  tracks?: Track[]
}

export interface UpdatePlaylistData {
  name?: string
  description?: string
  artwork?: string
  isPublic?: boolean
}
