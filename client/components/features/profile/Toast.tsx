'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ToastData {
  message: string
  type: 'success' | 'error'
}

interface ToastProps {
  toast: ToastData | null
  onClose: () => void
}

export function Toast({ toast, onClose }: ToastProps) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          onClick={onClose}
          className={cn(
            'fixed top-6 right-6 z-[200] px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-xl border cursor-pointer active:scale-95 transition-all',
            toast.type === 'success'
              ? 'bg-emerald-500/90 text-white border-emerald-400/50 shadow-emerald-200/50'
              : 'bg-red-500/90 text-white border-red-400/50 shadow-red-200/50'
          )}
        >
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
          <span className="font-black text-sm tracking-wide">{toast.message}</span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
