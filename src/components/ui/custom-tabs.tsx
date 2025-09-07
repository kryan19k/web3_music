import { cn } from '@/src/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import * as React from 'react'

interface TabsContextType {
  activeTab: string
  setActiveTab: (value: string) => void
}

const TabsContext = React.createContext<TabsContextType | undefined>(undefined)

interface TabsProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
  className?: string
}

export function Tabs({ value, onValueChange, children, className }: TabsProps) {
  const contextValue = React.useMemo(
    () => ({
      activeTab: value,
      setActiveTab: onValueChange,
    }),
    [value, onValueChange],
  )

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  )
}

interface TabsListProps {
  children: React.ReactNode
  className?: string
}

export function TabsList({ children, className }: TabsListProps) {
  return (
    <div
      className={cn(
        'flex items-center p-1 rounded-lg bg-muted/50 backdrop-blur-sm border border-border/50 shadow-sm',
        className,
      )}
    >
      {children}
    </div>
  )
}

interface TabsTriggerProps {
  value: string
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

export function TabsTrigger({ value, children, className, disabled }: TabsTriggerProps) {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error('TabsTrigger must be used within a Tabs component')
  }

  const { activeTab, setActiveTab } = context
  const isActive = activeTab === value

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => setActiveTab(value)}
      className={cn(
        'relative flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        isActive
          ? 'text-foreground shadow-sm bg-background'
          : 'text-muted-foreground hover:text-foreground hover:bg-background/50',
        className,
      )}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-background rounded-md shadow-sm border border-border/20"
          style={{ zIndex: -1 }}
          initial={false}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
        />
      )}
    </button>
  )
}

interface TabsContentProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error('TabsContent must be used within a Tabs component')
  }

  const { activeTab } = context
  const isActive = activeTab === value

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={value}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'mt-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hook for accessing the tabs context
export function useTabs() {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error('useTabs must be used within a Tabs component')
  }
  return context
}
