'use client'

import { useModules } from '@/hooks/admin/modules/useModules'
import type { DashboardTabId } from '@/components/features/admin/types'

export function useModulesTab({ activeTab, showToast }: { activeTab: DashboardTabId; showToast: (message: string, type?: 'success' | 'error') => void }) {
  return useModules({ activeTab, showToast })
}
