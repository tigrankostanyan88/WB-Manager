'use client'

import { useSettings } from '@/hooks/admin/useSettings'

export function useSettingsTab({ activeTab, allowed, showToast }: { activeTab: string; allowed: boolean; showToast: (message: string, type?: 'success' | 'error') => void }) {
  return useSettings({ activeTab, allowed, showToast })
}
