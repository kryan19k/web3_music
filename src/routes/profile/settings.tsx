import { ProfileSettings } from '@/src/components/pageComponents/profile/Settings'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/profile/settings')({
  component: ProfileSettings,
})
