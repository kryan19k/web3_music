/**
 * Artist Application Status Component
 * Displays current application status and verification progress
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import { Badge } from '@/src/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar'
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Twitter,
  Instagram,
  Globe,
  Music,
  Mail,
  Shield,
  RefreshCw
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import { useState, useEffect } from 'react'
import { ArtistService } from '@/src/services/artist.service'
import type { Artist } from '@/src/types/supabase'
import { formatDistanceToNow } from 'date-fns'

export function ArtistApplicationStatus() {
  const { address } = useAccount()
  const [artist, setArtist] = useState<Artist | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchArtistStatus = async () => {
    if (!address) return

    setIsLoading(true)
    setError(null)

    try {
      const { artist: artistData, error: fetchError } = await ArtistService.getArtistByWallet(address)
      
      if (fetchError) {
        setError(fetchError)
      } else {
        setArtist(artistData)
      }
    } catch (err) {
      setError('Failed to fetch application status')
      console.error('Artist status fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchArtistStatus()
  }, [address])

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading your application status...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !artist) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Application Found</h3>
              <p className="text-muted-foreground mb-4">
                {error || "We couldn't find an artist application for your wallet address."}
              </p>
              <Button onClick={() => window.location.href = '/artist-signup'}>
                Start Artist Application
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-50 dark:bg-yellow-950',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
          title: 'Application Under Review',
          description: 'Your artist application is being reviewed by our team. We\'ll notify you once it\'s processed.',
          badgeVariant: 'secondary' as const
        }
      case 'approved':
        return {
          icon: CheckCircle,
          color: 'text-green-500',
          bgColor: 'bg-green-50 dark:bg-green-950',
          borderColor: 'border-green-200 dark:border-green-800',
          title: 'Application Approved!',
          description: 'Congratulations! Your artist profile has been verified. You can now upload tracks and access all artist features.',
          badgeVariant: 'default' as const
        }
      case 'rejected':
        return {
          icon: XCircle,
          color: 'text-red-500',
          bgColor: 'bg-red-50 dark:bg-red-950',
          borderColor: 'border-red-200 dark:border-red-800',
          title: 'Application Needs Updates',
          description: 'Your application requires some updates before approval. Please review the feedback below and resubmit.',
          badgeVariant: 'destructive' as const
        }
      default:
        return {
          icon: Clock,
          color: 'text-gray-500',
          bgColor: 'bg-gray-50 dark:bg-gray-950',
          borderColor: 'border-gray-200 dark:border-gray-800',
          title: 'Status Unknown',
          description: 'Unable to determine application status.',
          badgeVariant: 'outline' as const
        }
    }
  }

  const statusConfig = getStatusConfig(artist.verification_status)
  const StatusIcon = statusConfig.icon
  const socialLinks = (artist.social_links as any) || {}

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Main Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className={`${statusConfig.borderColor} ${statusConfig.bgColor}`}>
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${statusConfig.bgColor}`}>
                  <StatusIcon className={`h-8 w-8 ${statusConfig.color}`} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{statusConfig.title}</h2>
                  <p className="text-muted-foreground">{statusConfig.description}</p>
                </div>
              </div>
              <Badge variant={statusConfig.badgeVariant} className="text-sm px-3 py-1">
                {artist.verification_status.toUpperCase()}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Applied {formatDistanceToNow(new Date(artist.created_at), { addSuffix: true })}</span>
              {artist.updated_at !== artist.created_at && (
                <span>• Updated {formatDistanceToNow(new Date(artist.updated_at), { addSuffix: true })}</span>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Artist Profile Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              Your Artist Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src={artist.avatar_url || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-2xl">
                  {artist.display_name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-xl font-bold">{artist.display_name}</h3>
                  <p className="text-muted-foreground">{artist.bio}</p>
                </div>

                {/* Social Links */}
                {(socialLinks.twitter || socialLinks.instagram || artist.website) && (
                  <div className="flex flex-wrap gap-2">
                    {socialLinks.twitter && (
                      <Badge variant="secondary">
                        <Twitter className="h-3 w-3 mr-1" />
                        Twitter
                      </Badge>
                    )}
                    {socialLinks.instagram && (
                      <Badge variant="secondary">
                        <Instagram className="h-3 w-3 mr-1" />
                        Instagram
                      </Badge>
                    )}
                    {artist.website && (
                      <Badge variant="secondary">
                        <Globe className="h-3 w-3 mr-1" />
                        Website
                      </Badge>
                    )}
                  </div>
                )}

                {/* Genres */}
                {artist.genres && artist.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {artist.genres.map((genre, idx) => (
                      <Badge key={idx} variant="outline">{genre}</Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Status-specific Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            {artist.verification_status === 'pending' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <Clock className="h-5 w-5" />
                  <span className="font-medium">Patience is key!</span>
                </div>
                <p className="text-muted-foreground">
                  Our team typically reviews applications within 24-48 hours. We'll send you an email 
                  once your application has been processed.
                </p>
                <div className="space-y-2">
                  <h4 className="font-medium">While you wait, you can:</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Prepare your music files for upload</li>
                    <li>Think about your NFT tier strategies</li>
                    <li>Connect with your fans on social media</li>
                    <li>Review our artist guidelines and best practices</li>
                  </ul>
                </div>
              </div>
            )}

            {artist.verification_status === 'approved' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <Shield className="h-5 w-5" />
                  <span className="font-medium">You're all set!</span>
                </div>
                <p className="text-muted-foreground">
                  Welcome to PAGS! You now have access to all artist features including track uploads, 
                  NFT minting, and analytics.
                </p>
                <div className="flex gap-3">
                  <Button onClick={() => window.location.href = '/artist/dashboard'}>
                    Go to Artist Dashboard
                  </Button>
                  <Button variant="outline" onClick={() => window.location.href = '/artist/upload'}>
                    Upload Your First Track
                  </Button>
                </div>
              </div>
            )}

            {artist.verification_status === 'rejected' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <Mail className="h-5 w-5" />
                  <span className="font-medium">Action required</span>
                </div>
                <p className="text-muted-foreground">
                  Don't worry - rejections are usually due to incomplete information or verification issues 
                  that can be easily fixed.
                </p>
                <div className="flex gap-3">
                  <Button onClick={() => window.location.href = '/artist-signup'}>
                    Update Application
                  </Button>
                  <Button variant="outline" onClick={() => window.open('mailto:support@pags.music')}>
                    Contact Support
                  </Button>
                </div>
              </div>
            )}

            <div className="pt-4 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchArtistStatus}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh Status
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Statistics (if approved) */}
      {artist.verification_status === 'approved' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Your Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{artist.total_tracks}</div>
                  <div className="text-sm text-muted-foreground">Tracks</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{artist.total_streams.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Streams</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{parseFloat(artist.total_earnings).toFixed(4)} ETH</div>
                  <div className="text-sm text-muted-foreground">Total Earnings</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{artist.followers_count.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Followers</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

