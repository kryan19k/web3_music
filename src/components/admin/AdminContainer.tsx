import { Button } from '@/src/components/ui/button'
import { useAdminAuth } from '@/src/hooks/useAdminAuth'
import { motion } from 'framer-motion'
import { LogOut, Shield, User } from 'lucide-react'
import { AdminDashboard } from './AdminDashboard'
import { AdminLogin } from './AdminLogin'

export function AdminContainer() {
  const { currentAdmin, isAuthenticated, isLoading, logout } = useAdminAuth()

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

  if (!isAuthenticated || !currentAdmin) {
    return <AdminLogin />
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
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{currentAdmin.email}</span>
              <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full capitalize">
                {currentAdmin.role.replace('_', ' ')}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Main Dashboard */}
      <AdminDashboard />
    </div>
  )
}
