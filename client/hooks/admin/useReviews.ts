'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { useConfirm } from '@/components/providers/ConfirmProvider'
import type { DashboardTabId, Review } from '@/components/features/admin/types'
import { queryKeys } from '@/lib/queryKeys'

interface UseReviewsParams {
  activeTab: DashboardTabId
  allowed: boolean
}

const fetchReviews = async (): Promise<Review[]> => {
  const res = await api.get('/api/v1/reviews')
  const payload = res.data as { reviews?: unknown; data?: unknown }
  let list: unknown[] = []
  if (Array.isArray(payload.reviews)) {
    list = payload.reviews
  } else if (payload.data && typeof payload.data === 'object') {
    const inner = payload.data as { reviews?: unknown }
    if (Array.isArray(inner.reviews)) list = inner.reviews
  }
  return list as Review[]
}

export default function useReviews({ activeTab, allowed }: UseReviewsParams) {
  const confirm = useConfirm()
  const queryClient = useQueryClient()

  const { data: reviews = [], isLoading: isReviewsLoading } = useQuery({
    queryKey: queryKeys.reviews,
    queryFn: fetchReviews,
    enabled: allowed && activeTab === 'comments',
    staleTime: 1000 * 60 * 5,
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number | string) => {
      const ok = await confirm({
        title: 'Ջնջե՞լ մեկնաբանությունը',
        message: 'Գործողությունը չի վերադարձվի',
        confirmText: 'Ջնջել',
        cancelText: 'Չեղարկել',
        tone: 'danger'
      })
      if (!ok) throw new Error('Cancelled')
      await api.delete(`/api/v1/reviews/${id}`)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews })
    },
  })

  const relativeTime = (iso?: string) => {
    if (!iso) return ''
    const dt = new Date(iso)
    const diffMs = Date.now() - dt.getTime()
    const mins = Math.floor(diffMs / 60000)
    if (mins < 60) return `${mins} րոպե առաջ`
    const hrs = Math.floor(mins / 60)
    if (hrs < 48) return `${hrs} ժամ առաջ`
    const days = Math.floor(hrs / 24)
    return `${days} օր առաջ`
  }

  const isToday = (iso?: string) => {
    if (!iso) return false
    const d = new Date(iso)
    const n = new Date()
    return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate()
  }

  const handleDeleteReview = async (id: number | string) => {
    try {
      await deleteMutation.mutateAsync(id)
    } catch (err) {
      // User cancelled or error occurred
    }
  }

  return { reviews, isReviewsLoading, relativeTime, isToday, handleDeleteReview }
}
