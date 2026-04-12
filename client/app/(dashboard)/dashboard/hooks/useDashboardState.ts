'use client'

import { useState } from 'react'
import { useNotification } from '@/components/features/admin/Notification'
import type { DashboardTabId } from '@/components/features/admin/types'

type EditingUser = { id: string | number; name: string; email: string; __editScope?: 'users' } | null

export function useDashboardState() {
  const [activeTab, setActiveTab] = useState<DashboardTabId>('overview')
  const [editingUser, setEditingUser] = useState<EditingUser>(null)
  const { notifications, showNotification, removeNotification } = useNotification()

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    showNotification(message, type)
  }

  return {
    activeTab,
    setActiveTab,
    editingUser,
    setEditingUser,
    showToast,
    notifications,
    removeNotification,
  }
}
