/**
 * Storacha Status Component
 * Shows IPFS storage connection status and helps with setup
 */

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import { Badge } from '@/src/components/ui/badge'
import { Progress } from '@/src/components/ui/progress'
import { 
  Cloud, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink,
  Info
} from 'lucide-react'
import { checkStorachaStatus } from '@/src/lib/storacha'
import { toast } from 'sonner'

interface StorachaStatusProps {
  onStatusChange?: (status: {
    configured: boolean
    hasCredentials: boolean
    spaceConnected: boolean
  }) => void
}

export function StorachaStatus({ onStatusChange }: StorachaStatusProps) {
  const [status, setStatus] = useState({
    configured: false,
    hasCredentials: false,
    spaceConnected: false,
    error: undefined as string | undefined
  })
  const [isChecking, setIsChecking] = useState(false)

  const checkStatus = async () => {
    setIsChecking(true)
    try {
      const result = await checkStorachaStatus()
      setStatus(result)
      onStatusChange?.(result)
      
      if (result.error) {
        toast.error('IPFS Storage Status', {
          description: result.error
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setStatus(prev => ({ ...prev, error: errorMessage }))
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  const getStatusColor = () => {
    if (status.configured && status.spaceConnected) return 'green'
    if (status.hasCredentials) return 'yellow'
    return 'red'
  }

  const getStatusText = () => {
    if (status.configured && status.spaceConnected) return 'Connected to IPFS'
    if (status.hasCredentials) return 'Credentials found, space not connected'
    return 'Not configured'
  }

  const getProgressValue = () => {
    let progress = 0
    if (status.hasCredentials) progress += 50
    if (status.spaceConnected) progress += 50
    return progress
  }

  return (
    <Card className="border-2 border-dashed">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Cloud className="w-5 h-5" />
            IPFS Storage (Storacha)
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={checkStatus}
            disabled={isChecking}
          >
            <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status Overview */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusColor() === 'green' && <CheckCircle className="w-4 h-4 text-green-600" />}
            {getStatusColor() === 'yellow' && <AlertCircle className="w-4 h-4 text-yellow-600" />}
            {getStatusColor() === 'red' && <AlertCircle className="w-4 h-4 text-red-600" />}
            <span className="text-sm font-medium">{getStatusText()}</span>
          </div>
          <Badge 
            variant={getStatusColor() === 'green' ? 'default' : 'secondary'}
            className={
              getStatusColor() === 'green' ? 'bg-green-100 text-green-800' :
              getStatusColor() === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }
          >
            {getStatusColor() === 'green' ? 'Ready' : 
             getStatusColor() === 'yellow' ? 'Partial' : 'Setup Required'}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Configuration Progress</span>
            <span>{getProgressValue()}%</span>
          </div>
          <Progress value={getProgressValue()} className="h-2" />
        </div>

        {/* Status Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center justify-between">
            <span>Credentials</span>
            {status.hasCredentials ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
          </div>
          <div className="flex items-center justify-between">
            <span>Space Connected</span>
            {status.spaceConnected ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
          </div>
        </div>

        {/* Error Display */}
        {status.error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  Configuration Error
                </p>
                <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                  {status.error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Help Information */}
        {!status.configured && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                  IPFS Setup Required
                </p>
                <p className="text-blue-700 dark:text-blue-300 mb-2">
                  For decentralized file storage, you need to configure Storacha delegation. 
                  Files will be stored on Supabase Storage as fallback until IPFS is configured.
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open('https://docs.storacha.network/', '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Setup Guide
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {status.configured && status.spaceConnected && (
          <div className="p-3 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <p className="text-sm text-green-800 dark:text-green-200">
                ✅ IPFS storage is ready! Your files will be stored on the decentralized network.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

