'use client'

import type { DashboardTabId } from '@/components/features/admin/types'
import { useCourses } from '@/hooks/admin/useCourses'

export function useCoursesTab({ activeTab, showToast }: { activeTab: DashboardTabId; showToast: (message: string, type?: 'success' | 'error') => void }) {
  return useCourses({ activeTab, showToast })
}
