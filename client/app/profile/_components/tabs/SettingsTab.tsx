'use client'

import { motion } from 'framer-motion'
import { Mail, MapPin, Phone, Shield, User as UserIcon, Save } from 'lucide-react'
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
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
    >
      <Card className="shadow-xl shadow-slate-200/50 rounded-3xl bg-white overflow-hidden border-0">
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-6">
          <h2 className="text-2xl font-black text-white">Անձնական տվյալներ</h2>
          <p className="text-violet-100 text-sm mt-1">Թարմացրեք ձեր անձնական տեղեկությունները</p>
        </div>
        
        <form onSubmit={onSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[ 
              { id: 'name', label: 'Անուն', val: user.name, icon: UserIcon, placeholder: 'Ձեր անունը', type: 'text' },
              { id: 'email', label: 'Էլ. փոստ', val: user.email, icon: Mail, placeholder: 'example@email.com', type: 'email' },
              { id: 'phone', label: 'Հեռախոսահամար', val: user.phone, icon: Phone, placeholder: '+374 XX XXX XXX', type: 'tel' },
              { id: 'address', label: 'Հասցե', val: user.address, icon: MapPin, placeholder: 'Ձեր հասցեն', type: 'text' },
            ].map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-bold text-slate-700 mb-2">{field.label}</label>
                <div className="relative group">
                  <div className={cn('absolute left-0 top-0 w-14 flex items-center justify-center text-slate-400 group-focus-within:text-violet-600 transition-colors bottom-0')}>
                    <field.icon className="w-5 h-5" />
                  </div>
                  <input
                    name={field.id}
                    type={field.type || 'text'}
                    defaultValue={field.val}
                    placeholder={field.placeholder}
                    className="w-full h-16 bg-slate-50 border-2 border-slate-200 rounded-2xl pl-14 pr-6 text-base font-bold text-slate-900 focus:bg-white focus:border-violet-500 focus:shadow-[0_10px_40px_-10px_rgba(124,58,237,0.1)] outline-none transition-all duration-300"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div 
              onClick={onShowPasswordModal} 
              className="flex items-center gap-3 text-slate-500 group cursor-pointer hover:text-violet-600 transition-all p-3 rounded-xl hover:bg-violet-50"
            >
              <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center group-hover:bg-violet-200 transition-colors">
                <Shield className="w-6 h-6 text-violet-600" />
              </div>
              <div>
                <span className="text-sm font-bold block">Փոխել գաղտնաբառը</span>
                <span className="text-xs text-slate-400">Թարմացրեք ձեր գաղտնաբառը</span>
              </div>
            </div>
            <Button
              type="submit"
              disabled={isUpdating}
              className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 font-black px-12 h-14 text-white shadow-2xl shadow-violet-200 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
            >
              {isUpdating ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  <span>Պահպանվում է...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="w-5 h-5" />
                  <span>Պահպանել փոփոխությունները</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  )
}
