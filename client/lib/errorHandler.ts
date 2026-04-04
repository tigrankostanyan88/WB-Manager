/**
 * Unified Error Handling Utility
 * Centralized error handling for consistent UX and logging
 */

import { createLogger } from './logger'

const logger = createLogger('ErrorHandler')

export interface ErrorHandlerOptions {
  showToast?: (message: string, type: 'success' | 'error') => void
  silent?: boolean
  context?: string
}

export interface AsyncHandlerOptions extends ErrorHandlerOptions {
  setLoading?: (loading: boolean) => void
  successMessage?: string
  errorMessage?: string
}

/**
 * Handle errors consistently across the application
 */
export function handleError(error: unknown, options: ErrorHandlerOptions = {}): string {
  const { showToast, silent = false, context } = options
  
  // Extract error message
  let message = 'Անհայտ սխալ է տեղի ունեցել'
  
  if (error instanceof Error) {
    message = error.message
  } else if (typeof error === 'string') {
    message = error
  } else if (error && typeof error === 'object' && 'message' in error) {
    message = String((error as { message: unknown }).message)
  }
  
  // Log error
  if (context) {
    logger.error(`[${context}] ${message}`, error)
  } else {
    logger.error(message, error)
  }
  
  // Show toast if not silent
  if (!silent && showToast) {
    showToast(message, 'error')
  }
  
  return message
}

/**
 * Wrap async functions with consistent error handling
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  options: AsyncHandlerOptions = {}
): Promise<T | undefined> {
  const { setLoading, successMessage, showToast, silent = false, context } = options
  
  try {
    setLoading?.(true)
    
    const result = await fn()
    
    if (successMessage && showToast && !silent) {
      showToast(successMessage, 'success')
    }
    
    return result
  } catch (error) {
    handleError(error, { showToast, silent, context })
    return undefined
  } finally {
    setLoading?.(false)
  }
}

/**
 * Create a hook-specific error handler
 */
export function createErrorHandler(context: string, showToast?: (message: string, type: 'success' | 'error') => void) {
  return {
    handle: (error: unknown, silent?: boolean) => handleError(error, { showToast, silent, context }),
    wrap: <T>(fn: () => Promise<T>, options?: Omit<AsyncHandlerOptions, 'context'>) => 
      withErrorHandling(fn, { ...options, context, showToast })
  }
}
