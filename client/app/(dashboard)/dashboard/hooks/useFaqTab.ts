'use client'

import useFaq from '@/hooks/admin/useFaq'
import type { DashboardTabId } from '@/components/features/admin/types'

export function useFaqTab({ activeTab, allowed, showToast }: { activeTab: DashboardTabId; allowed: boolean; showToast: (message: string, type?: 'success' | 'error') => void }) {
  return useFaq({ activeTab, allowed, showToast })
}
