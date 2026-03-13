'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Սխալ է տեղի ունեցել</h2>
        <p className="text-slate-500 mb-6">{error.message || 'Անհայտ սխալ'}</p>
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
