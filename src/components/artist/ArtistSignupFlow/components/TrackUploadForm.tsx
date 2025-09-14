/**
 * Track Upload Form
 * Comprehensive form for track metadata input
 */

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Textarea } from '@/src/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select'
import { Badge } from '@/src/components/ui/badge'
import { Switch } from '@/src/components/ui/switch'
import { Slider } from '@/src/components/ui/slider'
import { TrackMetadata, GENRE_OPTIONS } from '@/src/types/artist'
import { useAudioAnalysis } from '@/src/hooks/useAudioAnalysis'
import { 
  Music, 
  User, 
  Disc, 
  Tag, 
  Calendar, 
  Clock, 
  Zap,
  AlertTriangle,
  Check,
  Plus,
  X,
  DollarSign,
  Sparkles,
  Shield,
  FileText,
  TrendingUp,
  Crown,
  Star,
  Gem
} from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

interface TrackUploadFormProps {
  onComplete: (metadata: Partial<TrackMetadata>) => void
  initialData?: Partial<TrackMetadata>
}

export function TrackUploadForm({ onComplete, initialData = {} }: TrackUploadFormProps) {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    artist: initialData.artist || '',
    album: initialData.album || '',
    genre: initialData.genre || '',
    description: initialData.description || '',
    bpm: initialData.bpm?.toString() || '',
    key: initialData.key || '',
    isExplicit: initialData.isExplicit || false,
    rightsCleared: initialData.rightsCleared || false,
    releaseDate: initialData.releaseDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
    // Pricing & Config
    price: '0.01',
    maxSupply: 1000,
    royaltyPercentage: 10,
    perks: '',
  })

  const [tags, setTags] = useState<string[]>(initialData.tags || [])
  const [newTag, setNewTag] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.artist.trim()) {
      newErrors.artist = 'Artist name is required'
    }

    if (!formData.genre) {
      newErrors.genre = 'Genre is required'
    }

    if (formData.bpm && (parseInt(formData.bpm) < 40 || parseInt(formData.bpm) > 300)) {
      newErrors.bpm = 'BPM must be between 40 and 300'
    }

    if (!formData.rightsCleared) {
      newErrors.rightsCleared = 'You must confirm you have the rights to this music'
    }

    if (!formData.price || parseFloat(formData.price) < 0.001) {
      newErrors.price = 'Price must be at least 0.001 ETH'
    }

    if (formData.maxSupply < 1 || formData.maxSupply > 10000) {
      newErrors.maxSupply = 'Supply must be between 1 and 10,000'
    }

    if (formData.royaltyPercentage < 0 || formData.royaltyPercentage > 50) {
      newErrors.royaltyPercentage = 'Royalty must be between 0% and 50%'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      toast.error('Please fix the errors below')
      return
    }

    const metadata: Partial<TrackMetadata> = {
      title: formData.title.trim(),
      artist: formData.artist.trim(),
      album: formData.album.trim() || undefined,
      genre: formData.genre,
      description: formData.description.trim() || undefined,
      bpm: formData.bpm ? parseInt(formData.bpm) : undefined,
      key: formData.key || undefined,
      isExplicit: formData.isExplicit,
      rightsCleared: formData.rightsCleared,
      releaseDate: new Date(formData.releaseDate),
      tags,
      // Include pricing config
      trackConfig: {
        price: formData.price,
        maxSupply: formData.maxSupply,
        royaltyPercentage: formData.royaltyPercentage,
        perks: formData.perks.trim() || undefined,
        description: formData.description.trim() || undefined
      },
    }

    onComplete(metadata)
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 10) {
      setTags(prev => [...prev, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  // Animation variants for the Steve Jobs-inspired design
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
      className="min-h-screen bg-background p-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Hero Header */}
        <motion.div 
          variants={cardVariants}
          className="text-center mb-12 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 rounded-3xl blur-3xl"></div>
          <div className="relative">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-3xl mb-6 shadow-2xl">
              <Music className="w-12 h-12 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-6xl font-extralight tracking-tight text-foreground mb-4">
              Create Your
              <span className="font-bold block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Musical Masterpiece
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
              Design the perfect track with precision, pricing, and passion
            </p>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid xl:grid-cols-3 gap-8">
          {/* Left Column - Track Information */}
          <motion.div 
            variants={cardVariants} 
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="xl:col-span-2 space-y-8"
          >
            
            {/* Essential Details */}
            <Card className="border-border shadow-lg bg-card backdrop-blur-xl">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-2xl font-light flex items-center gap-3 text-foreground">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
                    <Star className="w-5 h-5 text-primary-foreground" />
                  </div>
                  Essential Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="title" className="text-sm font-medium text-foreground mb-2 block">
                        Track Title *
                      </Label>
                      <Input
                        id="title"
                        placeholder="Your next hit song..."
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className={`h-12 bg-background/50 border-border focus:border-primary focus:ring-primary/20 transition-all duration-300 ${errors.title ? 'border-destructive focus:border-destructive' : ''}`}
                      />
                      {errors.title && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-destructive text-sm mt-2 flex items-center gap-2"
                        >
                          <AlertTriangle className="w-4 h-4" />
                          {errors.title}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="artist" className="text-sm font-medium text-foreground mb-2 block">
                        Artist Name *
                      </Label>
                      <Input
                        id="artist"
                        placeholder="Your artist or band name"
                        value={formData.artist}
                        onChange={(e) => handleInputChange('artist', e.target.value)}
                        className={`h-12 bg-background/50 border-border focus:border-primary focus:ring-primary/20 transition-all duration-300 ${errors.artist ? 'border-destructive focus:border-destructive' : ''}`}
                      />
                      {errors.artist && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-destructive text-sm mt-2 flex items-center gap-2"
                        >
                          <AlertTriangle className="w-4 h-4" />
                          {errors.artist}
                        </motion.p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="album" className="text-sm font-medium text-foreground mb-2 block">
                        Album/EP <span className="text-muted-foreground">(Optional)</span>
                      </Label>
                      <Input
                        id="album"
                        placeholder="Album or EP name"
                        value={formData.album}
                        onChange={(e) => handleInputChange('album', e.target.value)}
                        className="h-12 bg-background/50 border-border focus:border-primary focus:ring-primary/20 transition-all duration-300"
                      />
                    </div>

                    <div>
                      <Label htmlFor="genre" className="text-sm font-medium text-foreground mb-2 block">
                        Genre *
                      </Label>
                      <Select value={formData.genre} onValueChange={(value) => handleInputChange('genre', value)}>
                        <SelectTrigger className={`h-12 bg-background/50 border-border focus:border-primary focus:ring-primary/20 transition-all duration-300 ${errors.genre ? 'border-destructive' : ''}`}>
                          <SelectValue placeholder="Choose your genre" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover backdrop-blur-xl border-border">
                          {GENRE_OPTIONS.map((genre) => (
                            <SelectItem key={genre} value={genre} className="hover:bg-accent">
                              {genre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.genre && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-destructive text-sm mt-2 flex items-center gap-2"
                        >
                          <AlertTriangle className="w-4 h-4" />
                          {errors.genre}
                        </motion.p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing & Economics */}
            <Card className="border-border shadow-lg bg-card backdrop-blur-xl">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-2xl font-light flex items-center gap-3 text-foreground">
                  <div className="w-10 h-10 bg-gradient-to-br from-secondary to-accent rounded-2xl flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  Pricing & Economics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Price */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-foreground">
                      NFT Price *
                    </Label>
                    <div className="space-y-4">
                      <div className="relative">
                        <Slider
                          value={[parseFloat(formData.price) || 0]}
                          onValueChange={(value) => handleInputChange('price', value[0].toFixed(3))}
                          max={1}
                          min={0.001}
                          step={0.001}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                          <span>0.001 POL</span>
                          <span>1.0 POL</span>
                        </div>
                      </div>
                      <div className="relative">
                        <Input
                          type="number"
                          step="0.001"
                          min="0.001"
                          max="1"
                          placeholder="0.01"
                          value={formData.price}
                          onChange={(e) => handleInputChange('price', e.target.value)}
                          className={`h-12 bg-background/50 border-border focus:border-primary focus:ring-primary/20 transition-all duration-300 pl-12 ${errors.price ? 'border-destructive' : ''}`}
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                          Ⓟ
                        </div>
                      </div>
                      {errors.price && (
                        <p className="text-destructive text-sm flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          {errors.price}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Supply */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-foreground">
                      Max Supply *
                    </Label>
                    <div className="space-y-4">
                      <div className="relative">
                        <Slider
                          value={[formData.maxSupply]}
                          onValueChange={(value) => handleInputChange('maxSupply', value[0])}
                          max={10000}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                          <span>1</span>
                          <span>10K</span>
                        </div>
                      </div>
                      <Input
                        type="number"
                        min="1"
                        max="10000"
                        placeholder="1000"
                        value={formData.maxSupply}
                        onChange={(e) => handleInputChange('maxSupply', parseInt(e.target.value) || 0)}
                        className={`h-12 bg-background/50 border-border focus:border-primary focus:ring-primary/20 transition-all duration-300 ${errors.maxSupply ? 'border-destructive' : ''}`}
                      />
                      {errors.maxSupply && (
                        <p className="text-destructive text-sm flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          {errors.maxSupply}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Royalties */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-foreground">
                      Royalty Rate *
                    </Label>
                    <div className="space-y-4">
                      <div className="relative">
                        <Slider
                          value={[formData.royaltyPercentage]}
                          onValueChange={(value) => handleInputChange('royaltyPercentage', value[0])}
                          max={50}
                          min={0}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-2">
                          <span>0%</span>
                          <span>50%</span>
                        </div>
                      </div>
                      <div className="relative">
                        <Input
                          type="number"
                          min="0"
                          max="50"
                          placeholder="10"
                          value={formData.royaltyPercentage}
                          onChange={(e) => handleInputChange('royaltyPercentage', parseInt(e.target.value) || 0)}
                          className={`h-12 bg-background/50 border-border focus:border-primary focus:ring-primary/20 transition-all duration-300 pr-12 ${errors.royaltyPercentage ? 'border-destructive' : ''}`}
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                          %
                        </div>
                      </div>
                      {errors.royaltyPercentage && (
                        <p className="text-destructive text-sm flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          {errors.royaltyPercentage}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technical & Creative */}
            <Card className="border-border shadow-lg bg-card backdrop-blur-xl">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-2xl font-light flex items-center gap-3 text-foreground">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary-foreground" />
                  </div>
                  Technical & Creative
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="bpm" className="text-sm font-medium text-foreground mb-2 block">
                          BPM <span className="text-muted-foreground">(Optional)</span>
                        </Label>
                        <Input
                          id="bpm"
                          type="number"
                          min="40"
                          max="300"
                          placeholder="120"
                          value={formData.bpm}
                          onChange={(e) => handleInputChange('bpm', e.target.value)}
                          className={`h-12 bg-background/50 border-border focus:border-primary focus:ring-primary/20 transition-all duration-300 ${errors.bpm ? 'border-destructive' : ''}`}
                        />
                        {errors.bpm && (
                          <p className="text-destructive text-sm mt-1">{errors.bpm}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="key" className="text-sm font-medium text-foreground mb-2 block">
                          Key <span className="text-muted-foreground">(Optional)</span>
                        </Label>
                        <Input
                          id="key"
                          placeholder="C Major"
                          value={formData.key}
                          onChange={(e) => handleInputChange('key', e.target.value)}
                          className="h-12 bg-background/50 border-border focus:border-primary focus:ring-primary/20 transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="releaseDate" className="text-sm font-medium text-foreground mb-2 block">
                        Release Date
                      </Label>
                      <Input
                        id="releaseDate"
                        type="date"
                        value={formData.releaseDate}
                        onChange={(e) => handleInputChange('releaseDate', e.target.value)}
                        className="h-12 bg-background/50 border-border focus:border-primary focus:ring-primary/20 transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="description" className="text-sm font-medium text-foreground mb-2 block">
                        Track Story <span className="text-muted-foreground">(Optional)</span>
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Share the inspiration and story behind your track..."
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={4}
                        className="bg-background/50 border-border focus:border-primary focus:ring-primary/20 transition-all duration-300 resize-none"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        {formData.description.length}/500 characters
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="perks" className="text-sm font-medium text-foreground mb-2 block">
                        Holder Perks <span className="text-muted-foreground">(Optional)</span>
                      </Label>
                      <Textarea
                        id="perks"
                        placeholder="Exclusive benefits for NFT holders..."
                        value={formData.perks}
                        onChange={(e) => handleInputChange('perks', e.target.value)}
                        rows={3}
                        className="bg-background/50 border-border focus:border-primary focus:ring-primary/20 transition-all duration-300 resize-none"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tags & Legal */}
            <Card className="border-border shadow-lg bg-card backdrop-blur-xl">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-2xl font-light flex items-center gap-3 text-foreground">
                  <div className="w-10 h-10 bg-gradient-to-br from-accent to-secondary rounded-2xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-accent-foreground" />
                  </div>
                  Tags & Legal
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-8">
                  {/* Tags */}
                  <div>
                    <Label className="text-sm font-medium text-foreground mb-4 block">
                      Tags <span className="text-muted-foreground">(Optional)</span>
                    </Label>
                    <div className="flex gap-3 mb-4">
                      <Input
                        placeholder="Add descriptive tags..."
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="h-12 bg-background/50 border-border focus:border-primary focus:ring-primary/20 transition-all duration-300 flex-1"
                      />
                      <Button
                        type="button"
                        onClick={addTag}
                        disabled={!newTag.trim() || tags.length >= 10}
                        className="h-12 px-6 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 border-0 transition-all duration-300"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="cursor-pointer hover:bg-red-100 hover:text-red-800 transition-colors duration-200 px-3 py-1"
                            onClick={() => removeTag(tag)}
                          >
                            {tag}
                            <X className="w-3 h-3 ml-2" />
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-xs text-muted-foreground">
                      {tags.length}/10 tags • Click a tag to remove it
                    </p>
                  </div>

                  {/* Legal Switches */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-2xl">
                      <Switch
                        id="explicit"
                        checked={formData.isExplicit}
                        onCheckedChange={(checked) => handleInputChange('isExplicit', checked)}
                      />
                      <Label htmlFor="explicit" className="font-medium text-foreground">
                        This track contains explicit content
                      </Label>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-2xl">
                      <Switch
                        id="rights"
                        checked={formData.rightsCleared}
                        onCheckedChange={(checked) => handleInputChange('rightsCleared', checked)}
                      />
                      <Label htmlFor="rights" className={`font-medium ${errors.rightsCleared ? 'text-destructive' : 'text-foreground'}`}>
                        I have the legal rights to publish and sell this music *
                      </Label>
                    </div>
                    
                    {errors.rightsCleared && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm flex items-center gap-2"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        {errors.rightsCleared}
                      </motion.p>
                    )}

                    <div className="bg-muted/30 p-6 rounded-2xl border border-border">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                          <AlertTriangle className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground mb-2">
                            Legal Confirmation Required
                          </p>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            By confirming rights clearance, you certify that you own all rights to this music 
                            or have explicit permission from copyright holders to publish and sell it as NFTs. 
                            Unauthorized distribution is strictly prohibited.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column - Live Preview */}
          <motion.div 
            variants={cardVariants}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="xl:col-span-1"
          >
            <div className="sticky top-6">
              <Card className="border-border shadow-lg bg-card backdrop-blur-xl overflow-hidden">
                <CardHeader className="border-b border-border bg-gradient-to-r from-primary/10 to-accent/10">
                  <CardTitle className="text-xl font-light flex items-center gap-3 text-foreground">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                      <Gem className="w-4 h-4 text-primary-foreground" />
                    </div>
                    Live Preview
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    How your NFT will appear to collectors
                  </p>
                </CardHeader>
                <CardContent className="p-8">
                  {/* NFT Preview Card */}
                  <div className="relative">
                    {/* Cover Art Placeholder */}
                    <div className="aspect-square bg-gradient-to-br from-primary via-accent to-secondary rounded-3xl flex items-center justify-center mb-6 shadow-2xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-background/20"></div>
                      <div className="text-center text-primary-foreground relative z-10">
                        <Disc className="w-16 h-16 mx-auto mb-3 animate-spin" style={{ animationDuration: '8s' }} />
                        <p className="font-medium">Cover Art</p>
                        <p className="text-xs opacity-75">Upload in next step</p>
                      </div>
                      {/* Floating elements */}
                      <div className="absolute top-4 right-4 w-3 h-3 bg-primary-foreground/30 rounded-full animate-pulse"></div>
                      <div className="absolute bottom-6 left-6 w-2 h-2 bg-primary-foreground/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                    </div>

                    {/* Track Information */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-foreground leading-tight">
                          {formData.title || 'Your Track Title'}
                        </h3>
                        <p className="text-muted-foreground font-medium">
                          by {formData.artist || 'Artist Name'}
                        </p>
                        
                        {formData.album && (
                          <p className="text-sm text-muted-foreground mt-1">
                            from "{formData.album}"
                          </p>
                        )}
                      </div>

                      {/* Price & Supply */}
                      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-primary" />
                          <span className="font-bold text-foreground">
                            {formData.price || '0.01'} POL
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Crown className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-muted-foreground">
                            {formData.maxSupply || '1000'} supply
                          </span>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2">
                        {formData.genre && (
                          <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                            {formData.genre}
                          </Badge>
                        )}
                        {formData.bpm && (
                          <Badge variant="outline" className="border-border">
                            {formData.bpm} BPM
                          </Badge>
                        )}
                        {formData.isExplicit && (
                          <Badge variant="outline" className="border-destructive/30 text-destructive">
                            Explicit
                          </Badge>
                        )}
                        <Badge className="bg-accent/10 text-accent-foreground border-accent/20">
                          {formData.royaltyPercentage || 10}% Royalty
                        </Badge>
                      </div>

                      {/* Description Preview */}
                      {formData.description && (
                        <div className="p-4 bg-muted/30 rounded-2xl">
                          <p className="text-sm text-foreground leading-relaxed line-clamp-4">
                            {formData.description}
                          </p>
                        </div>
                      )}

                      {/* Tags Preview */}
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {tags.slice(0, 6).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-border">
                              #{tag}
                            </Badge>
                          ))}
                          {tags.length > 6 && (
                            <Badge variant="outline" className="text-xs border-border">
                              +{tags.length - 6} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Continue Button */}
                    <Button
                      onClick={handleSubmit}
                      disabled={!formData.title || !formData.artist || !formData.genre || !formData.rightsCleared || !formData.price}
                      className="w-full mt-8 h-14 bg-gradient-to-r from-primary via-accent to-secondary hover:from-primary/90 hover:via-accent/90 hover:to-secondary/90 text-primary-foreground border-0 font-medium text-base shadow-lg transition-all duration-500 hover:shadow-primary/25 hover:scale-[1.02]"
                    >
                      {formData.title && formData.artist && formData.genre && formData.rightsCleared && formData.price ? (
                        <>
                          <Sparkles className="w-5 h-5 mr-3" />
                          Continue to Collaborators
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-5 h-5 mr-3" />
                          Complete Required Fields
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
