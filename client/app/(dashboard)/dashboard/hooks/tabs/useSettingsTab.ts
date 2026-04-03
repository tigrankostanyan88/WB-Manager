'use client'

import type { DashboardTabId } from '@/components/features/admin/types'
import useSettings from '@/hooks/admin/useSettings'

interface UseSettingsTabProps {
  activeTab: DashboardTabId
  allowed: boolean
  showToast: (message: string, type?: 'success' | 'error') => void
}

export function useSettingsTab({ activeTab, allowed, showToast }: UseSettingsTabProps) {
  const {
    siteSettings,
    setSiteSettings,
    workingHoursSchedule,
    setWorkingHoursSchedule,
    isSettingsLoading,
    saveSettings
  } = useSettings({ activeTab, allowed, showToast })

  return {
    siteSettings,
    setSiteSettings,
    workingHoursSchedule,
    setWorkingHoursSchedule,
    isSettingsLoading,
    saveSettings
  }
}
