'use client'

import useReviews from '@/components/features/admin/hooks/useReviews'

interface UseReviewsTabProps {
  activeTab: string
  allowed: boolean
}

export function useReviewsTab({ activeTab, allowed }: UseReviewsTabProps) {
  const {
    reviews,
    isReviewsLoading,
    relativeTime,
    isToday,
    handleDeleteReview
  } = useReviews({ activeTab: activeTab as any, allowed })

  return {
    reviews,
    isReviewsLoading,
    relativeTime,
    isToday,
    handleDeleteReview
  }
}
