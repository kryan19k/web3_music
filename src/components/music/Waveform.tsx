import { Button } from '@/src/components/ui/button'
import { cn } from '@/src/lib/utils'
import { Pause, Play, Volume2, VolumeX } from 'lucide-react'
import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'

interface WaveformProps {
  audioUrl: string
  className?: string
  height?: number
  waveColor?: string
  progressColor?: string
  onPlay?: () => void
  onPause?: () => void
  isPlaying?: boolean
  onLoadError?: (error: Error) => void
  visualOnly?: boolean // When true, only shows waveform without audio playback
}

export function Waveform({
  audioUrl,
  className,
  height = 80,
  waveColor = '#4a5568',
  progressColor = '#8b5cf6',
  onPlay,
  onPause,
  isPlaying = false,
  onLoadError,
  visualOnly = false,
}: WaveformProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const wavesurfer = useRef<WaveSurfer | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    // Create WaveSurfer instance
    wavesurfer.current = WaveSurfer.create({
      container: containerRef.current,
      waveColor,
      progressColor,
      height,
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      responsive: true,
      normalize: true,
      backend: 'WebAudio',
    })

    const ws = wavesurfer.current

    // Event listeners
    ws.on('ready', () => {
      setIsReady(true)
      setIsLoading(false)
      setDuration(ws.getDuration())
    })

    ws.on('loading', (progress: number) => {
      if (progress === 0) setIsLoading(true)
    })

    ws.on('audioprocess', () => {
      setCurrentTime(ws.getCurrentTime())
    })

    ws.on('error', (error: Error) => {
      setIsLoading(false)
      onLoadError?.(error)
      console.error('WaveSurfer error:', error)
    })

    ws.on('play', () => {
      onPlay?.()
    })

    ws.on('pause', () => {
      onPause?.()
    })

    // Load audio
    ws.load(audioUrl)

    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy()
      }
    }
  }, [audioUrl, height, waveColor, progressColor, onPlay, onPause, onLoadError])

  // Sync external play state - only if not in visualOnly mode
  useEffect(() => {
    if (!wavesurfer.current || !isReady || visualOnly) return

    if (isPlaying && !wavesurfer.current.isPlaying()) {
      wavesurfer.current.play()
    } else if (!isPlaying && wavesurfer.current.isPlaying()) {
      wavesurfer.current.pause()
    }
  }, [isPlaying, isReady, visualOnly])

  const handlePlayPause = () => {
    if (!wavesurfer.current || !isReady) return

    if (visualOnly) {
      // In visual-only mode, use external callbacks instead of controlling audio directly
      if (isPlaying) {
        onPause?.()
      } else {
        onPlay?.()
      }
    } else {
      // In normal mode, control the wavesurfer audio directly
      if (wavesurfer.current.isPlaying()) {
        wavesurfer.current.pause()
      } else {
        wavesurfer.current.play()
      }
    }
  }

  const handleVolumeToggle = () => {
    if (!wavesurfer.current) return

    if (isMuted) {
      wavesurfer.current.setVolume(volume)
      setIsMuted(false)
    } else {
      wavesurfer.current.setVolume(0)
      setIsMuted(true)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Controls */}
      <div className="flex items-center gap-3 mb-4">
        <Button
          size="icon"
          variant="ghost"
          onClick={handlePlayPause}
          disabled={!isReady || isLoading}
          className="w-10 h-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4 ml-0.5" />
          )}
        </Button>

        <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>/</span>
          <span>{formatTime(duration)}</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={handleVolumeToggle}
            className="w-8 h-8"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Waveform */}
      <div className="relative">
        <div
          ref={containerRef}
          className={cn('w-full rounded-lg overflow-hidden', isLoading && 'animate-pulse bg-muted')}
        />

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg">
            <div className="text-sm text-muted-foreground">Loading waveform...</div>
          </div>
        )}
      </div>
    </div>
  )
}
