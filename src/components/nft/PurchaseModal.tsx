import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent } from '@/src/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/components/ui/dialog'
import { Progress } from '@/src/components/ui/progress'
import { Separator } from '@/src/components/ui/separator'
import type { MusicNFT } from '@/src/types/music-nft'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Coins,
  CreditCard,
  DollarSign,
  Loader2,
  ShoppingCart,
  TrendingUp,
  Wallet,
  Zap,
} from 'lucide-react'
import * as React from 'react'
import { useState } from 'react'

interface PurchaseModalProps {
  nft: MusicNFT
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onPurchase: (tokenId: string, tier: string) => Promise<void>
}

type PurchaseStep = 'confirm' | 'processing' | 'success' | 'error'

const tierConfigs = {
  bronze: {
    name: 'Bronze',
    color: 'bg-muted/40 text-muted-foreground border-border',
    benefits: ['Basic NFT ownership', 'Monthly royalties', 'Community access'],
    apy: '6-8%',
  },
  silver: {
    name: 'Silver',
    color: 'bg-slate-500/20 text-slate-300 border-slate-500/50',
    benefits: ['Premium ownership', 'Higher royalties', 'VIP community', 'Exclusive content'],
    apy: '10-12%',
  },
  gold: {
    name: 'Gold',
    color: 'bg-accent/20 text-accent-foreground border-accent/50',
    benefits: ['Gold ownership', 'Premium royalties', 'Artist meetups', 'Governance rights'],
    apy: '15-18%',
  },
  platinum: {
    name: 'Platinum',
    color: 'bg-primary/20 text-primary-foreground border-primary/50',
    benefits: ['Ultimate ownership', 'Maximum royalties', 'All perks', 'Revenue sharing'],
    apy: '20-25%',
  },
}

export function PurchaseModal({ nft, isOpen, onOpenChange, onPurchase }: PurchaseModalProps) {
  const [step, setStep] = useState<PurchaseStep>('confirm')
  const [txHash, setTxHash] = useState<string>('')
  const [error, setError] = useState<string>('')

  const tierConfig = tierConfigs[nft.tier as keyof typeof tierConfigs]
  const monthlyProjection = (nft.priceUSD * (nft.earnings.apy / 100)) / 12

  const handlePurchase = async () => {
    try {
      setStep('processing')
      setError('')

      // Simulate transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      await onPurchase(nft.tokenId, nft.tier)

      // Simulate getting transaction hash
      setTxHash('0x1234567890abcdef...')
      setStep('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed')
      setStep('error')
    }
  }

  const resetModal = () => {
    setStep('confirm')
    setError('')
    setTxHash('')
    onOpenChange(false)
  }

  const completionPercentage = (nft.metadata.edition / nft.metadata.maxSupply) * 100

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Purchase Music NFT
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === 'confirm' && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* NFT Preview */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={nft.metadata.image || '/api/placeholder/80/80'}
                      alt={nft.metadata.title}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{nft.metadata.title}</h3>
                      <p className="text-sm text-muted-foreground">{nft.metadata.artist}</p>
                      <Badge className={`mt-2 ${tierConfig.color}`}>
                        {tierConfig.name} Edition
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tier Benefits */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-primary" />
                    <h4 className="font-semibold">Tier Benefits</h4>
                  </div>
                  <ul className="space-y-2">
                    {tierConfig.benefits.map((benefit) => (
                      <li
                        key={benefit}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle className="w-3 h-3 text-primary" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Supply Progress */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Edition Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {nft.metadata.edition}/{nft.metadata.maxSupply}
                    </span>
                  </div>
                  <Progress
                    value={completionPercentage}
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {(100 - completionPercentage).toFixed(1)}% remaining
                  </p>
                </CardContent>
              </Card>

              {/* Earnings Projection */}
              <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <h4 className="font-semibold">Projected Earnings</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Monthly Est.</p>
                      <p className="font-semibold text-primary">
                        ${monthlyProjection.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">APY Range</p>
                      <p className="font-semibold text-primary">{tierConfig.apy}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Separator />

              {/* Price Summary */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>NFT Price</span>
                  <span className="font-semibold">${nft.priceUSD.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Network Fee</span>
                  <span className="text-sm text-muted-foreground">~$12.50</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee (2.5%)</span>
                  <span className="text-sm text-muted-foreground">
                    ${(nft.priceUSD * 0.025).toFixed(2)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${(nft.priceUSD + 12.5 + nft.priceUSD * 0.025).toFixed(2)}</span>
                </div>
              </div>

              {/* Purchase Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={resetModal}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={handlePurchase}
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Purchase NFT
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 space-y-4"
            >
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
              <div>
                <h3 className="font-semibold">Processing Transaction</h3>
                <p className="text-sm text-muted-foreground">
                  Please confirm the transaction in your wallet...
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                This may take 1-2 minutes
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 space-y-4"
            >
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-primary">Purchase Successful!</h3>
                <p className="text-sm text-muted-foreground">
                  Congratulations! You now own this music NFT.
                </p>
              </div>
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Coins className="w-4 h-4 text-accent" />
                    <span>You'll start earning PAGS rewards within 24 hours</span>
                  </div>
                </CardContent>
              </Card>
              {txHash && <div className="text-xs text-muted-foreground">Transaction: {txHash}</div>}
              <Button
                className="w-full"
                onClick={resetModal}
              >
                View in Portfolio
              </Button>
            </motion.div>
          )}

          {step === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 space-y-4"
            >
              <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
              <div>
                <h3 className="font-semibold text-destructive">Transaction Failed</h3>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={resetModal}
                >
                  Close
                </Button>
                <Button onClick={() => setStep('confirm')}>Try Again</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
