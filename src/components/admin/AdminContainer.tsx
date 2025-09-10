import { Button } from '@/src/components/ui/button'
import { useAdminContractData } from '@/src/hooks/contracts'
import { useAccount, useDisconnect } from 'wagmi'
import { motion } from 'framer-motion'
import { LogOut, Shield, User, Wallet } from 'lucide-react'
import { AdminDashboard } from './AdminDashboard'
import { AdminDebug } from './AdminDebug'

export function AdminContainer() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  
  // Get admin data (now includes deployer bypass logic)
  const { isLoading, isAuthorized } = useAdminContractData()
  
  // Debug logging
  console.log('AdminContainer Debug:', {
    address,
    isConnected,
    isLoading,
    isAuthorized
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!isConnected || !address) {
    return <AdminDebug />
  }

  if (!isAuthorized) {
    return <AdminDebug />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b bg-card/50 backdrop-blur-xl sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">Pags Music</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium font-mono">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
              <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                Admin
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => disconnect()}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Disconnect
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Main Dashboard */}
      <AdminDashboard />
    </div>
  )
}
