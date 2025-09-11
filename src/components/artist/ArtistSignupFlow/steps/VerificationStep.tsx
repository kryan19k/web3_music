/**
 * Verification Step
 * Identity verification process for artists
 */

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import { Badge } from '@/src/components/ui/badge'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Textarea } from '@/src/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select'
import { useSupabaseArtistSignup } from '@/src/hooks/useSupabaseArtistSignup'
import { ArtistService } from '@/src/services/artist.service'
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
  
  // Application form state
  const [applicationForm, setApplicationForm] = useState({
    musicBackground: '',
    howDidYouHear: '',
    artistGoals: '',
    additionalInfo: '',
    expectedMonthlyReleases: '',
    hasOriginalMusic: '',
    socialMediaFollowing: ''
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

  const handleSubmitApplication = async () => {
    // Validate required fields
    const requiredFields = ['musicBackground', 'howDidYouHear', 'artistGoals', 'hasOriginalMusic']
    const missingFields = requiredFields.filter(field => !applicationForm[field as keyof typeof applicationForm])
    
    if (missingFields.length > 0) {
      toast.error('Please fill in all required fields', {
        description: 'Music background, referral source, goals, and original music status are required.'
      })
      return
    }

    // Save application data to database
    try {
      const applicationData = {
        artistId: onboardingState.profile?.id,
        musicBackground: applicationForm.musicBackground,
        howDidYouHear: applicationForm.howDidYouHear,
        artistGoals: applicationForm.artistGoals,
        hasOriginalMusic: applicationForm.hasOriginalMusic,
        expectedMonthlyReleases: applicationForm.expectedMonthlyReleases,
        socialMediaFollowing: applicationForm.socialMediaFollowing,
        additionalInfo: applicationForm.additionalInfo,
        verificationMethods: verificationMethods,
        submittedAt: new Date().toISOString()
      }
      
      console.log('Saving application data:', applicationData)
      
      // Save to database using ArtistService
      const saveResult = await ArtistService.saveApplicationData(
        onboardingState.profile?.id || '',
        applicationData
      )
      
      if (!saveResult.success) {
        throw new Error(saveResult.error || 'Failed to save application data')
      }
      
      console.log('Application submitted successfully:', { 
        profile: onboardingState.profile,
        application: applicationForm,
        verificationMethods 
      })
      
      toast.success('Application submitted!', {
        description: 'Your artist application has been submitted for review. We\'ll notify you within 24-48 hours.'
      })
      
      // Multiple approaches to ensure step transition works
      console.log('🔄 [VERIFICATION] Moving to complete step...')
      setCurrentStep('complete')
      
      // Backup approaches
      setTimeout(() => {
        console.log('🔄 [VERIFICATION] Backup setCurrentStep call')
        setCurrentStep('complete')
      }, 100)
      
      setTimeout(() => {
        console.log('🔄 [VERIFICATION] Backup custom event dispatch')
        window.dispatchEvent(new CustomEvent('forceStepChange', { detail: 'complete' }))
      }, 200)
      
    } catch (error) {
      console.error('Failed to save application:', error)
      toast.error('Failed to save application', {
        description: 'Please try again or contact support.'
      })
    }
  }

  const handleSkipVerification = async () => {
    // For users who want to skip detailed application
    setVerificationMethods(prev => ({ ...prev, manual: true }))
    
    try {
      // Save basic application data
      const basicApplicationData = {
        artistId: onboardingState.profile?.id,
        musicBackground: 'Basic application - no detailed background provided',
        howDidYouHear: 'Not specified',
        artistGoals: 'Basic application - no detailed goals provided', 
        hasOriginalMusic: 'Not specified',
        expectedMonthlyReleases: 'Not specified',
        socialMediaFollowing: 'Not specified',
        additionalInfo: 'Submitted as basic application',
        verificationMethods: { ...verificationMethods, manual: true },
        submittedAt: new Date().toISOString(),
        applicationType: 'basic'
      }
      
      console.log('Saving basic application data:', basicApplicationData)
      
      // Save basic application to database using ArtistService
      const saveResult = await ArtistService.saveApplicationData(
        onboardingState.profile?.id || '',
        basicApplicationData
      )
      
      if (!saveResult.success) {
        throw new Error(saveResult.error || 'Failed to save basic application data')
      }
      
      toast.info('Basic application submitted!', {
        description: 'Your basic artist profile has been submitted for review.'
      })
      
      // Multiple approaches to ensure step transition works
      console.log('🔄 [VERIFICATION] Moving to complete step (basic)...')
      setCurrentStep('complete')
      
      setTimeout(() => {
        console.log('🔄 [VERIFICATION] Backup setCurrentStep call (basic)')
        setCurrentStep('complete')
      }, 100)
      
      setTimeout(() => {
        console.log('🔄 [VERIFICATION] Backup custom event dispatch (basic)')
        window.dispatchEvent(new CustomEvent('forceStepChange', { detail: 'complete' }))
      }, 200)
      
    } catch (error) {
      console.error('Failed to save basic application:', error)
      toast.error('Failed to submit application', {
        description: 'Please try again or contact support.'
      })
    }
  }

  const handleContinue = async () => {
    console.log('VerificationStep - handleContinue called')
    console.log('VerificationStep - Verification methods:', verificationMethods)
    console.log('VerificationStep - Can proceed:', canProceed)
    
    if (canProceed) {
      console.log('VerificationStep - Moving to complete step')
      
      // Show immediate feedback
      toast.success('Verification complete!', {
        description: 'Artist application submitted!'
      })
      
      // Try multiple approaches to ensure navigation
      console.log('VerificationStep - Calling setCurrentStep...')
      setCurrentStep('complete')
      
      // Add a small delay and try again
      setTimeout(() => {
        console.log('VerificationStep - Retry setCurrentStep after 100ms')
        setCurrentStep('complete')
      }, 100)
      
      // Force direct DOM manipulation as last resort
      setTimeout(() => {
        console.log('VerificationStep - Current step still not changed, checking...')
        if (onboardingState.currentStep === 'verification') {
          console.log('VerificationStep - Step still verification, trying direct DOM approach')
          // Try to force a re-render by manipulating the parent component
          const flowElement = document.querySelector('[data-step="verification"]')
          if (flowElement) {
            flowElement.setAttribute('data-step', 'complete')
          }
          // Also try to trigger a custom event
          window.dispatchEvent(new CustomEvent('forceStepChange', { detail: 'complete' }))
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

      {/* Artist Application Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Music className="w-5 h-5 text-blue-600" />
              Artist Application
            </CardTitle>
            <p className="text-sm text-muted-foreground text-center">
              Tell us about yourself to complete your artist verification
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Music Background */}
            <div className="space-y-2">
              <Label htmlFor="musicBackground" className="text-sm font-medium">
                Tell us about your music background *
              </Label>
              <Textarea
                id="musicBackground"
                placeholder="Describe your musical journey, experience, and style..."
                value={applicationForm.musicBackground}
                onChange={(e) => setApplicationForm(prev => ({ ...prev, musicBackground: e.target.value }))}
                className="min-h-[100px] resize-none"
              />
            </div>

            {/* How did you hear about us */}
            <div className="space-y-2">
              <Label htmlFor="howDidYouHear" className="text-sm font-medium">
                How did you hear about our platform? *
              </Label>
              <Select
                value={applicationForm.howDidYouHear}
                onValueChange={(value) => setApplicationForm(prev => ({ ...prev, howDidYouHear: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an option..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="social-media">Social Media</SelectItem>
                  <SelectItem value="friend-referral">Friend/Artist Referral</SelectItem>
                  <SelectItem value="google-search">Google Search</SelectItem>
                  <SelectItem value="music-blogs">Music Blogs/Press</SelectItem>
                  <SelectItem value="discord-community">Discord/Community</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Original Music */}
              <div className="space-y-2">
                <Label htmlFor="hasOriginalMusic" className="text-sm font-medium">
                  Do you create original music? *
                </Label>
                <Select
                  value={applicationForm.hasOriginalMusic}
                  onValueChange={(value) => setApplicationForm(prev => ({ ...prev, hasOriginalMusic: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes-original">Yes, all original</SelectItem>
                    <SelectItem value="yes-mostly">Yes, mostly original</SelectItem>
                    <SelectItem value="mix">Mix of original & covers</SelectItem>
                    <SelectItem value="covers-only">Covers only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Expected Releases */}
              <div className="space-y-2">
                <Label htmlFor="expectedReleases" className="text-sm font-medium">
                  Expected monthly releases
                </Label>
                <Select
                  value={applicationForm.expectedMonthlyReleases}
                  onValueChange={(value) => setApplicationForm(prev => ({ ...prev, expectedMonthlyReleases: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 track</SelectItem>
                    <SelectItem value="2-3">2-3 tracks</SelectItem>
                    <SelectItem value="4-5">4-5 tracks</SelectItem>
                    <SelectItem value="5+">5+ tracks</SelectItem>
                    <SelectItem value="irregular">Irregular schedule</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Social Media Following */}
            <div className="space-y-2">
              <Label htmlFor="socialFollowing" className="text-sm font-medium">
                Total social media following (approximate)
              </Label>
              <Select
                value={applicationForm.socialMediaFollowing}
                onValueChange={(value) => setApplicationForm(prev => ({ ...prev, socialMediaFollowing: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select range..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-100">0-100</SelectItem>
                  <SelectItem value="100-500">100-500</SelectItem>
                  <SelectItem value="500-1k">500-1K</SelectItem>
                  <SelectItem value="1k-5k">1K-5K</SelectItem>
                  <SelectItem value="5k-10k">5K-10K</SelectItem>
                  <SelectItem value="10k+">10K+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Artist Goals */}
            <div className="space-y-2">
              <Label htmlFor="artistGoals" className="text-sm font-medium">
                What are your goals as an artist on our platform? *
              </Label>
              <Textarea
                id="artistGoals"
                placeholder="Describe your goals, what you hope to achieve, and how we can help..."
                value={applicationForm.artistGoals}
                onChange={(e) => setApplicationForm(prev => ({ ...prev, artistGoals: e.target.value }))}
                className="min-h-[80px] resize-none"
              />
            </div>

            {/* Additional Information */}
            <div className="space-y-2">
              <Label htmlFor="additionalInfo" className="text-sm font-medium">
                Additional information
              </Label>
              <Textarea
                id="additionalInfo"
                placeholder="Anything else you'd like us to know? Links to your work, achievements, etc."
                value={applicationForm.additionalInfo}
                onChange={(e) => setApplicationForm(prev => ({ ...prev, additionalInfo: e.target.value }))}
                className="min-h-[60px] resize-none"
              />
            </div>

            {/* Submit Application Button */}
            <div className="pt-4 border-t">
              <Button
                onClick={handleSubmitApplication}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3"
                size="lg"
              >
                Submit Artist Application
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-2">
                * Required fields. We'll review your application within 24-48 hours.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

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
          <div className="mb-6 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded text-sm">
            <p className="text-yellow-800 dark:text-yellow-200">
              🔧 <strong>Development Mode:</strong> Contract role checking is bypassed for testing.
            </p>
          </div>
        )}

        <Button
          variant="ghost"
          onClick={handleSkipVerification}
          className="text-muted-foreground"
        >
          Submit Basic Application
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
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 min-w-[200px]"
          >
            Complete Application
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
