import { FileUpload, type UploadedFile } from '@/src/components/artist/FileUpload'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/custom-tabs'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form'
import { Input } from '@/src/components/ui/input'
import { Progress } from '@/src/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select'
import { Separator } from '@/src/components/ui/separator'
import { Textarea } from '@/src/components/ui/textarea'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  DollarSign,
  Eye,
  Globe,
  Info,
  Lock,
  Music,
  Settings,
  Sparkles,
  Tag,
  TrendingUp,
  Upload,
  Users,
  Zap,
} from 'lucide-react'
import * as React from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { 
  useCreateCollection, 
  useAddTrackToCollection, 
  useFinalizeCollection,
  useMusicNFTArtistRole
} from '@/src/hooks/contracts/useMusicNFT'
import { useAccount } from 'wagmi'

// Form schema types
interface UploadFormData {
  // Collection Information
  albumTitle: string
  albumDescription: string
  albumArtist: string
  
  // Track Information
  title: string
  description: string
  genre: string
  mood: string
  tempo: string
  key: string
  instruments: string
  isExplicit: boolean

  // Tier Configuration
  bronzePrice: number
  silverPrice: number
  goldPrice: number
  platinumPrice: number

  bronzeSupply: number
  silverSupply: number
  goldSupply: number
  platinumSupply: number

  royaltyRate: number
  blokAllocation: number
}

const genres = [
  'Electronic',
  'Hip Hop',
  'Pop',
  'Rock',
  'Jazz',
  'Classical',
  'Country',
  'R&B',
  'Reggae',
  'Folk',
  'Blues',
  'Ambient',
  'House',
  'Techno',
  'Dubstep',
  'Indie',
  'Alternative',
  'Other',
]

const moods = [
  'Energetic',
  'Chill',
  'Melancholic',
  'Uplifting',
  'Aggressive',
  'Romantic',
  'Peaceful',
  'Dark',
  'Playful',
  'Mysterious',
  'Epic',
]

const tempos = ['Very Slow', 'Slow', 'Medium', 'Fast', 'Very Fast']
const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

export function ArtistUpload() {
  const { address } = useAccount()
  const [currentTab, setCurrentTab] = useState('collection')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [mintingStep, setMintingStep] = useState<'idle' | 'creating-collection' | 'adding-tracks' | 'finalizing' | 'complete'>(
    'idle',
  )
  const [collectionId, setCollectionId] = useState<number | null>(null)

  // Check if user has artist role
  const { data: isArtist, isLoading: artistRoleLoading } = useMusicNFTArtistRole(address as `0x${string}`)
  
  // Collection workflow hooks
  const { 
    createCollection, 
    createCollectionAsync, 
    isLoading: isCreatingCollection,
    isSuccess: isCollectionCreated,
    hash,
    handleConfirmation
  } = useCreateCollection()
  const { 
    addTrackToCollection, 
    addTrackToCollectionAsync, 
    isLoading: isAddingTrack,
    isSuccess: isTrackAdded 
  } = useAddTrackToCollection()
  const { 
    finalizeCollection, 
    finalizeCollectionAsync, 
    isLoading: isFinalizingCollection,
    isSuccess: isCollectionFinalized 
  } = useFinalizeCollection()

  const form = useForm<UploadFormData>({
    defaultValues: {
      // Collection Information
      albumTitle: '',
      albumDescription: '',
      albumArtist: '',
      
      // Track Information
      title: '',
      description: '',
      genre: '',
      mood: '',
      tempo: 'Medium',
      key: 'C',
      instruments: '',
      isExplicit: false,
      
      // Tier Configuration
      bronzePrice: 50,
      silverPrice: 150,
      goldPrice: 500,
      platinumPrice: 1500,
      bronzeSupply: 1000,
      silverSupply: 500,
      goldSupply: 100,
      platinumSupply: 10,
      royaltyRate: 5,
      blokAllocation: 1000,
    },
  })

  // Simulate file upload process
  const handleFilesSelected = async (files: File[]) => {
    const newFiles: UploadedFile[] = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadProgress: 0,
      status: 'uploading',
    }))

    setUploadedFiles((prev) => [...prev, ...newFiles])
    setIsUploading(true)

    // Simulate upload process for each file
    for (const uploadFile of newFiles) {
      // Update progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise((resolve) => setTimeout(resolve, 200))
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id
              ? {
                  ...f,
                  uploadProgress: progress,
                  status: progress === 100 ? 'processing' : 'uploading',
                }
              : f,
          ),
        )
      }

      // Processing phase
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Complete
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id
            ? {
                ...f,
                status: 'complete',
                duration: 180 + Math.random() * 120,
                ipfsHash: `Qm${Math.random().toString(36).substr(2, 44)}`,
              }
            : f,
        ),
      )
    }

    setIsUploading(false)
  }

  // Collection-first workflow implementation
  const onSubmit = async (data: UploadFormData) => {
    if (!address) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!isArtist) {
      toast.error('You need artist privileges to upload music. Please apply to become an artist first.')
      return
    }

    if (uploadedFiles.length === 0) {
      toast.error('Please upload at least one audio file')
      return
    }

    if (!data.albumTitle || !data.albumArtist) {
      toast.error('Please fill in album title and artist name')
      return
    }

    try {
      // Step 1: Create Collection (Album)
      setMintingStep('creating-collection')
      toast.info('Creating your album... Please confirm the transaction in your wallet.')

      await createCollectionAsync({
        title: data.albumTitle,
        artist: data.albumArtist,
        description: data.albumDescription,
        ipfsCoverArt: '', // TODO: Add album cover art upload
        genre: data.genre
      })

      // Wait for collection creation confirmation
      let actualCollectionId = 0
      
      // For now, generate a mock ID since we can't parse logs easily
      // TODO: Implement proper log parsing when contracts are deployed
      actualCollectionId = Math.floor(Math.random() * 1000) + 1
      setCollectionId(actualCollectionId)
      
      toast.success(`Album created successfully! Collection ID: ${actualCollectionId}`)

      // Step 2: Add Tracks to Collection
      setMintingStep('adding-tracks')
      toast.info(`Adding ${uploadedFiles.length} tracks to your album...`)

      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i]
        if (file.status === 'complete' && file.ipfsHash) {
          toast.info(`Adding track ${i + 1}/${uploadedFiles.length}: "${file.name}"... Please confirm in wallet.`)
          
          await addTrackToCollectionAsync({
            collectionId: actualCollectionId,
            title: data.title || file.name.replace(/\.[^/.]+$/, ""), // Remove extension
            ipfsHash: file.ipfsHash,
            duration: file.duration || 180,
            tags: [data.genre, data.mood].filter(Boolean)
          })
          
          toast.success(`Track "${data.title || file.name}" added to album successfully!`)
        }
      }

      // Step 3: Finalize Collection
      setMintingStep('finalizing')
      toast.info('Finalizing your album for sale... Please confirm the final transaction.')

      await finalizeCollectionAsync({
        collectionId: actualCollectionId
      })

      // Step 4: Complete
      setMintingStep('complete')
      toast.success('🎉 Your album has been created and is now available for purchase!')
      
      // Reset form after successful creation
      setTimeout(() => {
        setMintingStep('idle')
        setCurrentTab('collection')
        form.reset()
        setUploadedFiles([])
        setCollectionId(null)
      }, 3000)

    } catch (error) {
      console.error('Collection creation failed:', error)
      setMintingStep('idle')
      
      if (error instanceof Error) {
        toast.error(`Failed to create album: ${error.message}`)
      } else {
        toast.error('Failed to create album. Please check console for details.')
      }
    }
  }

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const handleFormSubmit = async (data: UploadFormData) => {
    if (uploadedFiles.length === 0) {
      return
    }

    setMintingStep('creating-collection')

    // Simulate minting process
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setMintingStep('adding-tracks')

    await new Promise((resolve) => setTimeout(resolve, 3000))
    setMintingStep('complete')

    console.log('Minting NFT:', data, uploadedFiles)
  }

  const canProceed = uploadedFiles.some((f) => f.status === 'complete')
  const totalSupply =
    form.watch('bronzeSupply') +
    form.watch('silverSupply') +
    form.watch('goldSupply') +
    form.watch('platinumSupply')
  const estimatedRevenue =
    form.watch('bronzePrice') * form.watch('bronzeSupply') +
    form.watch('silverPrice') * form.watch('silverSupply') +
    form.watch('goldPrice') * form.watch('goldSupply') +
    form.watch('platinumPrice') * form.watch('platinumSupply')

  if (mintingStep !== 'idle') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            {mintingStep === 'creating-collection' && (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-blue-500/10 rounded-full flex items-center justify-center">
                  <Music className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
                <div>
                  <h3 className="font-semibold">Creating Album</h3>
                  <p className="text-sm text-muted-foreground">
                    Creating your album collection on the blockchain...
                  </p>
                </div>
                <Progress value={25} className="w-full" />
              </div>
            )}

            {mintingStep === 'adding-tracks' && (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-purple-500/10 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-purple-500 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-semibold">Adding Tracks</h3>
                  <p className="text-sm text-muted-foreground">
                    Adding your songs to the album...
                  </p>
                </div>
                <Progress value={65} className="w-full" />
              </div>
            )}

            {mintingStep === 'finalizing' && (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-orange-500/10 rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-orange-500 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-semibold">Finalizing Album</h3>
                  <p className="text-sm text-muted-foreground">
                    Making your album available for purchase...
                  </p>
                </div>
                <Progress value={90} className="w-full" />
              </div>
            )}

            {mintingStep === 'complete' && (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-500">Album Created Successfully!</h3>
                  <p className="text-sm text-muted-foreground">
                    Your album is now live on the marketplace and ready for fans to purchase.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setMintingStep('idle')}
                  >
                    Create Another Album
                  </Button>
                  <Button>
                    View Album
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/95 backdrop-blur-xl sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Upload className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Upload Music NFT</h1>
              <p className="text-sm text-muted-foreground">Create and mint your music as NFTs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Tabs
            value={currentTab}
            onValueChange={setCurrentTab}
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger
                value="collection"
                className="flex items-center gap-2"
              >
                <Music className="w-4 h-4" />
                Album
              </TabsTrigger>
              <TabsTrigger
                value="upload"
                disabled={!form.watch('albumTitle')}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Tracks
              </TabsTrigger>
              <TabsTrigger
                value="metadata"
                disabled={!canProceed}
                className="flex items-center gap-2"
              >
                <Tag className="w-4 h-4" />
                Track Details
              </TabsTrigger>
              <TabsTrigger
                value="pricing"
                disabled={!canProceed}
                className="flex items-center gap-2"
              >
                <DollarSign className="w-4 h-4" />
                Pricing & Launch
              </TabsTrigger>
            </TabsList>

            {/* Collection (Album) Creation Tab - FIRST STEP */}
            <TabsContent
              value="collection"
              className="space-y-6 mt-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Music className="w-5 h-5" />
                    Create Your Album
                  </CardTitle>
                  <p className="text-muted-foreground">
                    First, let's create an album (collection) for your tracks. You can add multiple songs to this album.
                  </p>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="albumTitle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Album Title *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="My Amazing Album"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                This will be the name of your music collection/album
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="albumArtist"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Artist Name *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Your Artist Name"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Your name or band name as it will appear on the album
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="albumDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Album Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell people about your album - the inspiration, story, or theme..."
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Describe your album to help fans understand your artistic vision
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="genre"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Genre</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select album genre" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {genres.map((genre) => (
                                  <SelectItem key={genre} value={genre}>
                                    {genre}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Main genre that best describes this album
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </Form>
                  
                  {form.watch('albumTitle') && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 text-center"
                    >
                      <Button onClick={() => setCurrentTab('upload')}>
                        Continue to Upload Tracks
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Upload Tab - SECOND STEP */}
            <TabsContent
              value="upload"
              className="space-y-6 mt-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Music className="w-5 h-5" />
                    Upload Your Music
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FileUpload
                    onFilesSelected={handleFilesSelected}
                    uploadedFiles={uploadedFiles}
                    onRemoveFile={handleRemoveFile}
                    maxFiles={1}
                    acceptedFormats={['audio/mp3', 'audio/wav', 'audio/flac']}
                  />
                </CardContent>
              </Card>

              {canProceed && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <Button onClick={() => setCurrentTab('metadata')}>
                    Continue to Metadata
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              )}
            </TabsContent>

            {/* Metadata Tab */}
            <TabsContent
              value="metadata"
              className="space-y-6 mt-8"
            >
              <Form {...form}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Basic Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Track Title</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter track title..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe your track, its inspiration, or story..."
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>Tell collectors about your music</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="genre"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Genre</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select genre" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {genres.map((genre) => (
                                  <SelectItem
                                    key={genre}
                                    value={genre}
                                  >
                                    {genre}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Musical Attributes */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Musical Attributes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="mood"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mood</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select mood" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {moods.map((mood) => (
                                  <SelectItem
                                    key={mood}
                                    value={mood}
                                  >
                                    {mood}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="tempo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tempo</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select tempo" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {tempos.map((tempo) => (
                                    <SelectItem
                                      key={tempo}
                                      value={tempo}
                                    >
                                      {tempo}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="key"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Key</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select key" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {keys.map((key) => (
                                    <SelectItem
                                      key={key}
                                      value={key}
                                    >
                                      {key}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="instruments"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Instruments</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Piano, Guitar, Synthesizer..."
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>List the main instruments used</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </div>

                <div className="text-center">
                  <Button onClick={() => setCurrentTab('pricing')}>
                    Continue to Pricing
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Form>
            </TabsContent>

            {/* Pricing & Tiers Tab */}
            <TabsContent
              value="pricing"
              className="space-y-6 mt-8"
            >
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Tier Configuration */}
                    <div className="space-y-6">
                      {[
                        { tier: 'bronze', name: 'Bronze', color: 'orange', icon: '🥉' },
                        { tier: 'silver', name: 'Silver', color: 'slate', icon: '🥈' },
                        { tier: 'gold', name: 'Gold', color: 'yellow', icon: '🥇' },
                        { tier: 'platinum', name: 'Platinum', color: 'purple', icon: '💎' },
                      ].map(({ tier, name, color, icon }) => (
                        <Card
                          key={tier}
                          className={`border-${color}-500/20`}
                        >
                          <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2">
                              <span>{icon}</span>
                              {name} Tier
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name={`${tier}Price` as keyof UploadFormData}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Price (USD)</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        value={field.value?.toString() || ''}
                                        onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                                        onBlur={field.onBlur}
                                        name={field.name}
                                        ref={field.ref}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`${tier}Supply` as keyof UploadFormData}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Max Supply</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        value={field.value?.toString() || ''}
                                        onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                                        onBlur={field.onBlur}
                                        name={field.name}
                                        ref={field.ref}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Summary & Settings */}
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Revenue Projection
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span>Total Supply</span>
                              <span className="font-semibold">{totalSupply.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Max Revenue</span>
                              <span className="font-semibold text-green-500">
                                ${estimatedRevenue.toLocaleString()}
                              </span>
                            </div>
                            <Separator />
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>Platform Fee (2.5%)</span>
                              <span>-${(estimatedRevenue * 0.025).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between font-semibold">
                              <span>Your Earnings</span>
                              <span>${(estimatedRevenue * 0.975).toLocaleString()}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Additional Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <FormField
                            control={form.control}
                            name="royaltyRate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Royalty Rate (%)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min="0"
                                    max="10"
                                    step="0.1"
                                    {...field}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Percentage you earn from secondary sales
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="blokAllocation"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>BLOK Allocation</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...field}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                  />
                                </FormControl>
                                <FormDescription>
                                  BLOK tokens allocated for streaming rewards
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold mb-2">Ready to Create Album?</h3>
                          <p className="text-sm text-muted-foreground">
                            Review your settings and launch your album on the blockchain
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <Button variant="outline">
                            <Eye className="w-4 h-4 mr-2" />
                            Preview Album
                          </Button>
                          <Button
                            type="submit"
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                            disabled={isUploading || isCreatingCollection || isAddingTrack || isFinalizingCollection}
                          >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Create Album
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
