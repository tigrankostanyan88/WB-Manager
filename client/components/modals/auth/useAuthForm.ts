// modals/auth/useAuthForm.ts - Shared auth form hook

'use client'

import { useState, useCallback } from 'react'
import { SignInSchema, SignUpSchema } from '@/lib/validation'
import type { ApiResponse } from '@/types/api'
import type { AuthFormData, AuthMode, AuthResponse } from './types'
import type { User } from '@/lib/auth'

const emptyForm: AuthFormData = {
  name: '',
  email: '',
  phone: '',
  password: ''
}

export function useAuthForm(onSuccess: () => void) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [mode, setMode] = useState<AuthMode>('signin')
  const [formData, setFormData] = useState<AuthFormData>(emptyForm)
  const [rememberMe, setRememberMe] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear field error when user types
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const schema = mode === 'signup' ? SignUpSchema : SignInSchema
    const result = schema.safeParse(formData)
    
    if (!result.success) {
      const errors: Record<string, string> = {}
      result.error.errors.forEach((err) => {
        const field = err.path[0] as string
        if (!errors[field]) {
          errors[field] = err.message
        }
      })
      setFieldErrors(errors)
      return false
    }
    
    setFieldErrors({})
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    // Validate before API call
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)

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

      const apiResponse = data as ApiResponse<AuthResponse>
      const responseData = apiResponse?.data
      
      if (responseData?.user) {
        window.dispatchEvent(new CustomEvent('auth:updated', { detail: { user: responseData.user } }))
      }

      // Show toast notification
      window.dispatchEvent(new CustomEvent('show-notification', { 
        detail: { message: 'Մուտքը հաջողվեց', type: 'success' } 
      }))

      onSuccess()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Գրանցման սխալ')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMode = () => {
    setMode(prev => prev === 'signup' ? 'signin' : 'signup')
    setError(null)
    setFieldErrors({})
  }

  const resetForm = useCallback(() => {
    setFormData(emptyForm)
    setError(null)
    setFieldErrors({})
    setIsSuccess(false)
    setIsLoading(false)
  }, [])

  return {
    isLoading,
    isSuccess,
    error,
    fieldErrors,
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
