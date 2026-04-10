'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
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

export function AuthProvider({ children, initialUser = null }: { children: ReactNode; initialUser?: User | null }) {
  const [user, setUserState] = useState<User | null>(initialUser)
  const [isLoaded, setIsLoaded] = useState(!!initialUser)

  const fetchUser = useCallback(async () => {
    try {
      const res = await userService.getMe()
      const u = res.data.user
      const userWithAvatar = { ...u, avatar: buildAvatar(u) }
      setUserState(userWithAvatar)
    } catch (err) {
      const axiosError = err as { response?: { status?: number } }
      if (axiosError.response?.status === 401) {
        // Clear invalid JWT cookie and redirect to login
        document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        setUserState(null)
        // Redirect to home page for login
        if (typeof window !== 'undefined' && window.location.pathname !== '/') {
          window.location.href = '/'
        }
      }
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to fetch user:', err)
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
    if (!initialUser) {
      fetchUser()
    } else {
      setIsLoaded(true)
    }
  }, [initialUser, fetchUser])

  useEffect(() => {
    const handler = (evt: Event) => {
      console.log('[Auth] auth:updated event received:', (evt as CustomEvent).detail)
      const u = (evt as CustomEvent<{ user?: User }>).detail?.user
      if (u) {
        const userWithAvatar = { ...u, avatar: buildAvatar(u) }
        console.log('[Auth] Updating user state:', userWithAvatar)
        setUserState(userWithAvatar)
        setIsLoaded(true)
      }
    }
    window.addEventListener('auth:updated', handler)
    return () => window.removeEventListener('auth:updated', handler)
  }, [])

  const logout = async () => {
    try {
      await fetch('/api/v1/users/logout', { method: 'POST' })
    } catch { }
    document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
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
