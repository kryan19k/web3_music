/**
 * First Track Step
 * Complete track upload and NFT creation process
 */

import React, { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import { Progress } from '@/src/components/ui/progress'
import { Badge } from '@/src/components/ui/badge'
import { useSupabaseArtistSignup } from '@/src/hooks/useSupabaseArtistSignup'
import { useMusicNFTAddTrack } from '@/src/hooks/contracts/useMusicNFT'
import { TrackMetadata, TrackUploadState, DEFAULT_TIER_CONFIGS } from '@/src/types/artist'
import { TrackUploadForm } from '../components/TrackUploadForm'
import { FileUploadZone } from '../components/FileUploadZone'
import { TierConfiguration } from '../components/TierConfiguration'
import { DeploymentStep } from '../components/DeploymentStep'
import { 
  Music, 
  Upload, 
  Settings, 
  Rocket, 
  Check,
  AlertCircle,
  ArrowLeft,
  ArrowRight
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

type Step = 'metadata' | 'audio-upload' | 'cover-upload' | 'tier-config' | 'deploy' | 'complete'

export function FirstTrackStep() {
  const { setCurrentStep, completeOnboarding, uploadTrack } = useSupabaseArtistSignup()
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

  const { addTrack, isLoading: isDeploying } = useMusicNFTAddTrack()

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
        
        // Note: completeOnboarding is handled automatically in uploadTrack

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
            className="text-center py-12"
          >
            <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Track Created Successfully!</h3>
            <p className="text-muted-foreground">
              Your music NFT is now live and ready for fans to discover.
            </p>
          </motion.div>
        )
      default:
        return null
    }
  }

  const stepTitles = {
    'metadata': 'Track Information',
    'audio-upload': 'Upload Audio',
    'cover-upload': 'Upload Cover Art',
    'tier-config': 'Configure Tiers',
    'deploy': 'Deploy to Blockchain',
    'complete': 'Complete!'
  }

  const stepIcons = {
    'metadata': Music,
    'audio-upload': Upload,
    'cover-upload': Upload,
    'tier-config': Settings,
    'deploy': Rocket,
    'complete': Check
  }

  const CurrentIcon = stepIcons[currentStep]

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4">
          <CurrentIcon className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Create Your First Track</h2>
        <p className="text-muted-foreground text-lg">
          Upload your music and create NFTs that fans can collect and trade
        </p>
      </motion.div>

      {/* Progress */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Upload Progress</h3>
            <span className="text-sm font-medium">{Math.round(calculateProgress())}%</span>
          </div>
          <Progress value={calculateProgress()} className="h-2 mb-4" />
          
          {/* Step Indicators */}
          <div className="flex justify-between text-xs">
            {Object.entries(stepTitles).map(([step, title]) => {
              const isActive = currentStep === step
              const isComplete = ['metadata', 'audio-upload', 'cover-upload', 'tier-config', 'deploy'].indexOf(currentStep) > 
                               ['metadata', 'audio-upload', 'cover-upload', 'tier-config', 'deploy'].indexOf(step)
              
              return (
                <div
                  key={step}
                  className={`text-center ${
                    isActive ? 'text-primary' : isComplete ? 'text-green-500' : 'text-muted-foreground'
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full mx-auto mb-1 ${
                      isActive ? 'bg-primary' : isComplete ? 'bg-green-500' : 'bg-border'
                    }`}
                  />
                  <span>{title}</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Card className="min-h-[600px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <CurrentIcon className="w-6 h-6" />
            {stepTitles[currentStep]}
            {uploadState.contractDeployment.status === 'error' && (
              <Badge variant="destructive">
                <AlertCircle className="w-3 h-3 mr-1" />
                Error
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
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
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={() => {
            if (currentStep === 'metadata') {
              setCurrentStep('verification')
            } else {
              // Handle going back to previous step
              const steps: Step[] = ['metadata', 'audio-upload', 'cover-upload', 'tier-config', 'deploy', 'complete']
              const currentIndex = steps.indexOf(currentStep)
              if (currentIndex > 0) {
                setStep(steps[currentIndex - 1])
              }
            }
          }}
          disabled={currentStep === 'complete' || isDeploying}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {currentStep !== 'deploy' && currentStep !== 'complete' && (
          <Button
            onClick={() => {
              const steps: Step[] = ['metadata', 'audio-upload', 'cover-upload', 'tier-config', 'deploy']
              const currentIndex = steps.indexOf(currentStep)
              if (currentIndex < steps.length - 1 && canProceed()) {
                setStep(steps[currentIndex + 1])
              }
            }}
            disabled={!canProceed()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  )
}
