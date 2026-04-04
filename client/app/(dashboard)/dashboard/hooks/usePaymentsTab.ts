'use client'

import { usePayments } from '@/hooks/admin/usePayments'

export function usePaymentsTab({ activeTab, allowed }: { activeTab: string; allowed: boolean }) {
  return usePayments({ activeTab, allowed })
}
