'use client'

import { useEffect, useMemo, useState } from 'react'
import api from '@/lib/api'
import { useSettings as useGlobalSettings } from '@/context/SettingsContext' // moved from lib
import type { DashboardTabId, DayKey, SiteSettings, WorkingHoursSchedule } from '../_types'
import { fixLarge, withOrigin } from '../_utils/image'

interface UseSettingsParams {
  activeTab: DashboardTabId
  allowed: boolean
  showToast: (message: string, type?: 'success' | 'error') => void
}

export default function useSettings({ activeTab, allowed, showToast }: UseSettingsParams) {
  const extractErrorMessage = (err: unknown): string | null => {
    if (!err || typeof err !== 'object') return null
    const resp = (err as { response?: unknown }).response
    if (!resp || typeof resp !== 'object') return null
    const data = (resp as { data?: unknown }).data
    if (!data || typeof data !== 'object') return null
    const msg = (data as { message?: unknown }).message
    return typeof msg === 'string' ? msg : null
  }

  const { updateSettings } = useGlobalSettings()
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    siteName: 'WB Manager',
    phone: '+374 (98) 55-66-88',
    email: 'info@wbmanager.am',
    address: 'Երևան, Հայաստան',
    facebook: '',
    instagram: '',
    telegram: '',
    whatsapp: '',
    logo: '',
    logoFile: null
  })
  const defaultSchedule = useMemo<WorkingHoursSchedule>(() => {
    return {
      mon: { open: '09:00', close: '18:00', closed: false },
      tue: { open: '09:00', close: '18:00', closed: false },
      wed: { open: '09:00', close: '18:00', closed: false },
      thu: { open: '09:00', close: '18:00', closed: false },
      fri: { open: '09:00', close: '18:00', closed: false },
      sat: { open: '10:00', close: '14:00', closed: false },
      sun: { open: '00:00', close: '00:00', closed: true }
    }
  }, [])

  const [workingHoursSchedule, setWorkingHoursSchedule] = useState<WorkingHoursSchedule>(defaultSchedule)
  const [isSettingsLoading, setIsSettingsLoading] = useState(false)

  useEffect(() => {
    if (!allowed) return
    if (activeTab !== 'settings') return
    let cancelled = false
    ;(async () => {
      try {
        const res = await api.get('/api/v1/settings')
        const payload = res.data as { settings?: unknown }
        const data = payload.settings && typeof payload.settings === 'object' ? (payload.settings as Record<string, unknown>) : {}
        if (!cancelled) {
          setSiteSettings({
            siteName: typeof data.siteName === 'string' ? data.siteName : '',
            phone: typeof data.phone === 'string' ? data.phone : '',
            email: typeof data.email === 'string' ? data.email : '',
            address: typeof data.address === 'string' ? data.address : '',
            facebook: typeof data.facebook === 'string' ? data.facebook : '',
            instagram: typeof data.instagram === 'string' ? data.instagram : '',
            telegram: typeof data.telegram === 'string' ? data.telegram : '',
            whatsapp: typeof data.whatsapp === 'string' ? data.whatsapp : '',
            logo: withOrigin(fixLarge(typeof data.logo === 'string' ? data.logo : '')) || '',
            logoFile: null
          })
          try {
            const raw = data.workingHours ?? data.working_hours
            if (raw) {
              const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
              const merged = { ...defaultSchedule, ...parsed }
              setWorkingHoursSchedule(merged)
            } else {
              setWorkingHoursSchedule(defaultSchedule)
            }
          } catch {
            setWorkingHoursSchedule(defaultSchedule)
          }
        }
      } catch {}
    })()
    return () => {
      cancelled = true
    }
  }, [activeTab, allowed, defaultSchedule])

  const saveSettings = async () => {
    setIsSettingsLoading(true)
    try {
      const fd = new FormData()
      fd.append('siteName', siteSettings.siteName)
      fd.append('phone', siteSettings.phone)
      fd.append('email', siteSettings.email)
      fd.append('address', siteSettings.address)
      fd.append('workingHours', JSON.stringify(workingHoursSchedule))
      fd.append('facebook', siteSettings.facebook)
      fd.append('instagram', siteSettings.instagram)
      fd.append('telegram', siteSettings.telegram)
      fd.append('whatsapp', siteSettings.whatsapp)
      if (siteSettings.logoFile) {
        fd.append('logo', siteSettings.logoFile)
      }

      const res = await api.patch('/api/v1/settings', fd)
      const payload = res.data as { settings?: unknown }
      const data = payload.settings && typeof payload.settings === 'object' ? (payload.settings as Record<string, unknown>) : {}

      setSiteSettings((prev) => ({
        ...prev,
        siteName: typeof data.siteName === 'string' ? data.siteName : prev.siteName,
        phone: typeof data.phone === 'string' ? data.phone : prev.phone,
        email: typeof data.email === 'string' ? data.email : prev.email,
        address: typeof data.address === 'string' ? data.address : prev.address,
        facebook: typeof data.facebook === 'string' ? data.facebook : prev.facebook,
        instagram: typeof data.instagram === 'string' ? data.instagram : prev.instagram,
        telegram: typeof data.telegram === 'string' ? data.telegram : prev.telegram,
        whatsapp: typeof data.whatsapp === 'string' ? data.whatsapp : prev.whatsapp,
        logo: withOrigin(fixLarge(typeof data.logo === 'string' ? data.logo : '')) || prev.logo,
        logoFile: null
      }))
      try {
        const raw = data.workingHours ?? data.working_hours
        if (raw) {
          const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
          setWorkingHoursSchedule({ ...defaultSchedule, ...parsed })
        }
      } catch {}

      updateSettings({
        siteName: typeof data.siteName === 'string' ? data.siteName : undefined,
        logo: typeof data.logo === 'string' ? data.logo : undefined,
        facebook: typeof data.facebook === 'string' ? data.facebook : undefined,
        instagram: typeof data.instagram === 'string' ? data.instagram : undefined,
        telegram: typeof data.telegram === 'string' ? data.telegram : undefined,
        whatsapp: typeof data.whatsapp === 'string' ? data.whatsapp : undefined
      })

      showToast('Կարգավորումները պահպանվեցին', 'success')
    } catch (err: unknown) {
      const msg = extractErrorMessage(err) || 'Չհաջողվեց պահպանել'
      showToast(msg, 'error')
    } finally {
      setIsSettingsLoading(false)
    }
  }

  const setWorkingHoursField = (key: DayKey, patch: Partial<WorkingHoursSchedule[DayKey]>) => {
    setWorkingHoursSchedule((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }))
  }

  return {
    siteSettings,
    setSiteSettings,
    workingHoursSchedule,
    setWorkingHoursSchedule,
    setWorkingHoursField,
    defaultSchedule,
    isSettingsLoading,
    saveSettings
  }
}
