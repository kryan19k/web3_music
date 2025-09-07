import type {
  AdminNFT,
  BlockchainTransaction,
  PlatformSettings,
  PlatformStats,
  PlatformUser,
  SystemAlert,
} from '@/src/types/admin'
import { useCallback, useEffect, useState } from 'react'

// Mock data generators
const generateMockUsers = (): PlatformUser[] => {
  const users: PlatformUser[] = []
  for (let i = 1; i <= 50; i++) {
    users.push({
      id: `user-${i}`,
      walletAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
      username: `user${i}`,
      email: `user${i}@example.com`,
      avatar: '/api/placeholder/32/32',
      joinDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
      lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      isVerified: Math.random() > 0.7,
      isBanned: Math.random() > 0.95,
      totalNFTs: Math.floor(Math.random() * 50),
      totalEarnings: Math.random() * 10000,
      role: Math.random() > 0.8 ? 'artist' : 'user',
    })
  }
  return users
}

const generateMockNFTs = (): AdminNFT[] => {
  const nfts: AdminNFT[] = []
  const statuses: AdminNFT['status'][] = ['approved', 'pending', 'rejected', 'flagged']

  for (let i = 1; i <= 100; i++) {
    nfts.push({
      id: `nft-${i}`,
      tokenId: `${i}`,
      title: `Track ${i}`,
      artist: `Artist ${Math.ceil(i / 3)}`,
      artistId: `artist-${Math.ceil(i / 3)}`,
      contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
      status: statuses[Math.floor(Math.random() * statuses.length)],
      mintPrice: Math.random() * 1000 + 100,
      currentPrice: Math.random() * 2000 + 200,
      totalSales: Math.floor(Math.random() * 100),
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      lastModified: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      flaggedReasons:
        Math.random() > 0.8 ? ['Copyright concern', 'Inappropriate content'] : undefined,
    })
  }
  return nfts
}

const generateMockTransactions = (): BlockchainTransaction[] => {
  const transactions: BlockchainTransaction[] = []
  const types: BlockchainTransaction['type'][] = [
    'mint',
    'sale',
    'transfer',
    'royalty_payment',
    'token_swap',
  ]
  const statuses: BlockchainTransaction['status'][] = ['confirmed', 'pending', 'failed']

  for (let i = 1; i <= 200; i++) {
    transactions.push({
      id: `tx-${i}`,
      type: types[Math.floor(Math.random() * types.length)],
      hash: `0x${Math.random().toString(16).substr(2, 64)}`,
      blockNumber: 18000000 + Math.floor(Math.random() * 100000),
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      from: `0x${Math.random().toString(16).substr(2, 40)}`,
      to: `0x${Math.random().toString(16).substr(2, 40)}`,
      value: Math.random() * 10,
      gasUsed: Math.floor(Math.random() * 100000 + 21000),
      gasPrice: Math.random() * 50 + 10,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      nftId: Math.random() > 0.5 ? `nft-${Math.floor(Math.random() * 100 + 1)}` : undefined,
      tokenSymbol: Math.random() > 0.5 ? 'ETH' : 'PAGS',
    })
  }
  return transactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

const generateMockAlerts = (): SystemAlert[] => {
  const alerts: SystemAlert[] = [
    {
      id: 'alert-1',
      type: 'warning',
      title: 'High Gas Prices Detected',
      message:
        'Current gas prices are above normal levels (120 gwei). Consider waiting for lower prices.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isRead: false,
      severity: 'medium',
      category: 'blockchain',
    },
    {
      id: 'alert-2',
      type: 'error',
      title: 'Failed NFT Mint',
      message: 'NFT minting failed for token ID 1234 due to insufficient gas.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: false,
      severity: 'high',
      category: 'nfts',
    },
    {
      id: 'alert-3',
      type: 'info',
      title: 'New Artist Registration',
      message: 'Artist "MusicCreator2024" has submitted verification documents for review.',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      isRead: true,
      severity: 'low',
      category: 'users',
    },
    {
      id: 'alert-4',
      type: 'warning',
      title: 'Suspicious Activity',
      message: 'Multiple failed login attempts detected from IP 192.168.1.100',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      isRead: false,
      severity: 'high',
      category: 'security',
    },
  ]
  return alerts
}

export function useAdminData() {
  const [users, setUsers] = useState<PlatformUser[]>([])
  const [nfts, setNfts] = useState<AdminNFT[]>([])
  const [transactions, setTransactions] = useState<BlockchainTransaction[]>([])
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [alerts, setAlerts] = useState<SystemAlert[]>([])
  const [settings, setSettings] = useState<PlatformSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize mock data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)

      // Simulate API calls
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockUsers = generateMockUsers()
      const mockNfts = generateMockNFTs()
      const mockTransactions = generateMockTransactions()
      const mockAlerts = generateMockAlerts()

      setUsers(mockUsers)
      setNfts(mockNfts)
      setTransactions(mockTransactions)
      setAlerts(mockAlerts)

      // Generate stats
      const mockStats: PlatformStats = {
        totalUsers: mockUsers.length,
        totalNFTs: mockNfts.length,
        totalVolume: mockTransactions
          .filter((tx) => tx.type === 'sale' && tx.status === 'confirmed')
          .reduce((sum, tx) => sum + tx.value, 0),
        totalTransactions: mockTransactions.length,
        activeUsers24h: mockUsers.filter(
          (u) => new Date(u.lastActive).getTime() > Date.now() - 24 * 60 * 60 * 1000,
        ).length,
        newUsers24h: mockUsers.filter(
          (u) => new Date(u.joinDate).getTime() > Date.now() - 24 * 60 * 60 * 1000,
        ).length,
        topPerformingNFTs: mockNfts.sort((a, b) => b.totalSales - a.totalSales).slice(0, 10),
        recentTransactions: mockTransactions.slice(0, 10),
        revenueBreakdown: {
          nftSales: 45000,
          royalties: 12000,
          platformFees: 8500,
        },
      }
      setStats(mockStats)

      // Mock settings
      const mockSettings: PlatformSettings = {
        general: {
          platformName: 'Pags Music',
          description: 'Decentralized Music NFT Marketplace',
          supportEmail: 'support@pagsmusic.com',
          maintenanceMode: false,
        },
        fees: {
          platformFeePercentage: 2.5,
          royaltyCapPercentage: 10,
          minimumRoyaltyPercentage: 0.5,
        },
        blockchain: {
          supportedChains: ['ethereum', 'polygon', 'bsc'],
          defaultChain: 'ethereum',
          gasLimitMultiplier: 1.2,
        },
        content: {
          maxFileSize: 50 * 1024 * 1024, // 50MB
          allowedFileTypes: ['.mp3', '.wav', '.flac', '.jpg', '.png', '.gif'],
          requireModeration: true,
          autoApproveVerifiedArtists: true,
        },
        security: {
          maxLoginAttempts: 5,
          sessionTimeout: 8 * 60 * 60, // 8 hours
          requireTwoFactor: false,
        },
      }
      setSettings(mockSettings)

      setIsLoading(false)
    }

    loadData()
  }, [])

  // User management functions
  const banUser = useCallback((userId: string) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, isBanned: true } : user)),
    )
  }, [])

  const unbanUser = useCallback((userId: string) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, isBanned: false } : user)),
    )
  }, [])

  const verifyUser = useCallback((userId: string) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, isVerified: true } : user)),
    )
  }, [])

  // NFT management functions
  const approveNFT = useCallback((nftId: string) => {
    setNfts((prev) => prev.map((nft) => (nft.id === nftId ? { ...nft, status: 'approved' } : nft)))
  }, [])

  const rejectNFT = useCallback((nftId: string, reason?: string) => {
    setNfts((prev) =>
      prev.map((nft) =>
        nft.id === nftId
          ? {
              ...nft,
              status: 'rejected',
              moderatorNotes: reason,
            }
          : nft,
      ),
    )
  }, [])

  const flagNFT = useCallback((nftId: string, reasons: string[]) => {
    setNfts((prev) =>
      prev.map((nft) =>
        nft.id === nftId
          ? {
              ...nft,
              status: 'flagged',
              flaggedReasons: reasons,
            }
          : nft,
      ),
    )
  }, [])

  // Alert management
  const markAlertAsRead = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === alertId ? { ...alert, isRead: true } : alert)),
    )
  }, [])

  const dismissAlert = useCallback((alertId: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId))
  }, [])

  // Settings management
  const updateSettings = useCallback((newSettings: PlatformSettings) => {
    setSettings(newSettings)
  }, [])

  return {
    users,
    nfts,
    transactions,
    stats,
    alerts,
    settings,
    isLoading,
    banUser,
    unbanUser,
    verifyUser,
    approveNFT,
    rejectNFT,
    flagNFT,
    markAlertAsRead,
    dismissAlert,
    updateSettings,
  }
}
