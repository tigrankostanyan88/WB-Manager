'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children, initialUser = null }: { children: ReactNode; initialUser?: User | null }) {
  const [user, setUser] = useState<User | null>(initialUser)
  const [isLoaded, setIsLoaded] = useState(!!initialUser)

  useEffect(() => {
    // Always fetch user from server, no localStorage for security
    if (!initialUser) {
      fetchUser()
    } else {
      setIsLoaded(true)
      fetchUser()
    }

    const onAuthUpdated = (evt: Event) => {
      const u = (evt as CustomEvent<{ user?: User }>).detail?.user
      if (u) setUser(u)
      else fetchUser()
    }
    window.addEventListener('auth:updated', onAuthUpdated as EventListener)
    return () => {
      window.removeEventListener('auth:updated', onAuthUpdated as EventListener)
    }
  }, [])

  const buildAvatar = (u: User | null) => {
    if (!u) return u
    if (u.avatar && typeof u.avatar === 'string') return u
    if (Array.isArray(u.files) && u.files.length) {
      const typedFiles = u.files as Array<{ name_used?: string; name?: string; ext?: string; table_name?: string }>
      const f = typedFiles.find((x) => x.name_used === 'user_img') || typedFiles[0]
      if (f?.name && f?.ext) {
        const path = `/images/${f.table_name || 'users'}/large/${f.name}.${f.ext}`
        const apiBase = process.env.NEXT_PUBLIC_API_URL || '/api'
        const withOrigin = (p: string) => {
          if (/^https?:\/\//i.test(apiBase)) {
            const origin = apiBase.replace(/\/api.*$/, '')
            return `${origin}${p}`
          }
          const prefix = apiBase.endsWith('/') ? apiBase.slice(0, -1) : apiBase
          return `${prefix}${p}`
        }
        return { ...u, avatar: withOrigin(path) }
      }
    }
    return u
  }

  const fetchUser = async () => {
    try {
      const res = await userService.getMe()
      const u = res.data.user
      const userWithAvatar = buildAvatar(u)
      setUser(userWithAvatar)
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } }).response?.status
      // Only clear user on 401 (unauthorized) or if we truly don't have a user at all
      if (status === 401) {
        setUser(null)
      }
    } finally {
      setIsLoaded(true)
    }
  }

  useEffect(() => {
    if (!initialUser) {
      fetchUser()
    } else {
      setIsLoaded(true)
      fetchUser()
    }

    const onAuthUpdated = (evt: Event) => {
      const u = (evt as CustomEvent<{ user?: User }>).detail?.user
      if (u) setUser(u)
      else fetchUser()
    }
    window.addEventListener('auth:updated', onAuthUpdated as EventListener)
    return () => {
      window.removeEventListener('auth:updated', onAuthUpdated as EventListener)
    }
  }, [])

  const logout = async () => {
    try {
      await fetch('/api/v1/users/logout', { method: 'POST' })
    } catch {}
    document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    setUser(null)
    window.location.href = '/'
  }

  return (
    <AuthContext.Provider value={{ user, isLoaded, isLoggedIn: !!user, logout, setUser }}>
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
