'use client'

import useSettings from '@/components/features/admin/hooks/useSettings'

interface UseSettingsTabProps {
  activeTab: string
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
  } = useSettings({ activeTab: activeTab as any, allowed, showToast })

  return {
    siteSettings,
    setSiteSettings,
    workingHoursSchedule,
    setWorkingHoursSchedule,
    isSettingsLoading,
    saveSettings
  }
}
