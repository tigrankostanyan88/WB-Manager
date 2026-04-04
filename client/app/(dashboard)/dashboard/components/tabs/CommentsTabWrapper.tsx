'use client'

import { CommentsTab } from '@/components/features/admin/tabs/comments/CommentsTab'
import { CommentsTabSkeleton } from '@/components/features/admin/tabs/comments/CommentsTabSkeleton'
import { useReviewsTab } from '@/app/(dashboard)/dashboard/hooks'

interface CommentsTabWrapperProps {
  allowed: boolean
}

export function CommentsTabWrapper({ allowed }: CommentsTabWrapperProps) {
  const reviews = useReviewsTab({ activeTab: 'comments', allowed })
  
  if (reviews.isReviewsLoading) {
    return <CommentsTabSkeleton />
  }
  
  return (
    <CommentsTab
      reviews={reviews.reviews}
      isReviewsLoading={reviews.isReviewsLoading}
      relativeTime={reviews.relativeTime}
      onDeleteReview={reviews.handleDeleteReview}
    />
  )
}
