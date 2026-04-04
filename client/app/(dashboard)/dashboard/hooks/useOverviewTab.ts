'use client'

import useOverview from '@/hooks/admin/useOverview'
import type { DashboardTabId } from '@/components/features/admin/types'
import { Users, BookOpen, MessageSquare, UserCheck } from 'lucide-react'

export function useOverviewTab({ activeTab, allowed }: { activeTab: DashboardTabId; allowed: boolean }) {
  const { recentStudents, isRecentLoading, statCounts, relativeTime } = useOverview({ activeTab, allowed })

  // Transform statCounts to stats array format
  const stats = [
    {
      label: 'Ուսանողներ',
      value: String(statCounts.students),
      icon: Users,
      trend: '',
      color: 'text-violet-600',
      bg: 'bg-violet-50'
    },
    {
      label: 'Դասընթացներ',
      value: String(statCounts.courses),
      icon: BookOpen,
      trend: '',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      label: 'Կարծիքներ',
      value: String(statCounts.reviews),
      icon: MessageSquare,
      trend: '',
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    },
    {
      label: 'Ակտիվ օգտատերեր',
      value: String(statCounts.activeUsers),
      icon: UserCheck,
      trend: '',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    }
  ]

  return { stats, recentStudents, isRecentLoading, relativeTime }
}
