'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, Loader2, CheckCircle } from 'lucide-react'
import type { ApiResponse } from '@/types/api'

interface ResetPasswordResponse {
  message?: string
}

export default function ResetPasswordPage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string;

  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isValidating, setIsValidating] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tokenValid, setTokenValid] = useState<boolean | null>(null)

  // Validate token on page load
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenValid(false)
        setError('Թոքենը բացակայում է')
        setIsValidating(false)
        return
      }

      try {
        setTokenValid(true)
        setIsValidating(false)
      } catch {
        setTokenValid(false)
        setError('Թոքենի ստուգման սխալ')
        setIsValidating(false)
      }
    }

    validateToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password !== passwordConfirm) {
      setError('Գաղտնաբառերը չեն համընկնում')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Գաղտնաբառը պետք է լինի առնվազն 6 նիշ')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(`http://localhost:3300/api/v1/users/resetPassword/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, passwordConfirm })
      })

      const contentType = response.headers.get('content-type') || ''
      let data: unknown = null
      let rawText = ''

      if (contentType.includes('application/json')) {
        try {
          data = (await response.json()) as ApiResponse<ResetPasswordResponse>
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
        const msg = msgFromJson || cleanError || 'Սխալ է տեղի ունեցել'
        
        // Check for specific token errors
        if (msg.includes('invalid') || msg.includes('expired') || response.status === 401) {
          router.push('/')
          return
        } else {
          setError(msg)
        }
        setIsLoading(false)
        return
      }

      setIsSuccess(true)
      // Redirect to home after 3 seconds
      setTimeout(() => {
        router.push('/')
      }, 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Սխալ է տեղի ունեցել')
      setIsLoading(false)
    }
  }

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-violet-600" />
          <p className="mt-4 text-slate-600">Բեռնում...</p>
        </div>
      </div>
    )
  }

  if (tokenValid === false) {
    // Redirect to home page immediately if token is invalid
    router.push('/')
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-violet-600" />
          <p className="mt-4 text-slate-600">Վերահասցեավորում...</p>
        </div>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 text-center"
        >
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Գաղտնաբառը փոխված է</h1>
          <p className="text-slate-600 mb-6">
            Ձեր գաղտնաբառը հաջողությամբ վերականգնվել է: Ավտոմատ կսովորեցվեք գլխավոր էջ 3 վայրկյանից:
          </p>
          <button
            onClick={() => router.push('/')}
            className="w-full py-3 rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition-all font-semibold"
          >
            Վերադառնալ գլխավոր էջ
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8"
      >
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
            WB
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Նոր գաղտնաբառ</h1>
          <p className="text-slate-500 mt-2">Մուտքագրեք ձեր նոր գաղտնաբառը</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-600">Նոր գաղտնաբառ</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-600">Կրկնել գաղտնաբառը</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                required
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="••••••••"
                minLength={6}
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition-all font-semibold text-sm disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mx-auto" />
            ) : (
              'Փոխել գաղտնաբառը'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
