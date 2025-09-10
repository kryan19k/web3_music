/**
 * Artist Signup Route
 * Advanced multi-step artist onboarding flow
 */

import { ArtistSignupFlow } from '@/src/components/artist/ArtistSignupFlow'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/artist/signup/')({
  component: ArtistSignupFlow,
  beforeLoad: ({ location }) => {
    // TODO: Add authentication check here
    // Redirect to wallet connection if not connected
  },
})