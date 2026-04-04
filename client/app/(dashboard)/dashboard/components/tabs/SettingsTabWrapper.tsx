'use client'

import { SettingsTab } from '@/components/features/admin/tabs/settings/SettingsTab'
import { useSettingsTab } from '@/app/(dashboard)/dashboard/hooks'

interface SettingsTabWrapperProps {
  allowed: boolean
  showToast: (message: string, type?: 'success' | 'error') => void
  onLogoFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function SettingsTabWrapper({ allowed, showToast, onLogoFileSelect }: SettingsTabWrapperProps) {
  const settings = useSettingsTab({ activeTab: 'settings', allowed, showToast })
  return (
    <SettingsTab
      siteSettings={settings.siteSettings}
      setSiteSettings={settings.setSiteSettings}
      workingHoursSchedule={settings.workingHoursSchedule}
      setWorkingHoursSchedule={settings.setWorkingHoursSchedule}
      isSettingsLoading={settings.isSettingsLoading}
      saveSettings={settings.saveSettings}
      onLogoFileSelect={onLogoFileSelect}
    />
  )
}
