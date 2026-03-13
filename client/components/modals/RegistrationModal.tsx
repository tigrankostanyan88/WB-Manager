'use client'

import { useState, useEffect } from 'react'
import { X, CheckCircle, Loader2, Mail, Phone, MapPin, User as UserIcon, Lock, Chrome, ArrowLeft, KeyRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import type { User } from '@/lib/auth'

interface RegistrationModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function RegistrationModal({ isOpen, onClose }: RegistrationModalProps) {
  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setIsLoading(false)
      setIsSuccess(false)
      setError(null)
      setMode('signin')
      setForgotEmail('')
      setForgotPassword('')
      setForgotPasswordConfirm('')
      setForgotSuccess(false)
      setFormData({ name: '', email: '', phone: '', address: '', password: '' })
    }
  }, [isOpen])

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'signup' | 'signin' | 'forgot'>('signin')
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotPassword, setForgotPassword] = useState('')
  const [forgotPasswordConfirm, setForgotPasswordConfirm] = useState('')
  const [forgotSuccess, setForgotSuccess] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: ''
  })

  const resetToSignin = () => {
    setMode('signin')
    setForgotEmail('')
    setForgotPassword('')
    setForgotPasswordConfirm('')
    setForgotSuccess(false)
    setError(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      const endpoint = mode === 'signup' ? 'http://localhost:3300/api/v1/users/signUp' : 'http://localhost:3300/api/v1/users/signIn'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      })

      // Debug logging
      console.log('Request sent:', { endpoint, body: formData })
      console.log('Response:', { status: response.status, statusText: response.statusText, ok: response.ok })

      const contentType = response.headers.get('content-type') || ''
      let data: unknown = null
      let rawText = ''
      if (contentType.includes('application/json')) {
        try {
          data = (await response.json()) as unknown
        } catch {
          rawText = await response.text()
        }
      } else {
        rawText = await response.text()
      }

      if (!response.ok) {
        const msgFromJson =
          data && typeof data === 'object' && typeof (data as { message?: unknown }).message === 'string'
            ? String((data as { message?: unknown }).message)
            : ''
        const isHtml = rawText.trim().startsWith('<') || rawText.includes('<!DOCTYPE') || rawText.includes('<html')
        const cleanError = isHtml ? '' : rawText.slice(0, 200) // Truncate long non-HTML errors too
        // Debug logging
        console.log('Login error:', { status: response.status, contentType, msgFromJson, rawText: rawText.slice(0, 200), isHtml })
        const defaultError = mode === 'signup' ? 'Գրանցման սխալ' : 'Սխալ էլ․ հասցե կամ գաղտնաբառ'
        const msg = msgFromJson || cleanError || defaultError
        throw new Error(msg)
      }

      // Success!
      const user = data && typeof data === 'object' && (data as { user?: unknown }).user ? (data as { user: User }).user : null;
      const token = data && typeof data === 'object' && (data as { token?: unknown }).token ? String((data as { token: string }).token) : null;
      if (token) {
        localStorage.setItem('token', token);
      }
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        window.dispatchEvent(new CustomEvent('auth:updated', { detail: { user } }));
      }
      setIsSuccess(true)
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Գրանցման սխալ')
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('http://localhost:3300/api/v1/users/forgotPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      })

      const contentType = response.headers.get('content-type') || ''
      let data: unknown = null
      let rawText = ''
      if (contentType.includes('application/json')) {
        try {
          data = (await response.json()) as unknown
        } catch {
          rawText = await response.text()
        }
      } else {
        rawText = await response.text()
      }

      if (!response.ok) {
        const msgFromJson =
          data && typeof data === 'object' && typeof (data as { message?: unknown }).message === 'string'
            ? String((data as { message?: unknown }).message)
            : ''
        const isHtml = rawText.trim().startsWith('<') || rawText.includes('<!DOCTYPE') || rawText.includes('<html')
        const cleanError = isHtml ? '' : rawText.slice(0, 200)
        // Debug logging
        console.log('Forgot password error:', { status: response.status, contentType, msgFromJson, rawText: rawText.slice(0, 100) })
        const msg = msgFromJson || cleanError || `Սխալ կոդ ${response.status}`
        throw new Error(msg)
      }

      setForgotSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Սխալ է տեղի ունեցել')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // In a real app, you'd get these from Google's response
      const googleData = {
        googleId: 'dummy_id_' + Date.now(),
        email: 'user@gmail.com',
        name: 'Google User',
        phone: '091234567',
        address: 'Yerevan'
      }

      const response = await fetch('/api/v1/users/googleAuth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(googleData),
        credentials: 'include'
      })

      const contentType = response.headers.get('content-type') || ''
      let data: unknown = null
      let rawText = ''
      if (contentType.includes('application/json')) {
        try {
          data = (await response.json()) as unknown
        } catch {
          rawText = await response.text()
        }
      } else {
        rawText = await response.text()
      }
      if (!response.ok) {
        const msgFromJson =
          data && typeof data === 'object' && typeof (data as { message?: unknown }).message === 'string'
            ? String((data as { message?: unknown }).message)
            : ''
        const isHtml = rawText.trim().startsWith('<') || rawText.includes('<!DOCTYPE') || rawText.includes('<html')
        const cleanError = isHtml ? '' : rawText.slice(0, 200)
        const msg = msgFromJson || cleanError || 'Google-ով մուտքի սխալ'
        throw new Error(msg)
      }

      if (data && typeof data === 'object' && typeof (data as { token?: unknown }).token === 'string') {
        localStorage.setItem('token', String((data as { token?: unknown }).token))
        const maybeUser = (data as { user?: unknown }).user
        if (maybeUser) {
          localStorage.setItem('user', JSON.stringify(maybeUser))
        }
        setIsSuccess(true)
        setTimeout(() => {
          onClose()
          window.location.reload()
        }, 1500)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Google-ով մուտքի սխալ')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm" 
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-8">
            {/* Simple circle logo */}
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
              WB
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              {mode === 'signup' ? 'Սկսեք հիմա' : 'Մուտք գործել'}
            </h2>
          </div>

          <div className="space-y-6">
            {!isSuccess && mode === 'forgot' && (
              <div className="space-y-5">
                {forgotSuccess ? (
                  <div className="text-center space-y-4">
                    <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                    <p className="text-slate-600">Հղումն ուղարկված է ձեր էլ. հասցեին</p>
                    <button
                      onClick={resetToSignin}
                      className="text-violet-600 hover:text-violet-700 font-medium text-sm"
                    >
                      Վերադառնալ մուտքի էջ
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-600">Էլ. հասցե</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          required
                          type="email" 
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="example@gmail.com"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all text-sm"
                        />
                      </div>
                    </div>

                    {error && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm text-center"
                      >
                        {error}
                      </motion.p>
                    )}

                    <Button 
                      disabled={isLoading}
                      className="w-full py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all font-semibold text-sm"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Ուղարկել հղում'
                      )}
                    </Button>

                    <button
                      type="button"
                      onClick={resetToSignin}
                      className="w-full text-slate-500 hover:text-slate-700 font-medium text-sm transition-all"
                    >
                      Վերադառնալ
                    </button>
                  </form>
                )}
              </div>
            )}
              {!isSuccess && mode !== 'forgot' && (
              <div className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === 'signup' && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Անուն Ազգանուն</label>
                          <div className="relative">
                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                              required
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              type="text" 
                              placeholder="Արմեն Արմենյան"
                              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all placeholder:text-slate-300 text-slate-700 font-medium"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Հեռախոս</label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                              required
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              type="tel" 
                              placeholder="099 99 99 99"
                              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all placeholder:text-slate-300 text-slate-700 font-medium"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-600">Էլ. հասցե</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        required
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        type="email" 
                        placeholder="example@gmail.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-600">Գաղտնաբառ</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        required
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        type="password" 
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all text-sm"
                      />
                    </div>
                  </div>

                  {error && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm text-center"
                    >
                      {error}
                    </motion.p>
                  )}

                  <Button 
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all font-semibold text-sm"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      mode === 'signup' ? 'Ստեղծել հաշիվ' : 'Մուտք գործել'
                    )}
                  </Button>
                </form>

                {mode === 'signin' ? (
                  <div className="flex items-center justify-between text-sm">
                    <button
                      type="button"
                      onClick={() => { setMode('forgot'); setError(null); }}
                      className="text-slate-500 hover:text-slate-700 transition-colors"
                    >
                      Մոռացել եմ գաղտնաբառը
                    </button>
                    <button 
                      onClick={() => setMode('signup')}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Գրանցվել
                    </button>
                  </div>
                ) : (
                  <p className="text-center text-slate-500 text-sm">
                    Արդեն ունե՞ք հաշիվ {' '}
                    <button 
                      onClick={() => setMode('signin')}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Մուտք
                    </button>
                  </p>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
