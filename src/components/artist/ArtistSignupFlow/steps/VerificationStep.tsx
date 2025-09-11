/**
 * Verification Step
 * Identity verification process for artists
 */

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import { Badge } from '@/src/components/ui/badge'
import { useSupabaseArtistSignup } from '@/src/hooks/useSupabaseArtistSignup'
import { 
  Shield, 
  CheckCircle, 
  Clock, 
  X, 
  Twitter, 
  Instagram, 
  Music, 
  ArrowRight,
  ExternalLink
} from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { ContractDebugButton } from '@/src/components/debug/ContractDebugButton'

// Helper function to safely parse social links
function getSocialLinks(socialLinksJson: any): { twitter?: string; instagram?: string; spotify?: string; soundcloud?: string; youtube?: string } {
  if (!socialLinksJson || typeof socialLinksJson !== 'object') {
    return {}
  }
  return socialLinksJson as { twitter?: string; instagram?: string; spotify?: string; soundcloud?: string; youtube?: string }
}

export function VerificationStep() {
  const { onboardingState, setCurrentStep } = useSupabaseArtistSignup()
  const [verificationMethods, setVerificationMethods] = useState({
    social: false,
    streaming: false,
    manual: false,
  })

  const handleSocialVerification = () => {
    // Simulate social verification process
    setVerificationMethods(prev => ({ ...prev, social: true }))
    toast.success('Social verification initiated!', {
      description: 'We\'re checking your social media presence...'
    })
    
    // Simulate verification delay
    setTimeout(() => {
      toast.success('Social verification complete!', {
        description: 'Your social media accounts have been verified.'
      })
    }, 2000)
  }

  const handleStreamingVerification = () => {
    // Simulate streaming platform verification
    setVerificationMethods(prev => ({ ...prev, streaming: true }))
    toast.success('Streaming verification initiated!', {
      description: 'Checking your presence on streaming platforms...'
    })
    
    setTimeout(() => {
      toast.success('Streaming verification complete!', {
        description: 'Found your music on streaming platforms!'
      })
    }, 3000)
  }

  const handleManualVerification = () => {
    setVerificationMethods(prev => ({ ...prev, manual: true }))
    toast.success('Manual verification submitted!', {
      description: 'Your profile will be reviewed within 24-48 hours.'
    })
  }

  const handleSkipVerification = () => {
    setVerificationMethods(prev => ({ ...prev, manual: true }))
    toast.info('Verification skipped', {
      description: 'You can complete verification later in your profile.'
    })
    setCurrentStep('first-track')
  }

  const handleContinue = async () => {
    console.log('VerificationStep - handleContinue called')
    console.log('VerificationStep - Verification methods:', verificationMethods)
    console.log('VerificationStep - Can proceed:', canProceed)
    
    if (canProceed) {
      console.log('VerificationStep - Moving to first-track step')
      
      // Show immediate feedback
      toast.success('Verification complete!', {
        description: 'Moving to track upload...'
      })
      
      // Try multiple approaches to ensure navigation
      console.log('VerificationStep - Calling setCurrentStep...')
      setCurrentStep('first-track')
      
      // Add a small delay and try again
      setTimeout(() => {
        console.log('VerificationStep - Retry setCurrentStep after 100ms')
        setCurrentStep('first-track')
      }, 100)
      
      // Force direct DOM manipulation as last resort
      setTimeout(() => {
        console.log('VerificationStep - Current step still not changed, checking...')
        if (onboardingState.currentStep === 'verification') {
          console.log('VerificationStep - Step still verification, trying direct DOM approach')
          // Try to force a re-render by manipulating the parent component
          const flowElement = document.querySelector('[data-step="verification"]')
          if (flowElement) {
            flowElement.setAttribute('data-step', 'first-track')
          }
          // Also try to trigger a custom event
          window.dispatchEvent(new CustomEvent('forceStepChange', { detail: 'first-track' }))
        }
      }, 500)
      
    } else {
      toast.error('Please complete at least one verification method to continue')
    }
  }

  const isVerified = verificationMethods.social || verificationMethods.streaming
  const canProceed = isVerified || verificationMethods.manual

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Verify Your Artist Identity</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Help fans trust your music by verifying your identity. Verified artists get better visibility and trust badges.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Social Media Verification */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className={`relative overflow-hidden transition-all ${
            verificationMethods.social 
              ? 'ring-2 ring-green-500 bg-purple-600 border-green-300 shadow-lg shadow-green-200/50' 
              : 'hover:shadow-lg border-border'
          }`}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-3 w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <Twitter className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg ">Social Media</CardTitle>
              <p className="text-sm text-muted-foreground">
                Verify through your social accounts
              </p>
            </CardHeader>
            <CardContent className="text-center">
              {verificationMethods.social ? (
                <div className="space-y-3">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto" />
                  <Badge variant="secondary" className="bg-green-600 text-white">
                    Verified
                  </Badge>
                  <p className="text-sm text-gray-800 dark:text-green-300 font-medium">
                    Social accounts confirmed!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <Button
                    onClick={handleSocialVerification}
                    variant="outline"
                    className="w-full"
                    disabled={!(() => {
                      const socialLinks = getSocialLinks(onboardingState.profile?.social_links)
                      return socialLinks.twitter || socialLinks.instagram
                    })()}
                  >
                    <Twitter className="w-4 h-4 mr-2" />
                    Verify Social
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Requires Twitter or Instagram
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Streaming Platform Verification */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className={`relative overflow-hidden transition-all ${
            verificationMethods.streaming 
              ? 'ring-2 ring-green-500 bg-blue-600 border-green-300 shadow-lg shadow-green-200/50' 
              : 'hover:shadow-lg border-border'
          }`}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-3 w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                <Music className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">Streaming Platforms</CardTitle>
              <p className="text-sm text-muted-foreground">
                Connect your Spotify or Apple Music
              </p>
            </CardHeader>
            <CardContent className="text-center">
              {verificationMethods.streaming ? (
                <div className="space-y-3">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto" />
                  <Badge variant="secondary" className="bg-green-600 text-white">
                    Verified
                  </Badge>
                  <p className="text-sm text-gray-800 dark:text-green-300 font-medium">
                    Streaming presence confirmed!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <Button
                    onClick={handleStreamingVerification}
                    variant="outline"
                    className="w-full"
                  >
                    <Music className="w-4 h-4 mr-2" />
                    Verify Streaming
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Connect your artist profiles
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Manual Verification */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="md:col-span-2 lg:col-span-1"
        >
          <Card className={`relative overflow-hidden transition-all ${
            verificationMethods.manual 
              ? 'ring-2 ring-purple-500 bg-green-600 border-purple-300 shadow-lg shadow-purple-200/50' 
              : 'hover:shadow-lg border-border'
          }`}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-3 w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Manual Review</CardTitle>
              <p className="text-sm text-muted-foreground">
                Submit documents for manual review
              </p>
            </CardHeader>
            <CardContent className="text-center">
              {verificationMethods.manual ? (
                <div className="space-y-3">
                  <CheckCircle className="w-8 h-8 text-purple-600 mx-auto" />
                  <Badge variant="secondary" className="bg-purple-600 text-white">
                    Review Submitted
                  </Badge>
                  <p className="text-sm text-gray-800 dark:text-purple-300 font-medium">
                    Your request has been submitted for manual review.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleManualVerification}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Submit for Review
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Skip verification for now
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Verification Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">Benefits of Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Trust Badge</h3>
                <p className="text-sm text-muted-foreground">
                  Display a verified checkmark on your profile
                </p>
              </div>
              <div>
                <Shield className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Better Discovery</h3>
                <p className="text-sm text-muted-foreground">
                  Higher ranking in search results
                </p>
              </div>
              <div>
                <Music className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Premium Features</h3>
                <p className="text-sm text-muted-foreground">
                  Access to advanced analytics and tools
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex justify-between items-center"
      >
        {/* Debug Section - Only in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6">
            <ContractDebugButton />
          </div>
        )}

        <Button
          variant="ghost"
          onClick={handleSkipVerification}
          className="text-muted-foreground"
        >
          Skip for now
        </Button>

        <div className="flex gap-3">
          {isVerified && (
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 px-3 py-1">
              <CheckCircle className="w-4 h-4 mr-1" />
              Verified Artist
            </Badge>
          )}
          
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log('VerificationStep - Button clicked!')
              console.log('VerificationStep - canProceed:', canProceed)
              handleContinue()
            }}
            disabled={!canProceed}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 min-w-[200px]"
          >
            Continue to Track Upload
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
