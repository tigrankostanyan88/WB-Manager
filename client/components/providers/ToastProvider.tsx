'use client'

import { useEffect, useState } from 'react'
import { Toast } from '@/components/features/profile/Toast'

interface ToastData {
  message: string
  type: 'success' | 'error'
}

export function ToastProvider() {
  const [toast, setToast] = useState<ToastData | null>(null)

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<ToastData>).detail
      if (detail) {
        setToast(detail)
        // Auto close after 3 seconds
        setTimeout(() => {
          setToast(null)
        }, 3000)
      }
    }

    window.addEventListener('show-notification', handler)
    return () => window.removeEventListener('show-notification', handler)
  }, [])

  return <Toast toast={toast} onClose={() => setToast(null)} />
}
