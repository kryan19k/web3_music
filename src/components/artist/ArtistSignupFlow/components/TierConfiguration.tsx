/**
 * Tier Configuration
 * NFT tier setup with pricing, supply, and benefits customization
 */

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Badge } from '@/src/components/ui/badge'
import { Switch } from '@/src/components/ui/switch'
import { Slider } from '@/src/components/ui/slider'
import { TrackTierConfig, DEFAULT_TIER_CONFIGS } from '@/src/types/artist'
import { useTierConfiguration } from '@/src/hooks/contracts/useTierConfiguration'
import { 
  Crown,
  Star, 
  Trophy,
  Award,
  DollarSign,
  Users,
  Gift,
  Music,
  Settings,
  Check,
  Info,
  ArrowRight,
  Zap,
  AlertTriangle,
  RefreshCw,
  Target,
  Shield,
  TrendingUp
} from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

interface TierConfigurationProps {
  onComplete: (tiers: TrackTierConfig[]) => void
  initialTiers?: TrackTierConfig[]
}

const TIER_ICONS = {
  bronze: Award,
  silver: Star,
  gold: Trophy,
  platinum: Crown,
}

const TIER_COLORS = {
  bronze: { 
    bg: 'bg-orange-100 dark:bg-orange-900/20', 
    text: 'text-orange-600',
    border: 'border-orange-200 dark:border-orange-800'
  },
  silver: { 
    bg: 'bg-gray-100 dark:bg-gray-900/20', 
    text: 'text-gray-600',
    border: 'border-gray-200 dark:border-gray-800'
  },
  gold: { 
    bg: 'bg-yellow-100 dark:bg-yellow-900/20', 
    text: 'text-yellow-600',
    border: 'border-yellow-200 dark:border-yellow-800'
  },
  platinum: { 
    bg: 'bg-purple-100 dark:bg-purple-900/20', 
    text: 'text-purple-600',
    border: 'border-purple-200 dark:border-purple-800'
  },
}

export function TierConfiguration({ onComplete, initialTiers = DEFAULT_TIER_CONFIGS }: TierConfigurationProps) {
  const [tiers, setTiers] = useState<TrackTierConfig[]>(initialTiers)
  const [selectedTier, setSelectedTier] = useState<string | null>(null)
  const [isDeployingToContract, setIsDeployingToContract] = useState(false)
  
  const {
    configureAllTiers,
    isConfiguring,
    isConfirming,
    isSuccess,
    error: tierConfigError
  } = useTierConfiguration()

  const updateTier = (tierName: string, updates: Partial<TrackTierConfig>) => {
    setTiers(prev => prev.map(tier => 
      tier.tier === tierName ? { ...tier, ...updates } : tier
    ))
  }

  const handleSubmit = async () => {
    const enabledTiers = tiers.filter(tier => tier.enabled)
    
    if (enabledTiers.length === 0) {
      toast.error('Enable at least one tier')
      return
    }

    // Validate pricing
    for (const tier of enabledTiers) {
      const price = parseFloat(tier.price)
      if (isNaN(price) || price <= 0) {
        toast.error(`Invalid price for ${tier.tier} tier`)
        return
      }
      
      if (tier.maxSupply <= 0 || tier.maxSupply > 100000) {
        toast.error(`Invalid max supply for ${tier.tier} tier (must be 1-100,000)`)
        return
      }
    }

    // Option to deploy to smart contract or just save locally
    try {
      setIsDeployingToContract(true)
      toast.loading('Configuring tiers on smart contract...', { id: 'tier-config' })
      
      await configureAllTiers(enabledTiers)
      
      toast.success('Tier configuration deployed to smart contract!', { id: 'tier-config' })
      onComplete(tiers)
      
    } catch (error) {
      console.error('Failed to deploy tier configuration:', error)
      
      // Still allow proceeding with local configuration
      toast.warning('Smart contract deployment failed, proceeding with local configuration', { id: 'tier-config' })
      onComplete(tiers)
    } finally {
      setIsDeployingToContract(false)
    }
  }

  const getTotalEstimatedRevenue = () => {
    return tiers
      .filter(tier => tier.enabled)
      .reduce((total, tier) => {
        return total + (parseFloat(tier.price) * tier.maxSupply)
      }, 0)
      .toFixed(3)
  }

  const renderTierCard = (tier: TrackTierConfig) => {
    const TierIcon = TIER_ICONS[tier.tier]
    const colors = TIER_COLORS[tier.tier]
    
    return (
      <motion.div
        key={tier.tier}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative ${tier.enabled ? '' : 'opacity-60'}`}
      >
        <Card className={`relative overflow-hidden transition-all ${
          tier.enabled ? `${colors.border} bg-gradient-to-br from-background to-${colors.bg}` : ''
        } ${selectedTier === tier.tier ? 'ring-2 ring-primary' : ''}`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${colors.bg}`}>
                  <TierIcon className={`w-5 h-5 ${colors.text}`} />
                </div>
                <div>
                  <CardTitle className="capitalize">{tier.tier} Tier</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {tier.tier === 'bronze' && 'Entry level for new fans'}
                    {tier.tier === 'silver' && 'Popular choice with stem access'}
                    {tier.tier === 'gold' && 'Premium experience with backstage'}
                    {tier.tier === 'platinum' && 'Ultimate collector edition'}
                  </p>
                </div>
              </div>
              
              <Switch
                checked={tier.enabled}
                onCheckedChange={(enabled) => updateTier(tier.tier, { enabled })}
              />
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {tier.enabled && (
              <>
                {/* Pricing */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Price (ETH)</Label>
                    <Input
                      type="number"
                      step="0.001"
                      min="0"
                      value={tier.price}
                      onChange={(e) => updateTier(tier.tier, { price: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label>Max Per Track</Label>
                    <Input
                      type="number"
                      min="1"
                      max="10000"
                      value={tier.maxSupply}
                      onChange={(e) => updateTier(tier.tier, { maxSupply: parseInt(e.target.value) || 1 })}
                      className="mt-1"
                      placeholder="e.g., 1000"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Maximum NFTs that can be minted per track for this tier
                    </p>
                  </div>
                </div>

                {/* Tier Caps & Revenue */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-800 dark:text-green-200">Revenue Cap:</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                        <DollarSign className="w-3 h-3 mr-1" />
                        {(parseFloat(tier.price) * tier.maxSupply).toFixed(3)} ETH
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Supply Cap:</span>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                        <Target className="w-3 h-3 mr-1" />
                        {tier.maxSupply.toLocaleString()}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Benefits Configuration */}
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Gift className="w-4 h-4" />
                    Holder Benefits
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {/* Access Rights */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Backstage Access</Label>
                        <Switch
                          size="sm"
                          checked={tier.benefits.hasBackstageAccess}
                          onCheckedChange={(checked) => 
                            updateTier(tier.tier, {
                              benefits: { ...tier.benefits, hasBackstageAccess: checked }
                            })
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Remix Rights</Label>
                        <Switch
                          size="sm"
                          checked={tier.benefits.hasRemixRights}
                          onCheckedChange={(checked) => 
                            updateTier(tier.tier, {
                              benefits: { ...tier.benefits, hasRemixRights: checked }
                            })
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Stem Access</Label>
                        <Switch
                          size="sm"
                          checked={tier.benefits.hasStemAccess}
                          onCheckedChange={(checked) => 
                            updateTier(tier.tier, {
                              benefits: { ...tier.benefits, hasStemAccess: checked }
                            })
                          }
                        />
                      </div>
                    </div>

                    {/* Rewards */}
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs">Merch Discount (%)</Label>
                        <div className="mt-1">
                          <Slider
                            value={[tier.benefits.merchDiscount]}
                            onValueChange={(value) => 
                              updateTier(tier.tier, {
                                benefits: { ...tier.benefits, merchDiscount: value[0] }
                              })
                            }
                            max={100}
                            step={5}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>0%</span>
                            <span>{tier.benefits.merchDiscount}%</span>
                            <span>100%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-xs">Guest List Spots</Label>
                        <Input
                          type="number"
                          min="0"
                          max="10"
                          value={tier.benefits.maxGuestListSpots}
                          onChange={(e) => 
                            updateTier(tier.tier, {
                              benefits: { ...tier.benefits, maxGuestListSpots: parseInt(e.target.value) || 0 }
                            })
                          }
                          className="mt-1 h-8 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Benefits Preview */}
                <div className="border-t pt-3">
                  <div className="flex flex-wrap gap-1">
                    {tier.benefits.hasBackstageAccess && (
                      <Badge variant="outline" className="text-xs">
                        🎭 Backstage
                      </Badge>
                    )}
                    {tier.benefits.hasRemixRights && (
                      <Badge variant="outline" className="text-xs">
                        🎵 Remix Rights
                      </Badge>
                    )}
                    {tier.benefits.hasStemAccess && (
                      <Badge variant="outline" className="text-xs">
                        🔧 Stems
                      </Badge>
                    )}
                    {tier.benefits.merchDiscount > 0 && (
                      <Badge variant="outline" className="text-xs">
                        💰 {tier.benefits.merchDiscount}% Off Merch
                      </Badge>
                    )}
                    {tier.benefits.maxGuestListSpots > 0 && (
                      <Badge variant="outline" className="text-xs">
                        🎫 {tier.benefits.maxGuestListSpots} Guest List
                      </Badge>
                    )}
                  </div>
                </div>
              </>
            )}
            
            {!tier.enabled && (
              <div className="text-center py-6 text-muted-foreground">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                  <TierIcon className="w-6 h-6" />
                </div>
                <p className="text-sm">Tier disabled</p>
                <p className="text-xs">Enable to configure pricing and benefits</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Configure Your NFT Tiers
        </h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Create different tiers with unique pricing, supply caps, and benefits. Fans can choose the level of support that works for them.
        </p>
        
        {/* Smart Contract Integration Notice */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg max-w-xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-sm text-blue-800 dark:text-blue-200">
            <Shield className="w-4 h-4" />
            <span>Tier configurations will be deployed directly to the smart contract</span>
          </div>
        </div>
      </div>

      {/* Enhanced Stats with Caps */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4 text-center">
            <Target className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <h4 className="font-semibold text-blue-800 dark:text-blue-200">
              {tiers.filter(t => t.enabled).reduce((sum, t) => sum + t.maxSupply, 0).toLocaleString()}
            </h4>
            <p className="text-sm text-blue-600 dark:text-blue-400">Total Supply Cap</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-600" />
            <h4 className="font-semibold text-green-800 dark:text-green-200">{getTotalEstimatedRevenue()} ETH</h4>
            <p className="text-sm text-green-600 dark:text-green-400">Revenue Cap</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4 text-center">
            <Settings className="w-6 h-6 mx-auto mb-2 text-purple-600" />
            <h4 className="font-semibold text-purple-800 dark:text-purple-200">{tiers.filter(t => t.enabled).length}/4</h4>
            <p className="text-sm text-purple-600 dark:text-purple-400">Active Tiers</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20 border-orange-200 dark:border-orange-800">
          <CardContent className="p-4 text-center">
            <Shield className="w-6 h-6 mx-auto mb-2 text-orange-600" />
            <h4 className="font-semibold text-orange-800 dark:text-orange-200">
              {tiers.filter(t => t.enabled).length > 0 ? 'Ready' : 'Setup'}
            </h4>
            <p className="text-sm text-orange-600 dark:text-orange-400">Smart Contract</p>
          </CardContent>
        </Card>
      </div>

      {/* Tier Configuration */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {tiers.map(tier => renderTierCard(tier))}
      </div>

      {/* Tips */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium mb-2">Pricing Tips</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Bronze:</strong> Keep affordable (0.001-0.01 ETH) to attract new fans</li>
                <li>• <strong>Silver:</strong> Sweet spot for most fans (0.01-0.05 ETH) with stem access</li>
                <li>• <strong>Gold:</strong> Premium tier (0.05-0.1 ETH) with exclusive backstage content</li>
                <li>• <strong>Platinum:</strong> Collector's edition (0.1+ ETH) with all benefits unlocked</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Button */}
      <div className="flex justify-center">
        <div className="space-y-4">
          {/* Deploy Status */}
          {(isConfiguring || isConfirming || isDeployingToContract) && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
                <div>
                  <p className="font-medium text-blue-800 dark:text-blue-200">
                    {isConfiguring && 'Deploying tier configuration to smart contract...'}
                    {isConfirming && 'Waiting for blockchain confirmation...'}
                    {isDeployingToContract && 'Processing tier configuration...'}
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    This may take a few moments. Please don't close this window.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Error Display */}
          {tierConfigError && (
            <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-800 dark:text-red-200">
                    Smart Contract Deployment Failed
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {tierConfigError.message || 'Failed to deploy tier configuration'}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Action Button */}
          <Button
            onClick={handleSubmit}
            disabled={tiers.filter(t => t.enabled).length === 0 || isConfiguring || isConfirming || isDeployingToContract}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 px-8 py-6 text-lg w-full sm:w-auto"
            size="lg"
          >
            {(isConfiguring || isConfirming || isDeployingToContract) ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Deploying to Smart Contract...
              </>
            ) : tiers.filter(t => t.enabled).length > 0 ? (
              <>
                <Zap className="w-5 h-5 mr-2" />
                Deploy Tier Configuration
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            ) : (
              <>
                <Settings className="w-5 h-5 mr-2" />
                Enable at least one tier
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
