/**
 * Complete Step
 * Success screen with next steps and dashboard access
 */

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import { Badge } from '@/src/components/ui/badge'
import { 
  CheckCircle, 
  Music, 
  Users, 
  BarChart3, 
  Sparkles,
  ArrowRight,
  Trophy,
  Gift,
  Zap
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from '@tanstack/react-router'
import { useAccount } from 'wagmi'

export function CompleteStep() {
  const { address } = useAccount()

  return (
    <div className="max-w-4xl mx-auto text-center">
      {/* Success Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="mb-8"
      >
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full mb-6 relative">
          <CheckCircle className="w-12 h-12 text-white" />
          
          {/* Sparkle Effects */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute -top-2 -right-2"
          >
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute -bottom-2 -left-2"
          >
            <Sparkles className="w-4 h-4 text-pink-400" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-4xl font-bold mb-4">
            🎉 Welcome to PAGS!
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            Your artist profile is now live and ready to rock!
          </p>
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
            <Trophy className="w-4 h-4 mr-1" />
            Artist Verified
          </Badge>
        </motion.div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid md:grid-cols-3 gap-6 mb-8"
      >
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Music className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-lg">1</h3>
            <p className="text-sm text-muted-foreground">Track Created</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg">0</h3>
            <p className="text-sm text-muted-foreground">Fans (Growing!)</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg">0 ETH</h3>
            <p className="text-sm text-muted-foreground">Total Earnings</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Next Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">What's Next?</CardTitle>
            <p className="text-muted-foreground">
              Here are some recommended next steps to grow your presence on PAGS
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <div className="bg-purple-100 dark:bg-purple-900/20 p-2 rounded-lg">
                  <Music className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Upload More Tracks</h3>
                  <p className="text-sm text-muted-foreground">
                    Create more music NFTs to give fans more ways to support you
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-pink-100 dark:bg-pink-900/20 p-2 rounded-lg">
                  <Users className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Share Your Profile</h3>
                  <p className="text-sm text-muted-foreground">
                    Promote your PAGS profile on social media to attract fans
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Monitor Analytics</h3>
                  <p className="text-sm text-muted-foreground">
                    Track your sales, fan engagement, and earnings growth
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-lg">
                  <Gift className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Create Fan Experiences</h3>
                  <p className="text-sm text-muted-foreground">
                    Use NFT benefits to offer exclusive content and experiences
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="space-y-4"
      >
        <div className="flex justify-center gap-4">
          <Link to="/artist/application-status">
            <Button
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 px-8 py-6 text-lg"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Check Application Status
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          
          <Link to="/artist/dashboard">
            <Button variant="outline" className="px-8 py-6 text-lg">
              <BarChart3 className="w-5 h-5 mr-2" />
              Go to Dashboard
            </Button>
          </Link>
        </div>

        {/* Additional Actions */}
        <div className="flex justify-center gap-2">
          <Link to={`/profile/${address}`}>
            <Button variant="ghost" size="sm">
              View Public Profile
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const url = `${window.location.origin}/profile/${address}`
              navigator.clipboard.writeText(url)
            }}
          >
            Copy Profile Link
          </Button>
        </div>

        {/* Welcome Bonus */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 }}
        >
          <Card className="max-w-md mx-auto bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 border-yellow-200 dark:border-yellow-800">
            <CardContent className="text-center p-6">
              <Zap className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                Welcome Bonus!
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-4">
                As a new artist, you get reduced platform fees for your first 30 days!
              </p>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
                1% Platform Fee (vs 2.5% regular)
              </Badge>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
