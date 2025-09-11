import { createFileRoute } from '@tanstack/react-router'
import { ArtistApplicationStatus } from '@/src/components/artist/ArtistApplicationStatus'

export const Route = createFileRoute('/artist/application-status')({
  component: ArtistApplicationStatusPage,
})

function ArtistApplicationStatusPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/50">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)] opacity-30" />
      </div>

      <div className="relative z-10">
        <ArtistApplicationStatus />
      </div>
    </div>
  )
}