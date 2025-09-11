/**
 * Artist Signup Flow - Main Component
 * Advanced multi-step onboarding experience for artists
 */

import React from 'react'
import { Card } from '@/src/components/ui/card'
import { Progress } from '@/src/components/ui/progress'
import { useSupabaseArtistSignup } from '@/src/hooks/useSupabaseArtistSignup'
import { WalletConnectionStep } from './steps/WalletConnectionStep'
import { ProfileSetupStep } from './steps/ProfileSetupStep'
import { VerificationStep } from './steps/VerificationStep'
// Removed FirstTrackStep - track creation now happens in dashboard
import { CompleteStep } from './steps/CompleteStep'
import { motion, AnimatePresence } from 'framer-motion'

export function ArtistSignupFlow() {
  const { onboardingState, progressPercentage, isLoading, setCurrentStep } = useSupabaseArtistSignup()
  const [forceRender, setForceRender] = React.useState(0)
  const [localStep, setLocalStep] = React.useState<string | null>(null)
  
  // Debug: Track when component re-renders
  React.useEffect(() => {
    console.log('ArtistSignupFlow - Step:', onboardingState.currentStep, '| Loading:', isLoading)
  }, [onboardingState.currentStep, isLoading])

  // Sync local step with hook step
  React.useEffect(() => {
    if (localStep !== onboardingState.currentStep) {
      setLocalStep(onboardingState.currentStep)
      setForceRender(prev => prev + 1)
    }
  }, [onboardingState.currentStep])

  // Listen for custom force step change events
  React.useEffect(() => {
    const handleForceStepChange = (event: CustomEvent) => {
      console.log('ArtistSignupFlow - Received forceStepChange event:', event.detail)
      setLocalStep(event.detail)
      setCurrentStep(event.detail)
      setForceRender(prev => prev + 1)
    }

    window.addEventListener('forceStepChange', handleForceStepChange as EventListener)
    return () => {
      window.removeEventListener('forceStepChange', handleForceStepChange as EventListener)
    }
  }, [setCurrentStep])

  const renderCurrentStep = () => {
    const currentStep = onboardingState.currentStep
    console.log('🎨 [RENDER] Step:', currentStep)
    
    switch (currentStep) {
      case 'wallet-connect':
        return <WalletConnectionStep />
      case 'profile-setup':
        return <ProfileSetupStep />
      case 'verification':
        return <VerificationStep />
      case 'complete':
        return <CompleteStep />
      default:
        console.log('🎨 [RENDER] Unknown step:', currentStep)
        return <WalletConnectionStep />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/50">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)] opacity-30" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
              Join Blockify as an Artist
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Create, mint, and sell your music as NFTs. Build a direct connection with your fans and earn from your Music.
            </p>
          </motion.div>
        </div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="max-w-4xl mx-auto mb-8 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-muted-foreground">
                Setup Progress
              </h2>
              <span className="text-sm font-medium">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            
            {/* Step Indicators */}
            <div className="flex justify-between mt-4">
              {[
                { step: 'wallet-connect', label: 'Connect' },
                { step: 'profile-setup', label: 'Profile' },
                { step: 'verification', label: 'Apply' },
                { step: 'complete', label: 'Done' },
              ].map(({ step, label }) => {
                const isCurrentStep = onboardingState.currentStep === step
                const stepProgress = getStepProgress(step)
                const isCompleted = progressPercentage > stepProgress
                
                console.log(`Step ${step}: current=${isCurrentStep}, progress=${stepProgress}, completed=${isCompleted}`)
                
                return (
                  <div
                    key={step}
                    className={`flex flex-col items-center space-y-1 ${
                      isCurrentStep
                        ? 'text-primary'
                        : isCompleted
                        ? 'text-green-500'
                        : 'text-muted-foreground'
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full transition-colors ${
                        isCurrentStep
                          ? 'bg-primary'
                          : isCompleted
                          ? 'bg-green-500'
                          : 'bg-border'
                      }`}
                    />
                    <span className="text-xs font-medium">{label}</span>
                  </div>
                )
              })}
            </div>
          </Card>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={`step-${onboardingState.currentStep}-${forceRender}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div data-step={onboardingState.currentStep}>
                {renderCurrentStep()}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

// Helper function to calculate step progress
function getStepProgress(step: string): number {
  const steps = ['wallet-connect', 'profile-setup', 'verification', 'complete']
  const weights = [15, 40, 35, 10]
  
  const stepIndex = steps.indexOf(step)
  if (stepIndex === -1) return 0
  
  let progress = 0
  for (let i = 0; i < stepIndex; i++) {
    progress += weights[i]
  }
  
  return progress
}
