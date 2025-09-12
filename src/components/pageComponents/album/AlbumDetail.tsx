import React, { useState } from 'react'
import { useParams, Link, useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import { Badge } from '@/src/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar'
import { Progress } from '@/src/components/ui/progress'
import { IPFSAudioPlayer } from '@/src/components/audio/IPFSAudioPlayer'
import { Waveform } from '@/src/components/music/Waveform'
import { getIPFSUrls } from '@/src/utils/ipfs'
import { useArtistCollections } from '@/src/hooks/contracts/useArtistCollections'
import { useGetCollection, useGetCollectionTracks } from '@/src/hooks/contracts/useMusicNFT'
import { type Track, useAudioPlayer } from '@/src/hooks/useAudioPlayer'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  ExternalLink,
  Heart,
  Music,
  Pause,
  Play,
  Share2,
  ShoppingCart,
  Star,
  Users,
} from 'lucide-react'

interface AlbumDetailProps {
  collectionId?: string
}

export function AlbumDetail({ collectionId }: AlbumDetailProps) {
  const params = useParams({ strict: false }) as { id?: string }
  const albumId = collectionId || params.id
  const [isFollowing, setIsFollowing] = useState(false)
  const [selectedTrack, setSelectedTrack] = useState<any>(null)
  const navigate = useNavigate()
  
  const { play, pause, currentTrack, isPlaying } = useAudioPlayer()

  // Fetch album/collection data
  const { data: collectionData, isLoading: collectionLoading } = useGetCollection(
    albumId ? parseInt(albumId) : undefined
  )
  const { data: trackIds, isLoading: tracksLoading } = useGetCollectionTracks(
    albumId ? parseInt(albumId) : undefined
  )

  // Get artist collections data - this returns individual NFT tracks with collectionId properties
  const { collections: artistNFTs, isLoading: artistLoading } = useArtistCollections()

  // Find the specific collection and its tracks
  const albumData = React.useMemo(() => {
    if (!artistNFTs || !albumId) return null

    console.log('🔍 [ALBUM_DETAIL] Looking for album ID:', albumId)
    console.log('🔍 [ALBUM_DETAIL] Available NFTs:', artistNFTs?.length)

    // Find tracks that belong to this collection
    const albumTracks = artistNFTs.filter(nft => {
      console.log('🔍 [ALBUM_DETAIL] Checking NFT:', nft.tokenId, 'collection:', nft.collectionId)
      return nft.collectionId === parseInt(albumId)
    })

    console.log('🔍 [ALBUM_DETAIL] Found tracks for album:', albumTracks.length)

    if (albumTracks.length === 0) {
      console.warn('⚠️ [ALBUM_DETAIL] No tracks found for album ID:', albumId)
      return null
    }

    // Use the first track to get collection info
    const firstTrack = albumTracks[0]
    console.log('🔍 [ALBUM_DETAIL] First track:', firstTrack)
    
    return {
      id: parseInt(albumId),
      title: firstTrack.collectionTitle || `Album ${albumId}`,
      artist: firstTrack.metadata.artist || 'Unknown Artist',
      description: firstTrack.metadata.description || firstTrack.description || 'No description available',
      coverArt: firstTrack.metadata.image || firstTrack.coverArt || '/song_cover/placeholder.png',
      releaseDate: firstTrack.metadata.releaseDate || new Date().toISOString(),
      genre: firstTrack.metadata.genre || 'Electronic',
      trackCount: albumTracks.length,
      totalDuration: albumTracks.reduce((acc, track) => acc + (track.metadata.duration || 0), 0),
      totalSupply: albumTracks.reduce((acc, track) => acc + (track.metadata.maxSupply || 0), 0),
      revenue: albumTracks.reduce((acc, track) => acc + parseFloat(track.priceUSD.toString()), 0),
      tracks: albumTracks.sort((a, b) => (a.trackNumber || 0) - (b.trackNumber || 0))
    }
  }, [artistNFTs, albumId])

  const handlePlay = (track: any) => {
    console.log('🎵 [ALBUM] Playing track:', track.metadata.title, track.metadata.audioUrl)
    setSelectedTrack(track)
    
    // Also keep the old audio player working
    const audioTrack: Track = {
      id: track.tokenId,
      title: track.metadata.title,
      artist: track.metadata.artist,
      artwork: track.metadata.image || '/song_cover/placeholder.png',
      audioUrl: track.metadata.audioUrl || track.audioHash,
      duration: track.metadata.duration,
      pagsPerStream: track.metadata.blokAmount ? track.metadata.blokAmount / 1000 : undefined,
    }
    play(audioTrack)
  }

  const handlePause = () => {
    pause()
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const formatTotalDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  if (collectionLoading || artistLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-lg">Loading album...</p>
        </div>
      </div>
    )
  }

  if (!albumData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <Music className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Album Not Found</h2>
          <p className="text-muted-foreground mb-4">
            This album doesn't exist or hasn't been released yet.
          </p>
          <Button asChild>
            <Link to="/marketplace">Browse Albums</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Back Navigation */}
      <div className="border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild className="gap-2">
            <Link to="/artist/dashboard">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>

      {/* Album Header */}
      <div className="bg-gradient-to-b from-primary/5 to-background border-b border-border/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Album Artwork */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-shrink-0"
            >
              <div className="relative">
                <img
                  src={albumData.coverArt}
                  alt={albumData.title}
                  className="w-80 h-80 object-cover rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
              </div>
            </motion.div>

            {/* Album Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 flex flex-col justify-end"
            >
              <div className="mb-4">
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                  Album
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold mb-4">{albumData.title}</h1>
                
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>{albumData.artist[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-lg font-semibold">{albumData.artist}</span>
                  <span className="text-muted-foreground">•</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(albumData.releaseDate).getFullYear()}</span>
                  </div>
                  <span className="text-muted-foreground">•</span>
                  <span>{albumData.trackCount} tracks</span>
                  <span className="text-muted-foreground">•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatTotalDuration(albumData.totalDuration)}</span>
                  </div>
                </div>

                <p className="text-muted-foreground text-lg mb-6 max-w-2xl">
                  {albumData.description}
                </p>

                <div className="flex items-center gap-4">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                    onClick={() => albumData.tracks.length > 0 && handlePlay(albumData.tracks[0])}
                  >
                    <Play className="w-5 h-5" />
                    Play Album
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setIsFollowing(!isFollowing)}
                    className="gap-2"
                  >
                    <Heart className={`w-5 h-5 ${isFollowing ? 'fill-red-500 text-red-500' : ''}`} />
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>

                  <Button variant="outline" size="lg" className="gap-2">
                    <Share2 className="w-5 h-5" />
                    Share
                  </Button>

                  <Button variant="outline" size="lg" className="gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Buy Album
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Album Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Track List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="w-5 h-5" />
                  Tracks
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {albumData.tracks.map((track, index) => (
                    <motion.div
                      key={track.tokenId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors group cursor-pointer"
                      onClick={() => {
                        // Navigate to purchase page for this specific track
                        navigate({ to: `/marketplace/purchase/${track.tokenId}` })
                      }}
                    >
                      <div className="w-8 text-center text-muted-foreground group-hover:text-foreground">
                        {currentTrack?.id === track.tokenId && isPlaying ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation() // Prevent row click
                              handlePause()
                            }}
                            className="w-8 h-8 p-0"
                          >
                            <Pause className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation() // Prevent row click
                              handlePlay(track)
                            }}
                            className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100"
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        )}
                        <span className="group-hover:hidden">{index + 1}</span>
                      </div>

                      <img
                        src={track.metadata.image || albumData.coverArt}
                        alt={track.metadata.title}
                        className="w-12 h-12 object-cover rounded"
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate group-hover:text-primary">
                          {track.metadata.title}
                        </h4>
                        <p className="text-sm text-muted-foreground truncate">
                          {track.metadata.artist}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{track.streamingStats?.totalPlays || 0}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          <span>{(Math.random() * 2 + 3).toFixed(1)}</span>
                        </div>

                        <span>{formatDuration(track.metadata.duration || 0)}</span>

                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation() // Prevent row click
                            navigate({ to: `/marketplace/purchase/${track.tokenId}` })
                          }}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Album Stats & Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Album Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Revenue</span>
                  <span className="font-semibold">${albumData.revenue.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Supply</span>
                  <span className="font-semibold">{albumData.totalSupply.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tracks</span>
                  <span className="font-semibold">{albumData.trackCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-semibold">{formatTotalDuration(albumData.totalDuration)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Genre</span>
                  <Badge variant="secondary">{albumData.genre}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>About this Album</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {albumData.description || 'No additional information available for this album.'}
                </p>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-muted-foreground">
                    Released {new Date(albumData.releaseDate).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Fixed Audio Player at Bottom with Waveform */}
      {selectedTrack && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-50 p-6">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center gap-6 mb-4">
              {/* Track Info */}
              <img
                src={selectedTrack.metadata.image || albumData?.coverArt}
                alt={selectedTrack.metadata.title}
                className="w-16 h-16 object-cover rounded-lg shadow-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{selectedTrack.metadata.title}</h3>
                <p className="text-muted-foreground">{selectedTrack.metadata.artist}</p>
              </div>
            </div>
            
            {/* Waveform Player */}
            <Waveform
              audioUrl={(() => {
                const audioUrl = selectedTrack.metadata.audioUrl
                if (audioUrl?.includes('ipfs')) {
                  const ipfsHashMatch = audioUrl.match(/ipfs\/([a-zA-Z0-9]+)/)
                  if (ipfsHashMatch) {
                    const urls = getIPFSUrls(ipfsHashMatch[1])
                    return urls[0] || audioUrl
                  }
                }
                return audioUrl || ''
              })()}
              className="w-full"
              height={60}
              waveColor="#64748b"
              progressColor="#8b5cf6"
              visualOnly={true}
              onPlay={() => {
                console.log('🎵 Playing via Waveform:', selectedTrack.metadata.title)
                // Update the global audio player state
                const audioTrack: Track = {
                  id: selectedTrack.tokenId,
                  title: selectedTrack.metadata.title,
                  artist: selectedTrack.metadata.artist,
                  artwork: selectedTrack.metadata.image || '/song_cover/placeholder.png',
                  audioUrl: selectedTrack.metadata.audioUrl || selectedTrack.audioHash,
                  duration: selectedTrack.metadata.duration,
                  pagsPerStream: selectedTrack.metadata.blokAmount ? selectedTrack.metadata.blokAmount / 1000 : undefined,
                }
                play(audioTrack)
              }}
              onPause={() => {
                console.log('⏸️ Paused via Waveform:', selectedTrack.metadata.title)
                pause()
              }}
              isPlaying={currentTrack?.id === selectedTrack.tokenId && isPlaying}
              onLoadError={(error) => {
                console.error('❌ [WAVEFORM] Load error:', error)
                toast.error('Failed to load audio waveform')
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}