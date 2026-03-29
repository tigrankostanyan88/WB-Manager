'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ToastState } from './types'

interface DashboardToastProps {
  toast: ToastState | null
  onClose: () => void
}

export default function DashboardToast({ toast, onClose }: DashboardToastProps) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className={cn(
            'fixed top-5 right-5 z-[200] max-w-[520px] px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 border backdrop-blur-sm cursor-pointer active:scale-95 transition',
            toast.type === 'success'
              ? 'bg-emerald-600/90 text-white border-emerald-500/60'
              : 'bg-red-600/90 text-white border-red-500/60'
          )}
        >
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
          <span className="font-semibold text-xs leading-snug break-words">{toast.message}</span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

