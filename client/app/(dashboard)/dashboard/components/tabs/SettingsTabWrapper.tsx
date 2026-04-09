'use client'

import { SettingsTab } from '@/components/features/admin/tabs/settings/SettingsTab'
import type { SiteSettings, WorkingHoursSchedule } from '@/components/features/admin/types'
import type { Dispatch, SetStateAction } from 'react'

interface SettingsTabWrapperProps {
  allowed: boolean
  showToast: (message: string, type?: 'success' | 'error') => void
  onLogoFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  siteSettings: SiteSettings
  setSiteSettings: Dispatch<SetStateAction<SiteSettings>>
  workingHoursSchedule: WorkingHoursSchedule
  setWorkingHoursSchedule: Dispatch<SetStateAction<WorkingHoursSchedule>>
  isSettingsLoading: boolean
  saveSettings: () => void
}

export function SettingsTabWrapper({ 
  allowed, 
  showToast, 
  onLogoFileSelect,
  siteSettings,
  setSiteSettings,
  workingHoursSchedule,
  setWorkingHoursSchedule,
  isSettingsLoading,
  saveSettings
}: SettingsTabWrapperProps) {
  return (
    <SettingsTab
      siteSettings={siteSettings}
      setSiteSettings={setSiteSettings}
      workingHoursSchedule={workingHoursSchedule}
      setWorkingHoursSchedule={setWorkingHoursSchedule}
      isSettingsLoading={isSettingsLoading}
      saveSettings={saveSettings}
      onLogoFileSelect={onLogoFileSelect}
    />
  )
}
