'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log to error monitoring service (e.g., Sentry) in production
    // console.error is removed to prevent exposing errors in browser console
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100 max-w-md text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Սխալ է տեղի ունեցել</h2>
            <p className="text-slate-500 mb-6">{error.message || 'Անհայտ սխալ'}</p>
            <button
              onClick={reset}
              className="bg-violet-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-violet-700 transition-colors"
            >
              Կրկին փորձել
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
