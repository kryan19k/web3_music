import { ArtistUpload } from '@/src/components/pageComponents/artist/Upload'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/artist/upload')({
  component: ArtistUpload,
})
