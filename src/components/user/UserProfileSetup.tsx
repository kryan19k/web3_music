import { useState } from 'react'
import { useAccount } from 'wagmi'
import { toast } from 'sonner'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Textarea } from '@/src/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar'
import { Badge } from '@/src/components/ui/badge'
import { Separator } from '@/src/components/ui/separator'
import { Switch } from '@/src/components/ui/switch'
import { useUserProfileMutation, useUserDBProfile } from '@/src/hooks/useUserProfile'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Camera,
  Globe,
  MapPin,
  Eye,
  EyeOff,
  Shield,
  Settings,
  Save,
  Loader2,
  CheckCircle,
} from 'lucide-react'

interface UserProfileSetupProps {
  onComplete?: () => void
  isModal?: boolean
}

export function UserProfileSetup({ onComplete, isModal = false }: UserProfileSetupProps) {
  const { address } = useAccount()
  const { data: existingProfile, isLoading: profileLoading } = useUserDBProfile(address)
  const { createOrUpdateProfile } = useUserProfileMutation()
  
  // Form state
  const [displayName, setDisplayName] = useState(existingProfile?.display_name || '')
  const [bio, setBio] = useState(existingProfile?.bio || '')
  const [location, setLocation] = useState(existingProfile?.location || '')
  const [website, setWebsite] = useState(existingProfile?.website || '')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(existingProfile?.avatar_url || null)
  
  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    showEmail: existingProfile?.show_email || false,
    showWallet: existingProfile?.show_wallet !== false,
    showActivity: existingProfile?.privacy_settings?.showActivity !== false,
    showCollection: existingProfile?.privacy_settings?.showCollection !== false,
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!address) {
      toast.error('Please connect your wallet first')
      return
    }

    setIsLoading(true)

    try {
      const { user, error } = await createOrUpdateProfile({
        walletAddress: address,
        displayName: displayName.trim() || undefined,
        bio: bio.trim() || undefined,
        location: location.trim() || undefined,
        website: website.trim() || undefined,
        avatarFile: avatarFile || undefined,
        privacySettings,
      })

      if (error) {
        toast.error(error)
        return
      }

      setIsComplete(true)
      
      // Show success state briefly, then complete
      setTimeout(() => {
        onComplete?.()
      }, 2000)
      
    } catch (error) {
      console.error('Profile setup error:', error)
      toast.error('Failed to save profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={isModal ? "p-6" : "max-w-2xl mx-auto p-6"}
    >
      <AnimatePresence mode="wait">
        {isComplete ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-8"
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Profile Updated!</h2>
            <p className="text-muted-foreground">Your profile has been saved successfully.</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {existingProfile ? 'Edit Profile' : 'Setup Your Profile'}
                </CardTitle>
                <p className="text-muted-foreground">
                  {existingProfile 
                    ? 'Update your profile information and preferences'
                    : 'Create your profile to start collecting and sharing music NFTs'
                  }
                </p>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={avatarPreview || undefined} />
                      <AvatarFallback>
                        {displayName ? displayName[0].toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <Label htmlFor="avatar" className="cursor-pointer">
                        <div className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted transition-colors">
                          <Camera className="w-4 h-4" />
                          Change Photo
                        </div>
                        <input
                          id="avatar"
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        JPG, PNG or GIF. Max 5MB.
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Your display name"
                        maxLength={50}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        Location
                      </Label>
                      <Input
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g., Los Angeles, CA"
                        maxLength={100}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell people about yourself and your music interests..."
                      maxLength={500}
                      rows={4}
                    />
                    <div className="text-xs text-muted-foreground text-right">
                      {bio.length}/500
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">
                      <Globe className="w-4 h-4 inline mr-1" />
                      Website
                    </Label>
                    <Input
                      id="website"
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://your-website.com"
                    />
                  </div>

                  <Separator />

                  {/* Privacy Settings */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      <h3 className="font-semibold">Privacy Settings</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Show Wallet Address</Label>
                          <p className="text-xs text-muted-foreground">
                            Display your wallet address on your profile
                          </p>
                        </div>
                        <Switch
                          checked={privacySettings.showWallet}
                          onCheckedChange={(checked) => 
                            setPrivacySettings(prev => ({ ...prev, showWallet: checked }))
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Show Activity</Label>
                          <p className="text-xs text-muted-foreground">
                            Display your recent activity publicly
                          </p>
                        </div>
                        <Switch
                          checked={privacySettings.showActivity}
                          onCheckedChange={(checked) => 
                            setPrivacySettings(prev => ({ ...prev, showActivity: checked }))
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Show Collection</Label>
                          <p className="text-xs text-muted-foreground">
                            Display your NFT collection publicly
                          </p>
                        </div>
                        <Switch
                          checked={privacySettings.showCollection}
                          onCheckedChange={(checked) => 
                            setPrivacySettings(prev => ({ ...prev, showCollection: checked }))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Wallet Info */}
                  {address && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Connected Wallet</p>
                          <p className="text-xs font-mono text-muted-foreground">
                            {address.slice(0, 6)}...{address.slice(-4)}
                          </p>
                        </div>
                        <Badge variant="secondary">Connected</Badge>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving Profile...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {existingProfile ? 'Update Profile' : 'Create Profile'}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
