'use client'

import { useState, useCallback, useEffect } from 'react'
import type { SiteSettings, WorkingHoursSchedule, DashboardTabId } from '../_types'

interface UseSettingsProps {
  activeTab: DashboardTabId
  allowed: boolean
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
}

const defaultWorkingHours: WorkingHoursSchedule = {
  monday: { start: '09:00', end: '18:00', isOpen: true },
  tuesday: { start: '09:00', end: '18:00', isOpen: true },
  wednesday: { start: '09:00', end: '18:00', isOpen: true },
  thursday: { start: '09:00', end: '18:00', isOpen: true },
  friday: { start: '09:00', end: '18:00', isOpen: true },
  saturday: { start: '10:00', end: '14:00', isOpen: false },
  sunday: { start: '10:00', end: '14:00', isOpen: false }
}

export function useSettings({ activeTab, allowed, showToast }: UseSettingsProps) {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    siteName: 'WB Manager',
    logo: '',
    contactEmail: '',
    contactPhone: '',
    workingHours: defaultWorkingHours,
    socialLinks: {}
  })
  const [workingHoursSchedule, setWorkingHoursSchedule] = useState<WorkingHoursSchedule>(defaultWorkingHours)
  const [isSettingsLoading, setIsSettingsLoading] = useState(false)

  const fetchSettings = useCallback(async () => {
    if (activeTab !== 'settings' || !allowed) return
    setIsSettingsLoading(true)
    try {
      const res = await fetch('/api/settings')
      const data = await res.json()
      if (data.settings) {
        setSiteSettings(data.settings)
        setWorkingHoursSchedule(data.settings.workingHours || defaultWorkingHours)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setIsSettingsLoading(false)
    }
  }, [activeTab, allowed])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const saveSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...siteSettings, workingHours: workingHoursSchedule })
      })
      if (res.ok) {
        showToast('Կարգավորումները պահպանված են')
      } else {
        showToast('Սխալ է տեղի ունեցել', 'error')
      }
    } catch {
      showToast('Սխալ է տեղի ունեցել', 'error')
    }
  }, [siteSettings, workingHoursSchedule, showToast])

  return {
    siteSettings,
    setSiteSettings,
    workingHoursSchedule,
    setWorkingHoursSchedule,
    isSettingsLoading,
    saveSettings
  }
}
