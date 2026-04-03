'use client'

import { useState, useEffect, useCallback } from 'react'
import { useNotification } from '@/components/features/admin/Notification'
import useAuth from '@/hooks/admin/useAuth'
import type { User } from '@/components/features/admin/types'
import type { DashboardTabId } from '@/components/features/admin/types'
import { menuItems } from '@/app/(dashboard)/dashboard/lib/menuItems'

export function useDashboardSimple() {
  const [activeTab, setActiveTab] = useState<DashboardTabId>('overview')
  const [editingUser, setEditingUser] = useState<(User & { __editScope?: 'users' }) | null>(null)
  
  const { notifications, showNotification, removeNotification } = useNotification()
  const { isAuthLoading, allowed, user: currentUser } = useAuth()

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    showNotification(message, type)
  }, [showNotification])

  return {
    // Navigation
    activeTab,
    setActiveTab,
    menuItems,
    
    // Auth
    isAuthLoading,
    allowed,
    currentUser,
    
    // Shared UI State
    editingUser,
    setEditingUser,
    showToast,
    notifications,
    removeNotification
  }
}
