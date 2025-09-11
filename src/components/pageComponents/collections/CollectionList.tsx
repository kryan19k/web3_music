import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import { Badge } from '@/src/components/ui/badge'
import { Progress } from '@/src/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar'
import { 
  Music, 
  Users, 
  DollarSign, 
  Eye, 
  Play, 
  Plus,
  Calendar,
  Disc
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from '@tanstack/react-router'

interface Collection {
  id: number
  title: string
  artist: string
  description: string
  coverArt?: string
  trackCount: number
  totalMinted: number
  totalSupply: number
  revenue: number
  createdAt: string
  isActive: boolean
  completionProgress: number // Percentage of album completion
}

interface CollectionListProps {
  collections: Collection[]
  isLoading?: boolean
  showCreateButton?: boolean
  onCollectionSelect?: (collection: Collection) => void
}

export function CollectionList({ 
  collections, 
  isLoading = false,
  showCreateButton = false,
  onCollectionSelect 
}: CollectionListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-3 bg-muted rounded w-1/2 mb-4" />
              <div className="h-2 bg-muted rounded mb-2" />
              <div className="flex gap-2">
                <div className="h-6 bg-muted rounded w-16" />
                <div className="h-6 bg-muted rounded w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (collections.length === 0) {
    return (
      <Card className="col-span-full">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Disc className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Albums Yet</h3>
          <p className="text-muted-foreground text-center mb-6 max-w-md">
            Create your first album to start building your music collection. Albums help organize your tracks and provide a better experience for your fans.
          </p>
          {showCreateButton && (
            <Button asChild>
              <Link to="/artist/upload">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Album
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {collections.map((collection, index) => (
        <motion.div
          key={collection.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card 
            className="group cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20"
            onClick={() => onCollectionSelect?.(collection)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {collection.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    by {collection.artist}
                  </p>
                </div>
                <Badge 
                  variant={collection.isActive ? "default" : "secondary"}
                  className="ml-2"
                >
                  {collection.isActive ? "Active" : "Draft"}
                </Badge>
              </div>
              
              {collection.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                  {collection.description}
                </p>
              )}
            </CardHeader>

            <CardContent className="pt-0 space-y-4">
              {/* Album Completion Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Completion</span>
                  <span className="font-medium">{collection.completionProgress}%</span>
                </div>
                <Progress value={collection.completionProgress} className="h-2" />
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{collection.trackCount}</p>
                    <p className="text-xs text-muted-foreground">Tracks</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{collection.totalMinted}/{collection.totalSupply}</p>
                    <p className="text-xs text-muted-foreground">Minted</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">${collection.revenue.toFixed(0)}</p>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">
                      {new Date(collection.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Created</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Play className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Create New Collection Card */}
      {showCreateButton && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: collections.length * 0.1 }}
        >
          <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors cursor-pointer group">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors mb-4">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">Create New Album</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Start a new collection of tracks
              </p>
              <Button asChild size="sm">
                <Link to="/artist/upload">
                  Create Album
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
