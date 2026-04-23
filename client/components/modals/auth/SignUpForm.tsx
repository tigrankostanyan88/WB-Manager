// modals/auth/SignUpForm.tsx - Sign up form component

import { Mail, Lock, User as UserIcon, Phone, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import type { AuthFormData } from './types'

interface SignUpFormProps {
  formData: AuthFormData
  isLoading: boolean
  error: string | null
  fieldErrors?: Record<string, string>
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
  onToggleMode: () => void
}

export function SignUpForm({
  formData,
  isLoading,
  error,
  fieldErrors = {},
  onInputChange,
  onSubmit,
  onToggleMode
}: SignUpFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
            Անուն Ազգանուն
          </label>
          <div className="relative">
            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              required
              name="name"
              value={formData.name}
              onChange={onInputChange}
              type="text"
              placeholder="Արմեն Արմենյան"
              className={`w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border ${fieldErrors.name ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-violet-500 focus:ring-violet-500/10'} focus:ring-4 outline-none transition-all placeholder:text-slate-300 text-slate-700 font-medium`}
            />
            {fieldErrors.name && (
              <p className="text-red-500 text-xs mt-1 ml-1">{fieldErrors.name}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
            Հեռախոս
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              required
              name="phone"
              value={formData.phone}
              onChange={onInputChange}
              type="tel"
              placeholder="099 99 99 99"
              className={`w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border ${fieldErrors.phone ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-violet-500 focus:ring-violet-500/10'} focus:ring-4 outline-none transition-all placeholder:text-slate-300 text-slate-700 font-medium`}
            />
            {fieldErrors.phone && (
              <p className="text-red-500 text-xs mt-1 ml-1">{fieldErrors.phone}</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
          Էլ. հասցե
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            name="email"
            value={formData.email}
            onChange={onInputChange}
            type="email"
            placeholder="example@gmail.com"
            className={`w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border ${fieldErrors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-violet-500 focus:ring-violet-500/10'} focus:ring-4 outline-none transition-all placeholder:text-slate-300 text-slate-700 font-medium`}
          />
          {fieldErrors.email && (
            <p className="text-red-500 text-xs mt-1 ml-1">{fieldErrors.email}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
          Գաղտնաբառ
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            name="password"
            value={formData.password}
            onChange={onInputChange}
            type="password"
            placeholder="••••••••"
            className={`w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border ${fieldErrors.password ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-violet-500 focus:ring-violet-500/10'} focus:ring-4 outline-none transition-all placeholder:text-slate-300 text-slate-700 font-medium`}
          />
          {fieldErrors.password && (
            <p className="text-red-500 text-xs mt-1 ml-1">{fieldErrors.password}</p>
          )}
        </div>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm font-medium text-center bg-red-50 py-2.5 rounded-xl border border-red-100"
        >
          {error}
        </motion.p>
      )}

      <Button
        disabled={isLoading}
        className="w-full py-7 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all font-bold text-lg active:scale-[0.98] flex items-center justify-center gap-2"
      >
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Ստեղծել հաշիվ'}
      </Button>

      <p className="text-center text-slate-500 text-sm font-medium pt-4">
        Արդեն ունե՞ք հաշիվ{' '}
        <button
          type="button"
          onClick={onToggleMode}
          className="text-violet-600 hover:text-violet-700 font-bold underline underline-offset-4 decoration-2 decoration-violet-100 hover:decoration-violet-200 transition-all"
        >
          Մուտք
        </button>
      </p>
    </form>
  )
}
