import { useQuery } from '@tanstack/react-query'
import { formatEther, parseEther } from 'viem'
import { useBLOKUserData } from './useBLOKToken'
import { useMusicNFTUserData, useMusicNFTMarketplaceData, Tier, getTierName } from './useMusicNFT'

// ============================================
// COMBINED USER DASHBOARD DATA
// ============================================

export function useUserDashboard() {
  const pagsData = useBLOKUserData()
  const nftData = useMusicNFTUserData()
  const marketData = useMusicNFTMarketplaceData()

  return useQuery({
    queryKey: ['user-dashboard', pagsData.address],
    queryFn: async () => {
      if (!pagsData.address) return null

      // Calculate total portfolio value
      const totalPAGSValue = Number.parseFloat(pagsData.balance) * 0.024 // Assuming $0.024 per PAGS
      
      // Calculate NFT portfolio value (would need price data)
      const nftPortfolioValue = nftData.ownedTokens.reduce((total, tokenId) => {
        // This would calculate based on current tier prices
        return total + 100 // Placeholder value
      }, 0)

      // Calculate total earnings
      const royaltyEarnings = Number.parseFloat(pagsData.royalties.pendingRoyalties) * 3000 // ETH to USD
      const collaboratorEarnings = Number.parseFloat(nftData.collaboratorRoyalties) * 3000 // ETH to USD
      const stakingEarnings = pagsData.staking.stakes.reduce((total, stake) => {
        // Would calculate based on stake rewards
        return total + Number.parseFloat(stake.pendingReward || '0')
      }, 0)

      // Calculate APY based on staking
      const averageAPY = pagsData.staking.stakes.length > 0 
        ? pagsData.staking.stakes.reduce((sum, stake) => sum + (Number(stake.apy) || 0), 0) / pagsData.staking.stakes.length / 100
        : 0

      return {
        // Portfolio Overview
        totalPortfolioValue: totalPAGSValue + nftPortfolioValue,
        pagsValue: totalPAGSValue,
        nftValue: nftPortfolioValue,
        
        // Token Data
        pagsBalance: pagsData.balance,
        pagsStaked: pagsData.staking.totalStaked,
        stakingAPY: averageAPY,
        
        // NFT Data
        ownedNFTs: nftData.ownedTokens.length,
        nftsByTier: nftData.ownedTokens.reduce((acc, tokenId) => {
          // Would need to fetch tier for each token
          const tier = Tier.BRONZE // Placeholder
          acc[getTierName(tier)] = (acc[getTierName(tier)] || 0) + 1
          return acc
        }, {}),
        
        // Earnings Data
        totalEarnings: royaltyEarnings + collaboratorEarnings + stakingEarnings,
        royaltyEarnings,
        collaboratorEarnings,
        stakingEarnings,
        unclaimedRoyalties: pagsData.royalties.pendingRoyalties,
        unclaimedCollaboratorRoyalties: nftData.collaboratorRoyalties,
        
        // Activity Data
        activeStakes: pagsData.staking.activeStakes,
        stakingRewards: pagsData.staking.stakes,
        benefits: nftData.benefits,
        
        // Market Context
        salePhase: marketData.salePhase,
        dynamicPricing: marketData.dynamicPricing,
      }
    },
    enabled: !!pagsData.address,
    refetchInterval: 30000, // Refetch every 30 seconds
  })
}

// ============================================
// PORTFOLIO ANALYTICS
// ============================================

export function usePortfolioAnalytics() {
  const dashboardData = useUserDashboard()

  return useQuery({
    queryKey: ['portfolio-analytics', dashboardData.data?.totalPortfolioValue],
    queryFn: async () => {
      if (!dashboardData.data) return null

      const data = dashboardData.data

      // Calculate daily earnings (last 24h)
      const dailyEarnings = data.totalEarnings * 0.05 // Placeholder: 5% of total as daily

      // Calculate monthly projection
      const monthlyProjection = dailyEarnings * 30

      // Calculate ROI
      const initialInvestment = data.totalPortfolioValue * 0.8 // Assuming 80% of current value was initial
      const roi = data.totalPortfolioValue > initialInvestment 
        ? ((data.totalPortfolioValue - initialInvestment) / initialInvestment) * 100 
        : 0

      // Performance metrics
      const metrics = {
        totalValue: data.totalPortfolioValue,
        dailyEarnings,
        monthlyProjection,
        yearlyProjection: dailyEarnings * 365,
        roi,
        stakingYield: data.stakingAPY * 100,
        
        // Diversification
        diversification: {
          tokens: (data.pagsValue / data.totalPortfolioValue) * 100,
          nfts: (data.nftValue / data.totalPortfolioValue) * 100,
        },
        
        // Growth trend (would be calculated from historical data)
        growthTrend: {
          '24h': 2.5,
          '7d': 8.2,
          '30d': 15.7,
        }
      }

      return metrics
    },
    enabled: !!dashboardData.data,
    refetchInterval: 60000, // Refetch every minute
  })
}

// ============================================
// MARKETPLACE ANALYTICS
// ============================================

export function useMarketplaceAnalytics() {
  const marketData = useMusicNFTMarketplaceData()

  return useQuery({
    queryKey: ['marketplace-analytics'],
    queryFn: async () => {
      if (!marketData.tiers) return null

      const tiers = Object.values(marketData.tiers).filter(Boolean)
      
      // Calculate marketplace metrics
      // Tier tuple: [name, price, blokAllocation, maxSupply, currentSupply, startId, saleActive, metadataURI, artistRoyalty]
      const totalSupply = tiers.reduce((sum, tier) => sum + (tier ? Number(tier[3]) : 0), 0) // index 3 is maxSupply
      const totalMinted = tiers.reduce((sum, tier) => sum + (tier ? Number(tier[4]) : 0), 0) // index 4 is currentSupply
      const mintPercentage = (totalMinted / totalSupply) * 100

      // Calculate average prices
      const averagePrice = tiers.reduce((sum, tier) => sum + (tier ? Number.parseFloat(formatEther(tier[1] || 0n)) : 0), 0) / tiers.length // index 1 is price

      // Calculate tier availability
      const tierAvailability = tiers.filter(Boolean).map(tier => {
        if (!tier) return { name: '', available: 0, percentage: 0, price: '0' }
        return {
          name: tier[0] || '', // index 0 is name
          available: Number(tier[3] || 0) - Number(tier[4] || 0), // maxSupply - currentSupply
          percentage: (Number(tier[4] || 0) / (Number(tier[3]) || 1)) * 100,
          price: formatEther(tier[1] || 0n), // index 1 is price
        }
      })

      // Most popular tier (highest mint percentage)
      const mostPopularTier = tierAvailability.reduce((prev, current) => 
        (current.percentage > prev.percentage) ? current : prev
      )

      return {
        overview: {
          totalSupply,
          totalMinted,
          mintPercentage,
          averagePrice,
          salePhase: marketData.salePhase,
          dynamicPricing: marketData.dynamicPricing,
        },
        tiers: tierAvailability,
        insights: {
          mostPopularTier: mostPopularTier.name,
          scarcity: tierAvailability.find(t => t.available < 10), // Tiers with <10 available
        bestValue: tierAvailability.reduce((best, current) => 
          Number.parseFloat(current.price) < Number.parseFloat(best.price) ? current : best
        ),
        }
      }
    },
    enabled: !!marketData.tiers,
    refetchInterval: 30000,
  })
}

// ============================================
// EARNINGS CALCULATOR
// ============================================

export function useEarningsCalculator() {
  return {
    calculateStakingReturns: (amount: string, tier: number, days: number) => {
      const principal = Number.parseFloat(amount)
      
      // APY rates by tier (from contract)
      const apyRates = {
        1: 5, // 30 days - 5%
        2: 10, // 90 days - 10%  
        3: 15, // 180 days - 15%
        4: 25, // 365 days - 25%
      }

      const apy = apyRates[tier as keyof typeof apyRates] || 5
      const dailyRate = apy / 365 / 100
      const totalReturn = principal * dailyRate * days
      
      return {
        principal,
        dailyEarnings: principal * dailyRate,
        totalReturn,
        apy,
        days,
        finalAmount: principal + totalReturn,
      }
    },

    calculateRoyaltyProjections: (nftCount: number, tier: Tier, monthlyStreams = 10000) => {
      // Estimated monthly royalties per NFT by tier
      const baseRoyaltyPerStream = {
        [Tier.BRONZE]: 0.0001,
        [Tier.SILVER]: 0.0005,
        [Tier.GOLD]: 0.002,
        [Tier.PLATINUM]: 0.01,
      }

      const monthlyRoyaltyPerNFT = baseRoyaltyPerStream[tier] * monthlyStreams
      const totalMonthlyRoyalties = monthlyRoyaltyPerNFT * nftCount

      return {
        monthlyRoyalties: totalMonthlyRoyalties,
        yearlyRoyalties: totalMonthlyRoyalties * 12,
        perNFTMonthly: monthlyRoyaltyPerNFT,
        streamsConsidered: monthlyStreams,
        tier: getTierName(tier),
      }
    },

    calculateNFTValue: (tier: Tier, daysHeld: number, initialPrice: number) => {
      // Simple appreciation model
      const appreciationRates = {
        [Tier.BRONZE]: 0.001, // 0.1% per day
        [Tier.SILVER]: 0.002, // 0.2% per day
        [Tier.GOLD]: 0.005, // 0.5% per day
        [Tier.PLATINUM]: 0.01, // 1% per day
      }

      const dailyRate = appreciationRates[tier]
      const currentValue = initialPrice * (1 + dailyRate * daysHeld)
      const totalReturn = currentValue - initialPrice
      const roi = (totalReturn / initialPrice) * 100

      return {
        initialPrice,
        currentValue,
        totalReturn,
        roi,
        daysHeld,
        tier: getTierName(tier),
      }
    }
  }
}

// ============================================
// TRANSACTION HISTORY
// ============================================

export function useTransactionHistory() {
  const { address } = useBLOKUserData()

  return useQuery({
    queryKey: ['transaction-history', address],
    queryFn: async () => {
      // This would integrate with your subgraph or event logs
      // For now, returning mock data structure
      
      const mockTransactions = [
        {
          id: '1',
          type: 'NFT_PURCHASE',
          amount: '0.1',
          token: 'ETH',
          tier: 'Gold',
          timestamp: Date.now() - 86400000, // 1 day ago
          status: 'completed',
          hash: '0x123...',
        },
        {
          id: '2',
          type: 'STAKE',
          amount: '1000',
          token: 'PAGS',
          tier: '90 days',
          timestamp: Date.now() - 172800000, // 2 days ago
          status: 'completed',
          hash: '0x456...',
        },
        {
          id: '3',
          type: 'ROYALTY_CLAIM',
          amount: '0.05',
          token: 'ETH',
          timestamp: Date.now() - 259200000, // 3 days ago
          status: 'completed',
          hash: '0x789...',
        },
      ]

      return mockTransactions
    },
    enabled: !!address,
    refetchInterval: 60000,
  })
}

// ============================================
// LEADERBOARD & SOCIAL DATA
// ============================================

export function useLeaderboard() {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      // This would fetch from your backend/subgraph
      const mockLeaderboard = [
        {
          address: '0x1234...5678',
          ensName: 'musiclover.eth',
          totalEarnings: 15.7,
          nftCount: 25,
          pagsBalance: 50000,
          tier: 'Platinum Collector',
          rank: 1,
        },
        {
          address: '0x2345...6789',
          ensName: null,
          totalEarnings: 12.3,
          nftCount: 18,
          pagsBalance: 35000,
          tier: 'Gold Collector',
          rank: 2,
        },
        // ... more entries
      ]

      return mockLeaderboard
    },
    refetchInterval: 300000, // 5 minutes
  })
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================

export function useNotifications() {
  const { address } = useBLOKUserData()

  return useQuery({
    queryKey: ['notifications', address],
    queryFn: async () => {
      // This would check for various notification triggers
      const notifications = []

      // Check for claimable rewards, new releases, etc.
      // Mock notifications for now
      return [
        {
          id: '1',
          type: 'ROYALTY_AVAILABLE',
          message: 'You have $2.50 in unclaimed royalties',
          timestamp: Date.now() - 3600000,
          read: false,
          actionUrl: '/portfolio',
        },
        {
          id: '2',
          type: 'NEW_RELEASE',
          message: 'New Gold tier NFT available from Artist Name',
          timestamp: Date.now() - 7200000,
          read: false,
          actionUrl: '/marketplace/new-release',
        },
      ]
    },
    enabled: !!address,
    refetchInterval: 60000,
  })
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export const contractUtils = {
    formatTokenAmount: (amount: bigint | string, decimals = 18): string => {
    if (typeof amount === 'string') {
      return Number.parseFloat(amount).toLocaleString()
    }
    return Number.parseFloat(formatEther(amount)).toLocaleString()
  },

  formatCurrency: (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  },

  formatPercentage: (value: number): string => {
    return `${value.toFixed(2)}%`
  },

  calculateTimeUntilUnlock: (startTime: number, lockPeriod: number): string => {
    const unlockTime = startTime + lockPeriod
    const now = Date.now() / 1000
    const timeLeft = unlockTime - now

    if (timeLeft <= 0) return 'Unlocked'

    const days = Math.floor(timeLeft / 86400)
    const hours = Math.floor((timeLeft % 86400) / 3600)
    const minutes = Math.floor((timeLeft % 3600) / 60)

    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  },

  getTierInfo: (tier: Tier) => {
    const info = {
      [Tier.BRONZE]: {
        name: 'Bronze',
        color: 'orange',
        benefits: ['10% merch discount', 'Exclusive content', 'Community access'],
        pagsAllocation: '10,000',
      },
      [Tier.SILVER]: {
        name: 'Silver',
        color: 'gray',
        benefits: ['20% merch discount', 'Stem access', 'Governance rights', '1 guest list spot'],
        pagsAllocation: '100,000',
      },
      [Tier.GOLD]: {
        name: 'Gold',
        color: 'yellow',
        benefits: ['30% merch discount', 'Backstage access', 'Stem access', '2 guest list spots'],
        pagsAllocation: '500,000',
      },
      [Tier.PLATINUM]: {
        name: 'Platinum',
        color: 'purple',
        benefits: ['50% merch discount', 'Remix rights', 'VIP access', '4 guest list spots'],
        pagsAllocation: '2,000,000',
      },
    }

    return info[tier]
  }
}
