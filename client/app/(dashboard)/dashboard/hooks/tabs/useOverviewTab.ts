'use client'

import { useMemo } from 'react'
import useSettings from '@/hooks/admin/useSettings'
import useOverview from '@/hooks/admin/useOverview'
import type { DashboardTabId } from '@/components/features/admin/types'
import { createStats } from '@/app/(dashboard)/dashboard/lib/menuItems'

interface UseOverviewTabProps {
  activeTab: DashboardTabId
  allowed: boolean
}

export function useOverviewTab({ activeTab, allowed }: UseOverviewTabProps) {
  const { recentStudents, isRecentLoading, statCounts, relativeTime } = useOverview({
    activeTab,
    allowed
  })

  const stats = useMemo(() => createStats(statCounts), [statCounts])

  return {
    stats,
    recentStudents,
    isRecentLoading,
    relativeTime
  }
}
