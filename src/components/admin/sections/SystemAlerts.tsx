import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import { Badge } from '@/src/components/ui/badge'
import { Bell, AlertTriangle, Info, CheckCircle, XCircle, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

interface Alert {
  id: string
  type: 'error' | 'warning' | 'info' | 'success'
  title: string
  message: string
  timestamp: string
  isRead: boolean
  severity: 'low' | 'medium' | 'high' | 'critical'
}

export function SystemAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'warning',
      title: 'High Gas Fees Detected',
      message: 'Current gas fees are above normal. Consider pausing non-essential transactions.',
      timestamp: '2 minutes ago',
      isRead: false,
      severity: 'medium'
    },
    {
      id: '2',
      type: 'info',
      title: 'New Tier Configuration Needed',
      message: 'Gold tier is 90% sold out. Consider updating availability or pricing.',
      timestamp: '15 minutes ago',
      isRead: false,
      severity: 'low'
    },
    {
      id: '3',
      type: 'success',
      title: 'Royalty Distribution Complete',
      message: 'Successfully distributed 2.5 ETH in royalties to 150 holders.',
      timestamp: '1 hour ago',
      isRead: true,
      severity: 'low'
    },
    {
      id: '4',
      type: 'error',
      title: 'Oracle Update Failed',
      message: 'Track statistics update failed for Track ID 15. Manual intervention required.',
      timestamp: '2 hours ago',
      isRead: false,
      severity: 'high'
    }
  ])

  const markAsRead = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    )
  }

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })))
  }

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId))
  }

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
    }
  }

  const getSeverityBadge = (severity: Alert['severity']) => {
    const variants = {
      low: 'secondary',
      medium: 'default',
      high: 'destructive',
      critical: 'destructive'
    }
    return variants[severity] as any
  }

  const unreadCount = alerts.filter(alert => !alert.isRead).length
  const criticalCount = alerts.filter(alert => alert.severity === 'critical' && !alert.isRead).length

  return (
    <div className="space-y-6">
      {/* Alert Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                System Alerts
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant="secondary">
                  {unreadCount} Unread
                </Badge>
                {criticalCount > 0 && (
                  <Badge variant="destructive">
                    {criticalCount} Critical
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Button onClick={markAllAsRead} size="sm">
                Mark All Read
              </Button>
              <Button variant="outline" size="sm">
                Export Logs
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { type: 'error', count: alerts.filter(a => a.type === 'error').length, label: 'Errors' },
                { type: 'warning', count: alerts.filter(a => a.type === 'warning').length, label: 'Warnings' },
                { type: 'info', count: alerts.filter(a => a.type === 'info').length, label: 'Info' },
                { type: 'success', count: alerts.filter(a => a.type === 'success').length, label: 'Success' }
              ].map((stat) => (
                <div key={stat.type} className="text-center p-3 border rounded-lg">
                  <div className="text-2xl font-bold">{stat.count}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Alert List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 border rounded-lg ${!alert.isRead ? 'bg-muted/30' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{alert.title}</h4>
                          <Badge variant={getSeverityBadge(alert.severity)} size="sm">
                            {alert.severity}
                          </Badge>
                          {!alert.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {alert.message}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {alert.timestamp}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!alert.isRead && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => markAsRead(alert.id)}
                        >
                          Mark Read
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => dismissAlert(alert.id)}
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Alert Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Alert Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Alert Settings</h3>
              <p className="text-muted-foreground mb-4">
                Configure notification thresholds, delivery methods, and alert rules.
              </p>
              <Button variant="outline">
                Configure Alerts
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}