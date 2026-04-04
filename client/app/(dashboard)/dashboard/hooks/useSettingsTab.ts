'use client'

import type { DashboardTabId } from '@/components/features/admin/types'
import useSettings from '@/hooks/admin/useSettings'

export function useSettingsTab({ activeTab, allowed, showToast }: { activeTab: DashboardTabId; allowed: boolean; showToast: (message: string, type?: 'success' | 'error') => void }) {
  return useSettings({ activeTab, allowed, showToast })
}
