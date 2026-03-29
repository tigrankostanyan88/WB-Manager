// modals/auth/AuthModal.tsx - Main auth modal orchestrator

'use client'

import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { SignInForm } from './SignInForm'
import { SignUpForm } from './SignUpForm'
import { AuthSuccess } from './AuthSuccess'
import { useAuthForm } from './useAuthForm'
import type { AuthModalProps } from './types'

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const {
    isLoading,
    isSuccess,
    error,
    mode,
    formData,
    rememberMe,
    setRememberMe,
    handleInputChange,
    handleSubmit,
    toggleMode
  } = useAuthForm(onClose)

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-2 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all max-h-[90vh] overflow-y-auto no-scrollbar"
        >
          {/* Decorative background */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-600">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.8),transparent)]" />
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all hover:rotate-90"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative px-4 sm:px-8 pt-8 pb-8">
            {isSuccess ? (
              <AuthSuccess mode={mode} />
            ) : (
              <>
                {/* Logo */}
                <div className="mx-auto w-24 h-24 bg-white rounded-2xl shadow-2xl flex items-center justify-center mb-6 relative z-10 border-4 border-slate-50">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-inner">
                    WB
                  </div>
                </div>

                <div className="text-center mb-10">
                  <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
                    {mode === 'signup' ? 'Սկսեք հիմա' : 'Բարի գալուստ'}
                  </h2>
                  <p className="text-slate-500 text-base max-w-[340px] mx-auto leading-relaxed">
                    {mode === 'signup'
                      ? 'Լրացրեք տվյալները՝ հաշիվ ստեղծելու համար'
                      : 'Մուտք գործեք ձեր հաշիվ'}
                  </p>
                </div>

                {mode === 'signin' ? (
                  <SignInForm
                    formData={formData}
                    rememberMe={rememberMe}
                    isLoading={isLoading}
                    error={error}
                    onInputChange={handleInputChange}
                    onRememberMeChange={setRememberMe}
                    onSubmit={handleSubmit}
                    onToggleMode={toggleMode}
                  />
                ) : (
                  <SignUpForm
                    formData={formData}
                    isLoading={isLoading}
                    error={error}
                    onInputChange={handleInputChange}
                    onSubmit={handleSubmit}
                    onToggleMode={toggleMode}
                  />
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

// Default export for backwards compatibility
export default AuthModal
