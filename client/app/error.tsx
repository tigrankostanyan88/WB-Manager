'use client'

import { useEffect } from 'react'

interface ErrorBoundaryProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Route-level error boundary
 * Catches errors in nested routes and allows recovery
 */
export default function Error({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // Log error for monitoring in production
    if (process.env.NODE_ENV === 'production') {
      // Send to error tracking service (Sentry, LogRocket, etc.)
      // Example: Sentry.captureException(error, { tags: { boundary: 'route' } })
    }
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Սխալ է տեղի ունեցել</h2>
        <p className="text-slate-500 mb-6">
          {process.env.NODE_ENV === 'development' 
            ? error.message || 'Անհայտ սխալ'
            : 'Խնդիր է առաջացել: Խնդրում ենք փորձել կրկին'}
        </p>
        <button
          onClick={reset}
          className="px-6 py-2 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors"
        >
          Փորձել կրկին
        </button>
      </div>
    </div>
  )
}
