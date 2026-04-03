'use client'

import type { DashboardTabId } from '@/components/features/admin/types'
import useReviews from '@/hooks/admin/useReviews'

interface UseReviewsTabProps {
  activeTab: DashboardTabId
  allowed: boolean
}

export function useReviewsTab({ activeTab, allowed }: UseReviewsTabProps) {
  const {
    reviews,
    isReviewsLoading,
    relativeTime,
    isToday,
    handleDeleteReview
  } = useReviews({ activeTab, allowed })

  return {
    reviews,
    isReviewsLoading,
    relativeTime,
    isToday,
    handleDeleteReview
  }
}
