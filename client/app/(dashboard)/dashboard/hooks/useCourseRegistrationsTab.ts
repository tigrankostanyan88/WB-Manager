'use client'

import { useCourseRegistrations } from '@/hooks/admin/useCourseRegistrations'

export function useCourseRegistrationsTab({ activeTab, allowed }: { activeTab: string; allowed: boolean }) {
  return useCourseRegistrations({ activeTab, allowed })
}
