/**
 * Track Upload Modal for Artist Dashboard
 * Reuses the working logic from FirstTrackStep but as a standalone component
 */

import React, { useState, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/src/components/ui/dialog'
import { Button } from '@/src/components/ui/button'
import { Progress } from '@/src/components/ui/progress'
import { Badge } from '@/src/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { useSupabaseArtistSignup } from '@/src/hooks/useSupabaseArtistSignup'
import { useMusicNFTAddTrack } from '@/src/hooks/contracts/useMusicNFT'
import { TrackMetadata, TrackUploadState, DEFAULT_TIER_CONFIGS } from '@/src/types/artist'
import { TrackUploadForm } from '../ArtistSignupFlow/components/TrackUploadForm'
import { FileUploadZone } from '../ArtistSignupFlow/components/FileUploadZone'
import { TierConfiguration } from '../ArtistSignupFlow/components/TierConfiguration'
import { DeploymentStep } from '../ArtistSignupFlow/components/DeploymentStep'
import { 
  Music, 
  Upload, 
  Settings, 
  Rocket, 
  Check,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Plus,
  X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

type Step = 'metadata' | 'audio-upload' | 'cover-upload' | 'tier-config' | 'deploy' | 'complete'

interface TrackUploadModalProps {
  onTrackCreated?: () => void
  buttonText?: string
  buttonVariant?: 'default' | 'outline' | 'gradient'
  buttonClassName?: string
  fullWidth?: boolean
}

export function TrackUploadModal({ 
  onTrackCreated,
  buttonText = "Upload New Track",
  buttonVariant = "default",
  buttonClassName = "",
  fullWidth = false 
}: TrackUploadModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setStep] = useState<Step>('metadata')
  const [trackData, setTrackData] = useState<Partial<TrackMetadata>>({
    tiers: DEFAULT_TIER_CONFIGS,
  })
  const [uploadState, setUploadState] = useState<TrackUploadState>({
    audioUpload: { progress: 0, status: 'idle' },
    coverArtUpload: { progress: 0, status: 'idle' },
    contractDeployment: { status: 'idle' },
    overallProgress: 0,
    currentStep: 'metadata',
    isComplete: false,
  })

  const { uploadTrack } = useSupabaseArtistSignup()
  const { addTrack, isLoading: isDeploying } = useMusicNFTAddTrack()

  // Reset state when modal opens/closes
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      // Reset state when closing
      setTimeout(() => {
        setStep('metadata')
        setTrackData({ tiers: DEFAULT_TIER_CONFIGS })
        setUploadState({
          audioUpload: { progress: 0, status: 'idle' },
          coverArtUpload: { progress: 0, status: 'idle' },
          contractDeployment: { status: 'idle' },
          overallProgress: 0,
          currentStep: 'metadata',
          isComplete: false,
        })
      }, 300)
    }
  }

  // Calculate overall progress
  const calculateProgress = useCallback(() => {
    const stepWeights = {
      'metadata': 20,
      'audio-upload': 25,
      'cover-upload': 15,
      'tier-config': 15,
      'deploy': 20,
      'complete': 5,
    }

    let progress = 0
    const steps: Step[] = ['metadata', 'audio-upload', 'cover-upload', 'tier-config', 'deploy', 'complete']
    const currentIndex = steps.indexOf(currentStep)

    // Add completed steps
    for (let i = 0; i < currentIndex; i++) {
      progress += stepWeights[steps[i]]
    }

    // Add current step progress based on upload status
    if (currentStep === 'audio-upload' && uploadState.audioUpload.progress > 0) {
      progress += (stepWeights['audio-upload'] * uploadState.audioUpload.progress) / 100
    } else if (currentStep === 'cover-upload' && uploadState.coverArtUpload.progress > 0) {
      progress += (stepWeights['cover-upload'] * uploadState.coverArtUpload.progress) / 100
    } else if (currentStep === 'deploy' && uploadState.contractDeployment.status !== 'idle') {
      progress += stepWeights['deploy'] * 0.5
    }

    return Math.min(progress, 100)
  }, [currentStep, uploadState])

  const handleMetadataComplete = (metadata: Partial<TrackMetadata>) => {
    setTrackData(prev => ({ ...prev, ...metadata }))
    setStep('audio-upload')
  }

  const handleAudioUpload = (file: File, cid: string) => {
    setTrackData(prev => ({ 
      ...prev, 
      audioFile: file,
      ipfsAudioHash: cid 
    }))
    setUploadState(prev => ({
      ...prev,
      audioUpload: { progress: 100, status: 'success', cid }
    }))
    setStep('cover-upload')
  }

  const handleCoverUpload = (file: File, cid: string) => {
    setTrackData(prev => ({ 
      ...prev, 
      coverArtFile: file,
      ipfsCoverArt: cid 
    }))
    setUploadState(prev => ({
      ...prev,
      coverArtUpload: { progress: 100, status: 'success', cid }
    }))
    setStep('tier-config')
  }

  const handleTierConfig = (tiers: any[]) => {
    setTrackData(prev => ({ ...prev, tiers }))
    setStep('deploy')
  }

  const handleDeploy = async () => {
    if (!trackData.audioFile || !trackData.coverArtFile) {
      toast.error('Missing required files - please upload audio and cover art first')
      return
    }

    setUploadState(prev => ({
      ...prev,
      contractDeployment: { status: 'pending' }
    }))

    try {
      // Use the integrated uploadTrack function that handles IPFS + contract deployment
      const result = await uploadTrack({
        title: trackData.title || 'Untitled Track',
        description: trackData.album || 'Single',
        genre: trackData.genre || 'Electronic',
        duration: trackData.duration || 180,
        bpm: trackData.bpm || 120,
        key: trackData.key,
        isExplicit: trackData.isExplicit || false,
        rightsCleared: trackData.rightsCleared || true,
        releaseDate: new Date(),
        tags: trackData.tags || [],
        audioFile: trackData.audioFile,
        coverArtFile: trackData.coverArtFile,
        lyricsFile: trackData.lyricsFile,
        tiers: trackData.tiers || []
      })

      if (result.success) {
        setUploadState(prev => ({
          ...prev,
          contractDeployment: { status: 'success' }
        }))

        toast.success('Track deployed to blockchain successfully!')
        setStep('complete')
        
        // Notify parent component
        onTrackCreated?.()

      } else {
        throw new Error(result.error || 'Deployment failed')
      }

    } catch (error) {
      console.error('Deployment failed:', error)
      setUploadState(prev => ({
        ...prev,
        contractDeployment: { 
          status: 'error',
          error: error instanceof Error ? error.message : 'Deployment failed'
        }
      }))
      
      const errorMessage = error instanceof Error ? error.message : 'Deployment failed'
      toast.error('Deployment failed', { description: errorMessage })
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 'metadata':
        return !!(trackData.title && trackData.artist && trackData.genre)
      case 'audio-upload':
        return uploadState.audioUpload.status === 'success'
      case 'cover-upload':
        return uploadState.coverArtUpload.status === 'success'
      case 'tier-config':
        return true // Can always proceed from tier config
      case 'deploy':
        return uploadState.contractDeployment.status === 'success'
      default:
        return false
    }
  }

  const getCurrentStepComponent = () => {
    switch (currentStep) {
      case 'metadata':
        return <TrackUploadForm onComplete={handleMetadataComplete} initialData={trackData} />
      case 'audio-upload':
        return (
          <FileUploadZone
            type="audio"
            onUploadComplete={handleAudioUpload}
            onProgressUpdate={(progress) => 
              setUploadState(prev => ({
                ...prev,
                audioUpload: { ...prev.audioUpload, progress }
              }))
            }
          />
        )
      case 'cover-upload':
        return (
          <FileUploadZone
            type="image"
            onUploadComplete={handleCoverUpload}
            onProgressUpdate={(progress) => 
              setUploadState(prev => ({
                ...prev,
                coverArtUpload: { ...prev.coverArtUpload, progress }
              }))
            }
          />
        )
      case 'tier-config':
        return <TierConfiguration onComplete={handleTierConfig} initialTiers={trackData.tiers} />
      case 'deploy':
        return <DeploymentStep onDeploy={handleDeploy} isDeploying={isDeploying} />
      case 'complete':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-8 text-center"
          >
            <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Track Created Successfully!</h3>
            <p className="text-muted-foreground mb-6">
              Your music NFT is now live on the Polygon blockchain and ready for fans to discover.
            </p>
            
            <div className="flex justify-center gap-3">
              <Button onClick={() => setIsOpen(false)} variant="outline">
                Close
              </Button>
              <Button onClick={() => {
                setIsOpen(false)
                // Reset for next upload
                setTimeout(() => handleOpenChange(true), 500)
              }}>
                Upload Another Track
              </Button>
            </div>
          </motion.div>
        )
      default:
        return null
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 'metadata': return 'Track Information'
      case 'audio-upload': return 'Upload Audio File'
      case 'cover-upload': return 'Upload Cover Art'
      case 'tier-config': return 'Configure NFT Tiers'
      case 'deploy': return 'Deploy to Blockchain'
      case 'complete': return 'Upload Complete'
      default: return 'Upload Track'
    }
  }

  const progress = calculateProgress()

  // Get button styling based on variant
  const getButtonClassName = () => {
    const baseClasses = "flex items-center gap-2"
    const widthClass = fullWidth ? "w-full justify-start" : ""
    
    let variantClasses = ""
    switch (buttonVariant) {
      case 'gradient':
        variantClasses = "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        break
      case 'outline':
        variantClasses = ""
        break
      default:
        variantClasses = ""
    }
    
    return `${baseClasses} ${widthClass} ${variantClasses} ${buttonClassName}`.trim()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          className={getButtonClassName()}
          variant={buttonVariant === 'gradient' ? 'default' : buttonVariant}
        >
          <Upload className="w-4 h-4" />
          {buttonText}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">
              {getStepTitle()}
            </DialogTitle>
            {currentStep !== 'complete' && (
              <Badge variant="secondary" className="ml-2">
                Step {['metadata', 'audio-upload', 'cover-upload', 'tier-config', 'deploy'].indexOf(currentStep) + 1} of 5
              </Badge>
            )}
          </div>
          
          {/* Progress Bar */}
          {currentStep !== 'complete' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Overall Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
        </DialogHeader>

        <div className="space-y-6">
          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {getCurrentStepComponent()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {currentStep !== 'complete' && (
            <div className="flex justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  const steps: Step[] = ['metadata', 'audio-upload', 'cover-upload', 'tier-config', 'deploy']
                  const currentIndex = steps.indexOf(currentStep)
                  if (currentIndex > 0) {
                    setStep(steps[currentIndex - 1])
                  }
                }}
                disabled={currentStep === 'metadata'}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                
                {currentStep !== 'deploy' && (
                  <Button
                    onClick={() => {
                      const steps: Step[] = ['metadata', 'audio-upload', 'cover-upload', 'tier-config', 'deploy']
                      const currentIndex = steps.indexOf(currentStep)
                      if (currentIndex < steps.length - 1) {
                        setStep(steps[currentIndex + 1])
                      }
                    }}
                    disabled={!canProceed()}
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
