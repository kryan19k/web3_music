import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

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

      const handleError = () => {
        toast.error('Failed to load track')
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
    (track?: Track) => {
      if (!audioRef.current) return

      if (track && track.id !== state.currentTrack?.id) {
        // New track
        audioRef.current.src = track.audioUrl
        setState((prev) => ({
          ...prev,
          currentTrack: track,
          isLoading: true,
        }))
      }

      audioRef.current
        .play()
        .then(() => {
          setState((prev) => ({ ...prev, isPlaying: true }))
          if (track) {
            toast.success(`Now playing: ${track.title}`)
          }
        })
        .catch(() => {
          toast.error('Failed to play track')
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
