// modals/auth/AuthModal.tsx - Main auth modal orchestrator

'use client'

import { useCallback, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { SignInForm } from './SignInForm'
import { SignUpForm } from './SignUpForm'
import { ForgotPasswordForm } from './ForgotPasswordForm'
import { AuthSuccess } from './AuthSuccess'
import { useAuthForm } from './useAuthForm'
import type { AuthModalProps } from './types'

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const hasResetRef = useRef(false)

  const handleSuccess = useCallback(() => {
    onClose()
  }, [onClose])

  const {
    isLoading,
    isSuccess,
    forgotSuccess,
    error,
    fieldErrors,
    mode,
    formData,
    rememberMe,
    setRememberMe,
    handleInputChange,
    handleSubmit,
    handleForgotSubmit,
    toggleMode,
    setForgotMode,
    setSigninMode,
    resetForm
  } = useAuthForm(handleSuccess)

  // Reset form when modal is closed
  const handleClose = useCallback(() => {
    onClose()
    resetForm()
    hasResetRef.current = false
  }, [onClose, resetForm])

  // Reset form only once when modal first opens
  useEffect(() => {
    if (isOpen && !hasResetRef.current) {
      resetForm()
      hasResetRef.current = true
    }
    if (!isOpen) {
      hasResetRef.current = false
    }
  }, [isOpen, resetForm])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-2 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity"
          onClick={handleClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all max-h-[90vh] flex flex-col"
        >
          {/* Fixed header with decorative background */}
          <div className="relative h-20 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-600 flex-shrink-0">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.8),transparent)]" />
            
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all hover:rotate-90"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 pt-10 pb-8">
            {isSuccess ? (
              <AuthSuccess />
            ) : (
              <>
                {/* Logo - positioned to overlap header */}
                <div className="mx-auto w-24 h-24 bg-white rounded-2xl shadow-2xl flex items-center justify-center -mt-14 mb-6 relative z-10 border-4 border-slate-50">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-inner">
                    WB
                  </div>
                </div>

                <div className="text-center mb-6">
                  <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
                    {mode === 'signup' ? 'Սկսեք հիմա' : mode === 'forgot' ? 'Վերականգնել գաղտնաբառը' : 'Բարի գալուստ'}
                  </h2>
                  <p className="text-slate-500 text-base max-w-[340px] mx-auto leading-relaxed">
                    {mode === 'signup'
                      ? 'Լրացրեք տվյալները՝ հաշիվ ստեղծելու համար'
                      : mode === 'forgot'
                      ? 'Մուտքագրեք ձեր էլ. հասցեն և մենք ձեզ կուղարկենք գաղտնաբառի վերականգնման հղում'
                      : 'Մուտք գործեք ձեր հաշիվ'}
                  </p>
                </div>

                {mode === 'signin' ? (
                  <SignInForm
                    formData={formData}
                    rememberMe={rememberMe}
                    isLoading={isLoading}
                    error={error}
                    fieldErrors={fieldErrors}
                    onInputChange={handleInputChange}
                    onRememberMeChange={setRememberMe}
                    onSubmit={handleSubmit}
                    onToggleMode={toggleMode}
                    onForgotPassword={setForgotMode}
                  />
                ) : mode === 'forgot' ? (
                  <ForgotPasswordForm
                    email={formData.email}
                    isLoading={isLoading}
                    isSuccess={forgotSuccess}
                    error={error}
                    fieldErrors={fieldErrors}
                    onInputChange={handleInputChange}
                    onSubmit={handleForgotSubmit}
                    onBackToSignIn={setSigninMode}
                  />
                ) : (
                  <SignUpForm
                    formData={formData}
                    isLoading={isLoading}
                    error={error}
                    fieldErrors={fieldErrors}
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
