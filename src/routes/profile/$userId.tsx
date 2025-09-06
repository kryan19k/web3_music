import { UserProfile } from '@/components/pageComponents/profile/UserProfile'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/profile/$userId')({
  component: UserProfile,
})
