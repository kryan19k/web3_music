import { ArtistDashboard } from '@/src/components/pageComponents/artist/Dashboard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/artist/dashboard')({
  component: ArtistDashboard,
})
