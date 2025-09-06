import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Loader2, UserCheck, UserMinus, UserPlus } from 'lucide-react'
import * as React from 'react'
import { useState } from 'react'

interface FollowButtonProps {
  userId: string
  isFollowing: boolean
  isLoading?: boolean
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'default' | 'lg'
  showText?: boolean
  className?: string
  onFollowChange?: (userId: string, isFollowing: boolean) => void
}

export function FollowButton({
  userId,
  isFollowing,
  isLoading = false,
  variant = 'default',
  size = 'default',
  showText = true,
  className,
  onFollowChange,
}: FollowButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [localIsFollowing, setLocalIsFollowing] = useState(isFollowing)
  const [localIsLoading, setLocalIsLoading] = useState(false)

  const handleClick = async () => {
    if (localIsLoading || isLoading) return

    setLocalIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      const newState = !localIsFollowing
      setLocalIsFollowing(newState)
      onFollowChange?.(userId, newState)
    } catch (error) {
      console.error('Failed to update follow status:', error)
    } finally {
      setLocalIsLoading(false)
    }
  }

  const getButtonContent = () => {
    if (localIsLoading || isLoading) {
      return (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {showText && <span className="ml-2">Loading...</span>}
        </>
      )
    }

    if (localIsFollowing) {
      return (
        <>
          {isHovered ? <UserMinus className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
          {showText && <span className="ml-2">{isHovered ? 'Unfollow' : 'Following'}</span>}
        </>
      )
    }

    return (
      <>
        <UserPlus className="w-4 h-4" />
        {showText && <span className="ml-2">Follow</span>}
      </>
    )
  }

  const getButtonVariant = () => {
    if (localIsFollowing && isHovered) {
      return 'destructive'
    }
    if (localIsFollowing) {
      return 'secondary'
    }
    return variant
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button
        variant={getButtonVariant()}
        size={size}
        className={cn(
          'transition-all duration-200',
          localIsFollowing && 'border-primary/20',
          className,
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        disabled={localIsLoading || isLoading}
      >
        {getButtonContent()}
      </Button>
    </motion.div>
  )
}

// Compact version for use in cards
export function CompactFollowButton(props: Omit<FollowButtonProps, 'showText' | 'size'>) {
  return (
    <FollowButton
      {...props}
      showText={false}
      size="sm"
      variant="outline"
    />
  )
}
