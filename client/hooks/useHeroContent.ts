'use client'

import { useHeroContentQuery } from '@/hooks/queries/useHeroContentQuery'
import type { HeroContent } from '@/types/domain'

interface UseHeroContentReturn {
  content: HeroContent | null
  loading: boolean
  error: Error | null
}

export function useHeroContent(): UseHeroContentReturn {
  const { data, isLoading, error } = useHeroContentQuery(true)

  return {
    content: data ?? null,
    loading: isLoading,
    error: error ?? null,
  }
}
