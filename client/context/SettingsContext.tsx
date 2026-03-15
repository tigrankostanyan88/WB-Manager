'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import api from '@/lib/api'

type SettingsShape = {
  siteName?: string
  phone?: string
  email?: string
  address?: string
  bankCard?: string
  facebook?: string
  instagram?: string
  telegram?: string
  whatsapp?: string
  workingHours?: string
  logo?: string
}

interface SettingsContextType {
  settings: SettingsShape
  updateSettings: (newSettings: Partial<SettingsShape>) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

const withOrigin = (url: string) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  if (url.startsWith('/api/')) return url
  if (url.startsWith('/images/')) return `/api${url}`
  return url
}

export function SettingsProvider({ children, initialSettings = {} }: { children: ReactNode; initialSettings?: SettingsShape }) {
  const [settings, setSettings] = useState<SettingsShape>(initialSettings)

  useEffect(() => {
    // On the client-side, after initial render, we can update from localStorage or API
    // For now, we just ensure the logo path is correct on the client as well.
    if (initialSettings.logo && !initialSettings.logo.startsWith('http')) {
      setSettings(prev => ({...prev, logo: withOrigin(initialSettings.logo || '')}))
    }
  }, [initialSettings.logo])

  const updateSettings = (newSettings: Partial<SettingsShape>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings,
      logo: newSettings.logo ? withOrigin(newSettings.logo) : prev.logo
    }))
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
