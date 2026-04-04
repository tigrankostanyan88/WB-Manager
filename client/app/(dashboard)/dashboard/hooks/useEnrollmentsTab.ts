'use client'

import { useEnrollments } from '@/hooks/admin/useEnrollments'

export function useEnrollmentsTab({ activeTab, allowed }: { activeTab: string; allowed: boolean }) {
  return useEnrollments({ activeTab, allowed })
}
