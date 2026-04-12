'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ToolError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to monitoring service in production
    if (process.env.NODE_ENV === 'development') {
      console.error('[ToolError]:', error)
    }
  }, [error])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900">Գործիքի սխալ</h2>
          <p className="text-slate-500">
            Գործիքի բեռնման ժամանակ սխալ է առաջացել: Փորձեք կրկին կամ վերադարձեք:
          </p>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="bg-slate-50 rounded-lg p-4 text-left">
            <p className="text-sm font-mono text-red-600 break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-slate-400 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <Button
            onClick={reset}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Կրկին փորձել
          </Button>
          <Link href="/dashboard">
            <Button className="gap-2 bg-violet-600 hover:bg-violet-700">
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
