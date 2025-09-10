/**
 * File Upload Zone
 * Drag & drop file upload with progress, validation, and IPFS integration
 */

import React, { useState, useCallback, useRef } from 'react'
import { Card, CardContent } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import { Progress } from '@/src/components/ui/progress'
import { Badge } from '@/src/components/ui/badge'
import { uploadFile, uploadAudioFile, uploadCoverArt, uploadToIPFS } from '@/src/lib/storacha'
import { useAudioAnalysis, formatDuration } from '@/src/hooks/useAudioAnalysis'
import { 
  Upload, 
  FileAudio, 
  FileImage, 
  Check, 
  AlertCircle,
  X,
  Music,
  Image,
  Clock,
  Zap,
  Volume2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

interface FileUploadZoneProps {
  type: 'audio' | 'image'
  onUploadComplete: (file: File, cid: string) => void
  onProgressUpdate?: (progress: number) => void
  maxSize?: number
  accept?: string
}

export function FileUploadZone({ 
  type, 
  onUploadComplete, 
  onProgressUpdate,
  maxSize = type === 'audio' ? 100 * 1024 * 1024 : 10 * 1024 * 1024, // 100MB for audio, 10MB for images
  accept = type === 'audio' ? 'audio/*' : 'image/*'
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  
  const { analyzeAudio, metadata: audioMetadata, isAnalyzing } = useAudioAnalysis()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Helper functions for file validation and formatting
  const validateAudioFile = (file: File) => {
    const validTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/flac', 'audio/aac']
    if (!validTypes.includes(file.type)) {
      return { valid: false, error: 'Invalid audio format. Use MP3, WAV, FLAC, or AAC.' }
    }
    if (file.size > maxSize) {
      return { valid: false, error: `File too large. Max size: ${formatFileSize(maxSize)}` }
    }
    return { valid: true }
  }

  const validateImageFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      return { valid: false, error: 'Invalid image format. Use JPEG, PNG, or WebP.' }
    }
    if (file.size > maxSize) {
      return { valid: false, error: `File too large. Max size: ${formatFileSize(maxSize)}` }
    }
    return { valid: true }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const validateFile = (file: File) => {
    if (type === 'audio') {
      return validateAudioFile(file)
    } else {
      return validateImageFile(file)
    }
  }

  const handleFileSelect = useCallback(async (file: File) => {
    // Validate file
    const validation = validateFile(file)
    if (!validation.valid) {
      toast.error('Invalid file', { description: validation.error })
      return
    }

    setSelectedFile(file)
    setUploadError(null)

    // Create preview
    if (type === 'image') {
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target?.result as string)
      reader.readAsDataURL(file)
    } else if (type === 'audio') {
      // Analyze audio file
      try {
        await analyzeAudio(file)
      } catch (error) {
        console.warn('Audio analysis failed:', error)
      }
    }
  }, [type, analyzeAudio])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploadStatus('uploading')
    setUploadProgress(0)
    setUploadError(null)

    try {
      const result = await uploadToIPFS(selectedFile, (progress) => {
        setUploadProgress(progress.percentage)
        onProgressUpdate?.(progress.percentage)
      })

      setUploadStatus('success')
      toast.success(`${type === 'audio' ? 'Audio' : 'Image'} uploaded successfully!`, {
        description: `Stored on IPFS: ${result.cid.slice(0, 10)}...`
      })

      onUploadComplete(selectedFile, result.cid)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      setUploadStatus('error')
      setUploadError(errorMessage)
      toast.error('Upload failed', { description: errorMessage })
    }
  }

  const resetUpload = () => {
    setSelectedFile(null)
    setPreview(null)
    setUploadProgress(0)
    setUploadStatus('idle')
    setUploadError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getIcon = () => {
    return type === 'audio' ? FileAudio : FileImage
  }

  const getTitle = () => {
    return type === 'audio' ? 'Upload Audio File' : 'Upload Cover Art'
  }

  const getDescription = () => {
    if (type === 'audio') {
      return 'Upload your track in MP3, WAV, FLAC, or other supported formats'
    }
    return 'Upload cover art in JPG, PNG, or WebP format'
  }

  const getSupportedFormats = () => {
    if (type === 'audio') {
      return ['MP3', 'WAV', 'FLAC', 'AAC', 'OGG']
    }
    return ['JPG', 'PNG', 'WebP', 'GIF']
  }

  const Icon = getIcon()

  if (uploadStatus === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Upload Complete!</h3>
            <p className="text-muted-foreground mb-4">
              Your {type} file has been uploaded to IPFS successfully.
            </p>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge variant="secondary">
                <Icon className="w-3 h-3 mr-1" />
                {selectedFile?.name}
              </Badge>
              <Badge variant="outline">
                {formatFileSize(selectedFile?.size || 0)}
              </Badge>
            </div>
            <Button variant="outline" onClick={resetUpload} className="w-full">
              Upload Different File
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {!selectedFile ? (
        /* Upload Zone */
        <Card
          className={`border-2 border-dashed transition-all cursor-pointer hover:bg-accent/50 ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <CardContent className="p-12 text-center">
            <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
              type === 'audio' 
                ? 'bg-purple-100 dark:bg-purple-900/20' 
                : 'bg-pink-100 dark:bg-pink-900/20'
            }`}>
              <Icon className={`w-8 h-8 ${
                type === 'audio' ? 'text-purple-600' : 'text-pink-600'
              }`} />
            </div>
            
            <h3 className="text-xl font-semibold mb-2">{getTitle()}</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {getDescription()}
            </p>

            <div className="space-y-4">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0">
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
              
              <p className="text-sm text-muted-foreground">
                or drag and drop your file here
              </p>

              {/* File Requirements */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-2">Supported Formats:</h4>
                    <div className="flex flex-wrap gap-1">
                      {getSupportedFormats().map(format => (
                        <Badge key={format} variant="outline" className="text-xs">
                          {format}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Requirements:</h4>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Max size: {formatFileSize(maxSize)}</li>
                      {type === 'audio' && <li>• Duration: 10 seconds - 10 minutes</li>}
                      {type === 'image' && <li>• Recommended: 1:1 aspect ratio</li>}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* File Selected */
        <div className="space-y-6">
          {/* File Preview */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {/* Preview */}
                <div className="flex-shrink-0">
                  {type === 'image' && preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  ) : (
                    <div className={`w-20 h-20 rounded-lg flex items-center justify-center ${
                      type === 'audio' 
                        ? 'bg-purple-100 dark:bg-purple-900/20' 
                        : 'bg-pink-100 dark:bg-pink-900/20'
                    }`}>
                      <Icon className={`w-8 h-8 ${
                        type === 'audio' ? 'text-purple-600' : 'text-pink-600'
                      }`} />
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{selectedFile.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline">
                      {formatFileSize(selectedFile.size)}
                    </Badge>
                    {type === 'audio' && audioMetadata && (
                      <>
                        {audioMetadata.duration > 0 && (
                          <Badge variant="outline">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatDuration(audioMetadata.duration)}
                          </Badge>
                        )}
                        {audioMetadata.bpm && (
                          <Badge variant="outline">
                            <Zap className="w-3 h-3 mr-1" />
                            {audioMetadata.bpm} BPM
                          </Badge>
                        )}
                      </>
                    )}
                  </div>
                  
                  {type === 'audio' && audioMetadata?.duration && (
                    <div className="mt-3">
                      <div className="flex items-center text-sm text-muted-foreground mb-1">
                        <Volume2 className="w-3 h-3 mr-1" />
                        Audio Analysis {isAnalyzing ? 'in progress...' : 'complete'}
                      </div>
                      {!isAnalyzing && audioMetadata && (
                        <div className="text-xs text-muted-foreground">
                          Duration: {formatDuration(audioMetadata.duration)}
                          {audioMetadata.bpm && ` • BPM: ${audioMetadata.bpm}`}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Remove Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetUpload}
                  className="flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upload Progress */}
          <AnimatePresence>
            {uploadStatus === 'uploading' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">Uploading to IPFS...</h3>
                      <span className="text-sm font-medium">{Math.round(uploadProgress)}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-sm text-muted-foreground mt-2">
                      Your file is being stored on the decentralized web
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error State */}
          {uploadStatus === 'error' && uploadError && (
            <Card className="border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-900/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-medium text-red-800 dark:text-red-200">
                      Upload Failed
                    </h3>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                      {uploadError}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upload Button */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={resetUpload}
              className="flex-1"
            >
              Choose Different File
            </Button>
            
            <Button
              onClick={handleUpload}
              disabled={uploadStatus === 'uploading' || isAnalyzing}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
            >
              {uploadStatus === 'uploading' ? (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Uploading... {Math.round(uploadProgress)}%
                </>
              ) : isAnalyzing ? (
                <>
                  <Zap className="w-4 h-4 mr-2 animate-pulse" />
                  Analyzing Audio...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload to IPFS
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  )
}
