import { type ReactNode, createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dim' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  actualTheme: 'light' | 'dim' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || 'dim'
    }
    return 'dim'
  })

  const [actualTheme, setActualTheme] = useState<'light' | 'dim' | 'dark'>('dim')

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dim', 'dark')

    let systemTheme: 'light' | 'dark' = 'light'

    if (theme === 'system') {
      systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }

    const activeTheme = theme === 'system' ? systemTheme : theme
    setActualTheme(activeTheme as 'light' | 'dim' | 'dark')
    root.classList.add(activeTheme)

    localStorage.setItem('theme', theme)
  }, [theme])

  // Listen to system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = () => {
      if (theme === 'system') {
        const systemTheme = mediaQuery.matches ? 'dark' : 'light'
        setActualTheme(systemTheme)
        const root = window.document.documentElement
        root.classList.remove('light', 'dim', 'dark')
        root.classList.add(systemTheme)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  const value: ThemeContextType = {
    theme,
    setTheme,
    actualTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
