'use client'

import { useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export type NotificationType = 'success' | 'error'

export interface Notification {
  id: string
  message: string
  type: NotificationType
}

export interface UseNotificationReturn {
  notifications: Notification[]
  showNotification: (message: string, type?: NotificationType) => void
  removeNotification: (id: string) => void
}

export function useNotification(): UseNotificationReturn {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const showNotification = useCallback((message: string, type: NotificationType = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const notification: Notification = { id, message, type }
    
    setNotifications((prev) => [...prev, notification])
    
    window.setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, 3000)
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  return { notifications, showNotification, removeNotification }
}

export interface NotificationContainerProps {
  notifications: Notification[]
  onRemove: (id: string) => void
}

export function NotificationContainer({ notifications, onRemove }: NotificationContainerProps) {
  return (
    <div className="fixed top-24 right-5 z-[9999] flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            layout
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            onClick={() => onRemove(notification.id)}
            className={cn(
              'max-w-[400px] px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 border backdrop-blur-sm cursor-pointer',
              notification.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : 'bg-red-50 text-red-900 border-red-200'
            )}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            )}
            <span className="font-medium text-sm leading-snug">{notification.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
