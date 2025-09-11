/**
 * Artist Signup State Management Hook
 */

import { useState, useCallback, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { toast } from 'sonner'
import { 
  ArtistOnboardingState, 
  ArtistOnboardingStep, 
  ArtistProfile,
  TrackMetadata,
  TrackUploadState,
} from '@/src/types/artist'

interface ArtistSignupHook {
  // State
  onboardingState: ArtistOnboardingState
  uploadState: TrackUploadState | null
  
  // Actions
  setCurrentStep: (step: ArtistOnboardingStep) => void
  updateProfile: (updates: Partial<ArtistProfile>) => void
  startTrackUpload: (metadata: TrackMetadata) => void
  completeOnboarding: () => void
  reset: () => void
  
  // Computed
  canProceedToNextStep: boolean
  progressPercentage: number
}

const STEP_ORDER: ArtistOnboardingStep[] = [
  'wallet-connect',
  'profile-setup', 
  'verification',
  'first-track',
  'complete'
]

const STEP_WEIGHTS = {
  'wallet-connect': 10,
  'profile-setup': 30,
  'verification': 15,
  'first-track': 40,
  'complete': 5
}

export function useArtistSignup(): ArtistSignupHook {
  const { address, isConnected } = useAccount()
  
  const [onboardingState, setOnboardingState] = useState<ArtistOnboardingState>(() => {
    // Try to restore from localStorage
    const saved = localStorage.getItem('artist-onboarding-state')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        return {
          ...parsed,
          profile: {
            ...parsed.profile,
            address: address || parsed.profile.address
          }
        }
      } catch {
        // Ignore invalid saved state
      }
    }
    
    return {
      currentStep: isConnected ? 'profile-setup' : 'wallet-connect',
      isComplete: false,
      profile: {
        address: address || '0x',
        displayName: '',
        bio: '',
        socialLinks: {},
        verified: false,
        joinedAt: new Date(),
        totalTracks: 0,
        totalEarnings: '0',
        followers: 0,
      },
      verificationStatus: 'pending',
    }
  })

  const [uploadState, setUploadState] = useState<TrackUploadState | null>(null)

  // Save state to localStorage whenever it changes
  useEffect(() => {
    console.log('useArtistSignup - Saving to localStorage:', onboardingState)
    localStorage.setItem('artist-onboarding-state', JSON.stringify(onboardingState))
  }, [onboardingState])

  // Debug: Track state changes
  useEffect(() => {
    console.log('useArtistSignup - State changed:', {
      currentStep: onboardingState.currentStep,
      profileName: onboardingState.profile.displayName,
      profileBio: onboardingState.profile.bio
    })
  }, [onboardingState.currentStep, onboardingState.profile.displayName, onboardingState.profile.bio])

  // Update address when wallet connects
  useEffect(() => {
    if (address && address !== onboardingState.profile.address) {
      setOnboardingState(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          address,
        },
        currentStep: prev.currentStep === 'wallet-connect' ? 'profile-setup' : prev.currentStep
      }))
    }
  }, [address, onboardingState.profile.address])

  const setCurrentStep = useCallback((step: ArtistOnboardingStep) => {
    console.log('useArtistSignup - setCurrentStep called with:', step)
    console.log('useArtistSignup - Current state before update:', onboardingState.currentStep)
    
    setOnboardingState(prev => {
      console.log('useArtistSignup - Previous state:', prev.currentStep, '-> New state:', step)
      const newState = {
        ...prev,
        currentStep: step
      }
      console.log('useArtistSignup - New state object:', newState)
      return newState
    })
  }, [])

  const updateProfile = useCallback((updates: Partial<ArtistProfile>) => {
    setOnboardingState(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        ...updates
      }
    }))
  }, [])

  const startTrackUpload = useCallback((metadata: TrackMetadata) => {
    const initialUploadState: TrackUploadState = {
      audioUpload: {
        progress: 0,
        status: 'idle'
      },
      coverArtUpload: {
        progress: 0,
        status: 'idle'
      },
      contractDeployment: {
        status: 'idle'
      },
      overallProgress: 0,
      currentStep: 'metadata',
      isComplete: false
    }

    if (metadata.lyricsFile) {
      initialUploadState.lyricsUpload = {
        progress: 0,
        status: 'idle'
      }
    }

    setUploadState(initialUploadState)
    setCurrentStep('first-track')
  }, [setCurrentStep])

  const completeOnboarding = useCallback(() => {
    setOnboardingState(prev => ({
      ...prev,
      currentStep: 'complete',
      isComplete: true
    }))
    
    // Clear saved state
    localStorage.removeItem('artist-onboarding-state')
    
    toast.success('🎉 Welcome to PAGS!', {
      description: 'Your artist profile is now live. Start creating and selling your music NFTs!'
    })
  }, [])

  const reset = useCallback(() => {
    setOnboardingState({
      currentStep: isConnected ? 'profile-setup' : 'wallet-connect',
      isComplete: false,
      profile: {
        address: address || '0x',
        displayName: '',
        bio: '',
        socialLinks: {},
        verified: false,
        joinedAt: new Date(),
        totalTracks: 0,
        totalEarnings: '0',
        followers: 0,
      },
      verificationStatus: 'pending',
    })
    setUploadState(null)
    localStorage.removeItem('artist-onboarding-state')
  }, [address, isConnected])

  // Compute derived values
  const canProceedToNextStep = (() => {
    switch (onboardingState.currentStep) {
      case 'wallet-connect':
        return isConnected
      
      case 'profile-setup':
        return !!(
          onboardingState.profile.displayName?.trim() &&
          onboardingState.profile.bio?.trim()
        )
      
      case 'verification':
        return onboardingState.verificationStatus === 'approved'
      
      case 'first-track':
        return uploadState?.isComplete || false
      
      case 'complete':
        return true
      
      default:
        return false
    }
  })()

  const progressPercentage = (() => {
    const currentStepIndex = STEP_ORDER.indexOf(onboardingState.currentStep)
    let progress = 0
    
    // Add completed steps
    for (let i = 0; i < currentStepIndex; i++) {
      progress += STEP_WEIGHTS[STEP_ORDER[i]]
    }
    
    // Add current step progress
    const currentStep = onboardingState.currentStep
    if (currentStep === 'first-track' && uploadState) {
      progress += STEP_WEIGHTS[currentStep] * (uploadState.overallProgress / 100)
    } else if (canProceedToNextStep) {
      progress += STEP_WEIGHTS[currentStep]
    }
    
    return Math.min(progress, 100)
  })()

  return {
    onboardingState,
    uploadState,
    setCurrentStep,
    updateProfile,
    startTrackUpload,
    completeOnboarding,
    reset,
    canProceedToNextStep,
    progressPercentage,
  }
}
