import { FileUpload, type UploadedFile } from '@/components/artist/FileUpload'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
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

// Form schema types
interface UploadFormData {
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
  pagsAllocation: number
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
  const [currentTab, setCurrentTab] = useState('upload')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [mintingStep, setMintingStep] = useState<'idle' | 'preparing' | 'minting' | 'complete'>(
    'idle',
  )

  const form = useForm<UploadFormData>({
    defaultValues: {
      title: '',
      description: '',
      genre: '',
      mood: '',
      tempo: 'Medium',
      key: 'C',
      instruments: '',
      isExplicit: false,
      bronzePrice: 50,
      silverPrice: 150,
      goldPrice: 500,
      platinumPrice: 1500,
      bronzeSupply: 1000,
      silverSupply: 500,
      goldSupply: 100,
      platinumSupply: 10,
      royaltyRate: 5,
      pagsAllocation: 1000,
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

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const onSubmit = async (data: UploadFormData) => {
    if (uploadedFiles.length === 0) {
      return
    }

    setMintingStep('preparing')

    // Simulate minting process
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setMintingStep('minting')

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
            {mintingStep === 'preparing' && (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-blue-500/10 rounded-full flex items-center justify-center">
                  <Settings className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
                <div>
                  <h3 className="font-semibold">Preparing Upload</h3>
                  <p className="text-sm text-muted-foreground">
                    Processing metadata and preparing for blockchain...
                  </p>
                </div>
              </div>
            )}

            {mintingStep === 'minting' && (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-purple-500/10 rounded-full flex items-center justify-center">
                  <Zap className="w-8 h-8 text-purple-500 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-semibold">Minting NFT</h3>
                  <p className="text-sm text-muted-foreground">
                    Creating your music NFT on the blockchain...
                  </p>
                </div>
                <Progress
                  value={60}
                  className="w-full"
                />
              </div>
            )}

            {mintingStep === 'complete' && (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-500">NFT Created Successfully!</h3>
                  <p className="text-sm text-muted-foreground">
                    Your music NFT is now live on the marketplace.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setMintingStep('idle')}
                  >
                    Create Another
                  </Button>
                  <Button>
                    View NFT
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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                value="upload"
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload
              </TabsTrigger>
              <TabsTrigger
                value="metadata"
                disabled={!canProceed}
                className="flex items-center gap-2"
              >
                <Music className="w-4 h-4" />
                Metadata
              </TabsTrigger>
              <TabsTrigger
                value="pricing"
                disabled={!canProceed}
                className="flex items-center gap-2"
              >
                <DollarSign className="w-4 h-4" />
                Pricing & Tiers
              </TabsTrigger>
            </TabsList>

            {/* Upload Tab */}
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
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
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
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
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
                            name="pagsAllocation"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>PAGS Allocation</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...field}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                  />
                                </FormControl>
                                <FormDescription>
                                  PAGS tokens allocated for streaming rewards
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
                          <h3 className="font-semibold mb-2">Ready to Mint?</h3>
                          <p className="text-sm text-muted-foreground">
                            Review your settings and create your music NFT
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <Button variant="outline">
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </Button>
                          <Button
                            type="submit"
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                            disabled={isUploading}
                          >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Mint NFT
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
