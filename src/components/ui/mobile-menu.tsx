import { Button } from '@/src/components/ui/button'
import { cn } from '@/src/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import * as React from 'react'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

export function MobileMenu({ isOpen, onClose, children, className }: MobileMenuProps) {
  // Close on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          />

          {/* Menu Content */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              'fixed right-0 top-0 z-50 h-full w-[300px] border-l bg-background p-6 shadow-lg sm:w-[400px]',
              className,
            )}
          >
            {/* Close Button */}
            <div className="flex items-center justify-end mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>

            {/* Menu Content */}
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

interface MobileMenuTriggerProps {
  children: React.ReactNode
  onClick: () => void
  className?: string
}

export function MobileMenuTrigger({ children, onClick, className }: MobileMenuTriggerProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={cn('lg:hidden', className)}
    >
      {children}
    </Button>
  )
}
