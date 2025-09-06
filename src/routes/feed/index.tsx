import { SocialFeed } from '@/components/pageComponents/feed/SocialFeed'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/feed/')({
  component: SocialFeed,
})
