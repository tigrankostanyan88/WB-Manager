'use client'

// client/hooks/useInstructor.ts

import { useState, useEffect } from 'react'
import api from '@/lib/api'
import type { Instructor, InstructorStat, InstructorApiResponse } from '@/types/instructor'

interface UseInstructorReturn {
  instructor: Instructor
  loading: boolean
  error: Error | null
}

function fixLargePath(path?: string): string | undefined {
  if (!path || typeof path !== 'string') return path
  if (path.includes('/insotrutors/') && !path.includes('/insotrutors/large/')) {
    return path.replace('/insotrutors/', '/insotrutors/large/')
  }
  if (path.includes('/instructors/') && !path.includes('/instructors/large/')) {
    return path.replace('/instructors/', '/instructors/large/')
  }
  return path
}

function withOrigin(path?: string): string | undefined {
  if (!path || typeof path !== 'string') return path
  if (path.startsWith('/images/')) {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || '/api'
    if (/^https?:\/\//i.test(apiBase)) {
      const origin = apiBase.replace(/\/api.*$/, '')
      return `${origin}${path}`
    } else {
      const prefix = apiBase.endsWith('/') ? apiBase.slice(0, -1) : apiBase
      return `${prefix}${path}`
    }
  }
  return path
}

export function useInstructor(): UseInstructorReturn {
  const [instructor, setInstructor] = useState<Instructor>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    const fetchInstructor = async () => {
      try {
        setLoading(true)
        const res = await api.get<InstructorApiResponse>('/api/v1/instructor')
        const list = res.data?.instructors ?? []
        const row = list.length > 0 ? list[0] : null

        if (!row) {
          setInstructor({})
          return
        }

        let stats: InstructorStat[] = []
        if (row.stats_json) {
          try {
            stats = JSON.parse(row.stats_json) as InstructorStat[]
          } catch {
            stats = []
          }
        }

        if (!cancelled) {
          setInstructor({
            name: row.name ?? '',
            title: row.title ?? '',
            profession: row.profession ?? '',
            avatarUrl: withOrigin(fixLargePath(row.avatar_url)),
            description: row.description ?? '',
            stats,
          })
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Failed to fetch instructor'))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchInstructor()

    return () => {
      cancelled = true
    }
  }, [])

  return { instructor, loading, error }
}
