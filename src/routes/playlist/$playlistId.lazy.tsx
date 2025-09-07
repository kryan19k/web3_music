import { PlaylistDetailPage } from '@/src/components/pageComponents/playlist/detail'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/playlist/$playlistId')({
  component: PlaylistDetailPage,
})
