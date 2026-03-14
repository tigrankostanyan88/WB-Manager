'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { useConfirm } from '@/components/ConfirmProvider'
import type { DashboardTabId, Review } from '../_types'

interface UseReviewsParams {
  activeTab: DashboardTabId
  allowed: boolean
}

export default function useReviews({ activeTab, allowed }: UseReviewsParams) {
  const confirm = useConfirm()
  const [reviews, setReviews] = useState<Review[]>([])
  const [isReviewsLoading, setIsReviewsLoading] = useState(false)

  useEffect(() => {
    if (!allowed) return
    if (activeTab !== 'comments') return
    let cancelled = false
    ;(async () => {
      setIsReviewsLoading(true)
      try {
        const res = await api.get('/api/v1/reviews')
        const payload = res.data as { reviews?: unknown; data?: unknown }
        let list: unknown[] = []
        if (Array.isArray(payload.reviews)) {
          list = payload.reviews
        } else if (payload.data && typeof payload.data === 'object') {
          const inner = payload.data as { reviews?: unknown }
          if (Array.isArray(inner.reviews)) list = inner.reviews
        }
        if (!cancelled) setReviews(list as Review[])
      } finally {
        if (!cancelled) setIsReviewsLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [activeTab, allowed])

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
    const ok = await confirm({
      title: 'Ջնջե՞լ մեկնաբանությունը',
      message: 'Գործողությունը չի վերադարձվի',
      confirmText: 'Ջնջել',
      cancelText: 'Չեղարկել',
      tone: 'danger'
    })
    if (!ok) return
    await api.delete(`/api/v1/reviews/${id}`)
    setReviews((prev) => prev.filter((r) => String(r.id) !== String(id)))
  }

  return { reviews, isReviewsLoading, relativeTime, isToday, handleDeleteReview }
}
