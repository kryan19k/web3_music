import { createFileRoute } from '@tanstack/react-router'
import { AlbumDetail } from '@/src/components/pageComponents/album/AlbumDetail'

export const Route = createFileRoute('/album/$albumId')({
  component: AlbumDetailRoute,
})

function AlbumDetailRoute() {
  const { albumId } = Route.useParams()
  
  return <AlbumDetail collectionId={albumId} />
}