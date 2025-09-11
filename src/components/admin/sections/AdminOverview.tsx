import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import { Progress } from '@/src/components/ui/progress'
import { Button } from '@/src/components/ui/button'
import { 
  BarChart3, 
  Users, 
  Music, 
  DollarSign, 
  TrendingUp, 
  PlayCircle,
  Coins,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { motion } from 'framer-motion'
import { formatEther } from 'viem'
import { 
  useAdminContractData, 
  useMusicNFTAllTiers, 
  useAdminTogglePause,
  contractUtils 
} from '@/src/hooks/contracts'
import { Tier } from '@/src/hooks/contracts/useMusicNFT'

export function AdminOverview() {
  const { platformStats, roleInfo, isLoading, isAuthorized } = useAdminContractData()
  const { tiers } = useMusicNFTAllTiers()
  const { pause, unpause, isLoading: isToggling } = useAdminTogglePause()

  if (!isAuthorized) {
    return (
      <div className="text-center py-8">
        <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Access Denied</h3>
        <p className="text-muted-foreground">
          You need admin or manager privileges to access this dashboard.
        </p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading platform overview...</p>
      </div>
    )
  }

  // Calculate platform metrics
  const totalSupplyFormatted = Number(platformStats.totalSupply).toLocaleString()
  const platformRevenueETH = formatEther(BigInt(platformStats.totalPlatformRevenue || 0))
  const platformRevenueUSD = Number.parseFloat(platformRevenueETH) * 3000 // Assuming ETH = $3000
  const royaltiesReceivedETH = formatEther(BigInt(platformStats.totalRoyaltiesReceived || 0))
  const royaltiesDistributedETH = formatEther(BigInt(platformStats.totalRoyaltiesDistributed || 0))
  const platformFeePercent = Number(platformStats.platformFeePercentage) / 100

  // Calculate tier statistics
  const tierStats = Object.values(Tier).filter(tier => typeof tier === 'number').map(tier => {
    const tierData = tiers[tier as Tier]
    if (!tierData) return null
    
    // Contract returns tuple: [name, price, currentSupply, maxSupply, saleActive, remaining]
    const [name, price, currentSupply, maxSupply, saleActive] = tierData
    
    const mintedPercent = Number(maxSupply) > 0 
      ? (Number(currentSupply) / Number(maxSupply)) * 100 
      : 0

    return {
      tier: tier as Tier,
      name: name,
      minted: Number(currentSupply) || 0,
      total: Number(maxSupply) || 0,
      percent: mintedPercent,
      active: saleActive || false,
      price: formatEther(price || 0n),
    }
  }).filter((tier): tier is NonNullable<typeof tier> => tier !== null)

  const totalMinted = tierStats.reduce((sum, tier) => sum + tier.minted, 0)
  const totalAvailable = tierStats.reduce((sum, tier) => sum + tier.total, 0)
  const overallMintPercent = totalAvailable > 0 ? (totalMinted / totalAvailable) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Platform Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className={`border-2 ${platformStats.isPaused ? 'border-red-500 bg-red-50 dark:bg-red-950' : 'border-green-500 bg-green-50 dark:bg-green-950'}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {platformStats.isPaused ? (
                  <XCircle className="h-6 w-6 text-red-500" />
                ) : (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                )}
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">
                    Platform Status: {platformStats.isPaused ? 'PAUSED' : 'ACTIVE'}
                  </h3>
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    {platformStats.isPaused 
                      ? 'All platform functions are currently paused'
                      : 'Platform is operating normally'
                    }
                  </p>
                </div>
              </div>
              <Button
                variant={platformStats.isPaused ? "default" : "destructive"}
                onClick={() => platformStats.isPaused ? unpause() : pause()}
                disabled={isToggling}
              >
                {isToggling ? 'Processing...' : platformStats.isPaused ? 'Unpause' : 'Pause'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total NFTs Minted
              </CardTitle>
              <Music className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSupplyFormatted}</div>
              <div className="text-xs text-muted-foreground">
                {overallMintPercent.toFixed(1)}% of total supply
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Platform Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {contractUtils.formatCurrency(platformRevenueUSD)}
              </div>
              <div className="text-xs text-muted-foreground">
                {Number.parseFloat(platformRevenueETH).toFixed(4)} ETH
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Royalties Distributed
              </CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Number.parseFloat(royaltiesDistributedETH).toFixed(2)} ETH
              </div>
              <div className="text-xs text-muted-foreground">
                From {Number.parseFloat(royaltiesReceivedETH).toFixed(2)} ETH received
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Platform Fee
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{platformFeePercent}%</div>
              <div className="text-xs text-muted-foreground">
                Current fee percentage
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tier Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              NFT Tier Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tierStats.map((tier, index) => (
                <div key={tier.tier} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{tier.name}</span>
                      <Badge variant={tier.active ? "default" : "secondary"}>
                        {tier.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {tier.minted.toLocaleString()} / {tier.total.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {tier.price} ETH each
                      </div>
                    </div>
                  </div>
                  <Progress value={tier.percent} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    {tier.percent.toFixed(1)}% minted
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlayCircle className="h-5 w-5" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="font-medium">Contract Status</div>
                <div className="text-sm text-muted-foreground">
                  {platformStats.isPaused ? 'Paused' : 'Operational'}
                </div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Coins className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="font-medium">Fee Recipient</div>
                <div className="text-xs font-mono text-muted-foreground">
                  {platformStats.platformFeeRecipient 
                    ? `${platformStats.platformFeeRecipient.slice(0, 6)}...${platformStats.platformFeeRecipient.slice(-4)}`
                    : 'Not Set'
                  }
                </div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Shield className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="font-medium">Your Access</div>
                <div className="text-sm text-muted-foreground">
                  {roleInfo.userRoles.isAdmin ? 'Admin' : roleInfo.userRoles.isManager ? 'Manager' : 'User'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}