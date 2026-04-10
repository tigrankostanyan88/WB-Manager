'use client'

import { useCourseRegistrations } from '@/hooks/admin/useCourseRegistrations'

export function useEnrollmentsTab({ activeTab, allowed }: { activeTab: string; allowed: boolean }) {
  return useCourseRegistrations({ activeTab, allowed })
}
