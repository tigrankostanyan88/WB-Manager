'use client'

import { useInstructorQuery } from '@/hooks/queries/useInstructorQuery'
import type { Instructor } from '@/types/domain'

interface UseInstructorReturn {
  instructor: Instructor
  loading: boolean
  error: Error | null
}

export function useInstructor(): UseInstructorReturn {
  const { data, isLoading, error } = useInstructorQuery(true)

  return {
    instructor: data ?? { name: '', stats: [] },
    loading: isLoading,
    error: error ?? null,
  }
}
