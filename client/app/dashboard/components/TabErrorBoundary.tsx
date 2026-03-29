'use client'

import { useEffect, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface TabErrorBoundaryProps {
  error: Error & { digest?: string }
  reset: () => void
  tabName: string
  children: ReactNode
}

export function TabErrorBoundary({ error, reset, tabName, children }: TabErrorBoundaryProps) {
  useEffect(() => {
    console.error(`[${tabName} Tab Error]:`, error)
  }, [error, tabName])

  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl border border-red-200 shadow-lg p-8 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          {tabName} Tab սխալ
        </h3>
        
        <p className="text-sm text-slate-500 mb-6">
          Այս բաժնի բեռնման ժամանակ սխալ է տեղի ունեցել: Խնդրում ենք կրկին փորձել:
        </p>
        
        {error.message && (
          <div className="bg-slate-50 rounded-lg p-3 mb-6 text-left">
            <p className="text-xs font-mono text-slate-600 break-all">
              {error.message}
            </p>
          </div>
        )}
        
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Կրկին փորձել
        </button>
      </div>
    </div>
  )
}
