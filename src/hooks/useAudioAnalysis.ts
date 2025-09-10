/**
 * Audio Analysis Hook
 * Extracts metadata from audio files (duration, BPM, etc.)
 */

import { useState, useCallback } from 'react'
import { toast } from 'sonner'

export interface AudioMetadata {
  duration: number
  bpm?: number
  sampleRate?: number
  bitRate?: number
  title?: string
  artist?: string
  album?: string
  genre?: string
}

export interface AudioAnalysisState {
  isAnalyzing: boolean
  metadata: AudioMetadata | null
  error: string | null
}

export function useAudioAnalysis() {
  const [state, setState] = useState<AudioAnalysisState>({
    isAnalyzing: false,
    metadata: null,
    error: null,
  })

  const analyzeAudio = useCallback(async (file: File): Promise<AudioMetadata> => {
    setState(prev => ({ ...prev, isAnalyzing: true, error: null }))

    try {
      const metadata = await extractAudioMetadata(file)
      setState(prev => ({ ...prev, metadata, isAnalyzing: false }))
      return metadata
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze audio'
      setState(prev => ({ ...prev, error: errorMessage, isAnalyzing: false }))
      toast.error('Audio analysis failed', { description: errorMessage })
      throw error
    }
  }, [])

  const reset = useCallback(() => {
    setState({
      isAnalyzing: false,
      metadata: null,
      error: null,
    })
  }, [])

  return {
    ...state,
    analyzeAudio,
    reset,
  }
}

/**
 * Extract metadata from audio file using Web Audio API
 */
async function extractAudioMetadata(file: File): Promise<AudioMetadata> {
  return new Promise((resolve, reject) => {
    const audio = new Audio()
    const url = URL.createObjectURL(file)
    
    audio.addEventListener('loadedmetadata', () => {
      const metadata: AudioMetadata = {
        duration: Math.round(audio.duration),
        // Note: BPM detection requires more complex analysis
        // For now, we'll return basic metadata
      }

      // Try to extract additional metadata from file name
      const fileName = file.name.replace(/\.[^/.]+$/, '') // Remove extension
      const fileMetadata = parseFileNameForMetadata(fileName)
      
      URL.revokeObjectURL(url)
      resolve({ ...metadata, ...fileMetadata })
    })

    audio.addEventListener('error', () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load audio file'))
    })

    audio.src = url
  })
}

/**
 * Attempt to extract metadata from file name
 * Common patterns: "Artist - Track Name.mp3", "Track Name.mp3"
 */
function parseFileNameForMetadata(fileName: string): Partial<AudioMetadata> {
  const metadata: Partial<AudioMetadata> = {}

  // Pattern: "Artist - Track Name"
  if (fileName.includes(' - ')) {
    const [artist, title] = fileName.split(' - ', 2)
    metadata.artist = artist.trim()
    metadata.title = title.trim()
  } else {
    metadata.title = fileName
  }

  return metadata
}

/**
 * Estimate BPM using Web Audio API (simplified implementation)
 * This is a basic implementation - for production, consider using
 * a more sophisticated BPM detection library
 */
export async function estimateBPM(file: File): Promise<number | null> {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const arrayBuffer = await file.arrayBuffer()
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
    
    // This is a very simplified BPM estimation
    // In production, you'd want to use a proper beat detection algorithm
    const data = audioBuffer.getChannelData(0)
    const sampleRate = audioBuffer.sampleRate
    
    // Analyze peaks to estimate tempo (very basic implementation)
    const peaks = findPeaks(data, sampleRate)
    const intervals = peaks.slice(1).map((peak, i) => peak - peaks[i])
    
    if (intervals.length === 0) return null
    
    const averageInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length
    const bpm = Math.round(60 / averageInterval)
    
    // Return reasonable BPM range
    if (bpm >= 60 && bpm <= 200) {
      return bpm
    }
    
    return null
  } catch (error) {
    console.warn('BPM estimation failed:', error)
    return null
  }
}

/**
 * Find peaks in audio data (simplified implementation)
 */
function findPeaks(data: Float32Array, sampleRate: number, threshold = 0.5): number[] {
  const peaks: number[] = []
  const windowSize = Math.floor(sampleRate * 0.1) // 100ms window
  
  for (let i = windowSize; i < data.length - windowSize; i += windowSize) {
    let maxValue = 0
    let maxIndex = i
    
    for (let j = i - windowSize; j < i + windowSize; j++) {
      if (Math.abs(data[j]) > maxValue) {
        maxValue = Math.abs(data[j])
        maxIndex = j
      }
    }
    
    if (maxValue > threshold) {
      peaks.push(maxIndex / sampleRate)
    }
  }
  
  return peaks
}

/**
 * Format duration in seconds to MM:SS format
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

/**
 * Validate audio duration (not too short, not too long)
 */
export function validateAudioDuration(duration: number): { valid: boolean; error?: string } {
  const MIN_DURATION = 10 // 10 seconds
  const MAX_DURATION = 600 // 10 minutes

  if (duration < MIN_DURATION) {
    return { valid: false, error: `Track must be at least ${MIN_DURATION} seconds long` }
  }

  if (duration > MAX_DURATION) {
    return { valid: false, error: `Track must be less than ${Math.floor(MAX_DURATION / 60)} minutes long` }
  }

  return { valid: true }
}
