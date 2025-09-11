import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useAccount } from 'wagmi'
import { UserProfileSetup } from '@/src/components/user/UserProfileSetup'
import { useUserDBProfile } from '@/src/hooks/useUserProfile'

export const Route = createFileRoute('/profile/setup')({
  component: ProfileSetupPage,
})

function ProfileSetupPage() {
  const { address, isConnected } = useAccount()
  const { data: existingProfile } = useUserDBProfile(address)

  // Redirect to connect wallet if not connected
  if (!isConnected) {
    return <Navigate to="/" search={{ connectWallet: true }} />
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            {existingProfile ? 'Edit Your Profile' : 'Setup Your Profile'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {existingProfile 
              ? 'Update your profile information and privacy settings'
              : 'Create your profile to start collecting music NFTs and connecting with artists'
            }
          </p>
        </div>
        
        <UserProfileSetup 
          onComplete={() => {
            // Redirect to profile or marketplace after completion
            window.location.href = `/profile/${address}`
          }}
        />
      </div>
    </div>
  )
}