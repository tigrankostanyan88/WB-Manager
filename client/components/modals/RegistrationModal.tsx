'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, CheckCircle, Loader2, Mail, Phone, MapPin, User as UserIcon, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import type { User } from '@/lib/auth'

interface RegistrationModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function RegistrationModal({ isOpen, onClose }: RegistrationModalProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'signup' | 'signin'>('signin')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: ''
  })
  const [rememberMe, setRememberMe] = useState(false)

  if (!isOpen) return null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      const endpoint = mode === 'signup' ? '/api/v1/users/signUp' : '/api/v1/users/signIn'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
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
        const msg = msgFromJson || rawText || 'Գրանցման սխալ'
        throw new Error(msg)
      }

      // Success!
      const responseData = data as { user?: User; token?: string } | null;
      const user = responseData?.user ?? null;
      const token = responseData?.token ?? null;
      
      // Dispatch event FIRST before any state changes that might cause unmounting
      if (user) {
        window.dispatchEvent(new CustomEvent('auth:updated', { detail: { user } }));
      }
      
      if (token) {
        localStorage.setItem('token', token);
      }
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
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
        body: JSON.stringify(googleData)
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
        throw new Error(msgFromJson || rawText || 'Google-ով մուտքի սխալ')
      }

      const responseData = data as { user?: User; token?: string } | null;
      const user = responseData?.user ?? null;
      const token = responseData?.token ?? null;
      
      // Dispatch event FIRST before any state changes
      if (user) {
        window.dispatchEvent(new CustomEvent('auth:updated', { detail: { user } }));
      }
      
      if (token) {
        localStorage.setItem('token', token);
      }
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      setIsSuccess(true)
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Google-ով մուտքի սխալ')
    } finally {
      setIsLoading(false)
    }
  }

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
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.8),transparent)]"></div>
          </div>
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all hover:rotate-90"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative px-4 sm:px-8 pt-8 pb-8">
            {/* Success Animation or Logo */}
            <div className="mx-auto w-24 h-24 bg-white rounded-2xl shadow-2xl flex items-center justify-center mb-6 relative z-10 border-4 border-slate-50">
               {isSuccess ? (
                 <motion.div
                   initial={{ scale: 0 }}
                   animate={{ scale: 1 }}
                   transition={{ type: "spring", stiffness: 200, damping: 10 }}
                 >
                   <CheckCircle className="w-12 h-12 text-emerald-500" />
                 </motion.div>
               ) : (
                 <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-inner">
                   WB
                 </div>
               )}
            </div>

            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
                {isSuccess ? 'Գրանցումը հաջողվեց' : mode === 'signup' ? 'Սկսեք հիմա' : 'Բարի գալուստ'}
              </h2>
              <p className="text-slate-500 text-base max-w-[340px] mx-auto leading-relaxed">
                {isSuccess 
                  ? 'Մուտքը կատարվում է, խնդրում ենք սպասել...' 
                  : mode === 'signup' 
                    ? 'Լրացրեք տվյալները՝ հաշիվ ստեղծելու համար' 
                    : 'Մուտք գործեք ձեր հաշիվ'}
              </p>
            </div>

            {!isSuccess && (
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

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Հասցե</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            required
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            type="text" 
                            placeholder="ք. Երևան, Աբովյան 1"
                            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all placeholder:text-slate-300 text-slate-700 font-medium"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Email and Password only for signin/signup modes */}
                  {mode !== 'courseRegister' && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Էլ. հասցե</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            required
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            type="email" 
                            placeholder="example@gmail.com"
                            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all placeholder:text-slate-300 text-slate-700 font-medium"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Գաղտնաբառ</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            required
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            type="password" 
                            placeholder="••••••••"
                            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all placeholder:text-slate-300 text-slate-700 font-medium"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {error && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm font-medium text-center bg-red-50 py-2.5 rounded-xl border border-red-100"
                    >
                      {error}
                    </motion.p>
                  )}

                  {/* Remember me - only for signin */}
                  {mode === 'signin' && (
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
                      />
                      <label htmlFor="rememberMe" className="text-sm text-slate-600 cursor-pointer select-none">
                        Հիշել ինձ
                      </label>
                    </div>
                  )}

                  <Button 
                    disabled={isLoading}
                    className="w-full py-7 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all font-bold text-lg active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      mode === 'signup' ? 'Ստեղծել հաշիվ' : 'Մուտք գործել'
                    )}
                  </Button>
                </form>

                <p className="text-center text-slate-500 text-sm font-medium pt-4">
                  {mode === 'signup' ? 'Արդեն ունե՞ք հաշիվ' : 'Դեռ չունե՞ք հաշիվ'} {' '}
                  <button 
                    onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
                    className="text-violet-600 hover:text-violet-700 font-bold underline underline-offset-4 decoration-2 decoration-violet-100 hover:decoration-violet-200 transition-all"
                  >
                    {mode === 'signup' ? 'Մուտք' : 'Գրանցվել'}
                  </button>
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}