/**
 * Wallet Connection Step
 * First step in artist onboarding - connect wallet with attractive UI
 */

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import { Badge } from '@/src/components/ui/badge'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useSupabaseArtistSignup } from '@/src/hooks/useSupabaseArtistSignup'
import { Wallet, Check, Shield, Zap, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { ConnectKitButton } from 'connectkit'

export function WalletConnectionStep() {
  const { address, isConnected } = useAccount()
  const { setCurrentStep } = useSupabaseArtistSignup()

  const handleProceed = () => {
    if (isConnected) {
      setCurrentStep('profile-setup')
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Left Side - Information */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div>
          <h2 className="text-3xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Your wallet is your identity on PAGS. It's how you'll receive payments, 
            manage your music NFTs, and interact with your fans.
          </p>
        </div>

        {/* Benefits */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Why connect your wallet?</h3>
          
          <div className="space-y-3">
            {[
              {
                icon: Shield,
                title: 'Own Your Music',
                description: 'True ownership of your tracks and royalties'
              },
              {
                icon: Zap,
                title: 'Instant Payments',
                description: 'Get paid directly when fans buy your NFTs'
              },
              {
                icon: Users,
                title: 'Fan Connection',
                description: 'Build direct relationships with your audience'
              }
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                className="flex items-start space-x-3"
              >
                <div className="bg-primary/10 p-2 rounded-lg">
                  <benefit.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">{benefit.title}</h4>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Security Notice */}
        <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-900/20">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-amber-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                  Secure Connection
                </p>
                <p className="text-amber-700 dark:text-amber-300">
                  We never store your private keys. Your wallet stays under your complete control.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Right Side - Connection Interface */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="p-6">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">
              {isConnected ? 'Wallet Connected!' : 'Choose Your Wallet'}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {!isConnected ? (
              <>
                {/* Connect Button */}
                <div className="flex justify-center">
                  <ConnectKitButton.Custom>
                    {({ isConnecting, show }) => (
                      <Button
                        onClick={show}
                        disabled={isConnecting}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 py-6 text-lg font-semibold"
                      >
                        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                      </Button>
                    )}
                  </ConnectKitButton.Custom>
                </div>

                {/* Supported Wallets */}
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-3">Supported wallets:</p>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {['MetaMask', 'WalletConnect', 'Coinbase', 'Rainbow'].map((wallet) => (
                      <Badge key={wallet} variant="secondary" className="text-xs">
                        {wallet}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Connected State */}
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  
                  <div>
                    <p className="font-medium text-green-600 mb-2">Successfully Connected!</p>
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-sm font-mono">
                        {address?.slice(0, 6)}...{address?.slice(-4)}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={handleProceed}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 py-6 text-lg font-semibold"
                  >
                    Continue to Profile Setup
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Additional Info */}
        {!isConnected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-muted-foreground">
              Don't have a wallet?{' '}
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                Download MetaMask
              </a>{' '}
              to get started.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
