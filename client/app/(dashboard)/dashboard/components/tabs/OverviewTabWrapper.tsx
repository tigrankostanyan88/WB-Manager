'use client'

import { OverviewTab } from '@/components/features/admin/tabs/overview/OverviewTab'
import { OverviewTabSkeleton } from '@/components/features/admin/tabs/overview/OverviewTabSkeleton'
import { useOverviewTab } from '@/app/(dashboard)/dashboard/hooks'

interface OverviewTabWrapperProps {
  allowed: boolean
}

export function OverviewTabWrapper({ allowed }: OverviewTabWrapperProps) {
  const overview = useOverviewTab({ activeTab: 'overview', allowed })
  
  if (overview.isRecentLoading) {
    return <OverviewTabSkeleton />
  }
  
  return (
    <OverviewTab
      stats={overview.stats}
      recentStudents={overview.recentStudents}
      isRecentLoading={overview.isRecentLoading}
      relativeTime={overview.relativeTime}
    />
  )
}
