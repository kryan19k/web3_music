import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Separator } from '@/src/components/ui/separator'
import { Badge } from '@/src/components/ui/badge'
import { Switch } from '@/src/components/ui/switch'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select'
import { 
  Settings, 
  DollarSign, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Coins,
  BarChart3
} from 'lucide-react'
import { motion } from 'framer-motion'
import { formatEther } from 'viem'
import { 
  useAdminContractData,
  useAdminUpdatePlatformFee,
  useAdminSetSalePhase,
  useAdminSetDynamicPricing,
  useAdminTogglePause,
  useMusicNFTMarketplaceData,
  SalePhase
} from '@/src/hooks/contracts'

export function PlatformSettings() {
  const { platformStats, roleInfo, isLoading } = useAdminContractData()
  const { salePhase, dynamicPricing } = useMusicNFTMarketplaceData()
  
  const { updatePlatformFee, isLoading: isUpdatingFee } = useAdminUpdatePlatformFee()
  const { setSalePhase, isLoading: isSettingPhase } = useAdminSetSalePhase()
  const { setDynamicPricing, isLoading: isSettingPricing } = useAdminSetDynamicPricing()
  const { pause, unpause, isLoading: isToggling } = useAdminTogglePause()

  const [newFeePercentage, setNewFeePercentage] = useState('')
  const [selectedSalePhase, setSelectedSalePhase] = useState<SalePhase>(salePhase || SalePhase.CLOSED)
  const [isDynamicPricingEnabled, setIsDynamicPricingEnabled] = useState(dynamicPricing || false)

  const handleUpdatePlatformFee = () => {
    const percentage = Number.parseFloat(newFeePercentage)
    if (percentage >= 0 && percentage <= 10) {
      updatePlatformFee({ newPercentage: percentage })
      setNewFeePercentage('')
    }
  }

  const handleSetSalePhase = (phase: string) => {
    const salePhaseValue = Number.parseInt(phase) as SalePhase
    setSalePhase({ phase: salePhaseValue })
    setSelectedSalePhase(salePhaseValue)
  }

  const handleToggleDynamicPricing = (enabled: boolean) => {
    setDynamicPricing({ enabled })
    setIsDynamicPricingEnabled(enabled)
  }

  if (!roleInfo.userRoles.isAdmin) {
    return (
      <div className="text-center py-8">
        <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Admin Access Required</h3>
        <p className="text-muted-foreground">
          Only administrators can modify platform settings.
        </p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading platform settings...</p>
      </div>
    )
  }

  const currentFeePercent = Number(platformStats.platformFeePercentage) / 100

  return (
    <div className="space-y-6">
      {/* Platform Control */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Platform Control
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-medium flex items-center gap-2">
                  Platform Status
                  {platformStats.isPaused ? (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      Paused
                    </Badge>
                  ) : (
                    <Badge variant="default" className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Active
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {platformStats.isPaused 
                    ? 'All minting and transfers are paused'
                    : 'Platform is operating normally'
                  }
                </div>
              </div>
              <Button
                variant={platformStats.isPaused ? "default" : "destructive"}
                onClick={() => platformStats.isPaused ? unpause() : pause()}
                disabled={isToggling}
              >
                {isToggling 
                  ? 'Processing...' 
                  : platformStats.isPaused 
                    ? 'Unpause Platform' 
                    : 'Pause Platform'
                }
              </Button>
            </div>

            {platformStats.isPaused && (
              <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center gap-2 text-red-800 dark:text-red-300">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">Platform is currently paused</span>
                </div>
                <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                  Users cannot mint NFTs or interact with contracts while paused.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Fee Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Fee Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Current Platform Fee</Label>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{currentFeePercent}%</div>
                  <div className="text-sm text-muted-foreground">
                    Applied to all NFT sales
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Fee Recipient</Label>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="font-mono text-sm">
                    {platformStats.platformFeeRecipient 
                      ? `${platformStats.platformFeeRecipient.slice(0, 6)}...${platformStats.platformFeeRecipient.slice(-4)}`
                      : 'Not Set'
                    }
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Address receiving fees
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="new-fee">Update Platform Fee</Label>
              <div className="flex gap-2">
                <Input
                  id="new-fee"
                  type="number"
                  placeholder="Enter new fee percentage (0-10)"
                  value={newFeePercentage}
                  onChange={(e) => setNewFeePercentage(e.target.value)}
                  min="0"
                  max="10"
                  step="0.1"
                />
                <Button 
                  onClick={handleUpdatePlatformFee}
                  disabled={isUpdatingFee || !newFeePercentage}
                >
                  {isUpdatingFee ? 'Updating...' : 'Update Fee'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Fee percentage must be between 0% and 10%
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sale Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Sale Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Sale Phase</Label>
                <Select value={selectedSalePhase.toString()} onValueChange={handleSetSalePhase}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SalePhase.CLOSED.toString()}>
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        Closed
                      </div>
                    </SelectItem>
                    <SelectItem value={SalePhase.WHITELIST.toString()}>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-yellow-500" />
                        Whitelist Only
                      </div>
                    </SelectItem>
                    <SelectItem value={SalePhase.PUBLIC.toString()}>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Public Sale
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {isSettingPhase && (
                  <p className="text-xs text-blue-600">Updating sale phase...</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Dynamic Pricing</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={isDynamicPricingEnabled}
                    onCheckedChange={handleToggleDynamicPricing}
                    disabled={isSettingPricing}
                  />
                  <span className="text-sm">
                    {isDynamicPricingEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {isDynamicPricingEnabled 
                    ? 'Prices adjust based on demand'
                    : 'Fixed tier pricing'
                  }
                </p>
                {isSettingPricing && (
                  <p className="text-xs text-blue-600">Updating pricing model...</p>
                )}
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                Current Sale Settings
              </h4>
              <div className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                <div className="flex justify-between">
                  <span>Phase:</span>
                  <span className="font-medium">
                    {salePhase === SalePhase.CLOSED && 'Closed'}
                    {salePhase === SalePhase.WHITELIST && 'Whitelist'}
                    {salePhase === SalePhase.PUBLIC && 'Public'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Dynamic Pricing:</span>
                  <span className="font-medium">
                    {dynamicPricing ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Revenue Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5" />
              Revenue Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">
                  {Number.parseFloat(formatEther(platformStats.totalPlatformRevenue)).toFixed(4)}
                </div>
                <div className="text-sm text-muted-foreground">ETH Revenue</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Coins className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">
                  {Number.parseFloat(formatEther(platformStats.totalRoyaltiesReceived)).toFixed(4)}
                </div>
                <div className="text-sm text-muted-foreground">ETH Royalties</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <BarChart3 className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">
                  {Number.parseFloat(formatEther(platformStats.totalReferralRewards)).toFixed(4)}
                </div>
                <div className="text-sm text-muted-foreground">ETH Referrals</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}