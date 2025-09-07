import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { useAdminData } from '@/src/hooks/useAdminData'
import { motion } from 'framer-motion'
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Coins,
  DollarSign,
  Music,
  TrendingUp,
  Users,
} from 'lucide-react'

export function AdminOverview() {
  const { stats, transactions, nfts, users } = useAdminData()

  if (!stats) return null

  const criticalAlerts = 2 // Mock critical alerts count
  const pendingNFTs = nfts.filter((nft) => nft.status === 'pending').length
  const flaggedNFTs = nfts.filter((nft) => nft.status === 'flagged').length
  const bannedUsers = users.filter((user) => user.isBanned).length

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $
                {(
                  stats.revenueBreakdown.nftSales +
                  stats.revenueBreakdown.royalties +
                  stats.revenueBreakdown.platformFees
                ).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">+12.5% from last month</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers24h}</div>
              <p className="text-xs text-muted-foreground">+{stats.newUsers24h} new today</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVolume.toFixed(2)} ETH</div>
              <p className="text-xs text-muted-foreground">+8.3% from last week</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">NFTs Minted</CardTitle>
              <Music className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalNFTs}</div>
              <p className="text-xs text-muted-foreground">
                +{Math.floor(Math.random() * 20 + 5)} this week
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Action Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Requires Attention
            </CardTitle>
            <CardDescription>Items that need immediate admin action</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {criticalAlerts > 0 && (
              <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                <div>
                  <p className="font-medium text-red-500">Critical System Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    {criticalAlerts} critical issues detected
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                >
                  View
                </Button>
              </div>
            )}

            {pendingNFTs > 0 && (
              <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <div>
                  <p className="font-medium text-yellow-600">Pending NFTs</p>
                  <p className="text-sm text-muted-foreground">
                    {pendingNFTs} NFTs awaiting approval
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                >
                  Review
                </Button>
              </div>
            )}

            {flaggedNFTs > 0 && (
              <div className="flex items-center justify-between p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                <div>
                  <p className="font-medium text-orange-600">Flagged Content</p>
                  <p className="text-sm text-muted-foreground">
                    {flaggedNFTs} NFTs flagged for review
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                >
                  Moderate
                </Button>
              </div>
            )}

            {bannedUsers > 0 && (
              <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                <div>
                  <p className="font-medium text-red-600">Banned Users</p>
                  <p className="text-sm text-muted-foreground">
                    {bannedUsers} users currently banned
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                >
                  Manage
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest blockchain transactions and platform activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentTransactions.slice(0, 5).map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        tx.status === 'confirmed'
                          ? 'bg-green-500'
                          : tx.status === 'pending'
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium capitalize">{tx.type.replace('_', ' ')}</p>
                      <p className="text-xs text-muted-foreground">
                        {tx.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {tx.value.toFixed(4)} {tx.tokenSymbol}
                    </p>
                    <Badge
                      variant={
                        tx.status === 'confirmed'
                          ? 'default'
                          : tx.status === 'pending'
                            ? 'secondary'
                            : 'destructive'
                      }
                      className="text-xs"
                    >
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full mt-4"
              size="sm"
            >
              View All Transactions
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-green-500" />
            Revenue Breakdown
          </CardTitle>
          <CardDescription>Revenue distribution across platform services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-500/10 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                ${stats.revenueBreakdown.nftSales.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">NFT Sales</p>
              <p className="text-xs text-green-600">
                {(
                  (stats.revenueBreakdown.nftSales /
                    (stats.revenueBreakdown.nftSales +
                      stats.revenueBreakdown.royalties +
                      stats.revenueBreakdown.platformFees)) *
                  100
                ).toFixed(1)}
                %
              </p>
            </div>
            <div className="text-center p-4 bg-blue-500/10 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                ${stats.revenueBreakdown.royalties.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Royalties</p>
              <p className="text-xs text-blue-600">
                {(
                  (stats.revenueBreakdown.royalties /
                    (stats.revenueBreakdown.nftSales +
                      stats.revenueBreakdown.royalties +
                      stats.revenueBreakdown.platformFees)) *
                  100
                ).toFixed(1)}
                %
              </p>
            </div>
            <div className="text-center p-4 bg-purple-500/10 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                ${stats.revenueBreakdown.platformFees.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Platform Fees</p>
              <p className="text-xs text-purple-600">
                {(
                  (stats.revenueBreakdown.platformFees /
                    (stats.revenueBreakdown.nftSales +
                      stats.revenueBreakdown.royalties +
                      stats.revenueBreakdown.platformFees)) *
                  100
                ).toFixed(1)}
                %
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
