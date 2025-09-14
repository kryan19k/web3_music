/**
 * Collection Finalization Panel
 * Allows artists to finalize their albums when ready to publish
 */

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import { Badge } from '@/src/components/ui/badge'
import { Progress } from '@/src/components/ui/progress'
import { Switch } from '@/src/components/ui/switch'
import { Label } from '@/src/components/ui/label'
import { useArtistCollections } from '@/src/hooks/contracts/useArtistCollections'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { COLLECTION_MUSIC_NFT_ABI } from '@/src/constants/contracts/abis/CollectionMusicNFT'
import { CONTRACTS } from '@/src/constants/contracts/contracts'
import { 
  CheckCircle2,
  AlertTriangle,
  Music,
  Users,
  DollarSign,
  Clock,
  Play,
  Settings,
  Rocket,
  Shield,
  Target,
  Zap,
  RefreshCw,
  Info,
  TrendingUp,
  Calendar,
  Volume2,
  Image,
  Tag
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'

interface Collection {
  id: number
  title: string
  artist: string
  description: string
  trackCount: number
  finalized: boolean
  active: boolean
  createdAt: Date
  ipfsCoverArt?: string
  genre?: string
  tracks: any[]
}

interface CollectionFinalizationPanelProps {
  className?: string
}

export function CollectionFinalizationPanel({ className = "" }: CollectionFinalizationPanelProps) {
  const { collections, isLoading, refetch } = useArtistCollections()
  const [selectedCollectionId, setSelectedCollectionId] = useState<number | null>(null)
  const [autoPublish, setAutoPublish] = useState(true)
  
  const { writeContractAsync, data: hash, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  // Transform collections data
  const transformedCollections = React.useMemo(() => {
    if (!collections || collections.length === 0) return []
    
    const collectionsMap = new Map<number, Collection>()
    
    collections.forEach((nft: any) => {
      const collectionId = nft.collectionId
      const collectionTitle = nft.collectionTitle || nft.metadata?.title || `Collection ${collectionId}`
      
      if (!collectionsMap.has(collectionId)) {
        collectionsMap.set(collectionId, {
          id: collectionId,
          title: collectionTitle,
          artist: nft.metadata?.artist || 'Unknown Artist',
          description: nft.metadata?.description || 'No description',
          trackCount: 0,
          finalized: nft.finalized || false,
          active: nft.active !== false,
          createdAt: new Date(nft.metadata?.releaseDate || Date.now()),
          ipfsCoverArt: nft.metadata?.image,
          genre: nft.metadata?.genre,
          tracks: []
        })
      }
      
      const collection = collectionsMap.get(collectionId)!
      
      // Only count real tracks (not placeholders)
      if (!nft.tokenId.includes('placeholder')) {
        collection.trackCount++
        collection.tracks.push(nft)
      }
    })
    
    return Array.from(collectionsMap.values())
  }, [collections])

  const handleFinalizeCollection = async (collectionId: number) => {
    try {
      toast.loading('Finalizing collection...', { id: 'finalize' })
      
      const result = await writeContractAsync({
        address: CONTRACTS.CollectionMusicNFT.address as `0x${string}`,
        abi: COLLECTION_MUSIC_NFT_ABI,
        functionName: 'finalizeCollection',
        args: [BigInt(collectionId)],
      })
      
      console.log('✅ [FINALIZE] Collection finalization submitted:', result)
      
    } catch (error) {
      console.error('❌ [FINALIZE] Failed to finalize collection:', error)
      toast.error('Failed to finalize collection', { id: 'finalize' })
    }
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success('Collection finalized successfully!', { id: 'finalize' })
      refetch() // Refresh collections data
    }
  }, [isSuccess, refetch])

  useEffect(() => {
    if (error) {
      toast.error('Failed to finalize collection', { id: 'finalize' })
    }
  }, [error])

  const getReadinessScore = (collection: Collection) => {
    let score = 0
    let maxScore = 100
    
    // Basic info (30 points)
    if (collection.title) score += 15
    if (collection.description) score += 15
    
    // Content (40 points)
    if (collection.trackCount > 0) score += 20
    if (collection.trackCount >= 3) score += 10 // Bonus for multiple tracks
    if (collection.ipfsCoverArt) score += 10
    
    // Metadata (30 points)
    if (collection.genre) score += 10
    if (collection.artist) score += 10
    if (collection.tracks.some(track => track.metadata?.duration > 0)) score += 10
    
    return Math.min(score, maxScore)
  }

  const getReadinessStatus = (score: number) => {
    if (score >= 90) return { status: 'Ready', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30' }
    if (score >= 70) return { status: 'Almost Ready', color: 'text-yellow-600', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30' }
    if (score >= 50) return { status: 'In Progress', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30' }
    return { status: 'Needs Work', color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30' }
  }

  const renderCollectionCard = (collection: Collection) => {
    const readinessScore = getReadinessScore(collection)
    const readinessStatus = getReadinessStatus(readinessScore)
    const canFinalize = readinessScore >= 70 && !collection.finalized
    
    return (
      <motion.div
        key={collection.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        <Card className={`transition-all duration-200 hover:shadow-lg ${
          collection.finalized 
            ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20' 
            : canFinalize
            ? 'border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700'
            : 'border-yellow-200 dark:border-yellow-800'
        }`}>
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                {/* Cover Art */}
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 dark:from-primary/30 dark:to-accent/30 flex items-center justify-center flex-shrink-0">
                  {collection.ipfsCoverArt ? (
                    <img 
                      src={collection.ipfsCoverArt} 
                      alt={collection.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Image className="w-8 h-8 text-purple-400" />
                  )}
                </div>
                
                {/* Collection Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-lg truncate">{collection.title}</CardTitle>
                    {collection.finalized && (
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Finalized
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">by {collection.artist}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Music className="w-3 h-3" />
                      {collection.trackCount} track{collection.trackCount !== 1 ? 's' : ''}
                    </span>
                    
                    {collection.genre && (
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {collection.genre}
                      </span>
                    )}
                    
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDistanceToNow(collection.createdAt, { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Status Badge */}
              <Badge className={`${readinessStatus.bgColor} ${readinessStatus.color} border-0`}>
                {readinessStatus.status}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Readiness Progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium">Readiness Score</Label>
                <span className="text-sm font-semibold">{readinessScore}%</span>
              </div>
              <Progress value={readinessScore} className="h-2" />
            </div>
            
            {/* Collection Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                <Volume2 className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Tracks</p>
                  <p className="text-sm font-medium">{collection.trackCount}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                <Target className="w-4 h-4 text-green-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="text-sm font-medium">{collection.active ? 'Active' : 'Draft'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                <TrendingUp className="w-4 h-4 text-purple-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Total Duration</p>
                  <p className="text-sm font-medium">
                    {Math.floor(collection.tracks.reduce((sum, track) => sum + (track.metadata?.duration || 0), 0) / 60)}m
                  </p>
                </div>
              </div>
            </div>
            
            {/* Checklist */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Completion Checklist</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className={`flex items-center gap-2 ${collection.title ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {collection.title ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                  Album title
                </div>
                
                <div className={`flex items-center gap-2 ${collection.description ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {collection.description ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                  Description
                </div>
                
                <div className={`flex items-center gap-2 ${collection.trackCount > 0 ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {collection.trackCount > 0 ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                  Has tracks
                </div>
                
                <div className={`flex items-center gap-2 ${collection.ipfsCoverArt ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {collection.ipfsCoverArt ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                  Cover art
                </div>
                
                <div className={`flex items-center gap-2 ${collection.genre ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {collection.genre ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                  Genre set
                </div>
                
                <div className={`flex items-center gap-2 ${collection.trackCount >= 3 ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {collection.trackCount >= 3 ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                  Multiple tracks
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            {!collection.finalized && (
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Switch
                      id={`auto-publish-${collection.id}`}
                      checked={autoPublish}
                      onCheckedChange={setAutoPublish}
                    />
                    <Label htmlFor={`auto-publish-${collection.id}`} className="text-sm">
                      Auto-publish when finalized
                    </Label>
                  </div>
                </div>
                
                <Button
                  onClick={() => handleFinalizeCollection(collection.id)}
                  disabled={!canFinalize || isConfirming}
                  className={`w-full ${
                    canFinalize 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' 
                      : ''
                  }`}
                  variant={canFinalize ? 'default' : 'outline'}
                >
                  {isConfirming ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Finalizing...
                    </>
                  ) : canFinalize ? (
                    <>
                      <Rocket className="w-4 h-4 mr-2" />
                      Finalize & Publish Collection
                    </>
                  ) : (
                    <>
                      <Settings className="w-4 h-4 mr-2" />
                      Complete checklist to finalize
                    </>
                  )}
                </Button>
              </div>
            )}
            
            {collection.finalized && (
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm font-medium">This collection is finalized and live!</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (isLoading) {
    return (
      <div className={`${className}`}>
        <Card>
          <CardContent className="py-12 text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading your collections...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Collection Finalization
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Review and finalize your albums when they're ready to go live. Finalized collections cannot be modified.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <CardContent className="p-4 text-center">
            <Music className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <h3 className="font-semibold text-blue-800 dark:text-blue-200">{transformedCollections.length}</h3>
            <p className="text-sm text-blue-600 dark:text-blue-400">Total Collections</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-green-600" />
            <h3 className="font-semibold text-green-800 dark:text-green-200">
              {transformedCollections.filter(c => c.finalized).length}
            </h3>
            <p className="text-sm text-green-600 dark:text-green-400">Finalized</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
              {transformedCollections.filter(c => !c.finalized && getReadinessScore(c) >= 70).length}
            </h3>
            <p className="text-sm text-yellow-600 dark:text-yellow-400">Ready to Finalize</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-purple-600" />
            <h3 className="font-semibold text-purple-800 dark:text-purple-200">
              {transformedCollections.reduce((sum, c) => sum + c.trackCount, 0)}
            </h3>
            <p className="text-sm text-purple-600 dark:text-purple-400">Total Tracks</p>
          </CardContent>
        </Card>
      </div>

      {/* Collections List */}
      {transformedCollections.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Music className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">No Collections Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first album to start building your music collection.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {transformedCollections.map(collection => renderCollectionCard(collection))}
          </AnimatePresence>
        </div>
      )}

      {/* Info Panel */}
      <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">About Collection Finalization</h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• <strong>Finalization is permanent</strong> - You cannot add, remove, or modify tracks after finalizing</li>
                <li>• <strong>Minimum 70% readiness</strong> required before you can finalize a collection</li>
                <li>• <strong>Auto-publish option</strong> makes your collection immediately available for purchase</li>
                <li>• <strong>All NFT tiers</strong> must be configured before finalization</li>
                <li>• <strong>Revenue splits</strong> and collaborator arrangements are locked in upon finalization</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}