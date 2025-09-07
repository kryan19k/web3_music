import { Button } from '@/src/components/ui/button'
import { Switch } from '@/src/components/ui/custom-switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/components/ui/dialog'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Textarea } from '@/src/components/ui/textarea'
import { cn } from '@/src/lib/utils'
import type { CreatePlaylistData, UpdatePlaylistData } from '@/src/types/playlist'
import { AnimatePresence, motion } from 'framer-motion'
import { Globe, Image as ImageIcon, Lock, Music, Plus, Upload, X } from 'lucide-react'
import type * as React from 'react'
import { useState } from 'react'

interface CreatePlaylistDialogProps {
  trigger?: React.ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onSubmit: (data: CreatePlaylistData) => void
  initialData?: UpdatePlaylistData & { id?: string }
  isEditing?: boolean
}

export function CreatePlaylistDialog({
  trigger,
  isOpen,
  onOpenChange,
  onSubmit,
  initialData,
  isEditing = false,
}: CreatePlaylistDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<CreatePlaylistData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    artwork: initialData?.artwork || '',
    isPublic: initialData?.isPublic || false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [artworkPreview, setArtworkPreview] = useState<string | null>(initialData?.artwork || null)

  const isControlled = isOpen !== undefined && onOpenChange !== undefined
  const currentOpen = isControlled ? isOpen : open
  const setCurrentOpen = isControlled ? onOpenChange : setOpen

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    setIsSubmitting(true)
    try {
      await onSubmit({
        ...formData,
        artwork: artworkPreview || undefined,
      })

      if (!isEditing) {
        // Reset form for new playlist
        setFormData({
          name: '',
          description: '',
          artwork: '',
          isPublic: false,
        })
        setArtworkPreview(null)
      }

      setCurrentOpen(false)
    } catch (error) {
      console.error('Failed to save playlist:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file?.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setArtworkPreview(result)
        setFormData((prev) => ({ ...prev, artwork: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeArtwork = () => {
    setArtworkPreview(null)
    setFormData((prev) => ({ ...prev, artwork: '' }))
  }

  return (
    <Dialog
      open={currentOpen}
      onOpenChange={setCurrentOpen}
    >
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Music className="w-5 h-5" />
              {isEditing ? 'Edit Playlist' : 'Create New Playlist'}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Update your playlist details'
                : 'Create a new playlist to organize your favorite tracks'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-6">
            {/* Playlist Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Playlist Name *</Label>
              <Input
                id="name"
                placeholder="My Awesome Playlist"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your playlist..."
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                disabled={isSubmitting}
                rows={3}
              />
            </div>

            {/* Artwork Upload */}
            <div className="space-y-2">
              <Label>Playlist Cover</Label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div
                    className={cn(
                      'w-20 h-20 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center transition-colors',
                      artworkPreview && 'border-solid border-border',
                    )}
                  >
                    {artworkPreview ? (
                      <>
                        <img
                          src={artworkPreview}
                          alt="Playlist cover"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
                          onClick={removeArtwork}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </>
                    ) : (
                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    asChild
                    disabled={isSubmitting}
                  >
                    <label
                      htmlFor="artwork"
                      className="cursor-pointer"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </label>
                  </Button>
                  <input
                    id="artwork"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <p className="text-xs text-muted-foreground">JPG, PNG or GIF (max 5MB)</p>
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="space-y-3">
              <Label>Privacy</Label>
              <div className="flex items-center space-x-3">
                <Switch
                  id="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, isPublic: checked }))
                  }
                  disabled={isSubmitting}
                />
                <div className="flex items-center gap-2">
                  {formData.isPublic ? (
                    <Globe className="w-4 h-4 text-green-500" />
                  ) : (
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  )}
                  <div>
                    <Label
                      htmlFor="isPublic"
                      className="text-sm font-medium cursor-pointer"
                    >
                      {formData.isPublic ? 'Public playlist' : 'Private playlist'}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {formData.isPublic
                        ? 'Anyone can view and listen to this playlist'
                        : 'Only you can access this playlist'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.name.trim() || isSubmitting}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    'Update Playlist'
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Create Playlist
                    </>
                  )}
                </div>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
