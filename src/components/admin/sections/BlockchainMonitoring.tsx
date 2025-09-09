import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import { Progress } from '@/src/components/ui/progress'
import { Coins, Activity, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatEther } from 'viem'
import { useAdminContractData } from '@/src/hooks/contracts'

export function BlockchainMonitoring() {
  const { platformStats, isLoading } = useAdminContractData()

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading blockchain data...</p>
      </div>
    )
  }

  // Mock transaction data - in real app, this would come from monitoring service
  const recentTransactions = [
    { id: '1', type: 'NFT_MINT', amount: '0.1 ETH', status: 'confirmed', timestamp: '2 minutes ago' },
    { id: '2', type: 'ROYALTY_CLAIM', amount: '0.05 ETH', status: 'confirmed', timestamp: '5 minutes ago' },
    { id: '3', type: 'TIER_UPDATE', amount: '0 ETH', status: 'pending', timestamp: '10 minutes ago' }
  ]

  const royaltyDistributionPercent = platformStats.totalRoyaltiesDistributed > 0n 
    ? Number((Number(platformStats.totalRoyaltiesDistributed) / Number(platformStats.totalRoyaltiesReceived)) * 100n)
    : 0

  return (
    <div className="space-y-6">
      {/* Contract Health */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Contract Health Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  {platformStats.isPaused ? (
                    <AlertCircle className="h-8 w-8 text-red-500" />
                  ) : (
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  )}
                </div>
                <div className="font-medium">Contract Status</div>
                <Badge variant={platformStats.isPaused ? "destructive" : "default"}>
                  {platformStats.isPaused ? 'Paused' : 'Active'}
                </Badge>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <TrendingUp className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="font-medium">Gas Usage</div>
                <div className="text-sm text-muted-foreground">Optimized</div>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <Coins className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="font-medium">Treasury Balance</div>
                <div className="text-sm font-mono">
                  {Number.parseFloat(formatEther(platformStats.totalPlatformRevenue)).toFixed(4)} ETH
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Transaction Monitoring */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((tx, index) => (
                <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <div>
                      <div className="font-medium">{tx.type}</div>
                      <div className="text-sm text-muted-foreground">{tx.timestamp}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono">{tx.amount}</div>
                    <Badge variant={tx.status === 'confirmed' ? 'default' : 'secondary'}>
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Royalty Flow */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5" />
              Royalty Distribution Flow
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Received:</span>
                  <span className="font-mono">
                    {Number.parseFloat(formatEther(platformStats.totalRoyaltiesReceived)).toFixed(4)} ETH
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Distributed:</span>
                  <span className="font-mono">
                    {Number.parseFloat(formatEther(platformStats.totalRoyaltiesDistributed)).toFixed(4)} ETH
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Distribution Rate:</span>
                  <span className="font-semibold">{royaltyDistributionPercent.toFixed(1)}%</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Distribution Progress</div>
                <Progress value={royaltyDistributionPercent} className="h-3" />
                <div className="text-xs text-muted-foreground">
                  {royaltyDistributionPercent > 90 
                    ? 'Excellent distribution rate' 
                    : 'Pending distributions available'
                  }
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Network Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Network Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 border rounded-lg">
                <div className="font-medium">Network</div>
                <div className="text-sm text-muted-foreground">Polygon Amoy</div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="font-medium">Chain ID</div>
                <div className="text-sm text-muted-foreground">80002</div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="font-medium">Block Time</div>
                <div className="text-sm text-muted-foreground">~2s</div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="font-medium">Gas Price</div>
                <div className="text-sm text-muted-foreground">~30 gwei</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}