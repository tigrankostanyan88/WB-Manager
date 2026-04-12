'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'
import type { HeroContent } from '@/types/domain'

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

function normalizeVideoUrl(path?: string): string | undefined {
  if (!path || typeof path !== 'string') return path
  if (path.startsWith('/files/')) return path
  return path
}

export function useHeroContent(): UseHeroContentReturn {
  const [content, setContent] = useState<HeroContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
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
              video_url: normalizeVideoUrl(data.video_url)
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
