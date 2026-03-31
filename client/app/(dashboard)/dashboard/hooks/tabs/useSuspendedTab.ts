'use client'

import { useState } from 'react'
import { useSuspendedUsers } from '@/app/(dashboard)/dashboard/hooks/useSuspendedUsers'

interface UseSuspendedTabProps {
  showToast: (message: string, type: 'success' | 'error') => void
}

export function useSuspendedTab({ showToast }: UseSuspendedTabProps) {
  const {
    suspendedUsers,
    isSuspendedLoading,
    suspendedSearch,
    setSuspendedSearch,
    loadSuspendedUsers,
    handleRestoreUser,
    handlePermanentDelete,
    handleBulkDelete
  } = useSuspendedUsers(showToast)

  return {
    suspendedUsers,
    isSuspendedLoading,
    suspendedSearch,
    setSuspendedSearch,
    loadSuspendedUsers,
    handleRestoreUser,
    handlePermanentDelete,
    handleBulkDelete
  }
}
