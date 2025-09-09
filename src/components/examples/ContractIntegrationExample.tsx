import { useState } from 'react'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Input } from '@/src/components/ui/input'
import { Badge } from '@/src/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs'
import { Progress } from '@/src/components/ui/progress'
import { AlertCircle, TrendingUp, Music, DollarSign } from 'lucide-react'
import {
  // PAGS Token hooks
  usePAGSUserData,
  usePAGSStake,
  usePAGSUnstake,
  usePAGSClaimRoyalties,
  usePAGSStakingTiers,
  // Music NFT hooks
  useMusicNFTUserData,
  useMusicNFTMint,
  useMusicNFTAllTiers,
  useMusicNFTMarketplaceData,
  // Utility hooks
  useUserDashboard,
  usePortfolioAnalytics,
  useEarningsCalculator,
  // Types and utilities
  Tier,
  getTierName,
  getTierColors,
  contractUtils,
} from '@/src/hooks/contracts'
import { FormLabel } from '../ui/form'

/**
 * Comprehensive example showing how to integrate contract hooks into your components
 * This serves as both documentation and a practical template
 */
export function ContractIntegrationExample() {
  // ============================================
  // HOOK USAGE EXAMPLES
  // ============================================

  // 1. User data hooks - Get comprehensive user information
  const pagsData = usePAGSUserData()
  const nftData = useMusicNFTUserData()
  const dashboardData = useUserDashboard()
  const portfolioAnalytics = usePortfolioAnalytics()

  // 2. Market data hooks - Get current market state
  const marketData = useMusicNFTMarketplaceData()
  const tierData = useMusicNFTAllTiers()
  const stakingTiers = usePAGSStakingTiers()

  // 3. Transaction hooks - For user actions
  const { stake: stakeTokens, isLoading: isStaking } = usePAGSStake()
  const { unstake: unstakeTokens, isLoading: isUnstaking } = usePAGSUnstake()
  const { claimRoyalties, isLoading: isClaimingRoyalties } = usePAGSClaimRoyalties()
  const { mint: mintNFT, isLoading: isMinting } = useMusicNFTMint()

  // 4. Utility hooks - For calculations and helpers
  const calculator = useEarningsCalculator()

  // ============================================
  // LOCAL STATE FOR FORM INPUTS
  // ============================================
  const [stakeAmount, setStakeAmount] = useState('')
  const [selectedStakeTier, setSelectedStakeTier] = useState(1)
  const [selectedMintTier, setSelectedMintTier] = useState(Tier.BRONZE)
  const [mintQuantity, setMintQuantity] = useState(1)

  // ============================================
  // EXAMPLE ACTION HANDLERS
  // ============================================

  const handleStakeTokens = () => {
    if (!stakeAmount || Number.parseFloat(stakeAmount) <= 0) return
    
    stakeTokens({
      amount: stakeAmount,
      tier: selectedStakeTier,
      autoCompound: false,
    })
  }

  const handleUnstake = (stakeIndex: number) => {
    unstakeTokens({ stakeIndex })
  }

  const handleMintNFT = () => {
    mintNFT({
      tier: selectedMintTier,
      quantity: mintQuantity,
      referrer: undefined,
    })
  }

  const handleClaimRoyalties = () => {
    claimRoyalties()
  }

  // ============================================
  // DERIVED DATA EXAMPLES
  // ============================================

  // Calculate staking projections
  const stakingProjection = calculator.calculateStakingReturns(
    stakeAmount || '0',
    selectedStakeTier,
    30 // 30 days
  )

  // Calculate NFT value projections
  const nftProjection = calculator.calculateRoyaltyProjections(
    nftData.ownedTokens?.length || 0,
    selectedMintTier,
    10000 // monthly streams
  )

  // ============================================
  // LOADING STATES
  // ============================================
  const isLoading = pagsData.isLoading || nftData.isLoading || marketData.isLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto" />
          <p className="text-muted-foreground">Loading contract data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold gradient-text">Contract Integration Demo</h1>
        <p className="text-muted-foreground">
          Live example of PAGS Token and Music NFT contract integration
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="staking">Staking</TabsTrigger>
          <TabsTrigger value="nfts">NFTs</TabsTrigger>
          <TabsTrigger value="royalties">Royalties</TabsTrigger>
          <TabsTrigger value="market">Market</TabsTrigger>
        </TabsList>

        {/* ============================================ */}
        {/* DASHBOARD TAB - User Overview */}
        {/* ============================================ */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Portfolio Value */}
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Portfolio</CardDescription>
                <CardTitle className="text-2xl">
                  {contractUtils.formatCurrency(dashboardData.data?.totalPortfolioValue || 0)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-500">
                    +{portfolioAnalytics.data?.growthTrend?.['24h']}% (24h)
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* PAGS Balance */}
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>PAGS Balance</CardDescription>
                <CardTitle className="text-2xl">
                  {contractUtils.formatTokenAmount(pagsData.balance)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Staked: {contractUtils.formatTokenAmount(pagsData.staking.totalStaked)}
                </div>
              </CardContent>
            </Card>

            {/* NFT Collection */}
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>NFTs Owned</CardDescription>
                <CardTitle className="text-2xl">{nftData.ownedTokens?.length || 0}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-1">
                  {Object.entries(dashboardData.data?.nftsByTier || {}).map(([tier, count]) => (
                    <Badge key={tier} variant="secondary" className="text-xs">
                      {tier}: {count}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Earnings */}
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Earnings</CardDescription>
                <CardTitle className="text-2xl">
                  {contractUtils.formatCurrency(dashboardData.data?.totalEarnings || 0)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Unclaimed: {contractUtils.formatCurrency(
                    Number.parseFloat(pagsData.royalties.pendingRoyalties) * 3000 || 0
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Portfolio Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Analytics</CardTitle>
              <CardDescription>Detailed breakdown of your holdings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Tokens ({contractUtils.formatPercentage(portfolioAnalytics.data?.diversification?.tokens || 0)})</span>
                  <span>{contractUtils.formatCurrency(dashboardData.data?.pagsValue || 0)}</span>
                </div>
                <Progress value={portfolioAnalytics.data?.diversification?.tokens || 0} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span>NFTs ({contractUtils.formatPercentage(portfolioAnalytics.data?.diversification?.nfts || 0)})</span>
                  <span>{contractUtils.formatCurrency(dashboardData.data?.nftValue || 0)}</span>
                </div>
                <Progress value={portfolioAnalytics.data?.diversification?.nfts || 0} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================ */}
        {/* STAKING TAB - Token Staking */}
        {/* ============================================ */}
        <TabsContent value="staking" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Stake Tokens */}
            <Card>
              <CardHeader>
                <CardTitle>Stake PAGS Tokens</CardTitle>
                <CardDescription>Lock tokens to earn rewards</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <FormLabel className="text-sm font-medium">Amount to Stake</FormLabel>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <FormLabel className="text-sm font-medium">Staking Tier</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {stakingTiers.tiers.map((tier) => (
                      <Button
                        key={tier.id}
                        variant={selectedStakeTier === tier.id ? "default" : "outline"}
                        onClick={() => setSelectedStakeTier(tier.id)}
                        className="text-xs"
                      >
                        {tier.lockPeriod ? `${Math.floor(Number(tier.lockPeriod) / 86400)}d` : 'N/A'} - {tier.baseAPY ? `${Number(tier.baseAPY) / 100}%` : 'N/A'}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Projection */}
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">30-Day Projection</h4>
                  <div className="text-2xl font-bold text-green-500">
                    +{contractUtils.formatTokenAmount(stakingProjection.totalReturn.toString())} PAGS
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Daily: +{contractUtils.formatTokenAmount(stakingProjection.dailyEarnings.toString())} PAGS
                  </div>
                </div>

                <Button
                  onClick={handleStakeTokens}
                  disabled={isStaking || !stakeAmount}
                  className="w-full"
                >
                  {isStaking ? 'Staking...' : 'Stake Tokens'}
                </Button>
              </CardContent>
            </Card>

            {/* Active Stakes */}
            <Card>
              <CardHeader>
                <CardTitle>Your Stakes</CardTitle>
                <CardDescription>Manage your active stakes</CardDescription>
              </CardHeader>
              <CardContent>
                {pagsData.staking.stakes.length > 0 ? (
                  <div className="space-y-4">
                    {pagsData.staking.stakes.map((stake, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">
                              {contractUtils.formatTokenAmount(stake.amount)} PAGS
                            </div>
                            <div className="text-sm text-muted-foreground">
                              APY: {stake.apy ? `${stake.apy / 100}%` : 'N/A'}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Unlock: {contractUtils.calculateTimeUntilUnlock(
                                Number(stake.startTime),
                                Number(stake.lockPeriod)
                              )}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUnstake(index)}
                            disabled={isUnstaking}
                          >
                            Unstake
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No active stakes</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ============================================ */}
        {/* NFTS TAB - Music NFT Management */}
        {/* ============================================ */}
        <TabsContent value="nfts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mint NFTs */}
            <Card>
              <CardHeader>
                <CardTitle>Mint Music NFT</CardTitle>
                <CardDescription>Purchase music ownership rights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Tier</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(Tier)
                      .filter(tier => typeof tier === 'number')
                      .map((tier) => {
                        const tierInfo = contractUtils.getTierInfo(tier as Tier)
                        const colors = getTierColors(tier as Tier)
                        return (
                          <Button
                            key={tier}
                            variant={selectedMintTier === tier ? "default" : "outline"}
                            onClick={() => setSelectedMintTier(tier as Tier)}
                            className={selectedMintTier === tier ? colors.primary : ''}
                          >
                            {tierInfo?.name}
                          </Button>
                        )
                      })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Quantity</label>
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    value={mintQuantity}
                    onChange={(e) => setMintQuantity(Number.parseInt(e.target.value) || 1)}
                  />
                </div>

                {/* Tier Benefits */}
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">
                    {getTierName(selectedMintTier)} Benefits
                  </h4>
                  <div className="space-y-1">
                    {contractUtils.getTierInfo(selectedMintTier)?.benefits.map((benefit) => (
                      <div key={benefit} className="text-sm text-muted-foreground">
                        • {benefit}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Royalty Projection */}
                <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
                  <h4 className="font-medium mb-2">Monthly Earnings Projection</h4>
                  <div className="text-2xl font-bold text-green-500">
                    ${nftProjection.monthlyRoyalties.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Based on {nftProjection.streamsConsidered.toLocaleString()} monthly streams
                  </div>
                </div>

                <Button
                  onClick={handleMintNFT}
                  disabled={isMinting}
                  className="w-full"
                >
                  {isMinting ? 'Minting...' : `Mint ${mintQuantity} NFT${mintQuantity > 1 ? 's' : ''}`}
                </Button>
              </CardContent>
            </Card>

            {/* Owned NFTs */}
            <Card>
              <CardHeader>
                <CardTitle>Your Collection</CardTitle>
                <CardDescription>Manage your music NFTs</CardDescription>
              </CardHeader>
              <CardContent>
                {nftData.ownedTokens && nftData.ownedTokens.length > 0 ? (
                  <div className="space-y-4">
                    {nftData.ownedTokens.slice(0, 5).map((tokenId) => (
                      <div key={tokenId} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Music className="h-8 w-8 text-purple-500" />
                            <div>
                              <div className="font-medium">Token #{tokenId}</div>
                              <div className="text-sm text-muted-foreground">
                                Tier: {getTierName(Tier.BRONZE)} {/* Would be fetched from contract */}
                              </div>
                            </div>
                          </div>
                          <Badge variant="secondary">Owned</Badge>
                        </div>
                      </div>
                    ))}
                    
                    {nftData.ownedTokens.length > 5 && (
                      <div className="text-center text-sm text-muted-foreground">
                        +{nftData.ownedTokens.length - 5} more...
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No NFTs owned yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ============================================ */}
        {/* ROYALTIES TAB - Earnings Management */}
        {/* ============================================ */}
        <TabsContent value="royalties" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* PAGS Royalties */}
            <Card>
              <CardHeader>
                <CardTitle>PAGS Token Royalties</CardTitle>
                <CardDescription>Claim your share of platform royalties</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                  <DollarSign className="h-12 w-12 text-green-500 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-green-500">
                    {(Number.parseFloat(pagsData.royalties.pendingRoyalties) * 3000).toFixed(2)} USD
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {pagsData.royalties.pendingRoyalties} ETH available
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    From {pagsData.royalties.unclaimedPeriods} unclaimed periods
                  </div>
                </div>

                <Button
                  onClick={handleClaimRoyalties}
                  disabled={isClaimingRoyalties || Number.parseFloat(pagsData.royalties.pendingRoyalties) <= 0}
                  className="w-full"
                >
                  {isClaimingRoyalties ? 'Claiming...' : 'Claim Royalties'}
                </Button>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Last claimed period:</span>
                    <span>{pagsData.royalties.lastClaimedPeriod}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Current period:</span>
                    <span>{pagsData.royalties.currentPeriod}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Collaborator Royalties */}
            <Card>
              <CardHeader>
                <CardTitle>Collaborator Royalties</CardTitle>
                <CardDescription>Earnings from music collaborations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
                  <Music className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-blue-500">
                    {(Number.parseFloat(nftData.collaboratorRoyalties) * 3000).toFixed(2)} USD
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {nftData.collaboratorRoyalties} ETH available
                  </div>
                </div>

                {Number.parseFloat(nftData.collaboratorRoyalties) > 0 ? (
                  <Button className="w-full">
                    Claim Collaborator Royalties
                  </Button>
                ) : (
                  <div className="text-center text-muted-foreground">
                    No collaborator royalties available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ============================================ */}
        {/* MARKET TAB - Market Overview */}
        {/* ============================================ */}
        <TabsContent value="market" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {Object.values(Tier)
              .filter(tier => typeof tier === 'number')
              .map((tier) => {
                const tierConfig = tierData.tiers?.[tier as Tier]
                const tierInfo = contractUtils.getTierInfo(tier as Tier)
                const colors = getTierColors(tier as Tier)
                
                if (!tierConfig) return null

                const mintedPercentage = tierConfig.maxSupply 
                  ? (tierConfig.currentSupply / tierConfig.maxSupply) * 100 
                  : 0

                return (
                  <Card key={tier}>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center justify-between">
                        {tierInfo?.name}
                        <Badge className={colors.primary}>
                          {tierConfig.saleActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        {contractUtils.formatTokenAmount(tierConfig.price || 0n)} ETH
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Minted:</span>
                          <span>{tierConfig.currentSupply || 0}/{tierConfig.maxSupply || 0}</span>
                        </div>
                        <Progress value={mintedPercentage} className="h-2" />
                      </div>

                      <div className="space-y-1">
                        <div className="text-sm font-medium">Benefits:</div>
                        {tierInfo?.benefits.slice(0, 2).map((benefit) => (
                          <div key={benefit} className="text-xs text-muted-foreground">
                            • {benefit}
                          </div>
                        ))}
                      </div>

                      <div className="text-xs text-center text-muted-foreground">
                        PAGS: {tierInfo?.pagsAllocation}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Market Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">
                    {marketData.salePhase === 0 ? 'Closed' : 
                     marketData.salePhase === 1 ? 'Whitelist' : 'Public'}
                  </div>
                  <div className="text-sm text-muted-foreground">Sale Phase</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">
                    {marketData.dynamicPricing ? 'Enabled' : 'Disabled'}
                  </div>
                  <div className="text-sm text-muted-foreground">Dynamic Pricing</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">Live</div>
                  <div className="text-sm text-muted-foreground">Contract Status</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Export a simpler component for quick testing
export function SimpleContractDemo() {
  const pagsData = usePAGSUserData()
  const nftData = useMusicNFTUserData()
  
  return (
    <div className="max-w-md mx-auto space-y-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Quick Contract Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">PAGS Balance:</label>
            <p className="text-lg font-bold">{pagsData.balance}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium">NFTs Owned:</label>
            <p className="text-lg font-bold">{nftData.ownedTokens?.length || 0}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium">Pending Royalties:</label>
            <p className="text-lg font-bold">{pagsData.royalties.pendingRoyalties} ETH</p>
          </div>
          
          <div>
            <label className="text-sm font-medium">Wallet:</label>
            <p className="text-xs font-mono">
              {pagsData.address || 'Not connected'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
