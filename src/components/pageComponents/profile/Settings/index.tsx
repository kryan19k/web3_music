import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  Bell,
  Camera,
  Check,
  Copy,
  CreditCard,
  ExternalLink,
  Eye,
  EyeOff,
  Globe,
  Key,
  Lock,
  LogOut,
  Mail,
  Monitor,
  Moon,
  Palette,
  Save,
  Settings,
  Shield,
  Smartphone,
  Sun,
  Trash2,
  Unlock,
  Upload,
  User,
  Volume2,
  VolumeX,
  Wallet,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface ProfileFormData {
  displayName: string
  username: string
  bio: string
  location: string
  website: string
  email: string

  // Privacy settings
  isPrivate: boolean
  showEmail: boolean
  showWallet: boolean
  showActivity: boolean
  allowMessages: boolean

  // Notification settings
  emailNotifications: boolean
  pushNotifications: boolean
  socialNotifications: boolean
  marketingEmails: boolean
  weeklyDigest: boolean

  // App preferences
  theme: 'light' | 'dark' | 'system'
  autoPlay: boolean
  soundEffects: boolean
  defaultVolume: number
  language: string
  currency: string
}

const mockUserData: ProfileFormData = {
  displayName: 'Luna Vista',
  username: 'luna-vista',
  bio: 'Electronic music producer creating ambient soundscapes and ethereal beats. Love connecting with fellow music enthusiasts! 🎵✨',
  location: 'Los Angeles, CA',
  website: 'https://lunavista.music',
  email: 'luna@lunavista.music',

  isPrivate: false,
  showEmail: false,
  showWallet: true,
  showActivity: true,
  allowMessages: true,

  emailNotifications: true,
  pushNotifications: true,
  socialNotifications: true,
  marketingEmails: false,
  weeklyDigest: true,

  theme: 'system',
  autoPlay: true,
  soundEffects: true,
  defaultVolume: 80,
  language: 'en',
  currency: 'USD',
}

export function ProfileSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [avatar, setAvatar] = useState('/api/placeholder/120/120')
  const [showWallet, setShowWallet] = useState(true)

  const form = useForm<ProfileFormData>({
    defaultValues: mockUserData,
  })

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log('Profile updated:', data)
    setIsLoading(false)
  }

  const handleAvatarUpload = (event: { target: { files?: FileList | null } }) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatar(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const copyWalletAddress = () => {
    navigator.clipboard.writeText('0x742d35Cc6841C759D9AB7C1234567890abcdef1234')
    // Could add a toast notification here
  }

  const disconnectWallet = () => {
    // Handle wallet disconnection
    console.log('Disconnect wallet')
  }

  const deleteAccount = () => {
    // Handle account deletion
    console.log('Delete account')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/95 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Settings className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">Account Settings</h1>
              <p className="text-muted-foreground">Manage your profile, privacy, and preferences</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger
                value="profile"
                className="flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="privacy"
                className="flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Privacy
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="flex items-center gap-2"
              >
                <Bell className="w-4 h-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger
                value="preferences"
                className="flex items-center gap-2"
              >
                <Palette className="w-4 h-4" />
                Preferences
              </TabsTrigger>
              <TabsTrigger
                value="account"
                className="flex items-center gap-2"
              >
                <Wallet className="w-4 h-4" />
                Account
              </TabsTrigger>
            </TabsList>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-8 space-y-6"
              >
                {/* Profile Tab */}
                <TabsContent
                  value="profile"
                  className="space-y-6"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Avatar Upload */}
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <Avatar className="w-24 h-24">
                            <AvatarImage src={avatar} />
                            <AvatarFallback className="text-xl">LV</AvatarFallback>
                          </Avatar>
                          <label
                            htmlFor="avatar-upload"
                            className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            <Camera className="w-6 h-6 text-white" />
                          </label>
                          <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Profile Picture</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            Upload a new avatar. Recommended size is 400x400px.
                          </p>
                          <div className="flex gap-2">
                            <label htmlFor="avatar-upload">
                              <Button
                                variant="outline"
                                size="sm"
                                as="span"
                              >
                                <Upload className="w-4 h-4 mr-2" />
                                Upload New
                              </Button>
                            </label>
                            <Button
                              variant="ghost"
                              size="sm"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Basic Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="displayName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Display Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Your display name"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                This is how your name appears to other users
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    @
                                  </span>
                                  <Input
                                    className="pl-6"
                                    placeholder="username"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormDescription>
                                Your unique identifier on the platform
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="your@email.com"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="City, Country"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://your-website.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell us about yourself..."
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              A brief description of yourself (max 500 characters)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Privacy Tab */}
                <TabsContent
                  value="privacy"
                  className="space-y-6"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Privacy Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={form.control}
                        name="isPrivate"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                Private Account
                              </FormLabel>
                              <FormDescription>
                                Only approved followers can see your activity
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="showEmail"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                Show Email Address
                              </FormLabel>
                              <FormDescription>
                                Display your email on your public profile
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="showWallet"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base flex items-center gap-2">
                                <Wallet className="w-4 h-4" />
                                Show Wallet Address
                              </FormLabel>
                              <FormDescription>
                                Display your wallet address on your profile
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="showActivity"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base flex items-center gap-2">
                                <Eye className="w-4 h-4" />
                                Show Activity
                              </FormLabel>
                              <FormDescription>
                                Allow others to see your recent purchases and likes
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="allowMessages"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base flex items-center gap-2">
                                <Bell className="w-4 h-4" />
                                Allow Direct Messages
                              </FormLabel>
                              <FormDescription>
                                Let other users send you private messages
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent
                  value="notifications"
                  className="space-y-6"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <h4 className="font-medium">Email Notifications</h4>

                        <FormField
                          control={form.control}
                          name="emailNotifications"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  General Email Notifications
                                </FormLabel>
                                <FormDescription>
                                  Receive emails about account activity
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="marketingEmails"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Marketing Emails</FormLabel>
                                <FormDescription>
                                  Receive emails about new features and promotions
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="weeklyDigest"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Weekly Digest</FormLabel>
                                <FormDescription>
                                  Weekly summary of your activity and recommendations
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h4 className="font-medium">Push Notifications</h4>

                        <FormField
                          control={form.control}
                          name="pushNotifications"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Push Notifications</FormLabel>
                                <FormDescription>
                                  Receive notifications on your device
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="socialNotifications"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Social Notifications</FormLabel>
                                <FormDescription>
                                  Get notified when someone follows you or likes your content
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Preferences Tab */}
                <TabsContent
                  value="preferences"
                  className="space-y-6"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>App Preferences</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={form.control}
                        name="theme"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Theme</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select theme" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="light">
                                  <div className="flex items-center gap-2">
                                    <Sun className="w-4 h-4" />
                                    Light
                                  </div>
                                </SelectItem>
                                <SelectItem value="dark">
                                  <div className="flex items-center gap-2">
                                    <Moon className="w-4 h-4" />
                                    Dark
                                  </div>
                                </SelectItem>
                                <SelectItem value="system">
                                  <div className="flex items-center gap-2">
                                    <Monitor className="w-4 h-4" />
                                    System
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="language"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Language</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select language" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="en">English</SelectItem>
                                  <SelectItem value="es">Español</SelectItem>
                                  <SelectItem value="fr">Français</SelectItem>
                                  <SelectItem value="de">Deutsch</SelectItem>
                                  <SelectItem value="ja">日本語</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="currency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Currency</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select currency" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="USD">USD ($)</SelectItem>
                                  <SelectItem value="EUR">EUR (€)</SelectItem>
                                  <SelectItem value="GBP">GBP (£)</SelectItem>
                                  <SelectItem value="JPY">JPY (¥)</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h4 className="font-medium">Audio Settings</h4>

                        <FormField
                          control={form.control}
                          name="autoPlay"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Auto-play</FormLabel>
                                <FormDescription>
                                  Automatically play next track in queue
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="soundEffects"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Sound Effects</FormLabel>
                                <FormDescription>
                                  Play sound effects for UI interactions
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Account Tab */}
                <TabsContent
                  value="account"
                  className="space-y-6"
                >
                  {/* Wallet Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Wallet className="w-5 h-5" />
                        Wallet Connection
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                              Connected
                            </Badge>
                            <span className="font-medium">MetaMask</span>
                          </div>
                          <p className="text-sm font-mono text-muted-foreground">
                            0x742d35Cc6841C759D9AB7C1234567890abcdef1234
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={copyWalletAddress}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={disconnectWallet}
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Disconnect
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Security Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Security
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Two-Factor Authentication</p>
                          <p className="text-sm text-muted-foreground">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <Button variant="outline">
                          <Key className="w-4 h-4 mr-2" />
                          Enable 2FA
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Login Sessions</p>
                          <p className="text-sm text-muted-foreground">
                            Manage your active sessions
                          </p>
                        </div>
                        <Button variant="outline">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Sessions
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Danger Zone */}
                  <Card className="border-red-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-red-500">
                        <AlertTriangle className="w-5 h-5" />
                        Danger Zone
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-red-500/20 rounded-lg">
                        <div>
                          <p className="font-medium">Delete Account</p>
                          <p className="text-sm text-muted-foreground">
                            Permanently delete your account and all associated data
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          onClick={deleteAccount}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Account
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Save Button */}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-background/30 border-t-background" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
