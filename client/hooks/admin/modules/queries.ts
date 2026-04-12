// hooks/modules/queries.ts - Module query hooks

import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { queryKeys } from '@/lib/queryKeys'
import type { CourseOption, ModuleItem } from './types'
import { parseModules } from './utils'

export function useModulesQuery() {
  return useQuery<ModuleItem[]>({
    queryKey: queryKeys.modules,
    queryFn: async () => {
      const res = await api.get('/api/v1/modules')
      const modulesData = Array.isArray(res.data?.data)
        ? res.data.data
        : res.data?.data?.modules || res.data?.modules || []
      return parseModules(modulesData)
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function useModuleCoursesQuery() {
  return useQuery<CourseOption[]>({
    queryKey: [...queryKeys.courses, 'options'],
    queryFn: async () => {
      const res = await api.get('/api/v1/courses')
      const coursesData = Array.isArray(res.data?.data)
        ? res.data.data
        : res.data?.data?.courses || res.data?.courses || []
      const courses = Array.isArray(coursesData)
        ? coursesData
            .map((c: unknown) => {
              const cc = c as { id?: unknown; title?: unknown }
              return { id: String(cc?.id ?? ''), title: String(cc?.title ?? '') }
            })
            .filter((c: CourseOption) => c.id && c.title)
        : []
      return courses
    },
    staleTime: 1000 * 60 * 10,
  })
}
