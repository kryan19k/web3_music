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
  X
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

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Main Form */}
      <div className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="w-5 h-5" />
              Track Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Track Title *</Label>
              <Input
                id="title"
                placeholder="Enter your track title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="artist">Artist Name *</Label>
              <Input
                id="artist"
                placeholder="Your artist or band name"
                value={formData.artist}
                onChange={(e) => handleInputChange('artist', e.target.value)}
                className={errors.artist ? 'border-red-500' : ''}
              />
              {errors.artist && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {errors.artist}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="album">Album/EP (Optional)</Label>
              <Input
                id="album"
                placeholder="Album or EP name"
                value={formData.album}
                onChange={(e) => handleInputChange('album', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="genre">Genre *</Label>
              <Select value={formData.genre} onValueChange={(value) => handleInputChange('genre', value)}>
                <SelectTrigger className={errors.genre ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select a genre" />
                </SelectTrigger>
                <SelectContent>
                  {GENRE_OPTIONS.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.genre && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {errors.genre}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Technical Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Technical Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bpm">BPM (Optional)</Label>
                <Input
                  id="bpm"
                  type="number"
                  min="40"
                  max="300"
                  placeholder="120"
                  value={formData.bpm}
                  onChange={(e) => handleInputChange('bpm', e.target.value)}
                  className={errors.bpm ? 'border-red-500' : ''}
                />
                {errors.bpm && (
                  <p className="text-red-500 text-sm mt-1">{errors.bpm}</p>
                )}
              </div>

              <div>
                <Label htmlFor="key">Musical Key (Optional)</Label>
                <Input
                  id="key"
                  placeholder="e.g., C Major, A Minor"
                  value={formData.key}
                  onChange={(e) => handleInputChange('key', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="releaseDate">Release Date</Label>
              <Input
                id="releaseDate"
                type="date"
                value={formData.releaseDate}
                onChange={(e) => handleInputChange('releaseDate', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Description & Tags */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Description & Tags
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Tell fans about this track... What inspired it? What's the story behind it?"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.description.length}/500 characters
              </p>
            </div>

            <div>
              <Label>Tags (Optional)</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add a tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={addTag}
                  disabled={!newTag.trim() || tags.length >= 10}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-red-100 hover:text-red-800"
                      onClick={() => removeTag(tag)}
                    >
                      {tag}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              )}
              
              <p className="text-xs text-muted-foreground mt-1">
                {tags.length}/10 tags • Click a tag to remove it
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Rights & Legal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Rights & Legal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="explicit"
                checked={formData.isExplicit}
                onCheckedChange={(checked) => handleInputChange('isExplicit', checked)}
              />
              <Label htmlFor="explicit">This track contains explicit content</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="rights"
                checked={formData.rightsCleared}
                onCheckedChange={(checked) => handleInputChange('rightsCleared', checked)}
              />
              <Label htmlFor="rights" className={errors.rightsCleared ? 'text-red-500' : ''}>
                I have the legal rights to publish and sell this music *
              </Label>
            </div>
            
            {errors.rightsCleared && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {errors.rightsCleared}
              </p>
            )}

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Important:</strong> By checking this box, you confirm that you own all rights to this music 
                or have permission from the copyright holders to publish and sell it as NFTs. Unauthorized 
                distribution of copyrighted material is prohibited.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview */}
      <div className="lg:sticky lg:top-6">
        <Card>
          <CardHeader>
            <CardTitle>Track Preview</CardTitle>
            <p className="text-sm text-muted-foreground">
              How your track will appear to fans
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Track Art Placeholder */}
            <div className="aspect-square bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <div className="text-center text-white">
                <Disc className="w-12 h-12 mx-auto mb-2" />
                <p className="text-sm">Cover Art</p>
                <p className="text-xs opacity-75">Upload in next step</p>
              </div>
            </div>

            {/* Track Info */}
            <div className="space-y-2">
              <h3 className="font-bold text-lg">
                {formData.title || 'Track Title'}
              </h3>
              <p className="text-muted-foreground">
                by {formData.artist || 'Artist Name'}
              </p>
              
              {formData.album && (
                <p className="text-sm text-muted-foreground">
                  from "{formData.album}"
                </p>
              )}

              <div className="flex flex-wrap gap-2 mt-3">
                {formData.genre && (
                  <Badge variant="secondary">{formData.genre}</Badge>
                )}
                {formData.bpm && (
                  <Badge variant="outline">{formData.bpm} BPM</Badge>
                )}
                {formData.isExplicit && (
                  <Badge variant="outline">Explicit</Badge>
                )}
              </div>

              {formData.description && (
                <p className="text-sm text-muted-foreground mt-3 line-clamp-3">
                  {formData.description}
                </p>
              )}

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Action Button */}
            <Button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
              disabled={!formData.title || !formData.artist || !formData.genre || !formData.rightsCleared}
            >
              {formData.title && formData.artist && formData.genre && formData.rightsCleared ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Continue to Audio Upload
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Complete Required Fields
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
