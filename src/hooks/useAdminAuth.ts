import type { AdminPermission, AdminUser } from '@/src/types/admin'
import { useCallback, useEffect, useState } from 'react'

// Mock admin users for demonstration
const MOCK_ADMIN_USERS: AdminUser[] = [
  {
    id: 'admin-1',
    email: 'admin@pagsmusic.com',
    role: 'super_admin',
    permissions: [
      'users:read',
      'users:write',
      'users:delete',
      'nfts:read',
      'nfts:write',
      'nfts:delete',
      'transactions:read',
      'transactions:write',
      'settings:read',
      'settings:write',
      'analytics:read',
      'content:moderate',
      'blockchain:monitor',
    ],
    lastLogin: new Date(),
    isActive: true,
  },
]

interface AdminAuthState {
  currentAdmin: AdminUser | null
  isAuthenticated: boolean
  isLoading: boolean
}

export function useAdminAuth() {
  const [state, setState] = useState<AdminAuthState>({
    currentAdmin: null,
    isAuthenticated: false,
    isLoading: true,
  })

  // Initialize auth state
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const stored = localStorage.getItem('admin_session')
        if (stored) {
          const session = JSON.parse(stored)
          const admin = MOCK_ADMIN_USERS.find((u) => u.id === session.adminId)

          if (admin?.isActive && new Date(session.expires) > new Date()) {
            setState({
              currentAdmin: admin,
              isAuthenticated: true,
              isLoading: false,
            })
            return
          }
          localStorage.removeItem('admin_session')
        }
      } catch (error) {
        console.error('Failed to restore admin session:', error)
        localStorage.removeItem('admin_session')
      }

      setState({
        currentAdmin: null,
        isAuthenticated: false,
        isLoading: false,
      })
    }

    checkAuthStatus()
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setState((prev) => ({ ...prev, isLoading: true }))

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // For demo purposes, accept any email with password "admin123"
      if (password === 'admin123') {
        const admin = MOCK_ADMIN_USERS.find((u) => u.email === email) || MOCK_ADMIN_USERS[0]

        const session = {
          adminId: admin.id,
          expires: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours
        }

        localStorage.setItem('admin_session', JSON.stringify(session))

        // Set state immediately
        setState({
          currentAdmin: admin,
          isAuthenticated: true,
          isLoading: false,
        })

        return true
      }

      setState((prev) => ({ ...prev, isLoading: false }))
      return false
    } catch (error) {
      console.error('Login failed:', error)
      setState((prev) => ({ ...prev, isLoading: false }))
      return false
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('admin_session')
    setState({
      currentAdmin: null,
      isAuthenticated: false,
      isLoading: false,
    })
  }, [])

  const hasPermission = useCallback(
    (permission: AdminPermission): boolean => {
      return state.currentAdmin?.permissions.includes(permission) || false
    },
    [state.currentAdmin],
  )

  const hasAnyPermission = useCallback(
    (permissions: AdminPermission[]): boolean => {
      return permissions.some((permission) => hasPermission(permission))
    },
    [hasPermission],
  )

  const hasRole = useCallback(
    (role: AdminUser['role']): boolean => {
      return state.currentAdmin?.role === role || false
    },
    [state.currentAdmin],
  )

  const isSuperAdmin = useCallback((): boolean => {
    return hasRole('super_admin')
  }, [hasRole])

  return {
    ...state,
    login,
    logout,
    hasPermission,
    hasAnyPermission,
    hasRole,
    isSuperAdmin,
  }
}
