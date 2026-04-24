// modals/auth/ForgotPasswordForm.tsx - Forgot password form component

import { Mail, Loader2, ArrowLeft, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

interface ForgotPasswordFormProps {
  email: string
  isLoading: boolean
  isSuccess: boolean
  error: string | null
  fieldErrors?: Record<string, string>
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
  onBackToSignIn: () => void
}

export function ForgotPasswordForm({
  email,
  isLoading,
  isSuccess,
  error,
  fieldErrors = {},
  onInputChange,
  onSubmit,
  onBackToSignIn
}: ForgotPasswordFormProps) {
  if (isSuccess) {
    return (
      <div className="space-y-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"
        >
          <CheckCircle className="w-8 h-8 text-green-600" />
        </motion.div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Ստուգեք ձեր էլ. հասցեն</h3>
          <p className="text-slate-500 text-sm">
            Գաղտնաբառի վերականգնման հղումը ուղարկվել է <strong>{email}</strong> հասցեին
          </p>
        </div>
        <Button
          onClick={onBackToSignIn}
          className="w-full py-6 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 font-bold"
        >
          Մուտք գործել
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" aria-label="Գաղտնաբառի վերականգնման ձև">
      <div className="space-y-1.5">
        <label htmlFor="forgot-email" className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
          Էլ. հասցե
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
          <input
            id="forgot-email"
            name="email"
            value={email}
            onChange={onInputChange}
            type="email"
            autoComplete="email"
            placeholder="example@gmail.com"
            aria-required="true"
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? 'forgot-email-error' : undefined}
            className={`w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border ${fieldErrors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-violet-500 focus:ring-violet-500/10'} focus:ring-4 outline-none transition-all placeholder:text-slate-300 text-slate-700 font-medium`}
          />
          {fieldErrors.email && (
            <p id="forgot-email-error" className="text-red-500 text-xs mt-1 ml-1" role="alert">{fieldErrors.email}</p>
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

      <Button
        disabled={isLoading}
        aria-label={isLoading ? 'Ուղարկում' : 'Ուղարկել հղում'}
        aria-busy={isLoading}
        className="w-full py-7 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all font-bold text-lg active:scale-[0.98] flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            <span>Ուղարկում...</span>
          </>
        ) : (
          'Ուղարկել հղում'
        )}
      </Button>

      <button
        type="button"
        onClick={onBackToSignIn}
        className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-slate-700 text-sm font-medium py-2 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Վերադառնալ մուտքի էջ
      </button>
    </form>
  )
}
