'use client'

// client/hooks/useHeroContent.ts

import { useState, useEffect, useRef } from 'react'
import api from '@/lib/api'

interface HeroContent {
  id: number
  title: string
  name: string
  text: string
  video_url?: string
  thumbnail_time?: number
  created_at?: string
  updated_at?: string
}

interface HeroContentResponse {
  status: string
  data: HeroContent | null
  message?: string
}

interface UseHeroContentReturn {
  content: HeroContent | null
  loading: boolean
  error: Error | null
}

// Prevent re-fetch on Fast Refresh
const isFirstRender = { current: true }

function withOrigin(path?: string): string | undefined {
  if (!path || typeof path !== 'string') return path
  if (path.startsWith('/files/')) {
    // Վերադարձնում ենք path-ը առանց /api պրեֆիքսի
    return path
  }
  return path
}

export function useHeroContent(): UseHeroContentReturn {
  const [content, setContent] = useState<HeroContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const hasFetched = useRef(false)

  useEffect(() => {
    // Skip if already fetched (Fast Refresh protection)
    if (hasFetched.current) return
    
    let cancelled = false

    const fetchHeroContent = async () => {
      try {
        setLoading(true)
        const res = await api.get<HeroContentResponse>('/api/v1/hero-content')
        const data = res.data?.data

        if (!cancelled) {
          if (data) {
            setContent({
              ...data,
              video_url: withOrigin(data.video_url)
            })
          } else {
            setContent(null)
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Failed to fetch hero content'))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
          hasFetched.current = true
        }
      }
    }

    fetchHeroContent()

    return () => {
      cancelled = true
    }
  }, [])

  return { content, loading, error }
}
