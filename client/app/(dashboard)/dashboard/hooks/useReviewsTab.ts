'use client'

import useReviews from '@/hooks/admin/useReviews'
import type { DashboardTabId } from '@/components/features/admin/types'

export function useReviewsTab({ activeTab, allowed }: { activeTab: DashboardTabId; allowed: boolean }) {
  return useReviews({ activeTab, allowed })
}
