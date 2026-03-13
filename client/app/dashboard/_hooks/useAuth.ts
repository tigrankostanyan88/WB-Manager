'use client'

import { useEffect, useState } from 'react'

export function useAuth() {
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me')
        if (!res.ok) {
          setAllowed(false)
          setIsAuthLoading(false)
          return
        }
        const data = await res.json()
        setAllowed(data.user?.role === 'admin')
      } catch {
        setAllowed(false)
      } finally {
        setIsAuthLoading(false)
      }
    }
    checkAuth()
  }, [])

  return { isAuthLoading, allowed }
}
