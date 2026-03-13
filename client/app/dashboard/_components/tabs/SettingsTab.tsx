'use client'

import { Save, Upload } from 'lucide-react'
import type { SiteSettings, WorkingHoursSchedule } from '../../_types'

interface SettingsTabProps {
  siteSettings: SiteSettings
  setSiteSettings: React.Dispatch<React.SetStateAction<SiteSettings>>
  workingHoursSchedule: WorkingHoursSchedule
  setWorkingHoursSchedule: React.Dispatch<React.SetStateAction<WorkingHoursSchedule>>
  isSettingsLoading: boolean
  saveSettings: () => void
  onLogoFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function SettingsTab({
  siteSettings,
  setSiteSettings,
  workingHoursSchedule,
  setWorkingHoursSchedule,
  isSettingsLoading,
  saveSettings,
  onLogoFileSelect
}: SettingsTabProps) {
  if (isSettingsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">Կարգավորումներ</h2>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Կայքի անուն</label>
          <input
            type="text"
            value={siteSettings.siteName}
            onChange={(e) => setSiteSettings(prev => ({ ...prev, siteName: e.target.value }))}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Կապվեք էլ. փոստ</label>
          <input
            type="email"
            value={siteSettings.contactEmail || ''}
            onChange={(e) => setSiteSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Հեռախոս</label>
          <input
            type="tel"
            value={siteSettings.contactPhone || ''}
            onChange={(e) => setSiteSettings(prev => ({ ...prev, contactPhone: e.target.value }))}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Լոգո</label>
          <div className="flex items-center gap-4">
            {siteSettings.logo ? (
              <img src={siteSettings.logo} alt="Logo" className="w-16 h-16 rounded-xl object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center">
                <Upload className="w-6 h-6 text-slate-400" />
              </div>
            )}
            <label className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={onLogoFileSelect}
                className="hidden"
              />
              Փոփոխել
            </label>
          </div>
        </div>

        <button
          onClick={saveSettings}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 transition-colors"
        >
          <Save className="w-5 h-5" />
          Պահպանել
        </button>
      </div>
    </div>
  )
}
