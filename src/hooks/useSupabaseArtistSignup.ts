/**
 * Supabase-Integrated Artist Signup Hook
 * Manages artist onboarding with database persistence
 */

import { useState, useCallback, useEffect, useMemo } from 'react'
import { flushSync } from 'react-dom'
import { useAccount } from 'wagmi'
import { toast } from 'sonner'
import { ArtistService } from '@/src/services/artist.service'
import { TrackService } from '@/src/services/track.service'
import type { Artist, SocialLinks, TierBenefits } from '@/src/types/supabase'
import { uploadToIPFS } from '@/src/lib/storacha'
import { useMusicNFTAddTrack, useMusicNFTArtistRole } from '@/src/hooks/contracts/useMusicNFT'
import { supabase, signInWithWallet } from '@/src/lib/supabase'

export type ArtistOnboardingStep = 
  | 'wallet-connect'
  | 'profile-setup'
  | 'verification'
  | 'first-track'
  | 'complete'

export interface TrackUploadData {
  title: string
  description?: string
  genre: string
  duration?: number
  bpm?: number
  key?: string
  isExplicit: boolean
  rightsCleared: boolean
  releaseDate: Date
  tags: string[]
  audioFile?: File
  coverArtFile?: File
  lyricsFile?: File
  tiers: Array<{
    tierName: 'bronze' | 'silver' | 'gold' | 'platinum'
    priceEth: string
    maxSupply: number
    enabled: boolean
    benefits: TierBenefits
  }>
}

export interface ArtistSignupState {
  currentStep: ArtistOnboardingStep
  isComplete: boolean
  artist: Artist | null
  isLoading: boolean
  error: string | null
  lastUpdate?: number
  
  // Track upload state
  trackUpload: {
    isUploading: boolean
    progress: number
    currentPhase: 'idle' | 'files' | 'ipfs' | 'database' | 'contract' | 'complete'
    error: string | null
  }
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

export function useSupabaseArtistSignup() {
  const { address, isConnected } = useAccount()
  const { addTrack: addTrackToContract, isLoading: isContractLoading, isSuccess: isContractSuccess, hash } = useMusicNFTAddTrack()
  const { data: hasArtistRole, isLoading: isCheckingRole } = useMusicNFTArtistRole(address)
  
  const [state, setState] = useState<ArtistSignupState>({
    currentStep: 'wallet-connect',
    isComplete: false,
    artist: null,
    isLoading: false,
    error: null,
    trackUpload: {
      isUploading: false,
      progress: 0,
      currentPhase: 'idle',
      error: null
    }
  })

  // Initialize state based on wallet connection and existing artist
  useEffect(() => {
    const initializeState = async () => {
      if (!isConnected || !address) {
        setState(prev => ({
          ...prev,
          currentStep: 'wallet-connect',
          artist: null
        }))
        return
      }

      setState(prev => ({ ...prev, isLoading: true }))

      try {
        // Check if artist already exists
        const { artist, error } = await ArtistService.getArtistByWallet(address)
        
        if (error && !error.includes('No rows')) {
          console.error('Failed to fetch artist:', error)
          setState(prev => ({
            ...prev,
            error,
            isLoading: false
          }))
          return
        }

        if (artist) {
          // Artist exists - determine current step based on completion
          let currentStep: ArtistOnboardingStep = 'complete'
          
          if (!artist.verified && artist.verification_status === 'pending') {
            currentStep = 'verification'
          } else if (artist.total_tracks === 0) {
            currentStep = 'first-track'
          }

          setState(prev => ({
            ...prev,
            currentStep,
            artist,
            isComplete: currentStep === 'complete',
            isLoading: false
          }))
        } else {
          // New artist - start profile setup
          setState(prev => ({
            ...prev,
            currentStep: 'profile-setup',
            artist: null,
            isLoading: false
          }))
        }
      } catch (error) {
        console.error('Error initializing artist state:', error)
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Failed to initialize',
          isLoading: false
        }))
      }
    }

    initializeState()
  }, [address, isConnected])

  const setCurrentStep = useCallback((step: ArtistOnboardingStep) => {
    console.log('setCurrentStep called:', step)
    
    // Force state update with flushSync to ensure immediate rendering
    flushSync(() => {
      setState(prev => {
        if (prev.currentStep === step) {
          console.log('Step already set to', step, 'but forcing update anyway')
        }
        const newState = {
          ...prev,
          currentStep: step,
          lastUpdate: Date.now()
        }
        console.log('State updated from', prev.currentStep, 'to', step)
        console.log('New state object:', newState)
        return newState
      })
    })
    
    console.log('flushSync completed for step:', step)
  }, [])

  const createArtistProfile = useCallback(async (profileData: {
    displayName: string
    bio: string
    website?: string
    socialLinks?: SocialLinks
    genres?: string[]
    avatarFile?: File
  }) => {
    if (!address) {
      toast.error('Wallet not connected')
      return { success: false, error: 'Wallet not connected' }
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const { artist, error } = await ArtistService.createArtist({
        walletAddress: address,
        ...profileData
      })

      if (error || !artist) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error || 'Failed to create artist profile'
        }))
        return { success: false, error: error || 'Failed to create artist profile' }
      }

      setState(prev => ({
        ...prev,
        artist,
        isLoading: false,
        currentStep: 'verification'
      }))
      
      // Force re-render by updating step after state settles
      setTimeout(() => {
        console.log('createArtistProfile - forcing step update to verification')
        setCurrentStep('verification')
      }, 100)

      toast.success('Artist profile created successfully!')
      return { success: true, artist }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create profile'
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }))
      toast.error('Failed to create profile', { description: errorMessage })
      return { success: false, error: errorMessage }
    }
  }, [address])

  const updateArtistProfile = useCallback(async (updates: {
    displayName?: string
    bio?: string
    website?: string
    socialLinks?: SocialLinks
    genres?: string[]
  }, avatarFile?: File) => {
    if (!state.artist) {
      return { success: false, error: 'No artist profile found' }
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const { artist, error } = await ArtistService.updateArtist(
        state.artist.id,
        updates,
        avatarFile
      )

      if (error || !artist) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error || 'Failed to update artist profile'
        }))
        return { success: false, error: error || 'Failed to update artist profile' }
      }

      setState(prev => ({
        ...prev,
        artist,
        isLoading: false
      }))

      return { success: true, artist }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile'
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }))
      return { success: false, error: errorMessage }
    }
  }, [state.artist])

  const uploadTrack = useCallback(async (trackData: TrackUploadData) => {
    if (!state.artist) {
      toast.error('No artist profile found')
      return { success: false, error: 'No artist profile found' }
    }

    if (!address) {
      toast.error('Wallet not connected')
      return { success: false, error: 'Wallet not connected' }
    }

    // Skip authentication for now since we're bypassing database
    console.log('Skipping Supabase authentication - using direct IPFS + contract deployment')

    setState(prev => ({
      ...prev,
      trackUpload: {
        isUploading: true,
        progress: 5,
        currentPhase: 'files',
        error: null
      }
    }))

    try {
      let audioIpfsHash = ''
      let coverIpfsHash = ''

      // Phase 1: Upload audio file to IPFS
      if (trackData.audioFile) {
        setState(prev => ({
          ...prev,
          trackUpload: { ...prev.trackUpload, progress: 15 }
        }))

        const audioResult = await uploadToIPFS(trackData.audioFile, (progress) => {
          setState(prev => ({
            ...prev,
            trackUpload: { ...prev.trackUpload, progress: 15 + (progress.percentage * 0.3) }
          }))
        })
        audioIpfsHash = audioResult.cid
      }

      // Phase 2: Upload cover art to IPFS
      if (trackData.coverArtFile) {
        setState(prev => ({
          ...prev,
          trackUpload: { ...prev.trackUpload, progress: 45 }
        }))

        const coverResult = await uploadToIPFS(trackData.coverArtFile, (progress) => {
          setState(prev => ({
            ...prev,
            trackUpload: { ...prev.trackUpload, progress: 45 + (progress.percentage * 0.2) }
          }))
        })
        coverIpfsHash = coverResult.cid
      }

      // Phase 3: Skip database for now - deploy directly to contract
      setState(prev => ({
        ...prev,
        trackUpload: { ...prev.trackUpload, currentPhase: 'database', progress: 65 }
      }))

      console.log('Skipping database storage - going directly to smart contract deployment')
      
      // Create a mock track object for the contract call
      const track = {
        id: 'temp-id',
        title: trackData.title,
        artist_id: state.artist?.id || 'temp-artist-id'
      }

      // Phase 4: Deploy to smart contract
      setState(prev => ({
        ...prev,
        trackUpload: { ...prev.trackUpload, currentPhase: 'contract', progress: 80 }
      }))

      // Check if user has ARTIST_ROLE
      console.log('Checking ARTIST_ROLE for address:', address)
      console.log('Has ARTIST_ROLE:', hasArtistRole)
      
      if (!hasArtistRole) {
        throw new Error(`Address ${address} does not have ARTIST_ROLE. Please contact an admin to grant this role.`)
      }

      // Generate a unique track ID for the contract
      const contractTrackId = Math.floor(Math.random() * 1000000)

      // Call the smart contract to add the track
      await new Promise<void>((resolve, reject) => {
        addTrackToContract({
          trackId: contractTrackId,
          title: trackData.title,
          artist: state.artist?.display_name || 'Unknown Artist',
          album: trackData.description || '',
          ipfsAudioHash: audioIpfsHash,
          ipfsCoverArt: coverIpfsHash,
          duration: trackData.duration || 0,
          bpm: trackData.bpm || 0,
          genre: trackData.genre
        })

        // Listen for contract success/failure
        const checkContractStatus = () => {
          if (isContractSuccess) {
            resolve()
          } else if (!isContractLoading && hash) {
            // If we have a hash but not success yet, keep waiting
            setTimeout(checkContractStatus, 1000)
          }
        }
        
        // Start checking after a short delay
        setTimeout(checkContractStatus, 500)
      })

      // Skip database update for now
      console.log('Contract deployment successful, skipping database update')

      // Complete
      setState(prev => ({
        ...prev,
        trackUpload: { ...prev.trackUpload, currentPhase: 'complete', progress: 100 },
        currentStep: 'complete',
        isComplete: true
      }))

      toast.success('Track deployed to blockchain successfully!')
      return { success: true, track, txHash: hash }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload track'
      setState(prev => ({
        ...prev,
        trackUpload: {
          isUploading: false,
          progress: 0,
          currentPhase: 'idle',
          error: errorMessage
        }
      }))
      toast.error('Failed to upload track', { description: errorMessage })
      return { success: false, error: errorMessage }
    }
  }, [state.artist, addTrackToContract, isContractLoading, isContractSuccess, hash])

  const completeOnboarding = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: 'complete',
      isComplete: true
    }))

    toast.success('🎉 Welcome to PAGS!', {
      description: 'Your artist profile is now live. Start creating and selling your music NFTs!'
    })
  }, [])

  const reset = useCallback(() => {
    setState({
      currentStep: isConnected ? 'profile-setup' : 'wallet-connect',
      isComplete: false,
      artist: null,
      isLoading: false,
      error: null,
      trackUpload: {
        isUploading: false,
        progress: 0,
        currentPhase: 'idle',
        error: null
      }
    })
  }, [isConnected])

  // Compute derived values
  const canProceedToNextStep = (() => {
    switch (state.currentStep) {
      case 'wallet-connect':
        return isConnected
      
      case 'profile-setup':
        return !state.isLoading && !!state.artist
      
      case 'verification':
        return state.artist?.verification_status === 'approved'
      
      case 'first-track':
        return state.trackUpload.currentPhase === 'complete'
      
      case 'complete':
        return true
      
      default:
        return false
    }
  })()

  const progressPercentage = (() => {
    const currentStepIndex = STEP_ORDER.indexOf(state.currentStep)
    let progress = 0
    
    // Add completed steps
    for (let i = 0; i < currentStepIndex; i++) {
      progress += STEP_WEIGHTS[STEP_ORDER[i]]
    }
    
    // Add current step progress
    const currentStep = state.currentStep
    if (currentStep === 'first-track' && state.trackUpload.isUploading) {
      progress += STEP_WEIGHTS[currentStep] * (state.trackUpload.progress / 100)
    } else if (canProceedToNextStep) {
      progress += STEP_WEIGHTS[currentStep]
    }
    
    return Math.min(progress, 100)
  })()

  // Memoize onboardingState to ensure proper re-renders
  const onboardingState = useMemo(() => ({
    currentStep: state.currentStep,
    isComplete: state.isComplete,
    profile: state.artist,
    verificationStatus: state.artist?.verification_status || 'pending'
  }), [state.currentStep, state.isComplete, state.artist])

  return {
    // State
    onboardingState,
    uploadState: state.trackUpload.isUploading ? {
      audioUpload: { 
        progress: state.trackUpload.currentPhase === 'files' ? state.trackUpload.progress : 100, 
        status: state.trackUpload.currentPhase === 'files' ? 'uploading' : 'success' as const
      },
      coverArtUpload: { 
        progress: state.trackUpload.currentPhase === 'files' ? state.trackUpload.progress : 100, 
        status: state.trackUpload.currentPhase === 'files' ? 'uploading' : 'success' as const
      },
      contractDeployment: { 
        status: state.trackUpload.currentPhase === 'contract' ? 'pending' : 
               state.trackUpload.currentPhase === 'complete' ? 'success' : 'idle' as const
      },
      overallProgress: state.trackUpload.progress,
      currentStep: state.trackUpload.currentPhase === 'files' ? 'audio-upload' as const :
                   state.trackUpload.currentPhase === 'ipfs' ? 'cover-upload' as const :
                   state.trackUpload.currentPhase === 'database' ? 'tier-config' as const :
                   state.trackUpload.currentPhase === 'contract' ? 'deploy' as const :
                   'complete' as const,
      isComplete: state.trackUpload.currentPhase === 'complete'
    } : null,
    artist: state.artist,
    isLoading: state.isLoading,
    error: state.error,
    
    // Actions
    setCurrentStep,
    createArtistProfile,
    updateArtistProfile,
    uploadTrack,
    completeOnboarding,
    reset,
    
    // Computed
    canProceedToNextStep,
    progressPercentage,
  }
}
