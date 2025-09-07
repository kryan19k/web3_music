import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { useAdminData } from '@/src/hooks/useAdminData'
import { motion } from 'framer-motion'
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  CheckCircle,
  Info,
  Shield,
  Trash2,
  X,
} from 'lucide-react'

export function SystemAlerts() {
  const { alerts, markAlertAsRead, dismissAlert } = useAdminData()

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security':
        return <Shield className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-500 bg-red-500/10'
      case 'high':
        return 'border-orange-500 bg-orange-500/10'
      case 'medium':
        return 'border-yellow-500 bg-yellow-500/10'
      case 'low':
        return 'border-blue-500 bg-blue-500/10'
      default:
        return 'border-gray-500 bg-gray-500/10'
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  const getAlertStats = () => {
    return {
      total: alerts.length,
      unread: alerts.filter((a) => !a.isRead).length,
      critical: alerts.filter((a) => a.severity === 'critical').length,
      high: alerts.filter((a) => a.severity === 'high').length,
      byCategory: {
        blockchain: alerts.filter((a) => a.category === 'blockchain').length,
        security: alerts.filter((a) => a.category === 'security').length,
        users: alerts.filter((a) => a.category === 'users').length,
        nfts: alerts.filter((a) => a.category === 'nfts').length,
        system: alerts.filter((a) => a.category === 'system').length,
      },
    }
  }

  const stats = getAlertStats()

  return (
    <div className="space-y-6">
      {/* Alert Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Alerts</p>
                </div>
                <Bell className="w-8 h-8 text-blue-500" />
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
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-orange-600">{stats.unread}</p>
                  <p className="text-sm text-muted-foreground">Unread</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-500" />
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
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
                  <p className="text-sm text-muted-foreground">Critical</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-500" />
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
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-yellow-600">{stats.high}</p>
                  <p className="text-sm text-muted-foreground">High Priority</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Alert Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Categories</CardTitle>
          <CardDescription>
            Distribution of alerts across different system components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.entries(stats.byCategory).map(([category, count]) => (
              <div
                key={category}
                className="text-center p-4 bg-muted/50 rounded-lg"
              >
                <p className="text-2xl font-bold text-primary">{count}</p>
                <p className="text-sm text-muted-foreground capitalize">{category}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Alerts List */}
      <Card>
        <CardHeader>
          <CardTitle>System Alerts</CardTitle>
          <CardDescription>
            Monitor system events, errors, and important notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">All Clear!</h3>
              <p className="text-muted-foreground">No system alerts at this time.</p>
            </div>
          ) : (
            alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-lg border-l-4 ${getSeverityColor(alert.severity)} ${
                  alert.isRead ? 'opacity-75' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{alert.title}</h4>
                        <Badge
                          variant="outline"
                          className="text-xs"
                        >
                          {alert.severity}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="text-xs"
                        >
                          {getCategoryIcon(alert.category)}
                          {alert.category}
                        </Badge>
                        {!alert.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimeAgo(alert.timestamp)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!alert.isRead && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markAlertAsRead(alert.id)}
                      >
                        Mark Read
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => dismissAlert(alert.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          )}

          {alerts.length > 0 && (
            <div className="flex justify-end pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  for (const alert of alerts) {
                    markAlertAsRead(alert.id)
                  }
                }}
              >
                Mark All Read
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
