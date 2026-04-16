'use client'

import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { queryKeys } from '@/lib/queryKeys'
import type { FAQ } from '@/components/features/admin/types'

interface FaqResponse {
  faqs?: FAQ[]
}

export function useFaqQuery() {
  return useQuery({
    queryKey: queryKeys.faq,
    queryFn: async () => {
      const res = await api.get<FaqResponse>('/api/v1/faq')
      return Array.isArray(res.data.faqs) ? res.data.faqs : []
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
