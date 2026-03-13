 'use client'

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

type ConfirmOptions = {
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  tone?: 'default' | 'danger' | 'warning'
}

type InternalState = ConfirmOptions & {
  open: boolean
  resolve?: (v: boolean) => void
}

const toneStyles = {
  danger: {
    icon: 'bg-red-50 text-red-500',
    button: 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-200',
  },
  warning: {
    icon: 'bg-amber-50 text-amber-500',
    button: 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-200',
  },
  default: {
    icon: 'bg-violet-50 text-violet-500',
    button: 'bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-200',
  },
}

const ConfirmContext = createContext<{ confirm: (opts?: ConfirmOptions) => Promise<boolean> } | null>(null)

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<InternalState>({ open: false })

  const close = useCallback((result: boolean) => {
    setState((prev) => {
      prev.resolve?.(result)
      return { ...prev, open: false, resolve: undefined }
    })
  }, [])

  const confirm = useCallback((opts?: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setState({
        open: true,
        resolve,
        title: opts?.title,
        message: opts?.message,
        confirmText: opts?.confirmText,
        cancelText: opts?.cancelText,
        tone: opts?.tone ?? 'default',
      })
    })
  }, [])

  const value = useMemo(() => ({ confirm }), [confirm])
  const styles = toneStyles[state.tone || 'default']

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {state.open && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md"
            onClick={() => close(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8 space-y-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${styles.icon}`}>
                    <AlertTriangle className="w-7 h-7" />
                  </div>
                  <h4 className="text-xl font-black text-slate-900">{state.title}</h4>
                  <p className="text-sm font-medium text-slate-500">{state.message}</p>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={() => close(false)}
                    className="flex-1 bg-slate-50 text-slate-500 hover:bg-slate-100 rounded-xl h-12 font-black"
                  >
                    {state.cancelText || 'Չեղարկել'}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => close(true)}
                    className={`flex-1 rounded-xl h-12 font-black ${styles.button}`}
                  >
                    {state.confirmText || 'Հաստատել'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext)
  if (!ctx) {
    throw new Error('useConfirm must be used within ConfirmProvider')
  }
  return ctx
}
