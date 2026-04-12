'use client'

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import api from '@/lib/api'
import { queryKeys } from '@/lib/queryKeys'
import type { HeroContent } from '@/types/domain'

interface HeroContentApiResponse {
  status: string
  data: HeroContent | null
  message?: string
}

function normalizeVideoUrl(path?: string): string | undefined {
  if (!path || typeof path !== 'string') return path
  if (path.startsWith('/files/')) return path
  return path
}

function transformHeroContent(data: HeroContent | null): HeroContent | null {
  if (!data) return null
  return {
    ...data,
    video_url: normalizeVideoUrl(data.video_url)
  }
}

// Query hook for reading hero content
export function useHeroContentQuery(enabled = true) {
  return useQuery<HeroContent | null, Error>({
    queryKey: queryKeys.heroContent,
    queryFn: async () => {
      const res = await api.get<HeroContentApiResponse>('/api/v1/hero-content')
      return transformHeroContent(res.data?.data || null)
    },
    staleTime: 1000 * 60 * 5,
    enabled,
  })
}

// Mutation hook for updating hero content
export function useUpdateHeroContentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await api.patch('/api/v1/hero-content', formData)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.heroContent })
    },
  })
}

// Mutation hook for deleting hero content
export function useDeleteHeroContentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const res = await api.delete('/api/v1/hero-content')
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.heroContent })
    },
  })
}

// Re-export transform utility
export { normalizeVideoUrl }
