import { PlaylistsPage } from '@/src/components/pageComponents/playlists'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/playlists')({
  component: PlaylistsPage,
})
