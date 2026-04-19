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
  fieldErrors?: Record<string, string>
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
  fieldErrors = {},
  onInputChange,
  onRememberMeChange,
  onSubmit,
  onToggleMode
}: SignInFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" aria-label="Մուտքի ձև">
      <div className="space-y-1.5">
        <label htmlFor="signin-email" className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
          Էլ. հասցե
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
          <input
            id="signin-email"
            name="email"
            value={formData.email}
            onChange={onInputChange}
            type="email"
            autoComplete="email"
            placeholder="example@gmail.com"
            aria-required="true"
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? 'email-error' : undefined}
            className={`w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border ${fieldErrors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-violet-500 focus:ring-violet-500/10'} focus:ring-4 outline-none transition-all placeholder:text-slate-300 text-slate-700 font-medium`}
          />
          {fieldErrors.email && (
            <p id="email-error" className="text-red-500 text-xs mt-1 ml-1" role="alert">{fieldErrors.email}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="signin-password" className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
          Գաղտնաբառ
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
          <input
            id="signin-password"
            name="password"
            value={formData.password}
            onChange={onInputChange}
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            aria-required="true"
            aria-invalid={!!fieldErrors.password}
            aria-describedby={fieldErrors.password ? 'password-error' : undefined}
            className={`w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border ${fieldErrors.password ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-violet-500 focus:ring-violet-500/10'} focus:ring-4 outline-none transition-all placeholder:text-slate-300 text-slate-700 font-medium`}
          />
          {fieldErrors.password && (
            <p id="password-error" className="text-red-500 text-xs mt-1 ml-1" role="alert">{fieldErrors.password}</p>
          )}
        </div>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm font-medium text-center bg-red-50 py-2.5 rounded-xl border border-red-100"
          role="alert"
          aria-live="polite"
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
          aria-label="Հիշել ինձ"
        />
        <label htmlFor="rememberMe" className="text-sm text-slate-600 cursor-pointer select-none">
          Հիշել ինձ
        </label>
      </div>

      <Button
        disabled={isLoading}
        aria-label={isLoading ? 'Մուտք գործում' : 'Մուտք գործել'}
        aria-busy={isLoading}
        className="w-full py-7 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all font-bold text-lg active:scale-[0.98] flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            <span>Մուտք գործում...</span>
          </>
        ) : (
          'Մուտք գործել'
        )}
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
