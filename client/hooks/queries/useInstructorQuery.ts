'use client'

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import api from '@/lib/api'
import { queryKeys } from '@/lib/queryKeys'
import type { Instructor, InstructorStat } from '@/types/domain'

interface InstructorApiItem {
  title?: string
  name?: string
  profession?: string
  description?: string
  badge_text?: string
  avatar_url?: string
  stats_json?: string
  stats?: InstructorStat[]
}

interface InstructorApiResponse {
  instructors?: InstructorApiItem[]
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

function parseStats(statsJson?: string): InstructorStat[] {
  if (!statsJson) return []
  try {
    const parsed = JSON.parse(statsJson) as InstructorStat[] | unknown
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function transformInstructorData(data: InstructorApiItem | undefined): Instructor {
  if (!data) {
    return { name: '' }
  }

  const stats = data.stats_json ? parseStats(data.stats_json) : (data.stats || [])

  return {
    name: data.name ?? '',
    title: data.title ?? '',
    profession: data.profession ?? '',
    description: data.description ?? '',
    badgeText: data.badge_text ?? '',
    avatarUrl: withOrigin(fixLargePath(data.avatar_url)),
    avatar: withOrigin(fixLargePath(data.avatar_url)),
    stats,
  }
}

// Query hook for reading instructor data
export function useInstructorQuery(enabled = true) {
  return useQuery<Instructor, Error>({
    queryKey: queryKeys.instructor,
    queryFn: async () => {
      const res = await api.get<InstructorApiResponse>('/api/v1/instructor')
      const list = res.data?.instructors ?? []
      const first = list[0]
      return transformInstructorData(first)
    },
    staleTime: 1000 * 60 * 5,
    enabled,
  })
}

// Mutation hook for saving instructor data
export function useSaveInstructorMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await api.post('/api/v1/instructor', formData)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.instructor })
    },
  })
}

// Re-export transform utilities for admin use
export { fixLargePath, withOrigin, parseStats, transformInstructorData }
