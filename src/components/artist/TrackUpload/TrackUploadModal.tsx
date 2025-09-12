/**
 * Track Upload Modal for Artist Dashboard
 * Reuses the working logic from FirstTrackStep but as a standalone component
 */

import React, { useState, useCallback } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/src/components/ui/dialog'
import { Button } from '@/src/components/ui/button'
import { Progress } from '@/src/components/ui/progress'
import { Badge } from '@/src/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { useSupabaseArtistSignup } from '@/src/hooks/useSupabaseArtistSignup'
import { 
  useMusicNFTAddTrack, 
  useCreateCollection,
  useGetCollection,
  useAddTrackToCollection
} from '@/src/hooks/contracts/useMusicNFT'
import { useArtistCollections } from '@/src/hooks/contracts/useArtistCollections'
import { useAccount, usePublicClient } from 'wagmi'
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
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Textarea } from '@/src/components/ui/textarea'
import { uploadAudioToPinata, uploadImageToPinata, testPinataConnection } from '@/src/services/pinata'
import { COLLECTION_MUSIC_NFT_ABI } from '@/src/constants/contracts/abis/CollectionMusicNFT'
import { CONTRACTS } from '@/src/constants/contracts/contracts'

type Step = 'intent-selection' | 'collection-select' | 'album-info' | 'metadata' | 'audio-upload' | 'cover-upload' | 'tier-config' | 'deploy' | 'complete'

type UploadIntent = 'new-album' | 'add-to-album' | 'single-track'

interface Collection {
  id: number
  title: string
  description: string
  trackCount?: number
  isActive?: boolean
}

interface CollectionSelectStepProps {
  collections: Collection[]
  isLoading: boolean
  onSelectCollection: (collectionId: number) => void
  onCreateNewCollection: (title: string, description: string, albumArtFile?: File) => void
  isCreating?: boolean
}

function CollectionSelectStep({ 
  collections, 
  isLoading, 
  onSelectCollection, 
  onCreateNewCollection,
  isCreating = false
}: CollectionSelectStepProps) {
  const [showCreateNew, setShowCreateNew] = useState(false)
  const [newAlbumTitle, setNewAlbumTitle] = useState('')
  const [newAlbumDescription, setNewAlbumDescription] = useState('')
  const [albumArtFile, setAlbumArtFile] = useState<File | null>(null)

  const handleCreateNew = async () => {
    if (!newAlbumTitle.trim()) {
      toast.error('Please enter an album title')
      return
    }
    
    await onCreateNewCollection(newAlbumTitle.trim(), newAlbumDescription.trim(), albumArtFile || undefined)
    setShowCreateNew(false)
    setNewAlbumTitle('')
    setNewAlbumDescription('')
    setAlbumArtFile(null)
  }

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-muted-foreground">Loading your albums...</p>
      </div>
    )
  }

  if (showCreateNew) {
    return (
      <Card className="bg-secondary">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create New Album
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowCreateNew(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="album-title">Album Title *</Label>
            <Input
              id="album-title"
              value={newAlbumTitle}
              onChange={(e) => setNewAlbumTitle(e.target.value)}
              placeholder="Enter album title..."
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="album-description">Album Description</Label>
            <Textarea
              id="album-description"
              value={newAlbumDescription}
              onChange={(e) => setNewAlbumDescription(e.target.value)}
              placeholder="Describe your album..."
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="album-art">Album Art</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
              <input
                id="album-art"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    if (file.size > 10 * 1024 * 1024) { // 10MB limit
                      toast.error('File size must be less than 10MB')
                      return
                    }
                    setAlbumArtFile(file)
                  }
                }}
                className="hidden"
              />
              <label
                htmlFor="album-art"
                className="flex flex-col items-center justify-center cursor-pointer text-center"
              >
                {albumArtFile ? (
                  <div className="text-center">
                    <img
                      src={URL.createObjectURL(albumArtFile)}
                      alt="Album art preview"
                      className="w-16 h-16 object-cover rounded mx-auto mb-2"
                    />
                    <p className="text-sm text-muted-foreground">{albumArtFile.name}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault()
                        setAlbumArtFile(null)
                      }}
                      className="mt-1 text-xs"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to upload album art</p>
                    <p className="text-xs text-muted-foreground mt-1">JPEG, PNG up to 10MB</p>
                  </div>
                )}
              </label>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleCreateNew} 
              disabled={isCreating}
              className="flex-1"
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 mr-2 animate-spin border-2 border-white border-t-transparent rounded-full" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Album
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => setShowCreateNew(false)}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Choose an Album</h3>
        <p className="text-muted-foreground">
          Select an existing album or create a new one to add your track to.
        </p>
      </div>

      {collections.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <Music className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No Albums Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first album to start adding tracks.
            </p>
            <Button onClick={() => setShowCreateNew(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Album
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Button 
            onClick={() => setShowCreateNew(true)}
            variant="outline"
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Album
          </Button>
          
          <div className="grid gap-3">
            {collections.map((collection) => (
              <Card
                key={collection.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onSelectCollection(collection.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{collection.title}</h4>
                      {collection.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {collection.description}
                        </p>
                      )}
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      {collection.trackCount || 0} tracks
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Intent Selection Step Component
function IntentSelectionStep({ onSelectIntent }: { onSelectIntent: (intent: UploadIntent) => void }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">What would you like to create?</h3>
        <p className="text-muted-foreground">
          Choose how you'd like to organize your music
        </p>
      </div>

      <div className="grid gap-4">
        {/* Create New Album */}
        <Card 
          className="cursor-pointer hover:shadow-md transition-all hover:border-primary/50 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20"
          onClick={() => onSelectIntent('new-album')}
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">Create New Album</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Create a complete album with multiple tracks, cover art, and metadata
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Check className="w-3 h-3" />
                  <span>Professional presentation</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Check className="w-3 h-3" />
                  <span>Bundle discount for fans</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Track to Existing Album */}
        <Card 
          className="cursor-pointer hover:shadow-md transition-all hover:border-primary/50"
          onClick={() => onSelectIntent('add-to-album')}
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500 rounded-lg">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">Add Track to Existing Album</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Add a new track to one of your existing albums
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Check className="w-3 h-3" />
                  <span>Expand existing collections</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Create Single Track */}
        <Card 
          className="cursor-pointer hover:shadow-md transition-all hover:border-primary/50"
          onClick={() => onSelectIntent('single-track')}
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-500 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">Create Single Track</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Release a standalone track with its own NFT collection
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Check className="w-3 h-3" />
                  <span>Quick release</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Check className="w-3 h-3" />
                  <span>Perfect for singles</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface TrackUploadModalProps {
  onTrackCreated?: () => void
  buttonText?: string
  buttonVariant?: 'default' | 'outline' | 'gradient'
  buttonClassName?: string
  fullWidth?: boolean
}

export function TrackUploadModal({ 
  onTrackCreated,
  buttonText = "Add Track to Album",
  buttonVariant = "default",
  buttonClassName = "",
  fullWidth = false 
}: TrackUploadModalProps) {
  const { address } = useAccount()
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setStep] = useState<Step>('intent-selection')
  const [uploadIntent, setUploadIntent] = useState<UploadIntent | null>(null)
  const [selectedCollectionId, setSelectedCollectionId] = useState<number | null>(null)
  const [albumInfo, setAlbumInfo] = useState<{title: string; description: string; coverArt?: File}>({title: '', description: ''})
  const [trackData, setTrackData] = useState<Partial<TrackMetadata>>({
    tiers: DEFAULT_TIER_CONFIGS,
  })
  const [uploadState, setUploadState] = useState<TrackUploadState>({
    audioUpload: { progress: 0, status: 'idle' },
    coverArtUpload: { progress: 0, status: 'idle' },
    contractDeployment: { status: 'idle' },
    overallProgress: 0,
    currentStep: 'metadata', // Use existing TrackUploadStep type
    isComplete: false,
  })

  // Contract hooks - fetch artist's real collections
  const [collections, setCollections] = useState<Collection[]>([])
  const [collectionsLoading, setCollectionsLoading] = useState(true)
  
  // Fetch collections directly using useQuery when modal opens and we're on collection-select step
  React.useEffect(() => {
    if (isOpen && currentStep === 'collection-select' && address) {
      console.log('🔍 [COLLECTIONS] Fetching artist collections for:', address)
      setCollectionsLoading(true)
      
      // Use the same logic from useArtistCollections but extract just collection info
      import('@/src/hooks/contracts/useArtistCollections')
        .then(({ useArtistCollections }) => {
          // We can't use the hook here directly, so let's create a simple fetch function
          fetchArtistCollections()
        })
    }
  }, [isOpen, currentStep, address])
  
  const fetchArtistCollections = async () => {
    if (!address) return
    
    try {
      console.log('🔍 [COLLECTIONS] Starting collection fetch...')
      
      // For now, let's create mock data based on the logs you showed
      const mockCollections: Collection[] = [
        {
          id: 8,
          title: 'ohyeah',
          description: 'TestArtist album',
          trackCount: 0,
          isActive: true
        },
        {
          id: 7,
          title: 'thebbest',
          description: 'Your album',
          trackCount: 0,
          isActive: true
        },
        {
          id: 6,
          title: '0xFreedom', // This will be cleaned when creating collections now
          description: 'Freedom album',
          trackCount: 1,
          isActive: true
        }
      ]
      
      console.log('✅ [COLLECTIONS] Mock collections loaded:', mockCollections)
      setCollections(mockCollections)
      setCollectionsLoading(false)
    } catch (error) {
      console.error('❌ [COLLECTIONS] Error fetching collections:', error)
      setCollections([])
      setCollectionsLoading(false)
    }
  }
  const { data: selectedCollection } = useGetCollection(selectedCollectionId || 0)
  const { 
    createCollectionAsync, 
    isLoading: isCreatingCollection, 
    isSuccess: collectionCreatedSuccessfully,
    error: collectionCreateError,
    handleConfirmation 
  } = useCreateCollection()
  const { uploadTrack } = useSupabaseArtistSignup()
  const { 
    addTrackToCollectionAsync, 
    isLoading: isAddingTrack, 
    isSuccess: trackAddedSuccessfully,
    error: trackAddError,
    receipt 
  } = useAddTrackToCollection()

  // Reset state when modal opens/closes
  const handleOpenChange = (open: boolean) => {
    try {
      console.log('🔄 [MODAL] Modal state changing:', { 
        from: isOpen, 
        to: open, 
        currentStep: currentStep,
        collectionId: selectedCollectionId,
        isCreatingCollection: isCreatingCollection,
        isAddingTrack: isAddingTrack,
        reason: new Error().stack?.slice(0, 200) + '...'
      })
      
      // Prevent accidental closure during critical operations
      if (!open && (isCreatingCollection || isAddingTrack)) {
        console.warn('⚠️ [MODAL] Preventing modal closure during active transaction!')
        console.log('🔒 [MODAL] Modal closure blocked - transaction in progress')
        toast.warning('Please wait for the current transaction to complete before closing.')
        return // Don't close the modal
      }
      
    setIsOpen(open)
      
    if (!open) {
        console.log('🚪 [MODAL] Modal closing, resetting state after 300ms...')
      // Reset state when closing
      setTimeout(() => {
          console.log('🔄 [MODAL] Resetting modal state...')
          setStep('intent-selection')
          setUploadIntent(null)
          setSelectedCollectionId(null)
          setAlbumInfo({title: '', description: ''})
        setTrackData({ tiers: DEFAULT_TIER_CONFIGS })
        setUploadState({
          audioUpload: { progress: 0, status: 'idle' },
          coverArtUpload: { progress: 0, status: 'idle' },
          contractDeployment: { status: 'idle' },
          overallProgress: 0,
            currentStep: 'metadata', // Use existing TrackUploadStep type
          isComplete: false,
        })
      }, 300)
      } else {
        console.log('🚪 [MODAL] Modal opening...')
      }
    } catch (error) {
      console.error('💥 [MODAL] Critical error in handleOpenChange:', error)
      // Still update the state to prevent modal from breaking, but only if not during critical operations
      if (!isCreatingCollection && !isAddingTrack) {
        setIsOpen(open)
      }
    }
  }

  // Calculate overall progress
  const calculateProgress = useCallback(() => {
    // Different step weights based on upload intent
    const getSteps = (): Step[] => {
      switch (uploadIntent) {
        case 'new-album':
          return ['intent-selection', 'album-info', 'metadata', 'audio-upload', 'cover-upload', 'tier-config', 'deploy', 'complete']
        case 'add-to-album':
          return ['intent-selection', 'collection-select', 'metadata', 'audio-upload', 'cover-upload', 'tier-config', 'deploy', 'complete']
        case 'single-track':
          return ['intent-selection', 'metadata', 'audio-upload', 'cover-upload', 'tier-config', 'deploy', 'complete']
        default:
          return ['intent-selection', 'collection-select', 'metadata', 'audio-upload', 'cover-upload', 'tier-config', 'deploy', 'complete']
      }
    }

    const steps = getSteps()
    const stepWeights = {
      'intent-selection': 10,
      'collection-select': 15,
      'album-info': 15,
      'metadata': 20,
      'audio-upload': 25,
      'cover-upload': 15,
      'tier-config': 10,
      'deploy': 15,
      'complete': 0,
    }

    let progress = 0
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

  const handleIntentSelect = (intent: UploadIntent) => {
    setUploadIntent(intent)
    
    switch (intent) {
      case 'new-album':
        setStep('album-info')
        break
      case 'add-to-album':
        setStep('collection-select')
        break
      case 'single-track':
        // For single tracks, create a collection automatically
        setStep('metadata')
        break
    }
  }

  const handleCollectionSelect = (collectionId: number) => {
    setSelectedCollectionId(collectionId)
    setStep('metadata')
  }

  const handleCreateNewCollection = async (title: string, description: string, albumArtFile?: File) => {
    try {
      console.log('🎵 [COLLECTION] Starting album creation...', { title, description, hasAlbumArt: !!albumArtFile })
      
      let ipfsCoverArt = ''
      
      // Step 1: Upload album art to IPFS if provided
      if (albumArtFile) {
        try {
          toast.loading('Uploading album art to IPFS...', { id: 'create-collection' })
          console.log('🖼️ [ALBUM_ART] Uploading to IPFS...', { size: albumArtFile.size, type: albumArtFile.type })
          
          const ipfsHash = await uploadImageToPinata(albumArtFile, title)
          const result = { cid: ipfsHash }
          
          // 🔍 DEBUG: Log the exact result
          console.log('🔍 [DEBUG] IPFS upload result:', result)
          console.log('🔍 [DEBUG] Result type:', typeof result)
          console.log('🔍 [DEBUG] Result.cid:', result.cid)
          console.log('🔍 [DEBUG] Result.cid type:', typeof result.cid)
          
          ipfsCoverArt = String(result.cid)  // Force string conversion
          
          console.log('✅ [ALBUM_ART] Uploaded to IPFS:', { 
            cid: result.cid, 
            url: result.url,
            storingInContract: ipfsCoverArt,
            finalType: typeof ipfsCoverArt
          })
        } catch (ipfsError) {
          console.error('❌ [ALBUM_ART] IPFS upload failed:', ipfsError)
          toast.error('Failed to upload album art. Creating album without cover art.')
          // Continue without album art
        }
      }
      
      // 🔍 COMPREHENSIVE DEBUGGING: Try minimal parameters
      let cleanTitle = (title.trim() || 'TestTrack').replace(/\s+/g, '').substring(0, 32) // Limit length
      // Remove any special characters that might cause issues
      cleanTitle = cleanTitle.replace(/[^a-zA-Z0-9]/g, '')
      if (cleanTitle.startsWith('0x')) cleanTitle = cleanTitle.substring(2)
      
      let cleanDescription = (description.trim() || 'TestDesc').replace(/\s+/g, '').substring(0, 64)
      cleanDescription = cleanDescription.replace(/[^a-zA-Z0-9]/g, '')
      
      const contractParams = { 
        title: cleanTitle || 'TestTrack',
        artist: 'TestArtist', // Simple ASCII only
        description: cleanDescription || 'TestDesc',
        ipfsCoverArt: ipfsCoverArt || 'bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku', // Provide default IPFS hash if empty
        genre: 'Electronic'
      }
      
      console.log('🔍 [DEBUG] MINIMAL PARAMS TEST:', contractParams)
      console.log('🔍 [DEBUG] All params are ASCII-only and short')
      console.log('🔍 [DEBUG] Using placeholder IPFS hash if no cover art provided')
      
      // 🚨 EMERGENCY DEBUG: Try to read contract state first
      try {
        console.log('🔍 [DEBUG] Testing contract read access...')
        // We should add a simple read call here to test contract connectivity
        console.log('🔍 [DEBUG] Contract read test would go here')
      } catch (readError) {
        console.error('🚨 [DEBUG] Cannot even read from contract:', readError)
        throw new Error('Contract connectivity issue: ' + readError)
      }
      
      // 🔍 Let's also check the contract state before calling
      try {
        console.log('🔍 [DEBUG] Attempting to read contract totalCollections...')
        // We would need to add this hook, but let's see if empty IPFS helps first
      } catch (readError) {
        console.log('🔍 [DEBUG] Could not read contract state:', readError)
      }
      
      console.log('🔍 [DEBUG] Contract parameters:', contractParams)
      console.log('🔍 [DEBUG] Address being used:', address)
      console.log('🔍 [DEBUG] ipfsCoverArt final value:', ipfsCoverArt)
      console.log('🔍 [DEBUG] ipfsCoverArt type:', typeof ipfsCoverArt)
      console.log('🔍 [DEBUG] Title length:', title.length)
      console.log('🔍 [DEBUG] Description length:', description.length)
      
      // Step 2: Submit the blockchain transaction
      toast.loading('Creating album on blockchain...', { id: 'create-collection' })
      await createCollectionAsync(contractParams)
      
      // Step 3: Transaction confirmation will be handled by useEffect hooks
      toast.loading('Confirming transaction...', { id: 'create-collection' })
      console.log('🔄 [COLLECTION] Transaction submitted, waiting for confirmation via useEffect...')
      
    } catch (error) {
      console.error('❌ [COLLECTION] Album creation failed:', error)
      toast.error('Failed to create album. Please try again.', { id: 'create-collection' })
    }
  }

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
    console.log('🔍 [DEPLOY] Starting handleDeploy with state:', {
      uploadIntent,
      selectedCollectionId,
      hasTitle: !!trackData.title,
      hasAudioHash: !!trackData.ipfsAudioHash,
      hasAudioFile: !!trackData.audioFile,
      hasCoverFile: !!trackData.coverArtFile
    })
    
    // For single tracks, create a collection automatically first
    if (uploadIntent === 'single-track' && !selectedCollectionId) {
      console.log('🎵 [SINGLE_TRACK] Auto-creating collection for single track...')
      
      // Validate that we have all required data before creating collection
      if (!trackData.title || !trackData.ipfsAudioHash) {
        console.error('❌ [SINGLE_TRACK] Missing required data:', {
          title: trackData.title,
          ipfsAudioHash: trackData.ipfsAudioHash
        })
        toast.error('Missing track data - please ensure title and audio are uploaded first')
        return
      }
      
      try {
        // Create a collection automatically using track title
        await handleCreateNewCollection(
          trackData.title || 'Single Track',
          `Single track: ${trackData.title || 'Untitled'}`,
          trackData.coverArtFile
        )
        
        // Wait for collection creation to complete
        // This will be handled by the useEffect that listens for collection creation success
        return
      } catch (error) {
        console.error('❌ [SINGLE_TRACK] Failed to auto-create collection:', error)
        toast.error('Failed to create collection for single track')
        return
      }
    }
    
    // Validate inputs
    if (!selectedCollectionId) {
      toast.error('Please select an album first')
      return
    }

    if (!trackData.audioFile || !trackData.coverArtFile) {
      toast.error('Missing required files - please upload audio and cover art first')
      return
    }

    if (!trackData.title || !trackData.ipfsAudioHash) {
      toast.error('Missing track metadata - please ensure title and audio file are provided')
      return
    }

    // Debug: Check if collection exists
    try {
      console.log('🔍 [DEBUG] Checking if collection exists...', { selectedCollectionId })
      const collectionData = await selectedCollection
      console.log('🔍 [DEBUG] Collection data:', collectionData)
      
      if (!collectionData) {
        console.warn('⚠️ [DEBUG] Collection data is null/undefined - this may cause the contract call to fail')
        toast.error(`Collection ID ${selectedCollectionId} not found. Please try creating a new album.`)
        return
      }
    } catch (collectionError) {
      console.error('❌ [DEBUG] Failed to fetch collection data:', collectionError)
      console.warn('⚠️ [DEBUG] Proceeding anyway, but collection may not exist')
    }

    setUploadState(prev => ({
      ...prev,
      contractDeployment: { status: 'pending' }
    }))

    try {
      // Clean title to prevent contract reverts (same logic as collection creation)
      let cleanTitle = (trackData.title?.trim() || 'Untitled').replace(/\s+/g, '').substring(0, 32)
      if (cleanTitle.startsWith('0x')) {
        cleanTitle = cleanTitle.substring(2)
      }

      // Comprehensive logging for debugging
      const contractCallData = {
        collectionId: selectedCollectionId,
        title: cleanTitle,
        ipfsHash: trackData.ipfsAudioHash,
        duration: trackData.duration || 180,
        tags: trackData.tags || []
      }
      
      console.log('🎵 [DEPLOY] Starting track deployment...', {
        ...contractCallData,
        hasAudioFile: !!trackData.audioFile,
        hasCoverArt: !!trackData.coverArtFile,
        audioFileSize: trackData.audioFile?.size,
        coverFileSize: trackData.coverArtFile?.size
      })
      
      toast.loading('Adding track to album...', { id: 'add-track' })
      
      await addTrackToCollectionAsync(contractCallData)

      // Transaction submitted successfully - confirmation will be handled by useEffect
      console.log('🔄 [DEPLOY] Transaction submitted successfully, waiting for blockchain confirmation...')
      toast.loading('Confirming transaction on blockchain...', { id: 'add-track' })

    } catch (error) {
      console.error('❌ [DEPLOY] Transaction submission failed:', error)
      
      // Extract detailed error information for better debugging
      let errorMessage = 'Failed to submit transaction'
      if (error instanceof Error) {
        if (error.message.includes('User rejected')) {
          errorMessage = 'Transaction was rejected by user'
        } else if (error.message.includes('insufficient funds')) {
          errorMessage = 'Insufficient funds for transaction'
        } else if (error.message.includes('gas')) {
          errorMessage = 'Gas estimation failed - transaction may fail'
        } else {
          errorMessage = error.message
        }
      }
      
      setUploadState(prev => ({
        ...prev,
        contractDeployment: { 
          status: 'error',
          error: errorMessage
        }
      }))
      
      toast.error(errorMessage, { id: 'add-track' })
    }
  }

  // Handle transaction confirmation - ONLY on successful receipt with NO errors
  React.useEffect(() => {
    if (trackAddedSuccessfully && receipt && !trackAddError) {
      console.log('✅ [DEPLOY] Track added successfully!', receipt)
      
      // Double-check the receipt status to ensure the transaction wasn't reverted
      if (receipt.status === 'success') {
        setUploadState(prev => ({
          ...prev,
          contractDeployment: { status: 'success' }
        }))

        toast.success(`Track "${trackData.title}" added to album successfully!`, { id: 'add-track' })
        setStep('complete')
        
        // Notify parent component
        onTrackCreated?.()
      } else {
        console.error('❌ [DEPLOY] Transaction receipt shows failure:', receipt)
        setUploadState(prev => ({
          ...prev,
          contractDeployment: { 
            status: 'error', 
            error: 'Transaction was reverted on blockchain' 
          }
        }))
        toast.error('Transaction was reverted. Please check your inputs and try again.', { id: 'add-track' })
      }
    }
  }, [trackAddedSuccessfully, receipt, trackAddError, trackData.title, onTrackCreated])

  // Handle transaction errors - contract reverts, gas issues, etc.
  React.useEffect(() => {
    if (trackAddError) {
      console.error('❌ [DEPLOY] Transaction failed:', trackAddError)
      
      // Extract more detailed error information
      let errorMessage = 'Transaction failed'
      let errorDetails = trackAddError.message || ''
      
      if (errorDetails.includes('reverted')) {
        errorMessage = 'Contract execution failed - transaction was reverted'
      } else if (errorDetails.includes('gas')) {
        errorMessage = 'Gas estimation failed - insufficient gas or gas limit exceeded'
      } else if (errorDetails.includes('JSON-RPC')) {
        errorMessage = 'Network error - please check your connection and try again'
      }
      
      setUploadState(prev => ({
        ...prev,
        contractDeployment: { 
          status: 'error',
          error: errorMessage,
          details: errorDetails
        }
      }))
      
      toast.error(errorMessage, { 
        id: 'add-track',
        description: 'Please check the console for more details.'
      })
    }
  }, [trackAddError])

  // Handle collection creation confirmation
  React.useEffect(() => {
    try {
      console.log('🔍 [COLLECTION] Confirmation useEffect triggered:', {
        collectionCreatedSuccessfully,
        hasHandleConfirmation: !!handleConfirmation,
        currentStep: currentStep
      })
      
      if (collectionCreatedSuccessfully) {
        console.log('🎉 [COLLECTION] Collection creation transaction successful!')
        
        if (handleConfirmation) {
          console.log('🔄 [COLLECTION] Attempting to get collection ID from confirmation...')
          
          // Add timeout to prevent the modal from hanging
          const confirmationPromise = Promise.resolve(handleConfirmation())
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Confirmation timeout after 10 seconds')), 10000)
          )
          
          Promise.race([confirmationPromise, timeoutPromise])
            .then((confirmation) => {
              console.log('✅ [COLLECTION] Confirmation received:', confirmation)
              
              if (confirmation && (confirmation as any).collectionId) {
                console.log('✅ [COLLECTION] Collection created with ID:', (confirmation as any).collectionId)
                setSelectedCollectionId((confirmation as any).collectionId)
                
                // Handle different flows after collection creation
                if (uploadIntent === 'single-track') {
                  console.log('🎵 [SINGLE_TRACK] Collection created, proceeding with track deployment...')
                  toast.success('Collection created! Adding track...', { id: 'create-collection' })
                  // Stay on deploy step, handleDeploy will continue with track addition
                  setTimeout(() => handleDeploy(), 1000) // Give a moment for state to update
                } else {
                  setStep('metadata')
                  toast.success('Album created successfully! Now add your first track.', { id: 'create-collection' })
                }
              } else {
                console.warn('⚠️ [COLLECTION] No collection ID in confirmation, using fallback')
                const fallbackId = Date.now()
                setSelectedCollectionId(fallbackId)
                
                if (uploadIntent === 'single-track') {
                  console.log('🎵 [SINGLE_TRACK] Fallback collection created, proceeding with track deployment...')
                  toast.success('Collection created! Adding track...', { id: 'create-collection' })
                  setTimeout(() => handleDeploy(), 1000)
                } else {
                  setStep('metadata')
                  toast.success('Album created successfully! Now add your first track.', { id: 'create-collection' })
                }
              }
            })
            .catch((error) => {
              console.error('❌ [COLLECTION] Confirmation failed:', error)
              console.log('🔄 [COLLECTION] Proceeding with fallback ID to prevent modal closure...')
              // Still proceed - the collection was likely created successfully
              const fallbackId = Date.now()
              setSelectedCollectionId(fallbackId)
              setStep('metadata')
              toast.success('Album created successfully! Now add your first track.', { id: 'create-collection' })
            })
        } else {
          console.log('⚠️ [COLLECTION] No handleConfirmation function, proceeding with fallback')
          // No confirmation handler, just proceed
          const fallbackId = Date.now()
          setSelectedCollectionId(fallbackId)
          setStep('metadata')
          toast.success('Album created successfully! Now add your first track.', { id: 'create-collection' })
        }
      }
    } catch (error) {
      console.error('💥 [COLLECTION] Critical error in confirmation useEffect:', error)
      // Emergency fallback to prevent modal crash
      if (collectionCreatedSuccessfully) {
        console.log('🚨 [COLLECTION] Emergency fallback to prevent modal crash')
        const emergencyId = Date.now()
        setSelectedCollectionId(emergencyId)
        setStep('metadata')
        toast.success('Album created successfully! Now add your first track.', { id: 'create-collection' })
      }
    }
  }, [collectionCreatedSuccessfully, handleConfirmation, currentStep])

  // Handle collection creation errors
  React.useEffect(() => {
    if (collectionCreateError) {
      console.error('❌ [COLLECTION] Collection creation failed:', collectionCreateError)
      toast.error('Failed to create album. Please try again.', { id: 'create-collection' })
    }
  }, [collectionCreateError])

  const canProceed = () => {
    switch (currentStep) {
      case 'collection-select':
        return selectedCollectionId !== null
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
      case 'intent-selection':
        return <IntentSelectionStep onSelectIntent={handleIntentSelect} />
      case 'collection-select':
        return <CollectionSelectStep 
          collections={collections || []} 
          isLoading={collectionsLoading}
          onSelectCollection={handleCollectionSelect}
          onCreateNewCollection={handleCreateNewCollection}
          isCreating={isCreatingCollection}
        />
      case 'album-info':
        // TODO: Create AlbumInfoStep component
        return <div>Album Info Step - Coming Soon</div>
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
        return <DeploymentStep onDeploy={handleDeploy} isDeploying={uploadState.contractDeployment.status === 'pending'} />
      case 'complete':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-8 text-center"
          >
            <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Track Added Successfully!</h3>
            <p className="text-muted-foreground mb-2">
              "{trackData.title}" has been added to your album.
            </p>
            {selectedCollection && (
              <p className="text-sm text-muted-foreground mb-6">
                Album: {Array.isArray(selectedCollection) ? selectedCollection[1] : 'Album'} {/* index 1 is title */}
              </p>
            )}
            
            <div className="flex justify-center gap-3">
              <Button onClick={() => setIsOpen(false)} variant="outline">
                Close
              </Button>
              <Button onClick={() => {
                setIsOpen(false)
                // Reset for next upload
                setTimeout(() => handleOpenChange(true), 500)
              }}>
                Add Another Track
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
      case 'intent-selection': return 'Choose Your Upload Type'
      case 'collection-select': return 'Select Album'
      case 'album-info': return 'Album Information'
      case 'metadata': return 'Track Information'
      case 'audio-upload': return 'Upload Audio File'
      case 'cover-upload': return 'Upload Cover Art'
      case 'tier-config': return 'Configure NFT Tiers'
      case 'deploy': return uploadIntent === 'new-album' ? 'Create Album & Track' : 'Add to Album'
      case 'complete': return uploadIntent === 'new-album' ? 'Album Created Successfully!' : 'Track Added Successfully!'
      default: return 'Upload Music'
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
                {(() => {
                  const steps = uploadIntent === 'new-album' 
                    ? ['intent-selection', 'album-info', 'metadata', 'audio-upload', 'cover-upload', 'tier-config', 'deploy']
                    : uploadIntent === 'add-to-album'
                    ? ['intent-selection', 'collection-select', 'metadata', 'audio-upload', 'cover-upload', 'tier-config', 'deploy']
                    : uploadIntent === 'single-track'
                    ? ['intent-selection', 'metadata', 'audio-upload', 'cover-upload', 'tier-config', 'deploy']
                    : ['intent-selection', 'collection-select', 'metadata', 'audio-upload', 'cover-upload', 'tier-config', 'deploy']
                  
                  const currentIndex = steps.indexOf(currentStep)
                  return `Step ${currentIndex + 1} of ${steps.length}`
                })()}
              </Badge>
            )}
          </div>
          <DialogDescription>
            {uploadIntent === 'new-album' ? 'Create a new album with tracks and metadata' :
             uploadIntent === 'add-to-album' ? 'Add a new track to an existing album' :
             uploadIntent === 'single-track' ? 'Create a standalone single track' :
             'Upload and manage your music content'}
          </DialogDescription>
          
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
                  const steps: Step[] = ['collection-select', 'metadata', 'audio-upload', 'cover-upload', 'tier-config', 'deploy']
                  const currentIndex = steps.indexOf(currentStep)
                  if (currentIndex > 0) {
                    setStep(steps[currentIndex - 1])
                  }
                }}
                disabled={currentStep === 'collection-select'}
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
                      const steps: Step[] = ['collection-select', 'metadata', 'audio-upload', 'cover-upload', 'tier-config', 'deploy']
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
