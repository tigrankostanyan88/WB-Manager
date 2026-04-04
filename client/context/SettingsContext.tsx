'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import api from '@/lib/api'
import { withOrigin } from '@/components/features/admin/_utils/image'

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

export function SettingsProvider({ children, initialSettings = {} }: { children: ReactNode; initialSettings?: SettingsShape }) {
  const [settings, setSettings] = useState<SettingsShape>(initialSettings)

  useEffect(() => {
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
