'use client'

import { motion } from 'framer-motion'
import { Mail, MapPin, MessageSquare, Phone, Shield, User as UserIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import React from 'react'

interface SettingsUser {
  name: string
  email: string
  phone: string
  address: string
  bio?: string
}

interface SettingsTabProps {
  user: SettingsUser
  isUpdating: boolean
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  onShowPasswordModal: () => void
}

export default function SettingsTab({ user, isUpdating, onSubmit, onShowPasswordModal }: SettingsTabProps) {
  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="space-y-8"
    >
      <h3 className="text-4xl font-black text-slate-900 tracking-tight px-2">Կարգավորումներ</h3>
      <Card className="shadow-xl shadow-slate-200/50 rounded-2xl bg-white overflow-hidden border border-white/60">
        <form onSubmit={onSubmit} className="p-12 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {[
              { id: 'name', label: 'Անուն Ազգանուն', val: user.name, icon: UserIcon, placeholder: 'Ձեր անունը' },
              { id: 'email', label: 'Էլ. հասցե', val: user.email, icon: Mail, placeholder: 'example@mail.com', type: 'email' },
              { id: 'phone', label: 'Հեռախոսահամար', val: user.phone, icon: Phone, placeholder: '+374 (__) __-__-__', type: 'tel' },
              { id: 'address', label: 'Հասցե', val: user.address, icon: MapPin, placeholder: 'Քաղաք, փողոց...' },
              { id: 'bio', label: 'Կենսագրություն', val: user.bio, icon: MessageSquare, placeholder: 'Մի քանի բառ ձեր մասին...', isTextArea: true },
            ].map((field) => (
              <div key={field.id} className={cn('group space-y-3', field.isTextArea ? 'md:col-span-2' : '')}>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-violet-600 transition-colors">
                  {field.label}
                </label>
                <div className="relative">
                  <div className={cn('absolute left-0 top-0 w-14 flex items-center justify-center text-slate-400 group-focus-within:text-violet-600 transition-colors', field.isTextArea ? 'h-14' : 'bottom-0')}>
                    <field.icon className="w-5 h-5" />
                  </div>
                  {field.isTextArea ? (
                    <textarea
                      name={field.id}
                      defaultValue={field.val}
                      placeholder={field.placeholder}
                      rows={3}
                      className="w-full bg-slate-50 border-b-2 border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-base font-bold text-slate-900 focus:bg-white focus:border-violet-500 focus:shadow-[0_10px_40px_-10px_rgba(124,58,237,0.1)] outline-none transition-all duration-300 resize-none"
                    />
                  ) : (
                    <input
                      name={field.id}
                      type={field.type || 'text'}
                      defaultValue={field.val}
                      placeholder={field.placeholder}
                      className="w-full h-16 bg-slate-50 border-b-2 border-slate-100 rounded-2xl pl-14 pr-6 text-base font-bold text-slate-900 focus:bg-white focus:border-violet-500 focus:shadow-[0_10px_40px_-10px_rgba(124,58,237,0.1)] outline-none transition-all duration-300"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div onClick={onShowPasswordModal} className="flex items-center gap-3 text-slate-400 group cursor-pointer hover:text-violet-600 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-violet-50 transition-colors">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold">Փոխել գաղտնաբառը</span>
            </div>
            <Button
              type="submit"
              disabled={isUpdating}
              className="w-full sm:w-auto rounded-xl bg-violet-600 hover:bg-violet-700 font-black px-12 h-14 text-white shadow-2xl shadow-violet-200 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
            >
              {isUpdating ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Պահպանվում է...</span>
                </div>
              ) : (
                'Պահպանել փոփոխությունները'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  )
}
