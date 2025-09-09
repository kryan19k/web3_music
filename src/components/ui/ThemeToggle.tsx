import { Button } from '@/src/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select'
import { useTheme } from '@/src/contexts/ThemeContext'
import { Sun, Moon, Monitor } from 'lucide-react'

interface ThemeToggleProps {
  showTooltip?: boolean
  variant?: 'default' | 'minimal' | 'compact' | 'dropdown'
  className?: string
}

export function ThemeToggle({ showTooltip = true, variant = 'default', className = '' }: ThemeToggleProps) {
  const { theme, setTheme, actualTheme } = useTheme()
  
  const getNextTheme = () => {
    if (actualTheme === 'light') return 'dim'
    if (actualTheme === 'dim') return 'dark'
    return 'light'
  }

  const cycleTheme = () => {
    const nextTheme = getNextTheme()
    setTheme(nextTheme)
  }

  const getThemeIcon = (themeType: string) => {
    switch (themeType) {
      case 'light':
        return <Sun className="h-4 w-4" />
      case 'dim':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" fill="currentColor" opacity="0.4" />
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        )
      case 'dark':
        return <Moon className="h-4 w-4" />
      default:
        return <Sun className="h-4 w-4" />
    }
  }

  if (variant === 'dropdown') {
    return (
      <Select value={theme} onValueChange={(value) => setTheme(value as any)}>
        <SelectTrigger className={`w-[80px] h-8 ${className}`}>
          <div className="flex items-center justify-center w-full">
            {getThemeIcon(actualTheme)}
          </div>
        </SelectTrigger>
        <SelectContent align="end">
          <SelectItem value="light">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              <span>Light</span>
            </div>
          </SelectItem>
          <SelectItem value="dim">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" fill="currentColor" opacity="0.4" />
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
              <span>Dim</span>
            </div>
          </SelectItem>
          <SelectItem value="dark">
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4" />
              <span>Dark</span>
            </div>
          </SelectItem>
          <SelectItem value="system">
            <div className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              <span>System</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    )
  }

  if (variant === 'minimal') {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={cycleTheme}
        className={`relative ${className}`}
        title={showTooltip ? `Switch to ${getNextTheme().charAt(0).toUpperCase() + getNextTheme().slice(1)} theme` : undefined}
      >
        {getThemeIcon(actualTheme)}
      </Button>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Button
          variant="ghost"
          size="icon"
          onClick={cycleTheme}
          className="relative"
          title={showTooltip ? `Current: ${actualTheme} • Click for ${getNextTheme()}` : undefined}
        >
          {getThemeIcon(actualTheme)}
        </Button>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {['light', 'dim', 'dark'].map((t, i) => (
            <div key={t} className="flex items-center gap-1">
              <div 
                className={`w-2 h-2 rounded-full transition-colors ${
                  t === actualTheme ? 'bg-primary' : 'bg-muted-foreground/30'
                }`} 
              />
              {i < 2 && <span>→</span>}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <div className={`relative group ${className}`}>
      <Button
        variant="ghost"
        size="icon"
        onClick={cycleTheme}
        className="relative"
        title={showTooltip ? `Switch to ${getNextTheme().charAt(0).toUpperCase() + getNextTheme().slice(1)} theme` : undefined}
      >
        {/* Current theme icon with transition */}
        <div className="transition-all duration-300">
          {getThemeIcon(actualTheme)}
        </div>
      </Button>
      
      {/* Enhanced tooltip with theme progression */}
      {showTooltip && (
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground px-3 py-2 rounded-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 border shadow-md">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">Current:</span>
            <span className="capitalize">{actualTheme}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            {['Light', 'Dim', 'Dark'].map((t, i) => (
              <div key={t} className="flex items-center gap-1">
                <span className={`text-xs ${t.toLowerCase() === actualTheme ? 'text-primary font-medium' : ''}`}>
                  {t}
                </span>
                {i < 2 && <span>→</span>}
              </div>
            ))}
          </div>
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-popover rotate-45 border-l border-t"></div>
        </div>
      )}
    </div>
  )
}

// Export individual theme info for use in settings
export const themeInfo = {
  light: {
    name: 'Light',
    description: 'Bright and clean for well-lit environments',
    icon: <Sun className="h-4 w-4" />,
    suitable: 'Daytime, bright offices, outdoor use'
  },
  dim: {
    name: 'Dim',
    description: 'Comfortable middle-ground for extended use',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" fill="currentColor" opacity="0.4" />
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
    ),
    suitable: 'Evening, dimly lit rooms, long sessions'
  },
  dark: {
    name: 'Dark',
    description: 'High contrast for night viewing',
    icon: <Moon className="h-4 w-4" />,
    suitable: 'Night time, dark rooms, OLED displays'
  },
  system: {
    name: 'System',
    description: 'Follows your device preferences',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    suitable: 'Automatic based on OS settings'
  }
}
