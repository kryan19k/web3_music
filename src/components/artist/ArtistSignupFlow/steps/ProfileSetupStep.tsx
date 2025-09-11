/**
 * Profile Setup Step
 * Artist profile creation with social links and bio
 */

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Textarea } from '@/src/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar'
import { Badge } from '@/src/components/ui/badge'
import { useSupabaseArtistSignup } from '@/src/hooks/useSupabaseArtistSignup'
import { ArtistProfile, GENRE_OPTIONS } from '@/src/types/artist'
import { 
  User, 
  Camera, 
  Twitter, 
  Instagram, 
  Globe, 
  Music, 
  Upload,
  Check,
  ArrowRight
} from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

export function ProfileSetupStep() {
  const { 
    onboardingState, 
    createArtistProfile, 
    updateArtistProfile,
    setCurrentStep, 
    canProceedToNextStep,
    isLoading
  } = useSupabaseArtistSignup()
  
  // Debug: Log current state
  console.log('ProfileSetupStep - Current onboarding state:', onboardingState)
  console.log('ProfileSetupStep - Can proceed to next step:', canProceedToNextStep)
  console.log('ProfileSetupStep - Loading:', isLoading)
  // Helper function to safely extract social links
  const getSocialLinks = () => {
    if (!onboardingState.profile) return {}
    const socialLinks = onboardingState.profile.social_links
    if (typeof socialLinks === 'object' && socialLinks !== null) {
      return socialLinks as Record<string, string>
    }
    return {}
  }

  const [formData, setFormData] = useState({
    displayName: onboardingState.profile?.display_name || '',
    bio: onboardingState.profile?.bio || '',
    website: onboardingState.profile?.website || '',
    twitter: getSocialLinks().twitter || '',
    instagram: getSocialLinks().instagram || '',
    spotify: getSocialLinks().spotify || '',
    soundcloud: getSocialLinks().soundcloud || '',
    avatar: null as File | null,
  })

  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    onboardingState.profile?.avatar_url || null
  )
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Note: Real-time sync removed for Supabase version - will save on continue
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image too large', { description: 'Please choose an image under 5MB' })
        return
      }
      
      setFormData(prev => ({ ...prev, avatar: file }))
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    )
  }

  const handleSaveProfile = async () => {
    const profileData = {
      displayName: formData.displayName.trim(),
      bio: formData.bio.trim(),
      website: formData.website.trim() || undefined,
      socialLinks: {
        twitter: formData.twitter.trim() || undefined,
        instagram: formData.instagram.trim() || undefined,
        spotify: formData.spotify.trim() || undefined,
        soundcloud: formData.soundcloud.trim() || undefined,
      },
    }

    if (onboardingState.profile) {
      // Update existing profile
      await updateArtistProfile(profileData, formData.avatar || undefined)
    } else {
      // Create new profile
      await createArtistProfile({
        ...profileData,
        avatarFile: formData.avatar || undefined
      })
    }
  }

  const handleContinue = async () => {
    console.log('handleContinue - Called with form data:', formData)
    
    const profileData = {
      displayName: formData.displayName.trim(),
      bio: formData.bio.trim(),
      website: formData.website.trim() || undefined,
      socialLinks: {
        twitter: formData.twitter.trim() || undefined,
        instagram: formData.instagram.trim() || undefined,
        spotify: formData.spotify.trim() || undefined,
        soundcloud: formData.soundcloud.trim() || undefined,
      },
    }

    console.log('handleContinue - Saving profile with:', profileData)
    
    let result
    if (onboardingState.profile) {
      // Update existing profile
      result = await updateArtistProfile(profileData, formData.avatar || undefined)
    } else {
      // Create new profile
      result = await createArtistProfile({
        ...profileData,
        avatarFile: formData.avatar || undefined
      })
    }

    if (result?.success) {
      console.log('handleContinue - Profile saved, moving to verification')
      // Force immediate navigation
      setTimeout(() => {
        console.log('handleContinue - Forcing navigation to verification')
        setCurrentStep('verification')
      }, 200)
    } else {
      console.error('handleContinue - Failed to save profile:', result?.error)
    }
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Left Side - Profile Preview */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="sticky top-6">
          <CardHeader className="text-center">
            <CardTitle>Profile Preview</CardTitle>
            <p className="text-sm text-muted-foreground">
              How fans will see you
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Avatar */}
            <div className="text-center">
              <div className="relative inline-block">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={avatarPreview || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xl">
                    {formData.displayName?.slice(0, 2).toUpperCase() || <User className="w-8 h-8" />}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="avatar-upload"
                  className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-1 cursor-pointer hover:bg-primary/80 transition-colors"
                >
                  <Camera className="w-3 h-3" />
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Profile Info */}
            <div className="text-center space-y-2">
              <h3 className="font-bold text-lg">
                {formData.displayName || 'Your Artist Name'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {formData.bio || 'Your bio will appear here...'}
              </p>
            </div>

            {/* Social Links Preview */}
            <div className="flex justify-center gap-2">
              {formData.website && (
                <Badge variant="secondary">
                  <Globe className="w-3 h-3 mr-1" />
                  Website
                </Badge>
              )}
              {formData.twitter && (
                <Badge variant="secondary">
                  <Twitter className="w-3 h-3 mr-1" />
                  Twitter
                </Badge>
              )}
              {formData.instagram && (
                <Badge variant="secondary">
                  <Instagram className="w-3 h-3 mr-1" />
                  Instagram
                </Badge>
              )}
            </div>

            {/* Genres */}
            {selectedGenres.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Genres</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedGenres.map(genre => (
                    <Badge key={genre} variant="outline" className="text-xs">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Right Side - Profile Form */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="lg:col-span-2 space-y-6"
      >
        <div>
          <h2 className="text-3xl font-bold mb-2">Create Your Artist Profile</h2>
          <p className="text-muted-foreground">
            Tell your fans who you are and what you're about.
          </p>
        </div>

        <div className="grid gap-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="displayName">Artist Name *</Label>
                <Input
                  id="displayName"
                  placeholder="Your stage name or band name"
                  value={formData.displayName}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio *</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell your story... What genre do you make? What inspires you? What makes you unique?"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.bio.length}/500 characters
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Social Links
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Help fans find you across platforms
              </p>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  placeholder="https://yourwebsite.com"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="twitter">Twitter</Label>
                <div className="relative">
                  <Twitter className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="twitter"
                    placeholder="@username"
                    value={formData.twitter}
                    onChange={(e) => handleInputChange('twitter', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <div className="relative">
                  <Instagram className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="instagram"
                    placeholder="@username"
                    value={formData.instagram}
                    onChange={(e) => handleInputChange('instagram', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="spotify">Spotify</Label>
                <div className="relative">
                  <Music className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="spotify"
                    placeholder="Artist profile URL"
                    value={formData.spotify}
                    onChange={(e) => handleInputChange('spotify', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Genres */}
          <Card>
            <CardHeader>
              <CardTitle>Musical Genres</CardTitle>
              <p className="text-sm text-muted-foreground">
                Select genres that best describe your music
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {GENRE_OPTIONS.map((genre) => (
                  <Badge
                    key={genre}
                    variant={selectedGenres.includes(genre) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/10 transition-colors"
                    onClick={() => toggleGenre(genre)}
                  >
                    {selectedGenres.includes(genre) && <Check className="w-3 h-3 mr-1" />}
                    {genre}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleSaveProfile}>
            Save Draft
          </Button>
          
          <Button
            onClick={handleContinue}
            disabled={!formData.displayName.trim() || !formData.bio.trim() || isLoading}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
          >
            Continue to Verification
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
