// modals/auth/useAuthForm.ts - Shared auth form hook

'use client'

import { useState } from 'react'
import type { ApiResponse } from '@/types/api'
import type { AuthFormData, AuthMode, AuthResponse } from './types'

const emptyForm: AuthFormData = {
  name: '',
  email: '',
  phone: '',
  address: '',
  password: ''
}

export function useAuthForm(onSuccess: () => void) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<AuthMode>('signin')
  const [formData, setFormData] = useState<AuthFormData>(emptyForm)
  const [rememberMe, setRememberMe] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const endpoint = mode === 'signup' 
        ? '/api/v1/users/signUp' 
        : '/api/v1/users/signIn'

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      const contentType = response.headers.get('content-type') || ''
      let data: unknown = null
      let rawText = ''

      if (contentType.includes('application/json')) {
        try {
          data = await response.json() as ApiResponse<AuthResponse>
        } catch {
          rawText = await response.text()
        }
      } else {
        rawText = await response.text()
      }

      if (!response.ok) {
        const msgFromJson =
          data && typeof data === 'object' && 'message' in data
            ? String((data as { message?: unknown }).message)
            : ''
        const msg = msgFromJson || rawText || 'Գրանցման սխալ'
        throw new Error(msg)
      }

      const responseData = data as AuthResponse
      
      if (responseData.user) {
        window.dispatchEvent(new CustomEvent('auth:updated', { detail: { user: responseData.user } }))
      }
      // Token is set by server as httpOnly cookie - never store in localStorage (XSS risk)

      // Show toast notification
      window.dispatchEvent(new CustomEvent('show-notification', { 
        detail: { message: 'Մուտքը հաջողվեց', type: 'success' } 
      }))

      // Close modal immediately
      onSuccess()

      // Force page reload to update all components
      setTimeout(() => window.location.href = '/', 500)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Գրանցման սխալ')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMode = () => {
    setMode(prev => prev === 'signup' ? 'signin' : 'signup')
    setError(null)
  }

  const resetForm = () => {
    setFormData(emptyForm)
    setError(null)
    setIsSuccess(false)
    setIsLoading(false)
  }

  return {
    isLoading,
    isSuccess,
    error,
    mode,
    formData,
    rememberMe,
    setRememberMe,
    handleInputChange,
    handleSubmit,
    toggleMode,
    resetForm
  }
}
