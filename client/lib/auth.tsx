'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { userService } from '@/lib/api'

export interface User {
  id: string
  name: string
  email: string
  phone: string
  address: string
  role: string
  avatar?: string
  isPaid?: boolean
  files?: unknown[]
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
    const avatarFile = user.files.find((f: unknown) => {
      if (!f || typeof f !== 'object') return false
      const file = f as Record<string, unknown>
      return file.name_used === 'user_img'
    })
    if (avatarFile && typeof avatarFile === 'object') {
      const f = avatarFile as Record<string, unknown>
      if (typeof f.name === 'string' && typeof f.ext === 'string') {
        const table = typeof f.table_name === 'string' && f.table_name ? f.table_name : 'users'
        return `/api/images/${table}/large/${f.name}.${f.ext}`
      }
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
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } }).response?.status
      if (status === 401) {
        setUserState(null)
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
