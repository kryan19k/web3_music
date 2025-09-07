import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Switch } from '@/src/components/ui/custom-switch'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select'
import { Textarea } from '@/src/components/ui/textarea'
import { useAdminData } from '@/src/hooks/useAdminData'
import type { PlatformSettings as PlatformSettingsType } from '@/src/types/admin'
import { motion } from 'framer-motion'
import { DollarSign, FileText, Globe, Lock, Save, Settings, Shield, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export function PlatformSettings() {
  const { settings: initialSettings, updateSettings } = useAdminData()
  const [settings, setSettings] = useState<PlatformSettingsType | null>(null)
  const [isDirty, setIsDirty] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings)
    }
  }, [initialSettings])

  const handleSettingChange = (
    category: keyof PlatformSettingsType,
    key: string,
    value: unknown,
  ) => {
    if (!settings) return

    setSettings((prev) => {
      if (!prev) return null
      return {
        ...prev,
        [category]: {
          ...prev[category],
          [key]: value,
        },
      }
    })
    setIsDirty(true)
  }

  const handleSave = async () => {
    if (!settings) return

    setIsSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
      updateSettings(settings)
      setIsDirty(false)
      toast.success('Settings saved successfully!')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Save Banner */}
      {isDirty && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-orange-500/50 bg-orange-500/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-orange-500" />
                  <span className="font-medium">Unsaved changes detected</span>
                </div>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {isSaving ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      Save Changes
                    </div>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              General Settings
            </CardTitle>
            <CardDescription>Basic platform configuration and information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platformName">Platform Name</Label>
              <Input
                id="platformName"
                value={settings.general.platformName}
                onChange={(e) => handleSettingChange('general', 'platformName', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={settings.general.description}
                onChange={(e) => handleSettingChange('general', 'description', e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input
                id="supportEmail"
                type="email"
                value={settings.general.supportEmail}
                onChange={(e) => handleSettingChange('general', 'supportEmail', e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="maintenanceMode"
                checked={settings.general.maintenanceMode}
                onCheckedChange={(checked) =>
                  handleSettingChange('general', 'maintenanceMode', checked)
                }
              />
              <div className="space-y-0.5">
                <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Temporarily disable access to the platform
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fee Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Fee Configuration
            </CardTitle>
            <CardDescription>Platform fees and royalty settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platformFee">Platform Fee (%)</Label>
              <Input
                id="platformFee"
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={settings.fees.platformFeePercentage}
                onChange={(e) =>
                  handleSettingChange(
                    'fees',
                    'platformFeePercentage',
                    Number.parseFloat(e.target.value),
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="royaltyCap">Royalty Cap (%)</Label>
              <Input
                id="royaltyCap"
                type="number"
                min="0"
                max="20"
                step="0.1"
                value={settings.fees.royaltyCapPercentage}
                onChange={(e) =>
                  handleSettingChange(
                    'fees',
                    'royaltyCapPercentage',
                    Number.parseFloat(e.target.value),
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minRoyalty">Minimum Royalty (%)</Label>
              <Input
                id="minRoyalty"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={settings.fees.minimumRoyaltyPercentage}
                onChange={(e) =>
                  handleSettingChange(
                    'fees',
                    'minimumRoyaltyPercentage',
                    Number.parseFloat(e.target.value),
                  )
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Blockchain Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Blockchain Configuration
            </CardTitle>
            <CardDescription>Blockchain network and transaction settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="defaultChain">Default Chain</Label>
              <Select
                value={settings.blockchain.defaultChain}
                onValueChange={(value) => handleSettingChange('blockchain', 'defaultChain', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ethereum">Ethereum</SelectItem>
                  <SelectItem value="polygon">Polygon</SelectItem>
                  <SelectItem value="bsc">Binance Smart Chain</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gasMultiplier">Gas Limit Multiplier</Label>
              <Input
                id="gasMultiplier"
                type="number"
                min="1"
                max="2"
                step="0.1"
                value={settings.blockchain.gasLimitMultiplier}
                onChange={(e) =>
                  handleSettingChange(
                    'blockchain',
                    'gasLimitMultiplier',
                    Number.parseFloat(e.target.value),
                  )
                }
              />
            </div>

            <div className="space-y-3">
              <Label>Supported Chains</Label>
              {['ethereum', 'polygon', 'bsc'].map((chain) => (
                <div
                  key={chain}
                  className="flex items-center space-x-2"
                >
                  <Switch
                    id={`chain-${chain}`}
                    checked={settings.blockchain.supportedChains.includes(chain)}
                    onCheckedChange={(checked) => {
                      const newChains = checked
                        ? [...settings.blockchain.supportedChains, chain]
                        : settings.blockchain.supportedChains.filter((c) => c !== chain)
                      handleSettingChange('blockchain', 'supportedChains', newChains)
                    }}
                  />
                  <Label
                    htmlFor={`chain-${chain}`}
                    className="capitalize"
                  >
                    {chain}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Content Moderation
            </CardTitle>
            <CardDescription>File upload and content moderation settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
              <Input
                id="maxFileSize"
                type="number"
                min="1"
                max="100"
                value={settings.content.maxFileSize / (1024 * 1024)}
                onChange={(e) =>
                  handleSettingChange(
                    'content',
                    'maxFileSize',
                    Number.parseInt(e.target.value) * 1024 * 1024,
                  )
                }
              />
            </div>

            <div className="space-y-3">
              <Label>Content Settings</Label>

              <div className="flex items-center space-x-2">
                <Switch
                  id="requireModeration"
                  checked={settings.content.requireModeration}
                  onCheckedChange={(checked) =>
                    handleSettingChange('content', 'requireModeration', checked)
                  }
                />
                <div className="space-y-0.5">
                  <Label htmlFor="requireModeration">Require Moderation</Label>
                  <p className="text-sm text-muted-foreground">
                    All content must be approved before publishing
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="autoApprove"
                  checked={settings.content.autoApproveVerifiedArtists}
                  onCheckedChange={(checked) =>
                    handleSettingChange('content', 'autoApproveVerifiedArtists', checked)
                  }
                />
                <div className="space-y-0.5">
                  <Label htmlFor="autoApprove">Auto-approve Verified Artists</Label>
                  <p className="text-sm text-muted-foreground">
                    Verified artists' content is automatically approved
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Configuration
            </CardTitle>
            <CardDescription>Authentication and security settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="maxAttempts">Max Login Attempts</Label>
                <Input
                  id="maxAttempts"
                  type="number"
                  min="1"
                  max="10"
                  value={settings.security.maxLoginAttempts}
                  onChange={(e) =>
                    handleSettingChange(
                      'security',
                      'maxLoginAttempts',
                      Number.parseInt(e.target.value),
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  min="1"
                  max="24"
                  value={settings.security.sessionTimeout / 3600}
                  onChange={(e) =>
                    handleSettingChange(
                      'security',
                      'sessionTimeout',
                      Number.parseInt(e.target.value) * 3600,
                    )
                  }
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="require2FA"
                  checked={settings.security.requireTwoFactor}
                  onCheckedChange={(checked) =>
                    handleSettingChange('security', 'requireTwoFactor', checked)
                  }
                />
                <div className="space-y-0.5">
                  <Label htmlFor="require2FA">Require 2FA</Label>
                  <p className="text-sm text-muted-foreground">Force two-factor authentication</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={!isDirty || isSaving}
          size="lg"
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
        >
          {isSaving ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving Settings...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save All Changes
            </div>
          )}
        </Button>
      </div>
    </div>
  )
}
