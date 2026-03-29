// modals/auth/SignInForm.tsx - Sign in form component

import { Mail, Lock, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import type { AuthFormData } from './types'

interface SignInFormProps {
  formData: AuthFormData
  rememberMe: boolean
  isLoading: boolean
  error: string | null
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRememberMeChange: (checked: boolean) => void
  onSubmit: (e: React.FormEvent) => void
  onToggleMode: () => void
}

export function SignInForm({
  formData,
  rememberMe,
  isLoading,
  error,
  onInputChange,
  onRememberMeChange,
  onSubmit,
  onToggleMode
}: SignInFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
          Էլ. հասցե
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            required
            name="email"
            value={formData.email}
            onChange={onInputChange}
            type="email"
            placeholder="example@gmail.com"
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all placeholder:text-slate-300 text-slate-700 font-medium"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
          Գաղտնաբառ
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            required
            name="password"
            value={formData.password}
            onChange={onInputChange}
            type="password"
            placeholder="••••••••"
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all placeholder:text-slate-300 text-slate-700 font-medium"
          />
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

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="rememberMe"
          checked={rememberMe}
          onChange={(e) => onRememberMeChange(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
        />
        <label htmlFor="rememberMe" className="text-sm text-slate-600 cursor-pointer select-none">
          Հիշել ինձ
        </label>
      </div>

      <Button
        disabled={isLoading}
        className="w-full py-7 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all font-bold text-lg active:scale-[0.98] flex items-center justify-center gap-2"
      >
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Մուտք գործել'}
      </Button>

      <p className="text-center text-slate-500 text-sm font-medium pt-4">
        Դեռ չունե՞ք հաշիվ{' '}
        <button
          type="button"
          onClick={onToggleMode}
          className="text-violet-600 hover:text-violet-700 font-bold underline underline-offset-4 decoration-2 decoration-violet-100 hover:decoration-violet-200 transition-all"
        >
          Գրանցվել
        </button>
      </p>
    </form>
  )
}
