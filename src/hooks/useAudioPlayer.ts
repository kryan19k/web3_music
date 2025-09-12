import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { getIPFSUrls, getWorkingIPFSUrl } from '@/src/utils/ipfs'

export interface Track {
  id: string
  title: string
  artist: string
  artwork: string
  audioUrl: string
  duration: number
  pagsPerStream?: number
}

interface AudioPlayerState {
  currentTrack: Track | null
  isPlaying: boolean
  progress: number
  volume: number
  duration: number
  currentTime: number
  isLoading: boolean
  queue: Track[]
  queuePosition: number
}

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [state, setState] = useState<AudioPlayerState>({
    currentTrack: null,
    isPlaying: false,
    progress: 0,
    volume: 80,
    duration: 0,
    currentTime: 0,
    isLoading: false,
    queue: [],
    queuePosition: -1,
  })

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.preload = 'metadata'

      // Event listeners
      const audio = audioRef.current

      const handleLoadedMetadata = () => {
        setState((prev) => ({ ...prev, duration: audio.duration, isLoading: false }))
      }

      const handleTimeUpdate = () => {
        const progress = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0
        setState((prev) => ({
          ...prev,
          progress,
          currentTime: audio.currentTime,
        }))
      }

      const handleEnded = () => {
        setState((prev) => ({ ...prev, isPlaying: false }))
        // Auto-play next track
        next()
      }

      const handleError = async () => {
        console.log('🚫 [AUDIO_PLAYER] Audio error occurred for:', audioRef.current?.src)
        
        // Try IPFS fallbacks if this was an IPFS URL
        const currentSrc = audioRef.current?.src
        if (currentSrc?.includes('ipfs') && state.currentTrack) {
          console.log('🔄 [AUDIO_PLAYER] Trying IPFS fallbacks after error...')
          
          const ipfsHashMatch = currentSrc.match(/ipfs\/([a-zA-Z0-9]+)/)
          if (ipfsHashMatch) {
            const hash = ipfsHashMatch[1]
            const fallbackUrls = getIPFSUrls(hash)
            
            // Find the next fallback URL (skip the current one)
            const currentIndex = fallbackUrls.findIndex(url => url === currentSrc)
            const nextUrls = fallbackUrls.slice(currentIndex + 1)
            
            for (const fallbackUrl of nextUrls) {
              try {
                console.log('🔄 [AUDIO_PLAYER] Trying error fallback:', fallbackUrl)
                audioRef.current!.src = fallbackUrl
                // Don't auto-play, just set the source for next play attempt
                return
              } catch (error) {
                console.log('❌ [AUDIO_PLAYER] Error fallback failed:', fallbackUrl, error)
                continue
              }
            }
          }
        }
        
        toast.error('Failed to load track - media not accessible')
        setState((prev) => ({ ...prev, isLoading: false, isPlaying: false }))
      }

      const handleLoadStart = () => {
        setState((prev) => ({ ...prev, isLoading: true }))
      }

      const handleCanPlay = () => {
        setState((prev) => ({ ...prev, isLoading: false }))
      }

      audio.addEventListener('loadedmetadata', handleLoadedMetadata)
      audio.addEventListener('timeupdate', handleTimeUpdate)
      audio.addEventListener('ended', handleEnded)
      audio.addEventListener('error', handleError)
      audio.addEventListener('loadstart', handleLoadStart)
      audio.addEventListener('canplay', handleCanPlay)

      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
        audio.removeEventListener('timeupdate', handleTimeUpdate)
        audio.removeEventListener('ended', handleEnded)
        audio.removeEventListener('error', handleError)
        audio.removeEventListener('loadstart', handleLoadStart)
        audio.removeEventListener('canplay', handleCanPlay)
      }
    }
  }, [])

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.volume / 100
    }
  }, [state.volume])

  const play = useCallback(
    async (track?: Track) => {
      console.log('▶️ [AUDIO_PLAYER] Play requested:', track)
      if (!audioRef.current) return

      if (track && track.id !== state.currentTrack?.id) {
        console.log('🔍 [AUDIO_PLAYER] New track loading:', track.title, track.audioUrl)
        
        // Validate audio URL
        if (!track.audioUrl) {
          console.error('🚫 [AUDIO_PLAYER] No audio URL provided')
          toast.error('No audio file available')
          return
        }

        // New track - try to load it with IPFS fallbacks
        setState((prev) => ({
          ...prev,
          currentTrack: track,
          isLoading: true,
        }))

        let audioUrl = track.audioUrl
        
        // If it's an IPFS URL that might fail, try to find a working gateway
        if (audioUrl.includes('ipfs')) {
          console.log('🎵 [AUDIO_PLAYER] Trying IPFS URL:', audioUrl)
          
          // Extract the hash from any IPFS URL format
          const ipfsHashMatch = audioUrl.match(/ipfs\/([a-zA-Z0-9]+)/)
          if (ipfsHashMatch) {
            const hash = ipfsHashMatch[1]
            console.log('🔍 [AUDIO_PLAYER] Testing IPFS gateways for hash:', hash)
            
            // Try to find a working gateway
            const workingUrl = await getWorkingIPFSUrl(hash)
            if (workingUrl) {
              console.log('✅ [AUDIO_PLAYER] Found working gateway:', workingUrl)
              audioUrl = workingUrl
            } else {
              console.log('❌ [AUDIO_PLAYER] No working gateways found, using original URL')
            }
          }
        }

        console.log('🔗 [AUDIO_PLAYER] Final audio URL:', audioUrl)
        
        // Test if the URL is accessible and is actually an audio file
        try {
          const response = await fetch(audioUrl, { method: 'HEAD' })
          const contentType = response.headers.get('content-type')
          console.log('🔍 [AUDIO_PLAYER] Content-Type:', contentType)
          
          if (!contentType?.startsWith('audio/') && !contentType?.includes('octet-stream')) {
            console.warn('⚠️ [AUDIO_PLAYER] Invalid content type - might not be audio:', contentType)
          }
        } catch (error) {
          console.error('🚫 [AUDIO_PLAYER] URL accessibility test failed:', error)
        }

        audioRef.current.src = audioUrl
      }

      audioRef.current
        .play()
        .then(() => {
          setState((prev) => ({ ...prev, isPlaying: true }))
          if (track) {
            toast.success(`Now playing: ${track.title}`)
          }
        })
        .catch(async (error) => {
          console.error('🚫 [AUDIO_PLAYER] Play failed:', error)
          console.error('🚫 [AUDIO_PLAYER] Failed URL:', track?.audioUrl)
          console.error('🚫 [AUDIO_PLAYER] Track data:', track)
          
          // If this was an IPFS track, try alternative gateways
          if (track?.audioUrl.includes('ipfs')) {
            console.log('🔄 [AUDIO_PLAYER] Trying IPFS fallback gateways...')
            
            const ipfsHashMatch = track.audioUrl.match(/ipfs\/([a-zA-Z0-9]+)/)
            if (ipfsHashMatch) {
              const hash = ipfsHashMatch[1]
              const fallbackUrls = getIPFSUrls(hash).slice(1) // Skip the first one we already tried
              
              for (const fallbackUrl of fallbackUrls) {
                try {
                  console.log('🔄 [AUDIO_PLAYER] Trying fallback:', fallbackUrl)
                  audioRef.current!.src = fallbackUrl
                  await audioRef.current!.play()
                  
                  console.log('✅ [AUDIO_PLAYER] Fallback successful:', fallbackUrl)
                  setState((prev) => ({ ...prev, isPlaying: true }))
                  toast.success(`Now playing: ${track.title}`)
                  return
                } catch (fallbackError) {
                  console.log('❌ [AUDIO_PLAYER] Fallback failed:', fallbackUrl, fallbackError)
                  continue
                }
              }
            }
          }
          
          // All attempts failed
          toast.error('Failed to play track - media not accessible')
          setState((prev) => ({ ...prev, isPlaying: false, isLoading: false }))
        })
    },
    [state.currentTrack?.id],
  )

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      setState((prev) => ({ ...prev, isPlaying: false }))
    }
  }, [])

  const seek = useCallback(
    (percentage: number) => {
      if (audioRef.current && state.duration) {
        const newTime = (percentage / 100) * state.duration
        audioRef.current.currentTime = newTime
        setState((prev) => ({
          ...prev,
          progress: percentage,
          currentTime: newTime,
        }))
      }
    },
    [state.duration],
  )

  const setVolume = useCallback((volume: number) => {
    setState((prev) => ({ ...prev, volume }))
  }, [])

  const addToQueue = useCallback((track: Track) => {
    setState((prev) => ({
      ...prev,
      queue: [...prev.queue, track],
    }))
    toast.success(`Added "${track.title}" to queue`)
  }, [])

  const playQueue = useCallback(
    (tracks: Track[], startIndex = 0) => {
      setState((prev) => ({
        ...prev,
        queue: tracks,
        queuePosition: startIndex,
      }))
      if (tracks[startIndex]) {
        play(tracks[startIndex])
      }
    },
    [play],
  )

  const next = useCallback(() => {
    const nextIndex = state.queuePosition + 1
    if (state.queue[nextIndex]) {
      setState((prev) => ({ ...prev, queuePosition: nextIndex }))
      play(state.queue[nextIndex])
    }
  }, [state.queue, state.queuePosition, play])

  const previous = useCallback(() => {
    const prevIndex = state.queuePosition - 1
    if (state.queue[prevIndex]) {
      setState((prev) => ({ ...prev, queuePosition: prevIndex }))
      play(state.queue[prevIndex])
    }
  }, [state.queue, state.queuePosition, play])

  const togglePlayPause = useCallback(() => {
    if (state.isPlaying) {
      pause()
    } else if (state.currentTrack) {
      play()
    }
  }, [state.isPlaying, state.currentTrack, play, pause])

  return {
    ...state,
    play,
    pause,
    seek,
    setVolume,
    addToQueue,
    playQueue,
    next,
    previous,
    togglePlayPause,
  }
}
