import { Card, CardContent } from '@/src/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/custom-tabs'
import { useAdminData } from '@/src/hooks/useAdminData'
import { motion } from 'framer-motion'
import { BarChart3, Bell, Coins, Music, Settings, Users } from 'lucide-react'
import { useState } from 'react'
import { AdminOverview } from './sections/AdminOverview'
import { BlockchainMonitoring } from './sections/BlockchainMonitoring'
import { NFTManagement } from './sections/NFTManagement'
import { PlatformSettings } from './sections/PlatformSettings'
import { SystemAlerts } from './sections/SystemAlerts'
import { UserManagement } from './sections/UserManagement'

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const { isLoading, alerts } = useAdminData()
  const unreadAlerts = alerts.filter((alert) => !alert.isRead).length

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your platform, monitor blockchain activity, and oversee operations
          </p>
        </motion.div>

        {/* System Alerts Banner */}
        {unreadAlerts > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="border-orange-500/50 bg-orange-500/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-orange-500" />
                    <span className="font-medium">
                      {unreadAlerts} unread system alert{unreadAlerts > 1 ? 's' : ''}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Click on the Alerts tab to review
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main Dashboard Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger
              value="overview"
              className="flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger
              value="nfts"
              className="flex items-center gap-2"
            >
              <Music className="w-4 h-4" />
              NFTs
            </TabsTrigger>
            <TabsTrigger
              value="blockchain"
              className="flex items-center gap-2"
            >
              <Coins className="w-4 h-4" />
              Blockchain
            </TabsTrigger>
            <TabsTrigger
              value="alerts"
              className="flex items-center gap-2 relative"
            >
              <Bell className="w-4 h-4" />
              Alerts
              {unreadAlerts > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="overview"
            className="space-y-6"
          >
            <AdminOverview />
          </TabsContent>

          <TabsContent
            value="users"
            className="space-y-6"
          >
            <UserManagement />
          </TabsContent>

          <TabsContent
            value="nfts"
            className="space-y-6"
          >
            <NFTManagement />
          </TabsContent>

          <TabsContent
            value="blockchain"
            className="space-y-6"
          >
            <BlockchainMonitoring />
          </TabsContent>

          <TabsContent
            value="alerts"
            className="space-y-6"
          >
            <SystemAlerts />
          </TabsContent>

          <TabsContent
            value="settings"
            className="space-y-6"
          >
            <PlatformSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
