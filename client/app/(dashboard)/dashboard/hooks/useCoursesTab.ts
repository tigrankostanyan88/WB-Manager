'use client'

import { useCourses } from '@/hooks/admin/useCourses'

export function useCoursesTab({ activeTab, showToast }: { activeTab: string; showToast: (message: string, type?: 'success' | 'error') => void }) {
  return useCourses({ activeTab, showToast })
}
