import React, { useEffect, useState } from 'react'
import AudioPlayer from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css'
import { getIPFSUrls } from '@/src/utils/ipfs'
import { toast } from 'sonner'

interface IPFSAudioPlayerProps {
  src: string
  title?: string
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
  autoPlay?: boolean
  className?: string
}

export function IPFSAudioPlayer({
  src,
  title,
  onPlay,
  onPause,
  onEnded,
  autoPlay = false,
  className = ''
}: IPFSAudioPlayerProps) {
  const [currentSrc, setCurrentSrc] = useState<string>(src)
  const [fallbackUrls, setFallbackUrls] = useState<string[]>([])
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0)

  useEffect(() => {
    if (src) {
      // If it's an IPFS URL, prepare fallback URLs
      if (src.includes('ipfs')) {
        console.log('🎵 [IPFS_PLAYER] Preparing IPFS fallbacks for:', src)
        
        // Extract hash from IPFS URL
        const ipfsHashMatch = src.match(/ipfs\/([a-zA-Z0-9]+)/)
        if (ipfsHashMatch) {
          const hash = ipfsHashMatch[1]
          const urls = getIPFSUrls(hash)
          console.log('🔄 [IPFS_PLAYER] Generated fallback URLs:', urls)
          setFallbackUrls(urls)
          setCurrentSrc(urls[0] || src)
          setCurrentUrlIndex(0)
        } else {
          setCurrentSrc(src)
          setFallbackUrls([])
        }
      } else {
        setCurrentSrc(src)
        setFallbackUrls([])
      }
    }
  }, [src])

  const handleError = (error: any) => {
    console.error('🚫 [IPFS_PLAYER] Audio error:', error)
    console.error('🚫 [IPFS_PLAYER] Failed URL:', currentSrc)
    
    // Determine which gateway failed for better user feedback
    const gatewayName = currentSrc.includes('w3s.link') ? 'Storacha (w3s)' :
                       currentSrc.includes('storacha.link') ? 'Storacha (path)' :
                       currentSrc.includes('dweb.link') ? 'DWEB' :
                       currentSrc.includes('cloudflare') ? 'Cloudflare' :
                       currentSrc.includes('pinata') ? 'Pinata' :
                       currentSrc.includes('fleek') ? 'Fleek' :
                       'IPFS Gateway'
    
    console.log(`❌ [IPFS_PLAYER] ${gatewayName} gateway failed`)
    
    // Try next fallback URL if available
    if (fallbackUrls.length > 0 && currentUrlIndex < fallbackUrls.length - 1) {
      const nextIndex = currentUrlIndex + 1
      const nextUrl = fallbackUrls[nextIndex]
      const nextGateway = nextUrl.includes('w3s.link') ? 'Storacha' :
                         nextUrl.includes('storacha.link') ? 'Storacha (alt)' :
                         nextUrl.includes('dweb.link') ? 'DWEB' :
                         nextUrl.includes('cloudflare') ? 'Cloudflare' :
                         nextUrl.includes('pinata') ? 'Pinata' :
                         nextUrl.includes('fleek') ? 'Fleek' :
                         'Gateway'
      
      console.log(`🔄 [IPFS_PLAYER] Trying ${nextGateway} (${nextIndex + 1}/${fallbackUrls.length}):`, nextUrl)
      setCurrentSrc(nextUrl)
      setCurrentUrlIndex(nextIndex)
      
      toast.loading(`Trying ${nextGateway}... (${nextIndex + 1}/${fallbackUrls.length})`)
    } else {
      console.error('❌ [IPFS_PLAYER] All fallback URLs failed')
      toast.error('Unable to load audio - all IPFS gateways failed')
    }
  }

  const handlePlay = () => {
    console.log('▶️ [IPFS_PLAYER] Playing:', title || 'Unknown track')
    onPlay?.()
  }

  const handlePause = () => {
    console.log('⏸️ [IPFS_PLAYER] Paused:', title || 'Unknown track')
    onPause?.()
  }

  const handleEnded = () => {
    console.log('⏹️ [IPFS_PLAYER] Ended:', title || 'Unknown track')
    onEnded?.()
  }

  const handleLoadStart = () => {
    console.log('🔄 [IPFS_PLAYER] Loading started:', currentSrc)
  }

  const handleCanPlay = () => {
    console.log('✅ [IPFS_PLAYER] Can play:', currentSrc)
    toast.dismiss() // Clear any loading messages
  }

  return (
    <div className={`ipfs-audio-player ${className}`}>
      {title && (
        <div className="text-sm font-medium mb-2 text-center">
          {title}
        </div>
      )}
      <AudioPlayer
        src={currentSrc}
        autoPlay={autoPlay}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onError={handleError}
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        showJumpControls={false}
        showSkipControls={false}
        showDownloadProgress={true}
        customAdditionalControls={[]}
        customVolumeControls={[]}
        layout="horizontal-reverse"
      />
      {fallbackUrls.length > 0 && (
        <div className="text-xs text-muted-foreground mt-1 text-center">
          Server {currentUrlIndex + 1} of {fallbackUrls.length}
        </div>
      )}
    </div>
  )
}