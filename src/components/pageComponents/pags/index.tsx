import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/custom-tabs'
import { Input } from '@/src/components/ui/input'
import { Progress } from '@/src/components/ui/progress'
import { Slider } from '@/src/components/ui/slider'
import { motion } from 'framer-motion'
import {
  ArrowDownRight,
  ArrowLeftRight,
  ArrowUpRight,
  BarChart3,
  Calendar,
  Coins,
  Gift,
  Lock,
  Music,
  Percent,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Users,
} from 'lucide-react'
import { useState } from 'react'

// Mock PAGS token data
const pagsData = {
  balance: 15420,
  stakedAmount: 8500,
  availableToStake: 6920,
  pendingRewards: 124.67,
  totalEarned: 2847.5,
  currentPrice: 0.024,
  priceChange24h: 8.4,
  marketCap: 2400000,
  totalSupply: 100000000,
  stakingAPY: 15.2,
  stakingPeriod: 30, // days
  minimumStake: 100,
}

const stakingTiers = [
  {
    name: 'Bronze Staker',
    minAmount: 100,
    apy: 12,
    color: 'from-orange-500 to-red-500',
    rewards: ['Basic NFT discounts', 'Monthly airdrops'],
  },
  {
    name: 'Silver Staker',
    minAmount: 1000,
    apy: 15,
    color: 'from-slate-400 to-slate-600',
    rewards: ['Premium NFT access', 'VIP community', 'Higher rewards'],
  },
  {
    name: 'Gold Staker',
    minAmount: 5000,
    apy: 18,
    color: 'from-yellow-400 to-yellow-600',
    rewards: ['Exclusive NFT drops', 'Artist meetups', 'Governance voting'],
  },
  {
    name: 'Platinum Staker',
    minAmount: 15000,
    apy: 25,
    color: 'from-purple-400 to-purple-600',
    rewards: ['All benefits', 'Custom NFTs', 'Revenue sharing', 'Platform governance'],
  },
]

const priceHistory = [
  { date: 'Jan 2024', price: 0.018 },
  { date: 'Feb 2024', price: 0.021 },
  { date: 'Mar 2024', price: 0.019 },
  { date: 'Apr 2024', price: 0.025 },
  { date: 'May 2024', price: 0.022 },
  { date: 'Jun 2024', price: 0.024 },
]

const rewardsHistory = [
  { date: '2024-06-15', amount: 45.3, type: 'Staking Reward' },
  { date: '2024-06-08', amount: 67.8, type: 'NFT Royalties' },
  { date: '2024-06-01', amount: 52.4, type: 'Staking Reward' },
  { date: '2024-05-25', amount: 38.9, type: 'Governance Bonus' },
  { date: '2024-05-18', amount: 71.2, type: 'NFT Royalties' },
]

export function PagsDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview')
  const [stakeAmount, setStakeAmount] = useState(1000)
  const [swapAmount, setSwapAmount] = useState('')
  const [swapDirection, setSwapDirection] = useState<'eth-to-pags' | 'pags-to-eth'>('eth-to-pags')

  const currentTier =
    stakingTiers.find((tier) => pagsData.stakedAmount >= tier.minAmount) || stakingTiers[0]

  const nextTier = stakingTiers.find((tier) => tier.minAmount > pagsData.stakedAmount)

  const handleStake = () => {
    console.log('Staking', stakeAmount, 'PAGS tokens')
    // In a real app, this would call smart contract
  }

  const handleClaim = () => {
    console.log('Claiming', pagsData.pendingRewards, 'PAGS rewards')
    // In a real app, this would call smart contract
  }

  const handleSwap = () => {
    console.log('Swapping', swapAmount, swapDirection)
    // In a real app, this would integrate with a DEX
  }

  const projectedRewards = (stakeAmount * (currentTier.apy / 100)) / 12 // Monthly projection

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-yellow-900/20 via-background to-purple-900/20">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <img
                src="/pags.png"
                alt="PAGS Token"
                className="w-32 h-32 rounded-full shadow-lg"
              />
              <h1 className="text-5xl md:text-6xl font-bold">
                PAGS{' '}
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  Dashboard
                </span>
              </h1>
            </div>
            <p className="text-xl text-muted-foreground mb-8">
              Stake, earn, and manage your PAGS tokens. Unlock exclusive benefits and maximize your
              music investment returns.
            </p>

            {/* Token Price */}
            <div className="inline-flex items-center gap-4 bg-card/50 backdrop-blur-sm border border-border/50 rounded-full px-6 py-3">
              <div className="flex items-center gap-2">
                <img
                  src="/pags.png"
                  alt="PAGS"
                  className="w-5 h-5 rounded-full"
                />
                <span className="font-semibold">${pagsData.currentPrice.toFixed(4)}</span>
              </div>
              <Badge
                className={`${pagsData.priceChange24h > 0 ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}
              >
                {pagsData.priceChange24h > 0 ? (
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 mr-1" />
                )}
                {Math.abs(pagsData.priceChange24h)}% 24h
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <img
                      src="/pags.png"
                      alt="PAGS Token"
                      className="w-8 h-8 rounded-full shadow-md"
                    />
                    <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                      PAGS
                    </Badge>
                  </div>
                  <p className="text-3xl font-bold">{pagsData.balance.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Balance</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Lock className="w-8 h-8 text-purple-500" />
                    <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                      Staked
                    </Badge>
                  </div>
                  <p className="text-3xl font-bold">{pagsData.stakedAmount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Staked Amount</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Gift className="w-8 h-8 text-green-500" />
                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                      Rewards
                    </Badge>
                  </div>
                  <p className="text-3xl font-bold">{pagsData.pendingRewards.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Pending Rewards</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Percent className="w-8 h-8 text-blue-500" />
                    <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">APY</Badge>
                  </div>
                  <p className="text-3xl font-bold">{currentTier.apy}%</p>
                  <p className="text-sm text-muted-foreground">Current Staking APY</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Tabs */}
          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
          >
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="staking">Staking</TabsTrigger>
              <TabsTrigger value="swap">Swap</TabsTrigger>
              <TabsTrigger value="rewards">Rewards</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Current Tier */}
                <Card
                  className={`bg-gradient-to-br ${currentTier.color}/10 border-2`}
                  style={{
                    borderColor: currentTier.color.includes('yellow')
                      ? '#eab308'
                      : currentTier.color.includes('purple')
                        ? '#a855f7'
                        : currentTier.color.includes('slate')
                          ? '#64748b'
                          : '#ea580c',
                  }}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-5 h-5" />
                      Your Current Tier: {currentTier.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-2xl font-bold">{currentTier.apy}% APY</p>
                        <p className="text-sm text-muted-foreground">Annual Percentage Yield</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Benefits:</h4>
                        <ul className="space-y-1">
                          {currentTier.rewards.map((reward) => (
                            <li
                              key={reward}
                              className="flex items-center gap-2 text-sm"
                            >
                              <Star className="w-3 h-3 text-yellow-500" />
                              {reward}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {nextTier && (
                        <div className="pt-4 border-t">
                          <p className="text-sm text-muted-foreground">
                            Stake {(nextTier.minAmount - pagsData.stakedAmount).toLocaleString()}{' '}
                            more PAGS to unlock {nextTier.name}
                          </p>
                          <Progress
                            value={(pagsData.stakedAmount / nextTier.minAmount) * 100}
                            className="mt-2"
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Price Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Price History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {priceHistory.map((point, idx) => (
                        <div
                          key={point.date}
                          className="flex items-center justify-between"
                        >
                          <span className="font-medium">{point.date}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">${point.price.toFixed(4)}</span>
                            {idx > 0 && (
                              <Badge
                                variant={
                                  point.price > priceHistory[idx - 1].price
                                    ? 'secondary'
                                    : 'outline'
                                }
                              >
                                {point.price > priceHistory[idx - 1].price ? (
                                  <ArrowUpRight className="w-3 h-3 mr-1 text-green-500" />
                                ) : (
                                  <ArrowDownRight className="w-3 h-3 mr-1 text-red-500" />
                                )}
                                {Math.abs(
                                  ((point.price - priceHistory[idx - 1].price) /
                                    priceHistory[idx - 1].price) *
                                    100,
                                ).toFixed(1)}
                                %
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Market Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Market Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Market Cap</span>
                        <span className="font-semibold">
                          ${(pagsData.marketCap / 1000000).toFixed(1)}M
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Supply</span>
                        <span className="font-semibold">
                          {(pagsData.totalSupply / 1000000).toFixed(0)}M
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Circulating Supply</span>
                        <span className="font-semibold">
                          {((pagsData.totalSupply * 0.6) / 1000000).toFixed(0)}M
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">24h Volume</span>
                        <span className="font-semibold">$847K</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                        onClick={handleClaim}
                        disabled={pagsData.pendingRewards === 0}
                      >
                        <Gift className="w-4 h-4 mr-2" />
                        Claim {pagsData.pendingRewards.toFixed(2)} PAGS Rewards
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setSelectedTab('staking')}
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        Stake More Tokens
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setSelectedTab('swap')}
                      >
                        <ArrowLeftRight className="w-4 h-4 mr-2" />
                        Swap Tokens
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Staking Tab */}
            <TabsContent value="staking">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Stake Tokens */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="w-5 h-5" />
                      Stake PAGS Tokens
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <label
                          htmlFor="stake-amount"
                          className="text-sm font-medium"
                        >
                          Amount to Stake
                        </label>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center gap-2">
                            <Input
                              id="stake-amount"
                              type="number"
                              value={stakeAmount}
                              onChange={(e) => setStakeAmount(Number(e.target.value))}
                              placeholder="Enter amount"
                              className="flex-1"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setStakeAmount(pagsData.availableToStake)}
                            >
                              MAX
                            </Button>
                          </div>
                          <Slider
                            value={[stakeAmount]}
                            onValueChange={([value]) => setStakeAmount(value)}
                            max={pagsData.availableToStake}
                            min={pagsData.minimumStake}
                            step={100}
                          />
                          <p className="text-xs text-muted-foreground">
                            Available: {pagsData.availableToStake.toLocaleString()} PAGS
                          </p>
                        </div>
                      </div>

                      <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Staking APY:</span>
                          <span className="text-sm font-semibold">{currentTier.apy}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Lock Period:</span>
                          <span className="text-sm font-semibold">
                            {pagsData.stakingPeriod} days
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Projected Monthly:</span>
                          <span className="text-sm font-semibold text-green-500">
                            +{projectedRewards.toFixed(2)} PAGS
                          </span>
                        </div>
                      </div>

                      <Button
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        onClick={handleStake}
                        disabled={stakeAmount < pagsData.minimumStake}
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        Stake {stakeAmount.toLocaleString()} PAGS
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Staking Tiers */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-5 h-5" />
                      Staking Tiers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stakingTiers.map((tier) => (
                        <div
                          key={tier.name}
                          className={`p-4 rounded-lg border-2 ${
                            pagsData.stakedAmount >= tier.minAmount
                              ? 'border-primary bg-primary/5'
                              : 'border-border'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{tier.name}</h4>
                            <Badge className={`bg-gradient-to-r ${tier.color} text-white`}>
                              {tier.apy}% APY
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Minimum: {tier.minAmount.toLocaleString()} PAGS
                          </p>
                          <div className="text-xs text-muted-foreground">
                            {tier.rewards.slice(0, 2).join(' • ')}
                            {tier.rewards.length > 2 && ' • ...'}
                          </div>
                          {pagsData.stakedAmount >= tier.minAmount && (
                            <div className="mt-2">
                              <Badge
                                variant="secondary"
                                className="text-xs"
                              >
                                ✓ Unlocked
                              </Badge>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Swap Tab */}
            <TabsContent value="swap">
              <div className="max-w-md mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ArrowLeftRight className="w-5 h-5" />
                      Swap Tokens
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Swap Direction Toggle */}
                      <div className="flex border border-border rounded-lg">
                        <Button
                          variant={swapDirection === 'eth-to-pags' ? 'secondary' : 'ghost'}
                          className="flex-1 rounded-r-none"
                          onClick={() => setSwapDirection('eth-to-pags')}
                        >
                          ETH → PAGS
                        </Button>
                        <Button
                          variant={swapDirection === 'pags-to-eth' ? 'secondary' : 'ghost'}
                          className="flex-1 rounded-l-none"
                          onClick={() => setSwapDirection('pags-to-eth')}
                        >
                          PAGS → ETH
                        </Button>
                      </div>

                      {/* Swap Input */}
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="swap-from-input"
                            className="text-sm font-medium"
                          >
                            From ({swapDirection === 'eth-to-pags' ? 'ETH' : 'PAGS'})
                          </label>
                          <Input
                            id="swap-from-input"
                            type="number"
                            value={swapAmount}
                            onChange={(e) => setSwapAmount(e.target.value)}
                            placeholder={`Enter ${swapDirection === 'eth-to-pags' ? 'ETH' : 'PAGS'} amount`}
                            className="mt-2"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Balance:{' '}
                            {swapDirection === 'eth-to-pags'
                              ? '2.45 ETH'
                              : `${pagsData.balance.toLocaleString()} PAGS`}
                          </p>
                        </div>

                        <div className="flex justify-center">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              setSwapDirection(
                                swapDirection === 'eth-to-pags' ? 'pags-to-eth' : 'eth-to-pags',
                              )
                            }
                          >
                            <ArrowLeftRight className="w-4 h-4" />
                          </Button>
                        </div>

                        <div>
                          <span className="text-sm font-medium">
                            To ({swapDirection === 'eth-to-pags' ? 'PAGS' : 'ETH'})
                          </span>
                          <div className="mt-2 p-3 bg-muted rounded-lg">
                            <p className="font-semibold">
                              {swapAmount
                                ? swapDirection === 'eth-to-pags'
                                  ? (
                                      Number.parseFloat(swapAmount) / pagsData.currentPrice
                                    ).toLocaleString()
                                  : (Number.parseFloat(swapAmount) * pagsData.currentPrice).toFixed(
                                      6,
                                    )
                                : '0'}{' '}
                              {swapDirection === 'eth-to-pags' ? 'PAGS' : 'ETH'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Swap Details */}
                      <div className="p-4 bg-muted/50 rounded-lg space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Exchange Rate:</span>
                          <span>1 ETH = {(1 / pagsData.currentPrice).toLocaleString()} PAGS</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Network Fee:</span>
                          <span>~0.003 ETH</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Slippage:</span>
                          <span>0.5%</span>
                        </div>
                      </div>

                      <Button
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                        onClick={handleSwap}
                        disabled={!swapAmount}
                      >
                        <ArrowLeftRight className="w-4 h-4 mr-2" />
                        Swap {swapDirection === 'eth-to-pags' ? 'ETH for PAGS' : 'PAGS for ETH'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Rewards Tab */}
            <TabsContent value="rewards">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Rewards History
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {rewardsHistory.map((reward) => (
                          <div
                            key={`${reward.type}-${reward.date}`}
                            className="flex items-center justify-between p-4 border border-border rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                {reward.type.includes('Staking') ? (
                                  <Lock className="w-4 h-4 text-primary" />
                                ) : reward.type.includes('NFT') ? (
                                  <Music className="w-4 h-4 text-primary" />
                                ) : (
                                  <Users className="w-4 h-4 text-primary" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{reward.type}</p>
                                <p className="text-sm text-muted-foreground">{reward.date}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-green-500">
                                +{reward.amount.toFixed(2)} PAGS
                              </p>
                              <p className="text-xs text-muted-foreground">
                                ${(reward.amount * pagsData.currentPrice).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Claimable Rewards
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center space-y-4">
                        <div>
                          <p className="text-3xl font-bold text-green-500">
                            {pagsData.pendingRewards.toFixed(2)}
                          </p>
                          <p className="text-sm text-muted-foreground">PAGS Tokens</p>
                          <p className="text-xs text-muted-foreground">
                            ≈ ${(pagsData.pendingRewards * pagsData.currentPrice).toFixed(2)} USD
                          </p>
                        </div>
                        <Button
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                          onClick={handleClaim}
                          disabled={pagsData.pendingRewards === 0}
                        >
                          <Gift className="w-4 h-4 mr-2" />
                          Claim Rewards
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Lifetime Rewards</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-2xl font-bold">{pagsData.totalEarned.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">Total PAGS Earned</p>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Staking Rewards:</span>
                            <span>65%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>NFT Royalties:</span>
                            <span>28%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Governance Bonus:</span>
                            <span>7%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
