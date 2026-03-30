'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import type { FormEvent } from 'react'

interface PasswordData {
  passwordCurrent: string
  password: string
  passwordConfirm: string
}

interface PasswordModalProps {
  open: boolean
  isUpdating: boolean
  passwordData: PasswordData
  onClose: () => void
  onSubmit: (e: FormEvent) => void
  onChange: (id: keyof PasswordData, value: string) => void
}

export function PasswordModal({ open, isUpdating, passwordData, onClose, onSubmit, onChange }: PasswordModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <form onSubmit={onSubmit} className="p-10 space-y-6">
              <div className="text-center space-y-2">
                <h4 className="text-2xl font-black text-slate-900">Փոխել գաղտնաբառը</h4>
                <p className="text-sm font-medium text-slate-500">Մուտքագրեք ձեր նոր գաղտնաբառը</p>
              </div>

              <div className="space-y-4">
                {(
                  [
                    { id: 'passwordCurrent', label: 'Ընթացիկ գաղտնաբառ', placeholder: '********', type: 'password' },
                    { id: 'password', label: 'Նոր գաղտնաբառ', placeholder: '********', type: 'password' },
                    { id: 'passwordConfirm', label: 'Կրկնել նոր գաղտնաբառը', placeholder: '********', type: 'password' },
                  ] as const
                ).map((field) => (
                  <div key={field.id} className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">{field.label}</label>
                    <input
                      required
                      type={field.type}
                      placeholder={field.placeholder}
                      value={passwordData[field.id]}
                      onChange={(e) => onChange(field.id, e.target.value)}
                      className="w-full h-14 bg-slate-50 border-b-2 border-slate-100 rounded-xl px-6 text-sm font-bold focus:border-violet-500 outline-none transition-all"
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="button" onClick={onClose} className="flex-1 bg-slate-50 text-slate-500 hover:bg-slate-100 rounded-xl h-14 font-black">
                  Չեղարկել
                </Button>
                <Button type="submit" disabled={isUpdating} className="flex-1 bg-violet-600 hover:bg-violet-700 text-white rounded-xl h-14 font-black shadow-lg shadow-violet-200">
                  {isUpdating ? 'Պահպանվում է...' : 'Թարմացնել'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
