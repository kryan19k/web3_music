import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent } from '@/src/components/ui/card'
import { Progress } from '@/src/components/ui/progress'
import { cn } from '@/src/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { Activity, AlertTriangle, CheckCircle, FileAudio, Music, Upload, X } from 'lucide-react'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

export interface UploadedFile {
  id: string
  file: File
  name: string
  size: number
  type: string
  duration?: number
  waveform?: number[]
  uploadProgress: number
  status: 'uploading' | 'processing' | 'complete' | 'error'
  error?: string
  url?: string
  ipfsHash?: string
}

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void
  uploadedFiles: UploadedFile[]
  onRemoveFile: (id: string) => void
  acceptedFormats?: string[]
  maxFileSize?: number // in MB
  maxFiles?: number
  className?: string
}

const DEFAULT_ACCEPTED_FORMATS = ['audio/mp3', 'audio/wav', 'audio/flac', 'audio/aac', 'audio/ogg']
const DEFAULT_MAX_FILE_SIZE = 100 // 100MB
const DEFAULT_MAX_FILES = 5

export function FileUpload({
  onFilesSelected,
  uploadedFiles,
  onRemoveFile,
  acceptedFormats = DEFAULT_ACCEPTED_FORMATS,
  maxFileSize = DEFAULT_MAX_FILE_SIZE,
  maxFiles = DEFAULT_MAX_FILES,
  className,
}: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Filter files by size and format
      const validFiles = acceptedFiles.filter((file) => {
        const isValidFormat = acceptedFormats.some(
          (format) =>
            file.type === format || file.name.toLowerCase().endsWith(format.split('/')[1]),
        )
        const isValidSize = file.size <= maxFileSize * 1024 * 1024
        return isValidFormat && isValidSize
      })

      // Check total files limit
      const remainingSlots = maxFiles - uploadedFiles.length
      const filesToAdd = validFiles.slice(0, remainingSlots)

      if (filesToAdd.length > 0) {
        onFilesSelected(filesToAdd)
      }
    },
    [onFilesSelected, acceptedFormats, maxFileSize, maxFiles, uploadedFiles.length],
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    onDrop,
    accept: acceptedFormats.reduce(
      (acc, format) => {
        acc[format] = []
        return acc
      },
      {} as Record<string, string[]>,
    ),
    maxSize: maxFileSize * 1024 * 1024,
    multiple: maxFiles > 1,
    disabled: uploadedFiles.length >= maxFiles,
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
        return <Upload className="w-4 h-4 animate-pulse text-blue-500" />
      case 'processing':
        return <Activity className="w-4 h-4 animate-pulse text-yellow-500" />
      case 'complete':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      default:
        return <FileAudio className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getStatusText = (file: UploadedFile) => {
    switch (file.status) {
      case 'uploading':
        return `Uploading... ${file.uploadProgress}%`
      case 'processing':
        return 'Processing audio...'
      case 'complete':
        return 'Ready to mint'
      case 'error':
        return file.error || 'Upload failed'
      default:
        return 'Pending'
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Drop Zone */}
      <Card
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed transition-all duration-200 cursor-pointer',
          isDragActive && !isDragReject && 'border-primary bg-primary/5',
          isDragReject && 'border-red-500 bg-red-500/5',
          uploadedFiles.length >= maxFiles && 'opacity-50 cursor-not-allowed',
        )}
      >
        <CardContent className="p-8 text-center">
          <input {...getInputProps()} />

          <div className="space-y-4">
            <div
              className={cn(
                'w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-colors',
                isDragActive && !isDragReject && 'bg-primary/10',
                isDragReject && 'bg-red-500/10',
                'bg-muted',
              )}
            >
              <Music
                className={cn(
                  'w-8 h-8',
                  isDragActive && !isDragReject && 'text-primary',
                  isDragReject && 'text-red-500',
                  'text-muted-foreground',
                )}
              />
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                {uploadedFiles.length >= maxFiles
                  ? 'Upload limit reached'
                  : isDragActive
                    ? isDragReject
                      ? 'File type not supported'
                      : 'Drop your music files here'
                    : 'Drag & drop your music files'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {uploadedFiles.length >= maxFiles
                  ? `Maximum ${maxFiles} files allowed`
                  : `Supports ${acceptedFormats.map((f) => f.split('/')[1].toUpperCase()).join(', ')} up to ${maxFileSize}MB each`}
              </p>
            </div>

            {uploadedFiles.length < maxFiles && (
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Browse Files
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* File Rejections */}
      <AnimatePresence>
        {fileRejections.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="border-red-500/50 bg-red-500/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="font-medium text-red-500">Upload Issues</span>
                </div>
                <div className="space-y-1">
                  {fileRejections.map(({ file, errors }) => (
                    <div
                      key={file.name}
                      className="text-sm"
                    >
                      <span className="font-medium">{file.name}</span>
                      <ul className="text-red-600 ml-4">
                        {errors.map((error) => (
                          <li key={error.code}>• {error.message}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Uploaded Files */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Uploaded Files</h4>
              <Badge variant="secondary">
                {uploadedFiles.length}/{maxFiles}
              </Badge>
            </div>

            {uploadedFiles.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                layout
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">{getStatusIcon(file.status)}</div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="font-medium truncate">{file.name}</h5>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveFile(file.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <span>{formatFileSize(file.size)}</span>
                          {file.duration && <span>{formatDuration(file.duration)}</span>}
                          <span className="capitalize">{file.type.split('/')[1]}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium">{getStatusText(file)}</span>
                          {file.status === 'complete' && file.ipfsHash && (
                            <Badge
                              variant="outline"
                              className="text-xs"
                            >
                              IPFS: {file.ipfsHash.slice(0, 8)}...
                            </Badge>
                          )}
                        </div>

                        {/* Progress Bar */}
                        {(file.status === 'uploading' || file.status === 'processing') && (
                          <Progress
                            value={file.status === 'uploading' ? file.uploadProgress : 50}
                            className="mt-2 h-1"
                          />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
