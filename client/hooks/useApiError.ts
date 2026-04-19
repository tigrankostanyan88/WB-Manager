// hooks/useApiError.ts - API error handling hook

'use client'

import { useState, useCallback } from 'react'

interface ApiError {
  message: string
  status?: number
  code?: string
}

interface UseApiErrorReturn {
  error: ApiError | null
  isError: boolean
  setError: (error: unknown) => void
  clearError: () => void
  handleApiError: (error: unknown) => string
}

export function useApiError(): UseApiErrorReturn {
  const [error, setErrorState] = useState<ApiError | null>(null)

  const handleApiError = useCallback((err: unknown): string => {
    // Handle different error types
    if (err instanceof Error) {
      return err.message
    }
    
    if (typeof err === 'string') {
      return err
    }
    
    // Handle axios/fetch style errors
    if (err && typeof err === 'object') {
      const errorObj = err as Record<string, unknown>
      
      // Check for response error (axios style)
      if (errorObj.response && typeof errorObj.response === 'object') {
        const response = errorObj.response as Record<string, unknown>
        const data = response.data as Record<string, unknown> | undefined
        
        if (data?.message) {
          return String(data.message)
        }
        
        if (response.status) {
          const status = Number(response.status)
          if (status === 401) return 'Մուտք գործելու ժամանակ սխալ'
          if (status === 403) return 'Մուտք արգելված է'
          if (status === 404) return 'Ռեսուրսը չի գտնվել'
          if (status === 409) return 'Դուplicատ տվյալներ'
          if (status >= 500) return 'Սերվերի սխալ, փորձեք ավելի ուշ'
        }
      }
      
      // Check for message property directly
      if (errorObj.message) {
        return String(errorObj.message)
      }
    }
    
    return 'Անհայտ սխալ է տեղի ունեցել'
  }, [])

  const setError = useCallback((err: unknown) => {
    const message = handleApiError(err)
    
    // Extract status code if available
    let status: number | undefined
    let code: string | undefined
    
    if (err && typeof err === 'object') {
      const errorObj = err as Record<string, unknown>
      if (errorObj.response && typeof errorObj.response === 'object') {
        const response = errorObj.response as Record<string, unknown>
        status = Number(response.status) || undefined
      }
      code = errorObj.code as string | undefined
    }
    
    setErrorState({ message, status, code })
  }, [handleApiError])

  const clearError = useCallback(() => {
    setErrorState(null)
  }, [])

  return {
    error,
    isError: error !== null,
    setError,
    clearError,
    handleApiError
  }
}

// Utility function for retry logic
export function useRetry<T>(
  fn: () => Promise<T>,
  options: { maxRetries?: number; delay?: number } = {}
): () => Promise<T> {
  const { maxRetries = 3, delay = 1000 } = options

  return async () => {
    let lastError: unknown
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn()
      } catch (err) {
        lastError = err
        
        // Don't retry on client errors (4xx)
        if (err && typeof err === 'object') {
          const errorObj = err as Record<string, unknown>
          if (errorObj.response && typeof errorObj.response === 'object') {
            const response = errorObj.response as Record<string, unknown>
            const status = Number(response.status)
            if (status >= 400 && status < 500) {
              throw err
            }
          }
        }
        
        // Wait before retrying
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay * (i + 1)))
        }
      }
    }
    
    throw lastError
  }
}

// Hook for managing async operations with loading and error states
export function useAsyncOperation<T, Args extends unknown[]>(
  operation: (...args: Args) => Promise<T>
) {
  const [isLoading, setIsLoading] = useState(false)
  const { error, setError, clearError, handleApiError } = useApiError()

  const execute = useCallback(async (...args: Args): Promise<T | null> => {
    setIsLoading(true)
    clearError()
    
    try {
      const result = await operation(...args)
      return result
    } catch (err) {
      setError(err)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [operation, clearError, setError])

  return {
    isLoading,
    error: error?.message || null,
    isError: error !== null,
    execute,
    clearError
  }
}

export default useApiError
