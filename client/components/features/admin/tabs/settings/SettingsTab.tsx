'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Camera, Clock, Facebook, Globe, Instagram, Mail, MapPin, MessageSquare, Phone, Save, Send, type LucideIcon } from 'lucide-react'
import type { DayKey, SiteSettings, WorkingHoursSchedule } from '@/components/features/admin/types'
import type { Dispatch, SetStateAction } from 'react'

type SettingsTextKey = 'siteName' | 'phone' | 'email' | 'address' | 'facebook' | 'instagram' | 'telegram' | 'whatsapp'

interface SettingsTabProps {
  siteSettings: SiteSettings
  setSiteSettings: Dispatch<SetStateAction<SiteSettings>>
  workingHoursSchedule: WorkingHoursSchedule
  setWorkingHoursSchedule: Dispatch<SetStateAction<WorkingHoursSchedule>>
  isSettingsLoading: boolean
  saveSettings: () => void
  onLogoFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function SettingsTab({
  siteSettings,
  setSiteSettings,
  workingHoursSchedule,
  setWorkingHoursSchedule,
  isSettingsLoading,
  saveSettings,
  onLogoFileSelect
}: SettingsTabProps) {
  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-black text-slate-900">Կայքի կարգավորումներ</h3>
      </div>

      <Card className="shadow-sm rounded-[2.5rem] bg-white border border-slate-100 overflow-hidden">
        <CardContent className="p-10">
          <div className="flex flex-col items-center mb-10">
            <div className="relative w-32 h-32 rounded-3xl overflow-hidden bg-slate-50 border-4 border-white shadow-2xl mb-4 group cursor-pointer">
              {siteSettings.logo ? (
                <Image
                  src={siteSettings.logo}
                  alt="Logo"
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <Globe className="w-12 h-12 opacity-50" />
                </div>
              )}
              <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-8 h-8 text-white" />
                <input type="file" accept="image/*" className="hidden" onChange={onLogoFileSelect} />
              </label>
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Կայքի լոգո</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { id: 'siteName', label: 'Կայքի անվանում', val: siteSettings.siteName, icon: Globe },
              { id: 'phone', label: 'Հեռախոսահամար', val: siteSettings.phone, icon: Phone },
              { id: 'email', label: 'Էլ. հասցե', val: siteSettings.email, icon: Mail },
              { id: 'address', label: 'Հասցե', val: siteSettings.address, icon: MapPin },
              { id: 'facebook', label: 'Facebook', val: siteSettings.facebook, icon: Facebook },
              { id: 'instagram', label: 'Instagram', val: siteSettings.instagram, icon: Instagram },
              { id: 'telegram', label: 'Telegram', val: siteSettings.telegram, icon: Send },
              { id: 'whatsapp', label: 'WhatsApp', val: siteSettings.whatsapp, icon: MessageSquare }
            ].map((field) => (
              <div key={field.id} className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">{field.label}</label>
                <div className="relative group">
                  <div className="absolute left-0 inset-y-0 w-12 flex items-center justify-center text-slate-400 group-focus-within:text-violet-600 transition-colors">
                    <field.icon className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={field.val}
                    onChange={(e) => setSiteSettings((prev) => ({ ...prev, [field.id]: e.target.value }))}
                    className="w-full h-14 bg-slate-50 border-none rounded-2xl pl-12 pr-4 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-violet-500 outline-none transition-all"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Աշխատանքային ժամեր (շաբաթական)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(
                [
                  { key: 'mon', label: 'Երկուշաբթի' },
                  { key: 'tue', label: 'Երեքշաբթի' },
                  { key: 'wed', label: 'Չորեքշաբթի' },
                  { key: 'thu', label: 'Հինգշաբթի' },
                  { key: 'fri', label: 'Ուրբաթ' },
                  { key: 'sat', label: 'Շաբաթ' },
                  { key: 'sun', label: 'Կիրակի' }
                ] as Array<{ key: DayKey; label: string }>
              ).map(({ key, label }) => {
                const day = workingHoursSchedule[key] || { open: '09:00', close: '18:00', closed: false }
                return (
                  <div key={key} className="flex items-center gap-3 bg-slate-50 rounded-2xl p-3">
                    <div className="w-28 text-xs font-black text-slate-500 uppercase tracking-widest">{label}</div>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-600">
                      <input
                        type="checkbox"
                        checked={day.closed}
                        onChange={(e) =>
                          setWorkingHoursSchedule((prev) => ({ ...prev, [key]: { ...prev[key], closed: e.target.checked } }))
                        }
                      />
                      Փակ
                    </label>
                    <input
                      type="time"
                      value={day.open}
                      disabled={day.closed}
                      onChange={(e) => setWorkingHoursSchedule((prev) => ({ ...prev, [key]: { ...prev[key], open: e.target.value } }))}
                      className="h-10 rounded-xl bg-white border border-slate-200 px-3 text-sm font-medium disabled:opacity-50"
                    />
                    <span className="text-xs font-bold text-slate-400">-</span>
                    <input
                      type="time"
                      value={day.close}
                      disabled={day.closed}
                      onChange={(e) => setWorkingHoursSchedule((prev) => ({ ...prev, [key]: { ...prev[key], close: e.target.value } }))}
                      className="h-10 rounded-xl bg-white border border-slate-200 px-3 text-sm font-medium disabled:opacity-50"
                    />
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-50">
            <Button
              onClick={saveSettings}
              disabled={isSettingsLoading}
              className="bg-slate-900 text-white hover:bg-slate-800 rounded-2xl h-14 px-10 font-black text-sm shadow-xl flex items-center gap-3 transition-all active:scale-95"
            >
              <Save className="w-5 h-5" />
              {isSettingsLoading ? 'Պահպանվում է...' : 'Պահպանել փոփոխությունները'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
