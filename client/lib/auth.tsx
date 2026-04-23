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
  [key: string]: unknown
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
      // ext already includes the leading dot from backend (e.g., '.jpg')
      const extWithDot = avatarFile.ext.startsWith('.') ? avatarFile.ext : `.${avatarFile.ext}`
      return `/images/${table}/large/${avatarFile.name}${extWithDot}`
    }
  }
  return ''
}

// Note: JWT cookie is HttpOnly (secure), so we can't check it client-side
// We just try to fetch the user - if no cookie, API will return 401

export function AuthProvider({ children, initialUser = null }: { children: ReactNode; initialUser?: User | null }) {
  const [user, setUserState] = useState<User | null>(initialUser)
  const [isLoaded, setIsLoaded] = useState(!!initialUser)
  const [isMounted, setIsMounted] = useState(false)

  const fetchUser = useCallback(async () => {
    // Always try to fetch user - API will return 401 if no valid cookie
    console.log('[Client] fetchUser: Starting API call to /api/v1/users/me...')
    try {
      const res = await userService.getMe()
      console.log('[Client] fetchUser: API response received', res.data?.user?.id || res.data?.id)
      const u = res.data?.user || res.data
      if (u && u.id) {
        const userWithAvatar = { ...u, avatar: buildAvatar(u) }
        setUserState(userWithAvatar)
      } else {
        console.log('[Client] fetchUser: No user in response')
        setUserState(null)
      }
    } catch (err) {
      const axiosError = err as { response?: { status?: number } }
      if (axiosError.response?.status === 401) {
        // Unauthorized - no valid session (expected when logged out)
        console.log('[Client] fetchUser: 401 - no valid session')
        setUserState(null)
      } else {
        console.log('[Client] fetchUser: API error', axiosError.response?.status, err)
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to fetch user:', err)
        }
        setUserState(null)
      }
    } finally {
      setIsLoaded(true)
      console.log('[Client] fetchUser: Done, isLoaded = true, user:', user ? 'exists' : 'null')
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
    setIsMounted(true)
    
    // Clean up any legacy localStorage tokens (security fix)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
    
    console.log('[Client] AuthProvider mounted, initialUser:', initialUser?.id || 'null')
    
    // If server provided initialUser, use it
    if (initialUser) {
      console.log('[Client] Using server-provided initialUser')
      setUserState(initialUser)
      setIsLoaded(true)
      return
    }
    
    // Otherwise check for JWT cookie and fetch user client-side
    console.log('[Client] No initialUser, trying to fetch user...')
    // Always try to fetch - API will tell us if session exists
    fetchUser()
  }, [initialUser, fetchUser])
  
  // Re-fetch user on window focus if we're logged out but cookie exists (rare edge case)
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !user) {
        console.log('[Client] Page visible, no user - re-fetching...')
        fetchUser()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [user, fetchUser])

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
      if (!userRef.current) return
      
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
    <AuthContext.Provider value={{ user, isLoaded: isLoaded && isMounted, isLoggedIn: !!user, logout, setUser, refreshUser }}>
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
