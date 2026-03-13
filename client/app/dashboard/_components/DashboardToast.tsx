'use client'

import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ToastState } from '../_types'

interface DashboardToastProps {
  toast: ToastState | null
  onClose: () => void
}

export default function DashboardToast({ toast, onClose }: DashboardToastProps) {
  if (!toast) return null

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  }

  const styles = {
    success: 'bg-emerald-50 border-emerald-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200'
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-2 fade-in duration-200">
      <div className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg min-w-[300px]',
        styles[toast.type]
      )}>
        {icons[toast.type]}
        <p className="flex-1 text-sm font-medium text-slate-900">{toast.message}</p>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/50 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-slate-500" />
        </button>
      </div>
    </div>
  )
}
