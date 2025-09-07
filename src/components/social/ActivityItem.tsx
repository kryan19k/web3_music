import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent } from '@/src/components/ui/card'
import { cn } from '@/src/lib/utils'
import type { ActivityItem as ActivityItemType } from '@/src/types/social'
import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import {
  Award,
  Clock,
  DollarSign,
  Headphones,
  Heart,
  MessageCircle,
  Music,
  Play,
  Share2,
  ShoppingBag,
  Upload,
  UserPlus,
} from 'lucide-react'
import * as React from 'react'

interface ActivityItemProps {
  activity: ActivityItemType
  compact?: boolean
  showInteractions?: boolean
  className?: string
}

export function ActivityItem({
  activity,
  compact = false,
  showInteractions = true,
  className,
}: ActivityItemProps) {
  const { user, type, timestamp, metadata } = activity

  const getActivityIcon = () => {
    const iconClass = 'w-4 h-4'
    switch (type) {
      case 'purchase':
        return <ShoppingBag className={cn(iconClass, 'text-green-500')} />
      case 'like':
        return <Heart className={cn(iconClass, 'text-red-500')} />
      case 'follow':
        return <UserPlus className={cn(iconClass, 'text-blue-500')} />
      case 'comment':
        return <MessageCircle className={cn(iconClass, 'text-purple-500')} />
      case 'upload':
        return <Upload className={cn(iconClass, 'text-yellow-500')} />
      case 'play':
        return <Play className={cn(iconClass, 'text-green-400')} />
      case 'share':
        return <Share2 className={cn(iconClass, 'text-blue-400')} />
      default:
        return <Music className={cn(iconClass, 'text-muted-foreground')} />
    }
  }

  const getActivityText = () => {
    switch (type) {
      case 'purchase':
        return (
          <span>
            purchased{' '}
            <Link
              to="/marketplace/$nftId"
              params={{ nftId: activity.nftId || '' }}
              className="font-medium hover:underline"
            >
              {activity.trackTitle}
            </Link>
            {metadata?.price && (
              <span className="text-green-500 font-medium ml-1">for ${metadata.price}</span>
            )}
          </span>
        )
      case 'like':
        return (
          <span>
            liked{' '}
            <Link
              to="/marketplace/$nftId"
              params={{ nftId: activity.nftId || '' }}
              className="font-medium hover:underline"
            >
              {activity.trackTitle}
            </Link>
          </span>
        )
      case 'follow':
        return (
          <span>
            started following{' '}
            <Link
              to="/profile/$userId"
              params={{ userId: activity.targetUserId || '' }}
              className="font-medium hover:underline"
            >
              {activity.targetUserName}
            </Link>
          </span>
        )
      case 'comment':
        return (
          <span>
            commented on{' '}
            <Link
              to="/marketplace/$nftId"
              params={{ nftId: activity.nftId || '' }}
              className="font-medium hover:underline"
            >
              {activity.trackTitle}
            </Link>
            {activity.commentText && !compact && (
              <div className="mt-2 p-3 bg-muted/50 rounded-lg text-sm italic">
                "{activity.commentText}"
              </div>
            )}
          </span>
        )
      case 'upload':
        return (
          <span>
            uploaded a new track{' '}
            <Link
              to="/marketplace/$nftId"
              params={{ nftId: activity.nftId || '' }}
              className="font-medium hover:underline"
            >
              {activity.trackTitle}
            </Link>
            {metadata?.genre && (
              <Badge
                variant="secondary"
                className="ml-2 text-xs"
              >
                {metadata.genre}
              </Badge>
            )}
          </span>
        )
      case 'play':
        return (
          <span>
            streamed{' '}
            <Link
              to="/marketplace/$nftId"
              params={{ nftId: activity.nftId || '' }}
              className="font-medium hover:underline"
            >
              {activity.trackTitle}
            </Link>
            <span className="text-muted-foreground ml-1">by {activity.trackArtist}</span>
          </span>
        )
      case 'share':
        return (
          <span>
            shared{' '}
            <Link
              to="/marketplace/$nftId"
              params={{ nftId: activity.nftId || '' }}
              className="font-medium hover:underline"
            >
              {activity.trackTitle}
            </Link>
            <span className="text-muted-foreground ml-1">
              on {metadata?.platform || 'social media'}
            </span>
          </span>
        )
      default:
        return <span>had some activity</span>
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`
    return date.toLocaleDateString()
  }

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className={cn(
          'flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors',
          className,
        )}
      >
        <div className="flex-shrink-0">{getActivityIcon()}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link
              to="/profile/$userId"
              params={{ userId: user.id }}
              className="font-medium hover:underline truncate"
            >
              {user.displayName}
            </Link>
            {user.verified && <Award className="w-3 h-3 text-blue-500" />}
          </div>
          <p className="text-sm text-muted-foreground truncate">{getActivityText()}</p>
        </div>
        <div className="flex-shrink-0 text-xs text-muted-foreground">
          {formatTimestamp(timestamp)}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* User Avatar */}
            <Link
              to="/profile/$userId"
              params={{ userId: user.id }}
              className="flex-shrink-0"
            >
              <Avatar className="w-10 h-10 ring-2 ring-background hover:ring-primary/20 transition-all">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.displayName[0]}</AvatarFallback>
              </Avatar>
            </Link>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-center gap-2 mb-2">
                <Link
                  to="/profile/$userId"
                  params={{ userId: user.id }}
                  className="font-semibold hover:underline"
                >
                  {user.displayName}
                </Link>
                {user.verified && <Award className="w-4 h-4 text-blue-500" />}
                <div className="flex items-center gap-1 text-muted-foreground">
                  {getActivityIcon()}
                </div>
                <span className="text-muted-foreground">·</span>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {formatTimestamp(timestamp)}
                </div>
              </div>

              {/* Activity Content */}
              <div className="text-sm mb-3">{getActivityText()}</div>

              {/* Track Preview (for relevant activities) */}
              {(type === 'purchase' || type === 'like' || type === 'upload' || type === 'play') &&
                activity.trackImage && (
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg mb-3">
                    <img
                      src={activity.trackImage}
                      alt={activity.trackTitle}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{activity.trackTitle}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        by {activity.trackArtist}
                      </p>
                    </div>
                    {metadata?.price && (
                      <div className="flex items-center gap-1 text-green-500 font-medium">
                        <DollarSign className="w-4 h-4" />
                        {metadata.price}
                      </div>
                    )}
                  </div>
                )}

              {/* Interactions */}
              {showInteractions && (
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-1"
                  >
                    <Heart className="w-4 h-4 mr-1" />
                    Like
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-1"
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Comment
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-1"
                  >
                    <Share2 className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
