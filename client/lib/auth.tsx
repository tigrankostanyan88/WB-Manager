'use client'

import { createContext, useContext, useState, useEffect, useRef, type ReactNode, useCallback } from 'react'
import { userService } from '@/lib/api'

export interface UserFile {
  name_used?: string
  name?: string
  ext?: string
  table_name?: string
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  address: string
  role: string
  avatar?: string
  isPaid?: boolean
  files?: UserFile[]
  course_ids?: (string | number)[]
  [key: string]: unknown // Allow additional fields for compatibility
}

interface AuthContextType {
  user: User | null
  isLoaded: boolean
  isLoggedIn: boolean
  logout: () => Promise<void>
  setUser: (user: User | null) => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function buildAvatar(user: User | null): string {
  if (!user) return ''
  if (user.avatar) return user.avatar
  if (user.files && Array.isArray(user.files) && user.files.length > 0) {
    const avatarFile = user.files.find((f) => f?.name_used === 'user_img') ?? user.files[0]
    if (avatarFile?.name && avatarFile?.ext) {
      const table = avatarFile.table_name || 'users'
      return `/api/images/${table}/large/${avatarFile.name}.${avatarFile.ext}`
    }
  }
  return ''
}

// Helper to check if JWT cookie exists
function hasJwtCookie(): boolean {
  if (typeof document === 'undefined') return false
  return document.cookie.split(';').some(c => c.trim().startsWith('jwt='))
}

export function AuthProvider({ children, initialUser = null }: { children: ReactNode; initialUser?: User | null }) {
  const [user, setUserState] = useState<User | null>(initialUser)
  const [isLoaded, setIsLoaded] = useState(!!initialUser)

  const fetchUser = useCallback(async () => {
    // Skip API call if no JWT cookie (prevents 401 console error)
    if (!hasJwtCookie()) {
      setUserState(null)
      setIsLoaded(true)
      return
    }
    
    try {
      const res = await userService.getMe()
      const u = res.data.user
      const userWithAvatar = { ...u, avatar: buildAvatar(u) }
      setUserState(userWithAvatar)
    } catch (err) {
      const axiosError = err as { response?: { status?: number } }
      if (axiosError.response?.status === 401) {
        // Unauthorized - clear session (expected when logged out)
        setUserState(null)
      } else {
        // Only log non-401 errors
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to fetch user:', err)
        }
      }
    } finally {
      setIsLoaded(true)
    }
  }, [])

  const refreshUser = useCallback(async () => {
    await fetchUser()
  }, [fetchUser])

  const setUser = useCallback((u: User | null) => {
    if (u && !u.avatar) {
      u = { ...u, avatar: buildAvatar(u) }
    }
    setUserState(u)
  }, [])

  useEffect(() => {
    // Clean up any legacy localStorage tokens (security fix)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
    
    if (!initialUser) {
      fetchUser()
    } else {
      setIsLoaded(true)
    }
  }, [initialUser, fetchUser])

  useEffect(() => {
    const handler = (evt: Event) => {
      const u = (evt as CustomEvent<{ user?: User }>).detail?.user
      if (u) {
        const userWithAvatar = { ...u, avatar: buildAvatar(u) }
        setUserState(userWithAvatar)
        setIsLoaded(true)
      }
    }
    window.addEventListener('auth:updated', handler)
    return () => window.removeEventListener('auth:updated', handler)
  }, [])

  // Ref to always access current user state without stale closure
  const userRef = useRef(user)
  useEffect(() => {
    userRef.current = user
  }, [user])

  // Check session on focus (cookie tampering detection)
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const checkSession = async () => {
      if (!userRef.current || !hasJwtCookie()) return
      
      try {
        const res = await userService.getMe()
        if (res.data?.user) {
          const u = res.data.user
          setUserState({ ...u, avatar: buildAvatar(u) })
        }
      } catch (err: unknown) {
        const axiosError = err as { response?: { status?: number } }
        if (axiosError.response?.status === 401) {
          // Session expired - logout
          setUserState(null)
          window.location.href = '/'
        }
      }
    }
    
    window.addEventListener('focus', checkSession)
    
    return () => {
      window.removeEventListener('focus', checkSession)
    }
  }, [])

  const logout = async () => {
    try {
      await fetch('/api/v1/users/logout', { method: 'POST' })
    } catch { }
    document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    // Clear legacy tokens
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
    setUserState(null)
    window.location.href = '/'
  }

  return (
    <AuthContext.Provider value={{ user, isLoaded, isLoggedIn: !!user, logout, setUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
