/**
 * Deployment Step
 * Smart contract deployment with transaction status and visual feedback
 */

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import { Badge } from '@/src/components/ui/badge'
import { Progress } from '@/src/components/ui/progress'
import { 
  Rocket,
  Check,
  AlertCircle,
  ExternalLink,
  Zap,
  Clock,
  Shield,
  Sparkles,
  Copy,
  Eye
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

interface DeploymentStepProps {
  onDeploy: () => Promise<void>
  isDeploying: boolean
}

export function DeploymentStep({ onDeploy, isDeploying }: DeploymentStepProps) {
  const [deploymentStep, setDeploymentStep] = useState<
    'ready' | 'preparing' | 'uploading' | 'deploying' | 'confirming' | 'success' | 'error'
  >('ready')
  const [progress, setProgress] = useState(0)
  const [txHash, setTxHash] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (isDeploying) {
      simulateDeployment()
    }
  }, [isDeploying])

  const simulateDeployment = async () => {
    try {
      // Step 1: Preparing
      setDeploymentStep('preparing')
      setProgress(10)
      await delay(1000)

      // Step 2: Uploading metadata
      setDeploymentStep('uploading')
      setProgress(30)
      await delay(2000)

      // Step 3: Deploying to blockchain
      setDeploymentStep('deploying')
      setProgress(60)
      
      // Simulate transaction hash
      const mockTxHash = `0x${Math.random().toString(16).substring(2, 66)}`
      setTxHash(mockTxHash)
      await delay(3000)

      // Step 4: Confirming
      setDeploymentStep('confirming')
      setProgress(90)
      await delay(2000)

      // Success
      setDeploymentStep('success')
      setProgress(100)

    } catch (err) {
      setDeploymentStep('error')
      setError(err instanceof Error ? err.message : 'Deployment failed')
    }
  }

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  const handleDeploy = async () => {
    setError('')
    setDeploymentStep('preparing')
    try {
      await onDeploy()
    } catch (err) {
      setDeploymentStep('error')
      setError(err instanceof Error ? err.message : 'Deployment failed')
    }
  }

  const copyTxHash = () => {
    if (txHash) {
      navigator.clipboard.writeText(txHash)
      toast.success('Transaction hash copied!')
    }
  }

  const getStepInfo = () => {
    switch (deploymentStep) {
      case 'ready':
        return {
          title: 'Ready to Deploy',
          description: 'Your track and metadata are ready to be published on the blockchain',
          icon: Rocket,
          color: 'text-primary',
          bgColor: 'bg-primary/10'
        }
      case 'preparing':
        return {
          title: 'Preparing Deployment',
          description: 'Validating metadata and preparing smart contract call',
          icon: Zap,
          color: 'text-accent',
          bgColor: 'bg-accent/10'
        }
      case 'uploading':
        return {
          title: 'Uploading Metadata',
          description: 'Storing track metadata on IPFS',
          icon: Zap,
          color: 'text-primary',
          bgColor: 'bg-primary/10'
        }
      case 'deploying':
        return {
          title: 'Deploying to Blockchain',
          description: 'Creating your music NFT smart contract',
          icon: Zap,
          color: 'text-secondary',
          bgColor: 'bg-secondary/10'
        }
      case 'confirming':
        return {
          title: 'Confirming Transaction',
          description: 'Waiting for blockchain confirmation',
          icon: Clock,
          color: 'text-accent',
          bgColor: 'bg-accent/10'
        }
      case 'success':
        return {
          title: 'Deployment Complete!',
          description: 'Your music NFT is now live on the blockchain',
          icon: Check,
          color: 'text-primary',
          bgColor: 'bg-primary/10'
        }
      case 'error':
        return {
          title: 'Deployment Failed',
          description: error || 'Something went wrong during deployment',
          icon: AlertCircle,
          color: 'text-destructive',
          bgColor: 'bg-destructive/10'
        }
      default:
        return {
          title: 'Unknown State',
          description: '',
          icon: AlertCircle,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100 dark:bg-gray-900/20'
        }
    }
  }

  const stepInfo = getStepInfo()
  const StepIcon = stepInfo.icon

  return (
    <div className="max-w-2xl mx-auto">
      {/* Main Status Card */}
      <motion.div
        layout
        className="mb-8"
      >
        <Card className={`relative overflow-hidden border-border ${
          deploymentStep === 'success' ? 'border-primary/50' : 
          deploymentStep === 'error' ? 'border-destructive/50' : ''
        }`}>
          {/* Progress Bar */}
          {deploymentStep !== 'ready' && deploymentStep !== 'error' && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          )}

          <CardContent className="p-8 text-center">
            {/* Icon */}
            <motion.div
              key={deploymentStep}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${stepInfo.bgColor}`}
            >
              <StepIcon className={`w-10 h-10 ${stepInfo.color} ${
                deploymentStep === 'preparing' || deploymentStep === 'uploading' || 
                deploymentStep === 'deploying' || deploymentStep === 'confirming' 
                  ? 'animate-pulse' : ''
              }`} />
            </motion.div>

            {/* Status */}
            <motion.div
              key={`${deploymentStep}-content`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div>
                <h2 className="text-2xl font-bold mb-2">{stepInfo.title}</h2>
                <p className="text-muted-foreground">{stepInfo.description}</p>
              </div>

              {/* Progress Indicator */}
              {deploymentStep !== 'ready' && deploymentStep !== 'error' && (
                <div className="max-w-md mx-auto">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-muted-foreground">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {/* Transaction Hash */}
              <AnimatePresence>
                {txHash && (deploymentStep === 'deploying' || deploymentStep === 'confirming' || deploymentStep === 'success') && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-muted/50 p-4 rounded-lg max-w-md mx-auto"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Transaction Hash:</span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={copyTxHash}>
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => window.open(`https://etherscan.io/tx/${txHash}`, '_blank')}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="font-mono text-xs break-all text-muted-foreground">
                      {txHash}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="pt-4">
                {deploymentStep === 'ready' && (
                  <Button
                    onClick={handleDeploy}
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground border-0 px-8 py-6 text-lg"
                  >
                    <Rocket className="w-5 h-5 mr-2" />
                    Deploy to Blockchain
                  </Button>
                )}

                {deploymentStep === 'error' && (
                  <div className="space-y-4">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg">
                      <p className="text-red-800 dark:text-red-200 text-sm">
                        {error}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={handleDeploy}
                        variant="outline"
                        className="px-6"
                      >
                        Try Again
                      </Button>
                      
                      <Button
                        onClick={async () => {
                          try {
                            const { debugContractStatus } = await import('@/src/utils/contractVerification')
                            const result = await debugContractStatus()
                            console.log('🔍 Debug result:', result)
                            
                            if (!result.contract.deployed) {
                              alert('❌ Contract not deployed at expected address!\n\nAddress: 0x2CC2287C9b72Bf2BDb194DF6Cac265d2BD3B2167\n\nYou need to deploy the MusicNFT contract first.')
                            } else if (result.contract.tests?.some((t: any) => t.function.includes('addTrack') && !t.success)) {
                              alert('❌ Contract missing addTrack function!\n\nThe deployed contract does not match the expected ABI.\nContract needs to be redeployed with the correct code.')
                            } else if (!result.role.hasRole) {
                              alert('⚠️ ARTIST_ROLE not granted!\n\nYou need to grant ARTIST_ROLE to your wallet address via the admin panel.')
                            } else {
                              alert('✅ Contract and role checks passed!\n\nThe issue might be elsewhere. Check console logs.')
                            }
                          } catch (err) {
                            console.error('Debug failed:', err)
                            alert('❌ Debug failed: ' + (err instanceof Error ? err.message : String(err)))
                          }
                        }}
                        variant="outline"
                        size="sm"
                      >
                        🔍 Debug Contract
                      </Button>
                    </div>
                  </div>
                )}

                {deploymentStep === 'success' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <Sparkles className="w-5 h-5" />
                      <span className="font-medium">Your track is now live!</span>
                      <Sparkles className="w-5 h-5" />
                    </div>
                    
                    <div className="flex gap-3 justify-center">
                      <Button
                        variant="outline"
                        onClick={() => window.open(`https://etherscan.io/tx/${txHash}`, '_blank')}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View on Etherscan
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Information Cards */}
      {deploymentStep === 'ready' && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* What Happens */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5" />
                What Happens Next?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="text-xs">1</Badge>
                <div>
                  <p className="text-sm font-medium">Metadata Upload</p>
                  <p className="text-xs text-muted-foreground">Track details stored on IPFS</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="text-xs">2</Badge>
                <div>
                  <p className="text-sm font-medium">Smart Contract Call</p>
                  <p className="text-xs text-muted-foreground">Create your music NFT on-chain</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="text-xs">3</Badge>
                <div>
                  <p className="text-sm font-medium">Confirmation</p>
                  <p className="text-xs text-muted-foreground">Transaction confirmed by network</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Costs & Fees */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Costs & Fees
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Gas Fee</span>
                <Badge variant="secondary">~$5-15</Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Platform Fee</span>
                <Badge variant="secondary">0%</Badge>
              </div>
              
              <div className="flex justify-between items-center border-t pt-2">
                <span className="text-sm font-medium">Total Cost</span>
                <Badge>Gas Only</Badge>
              </div>
              
              <p className="text-xs text-muted-foreground">
                Gas fees vary based on network congestion. We don't charge any deployment fees!
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
