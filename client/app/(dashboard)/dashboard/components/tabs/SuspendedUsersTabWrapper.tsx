'use client'

import { SuspendedUsersTab } from '@/components/features/admin/tabs/suspended/SuspendedUsersTab'
import { useSuspendedTab } from '@/app/(dashboard)/dashboard/hooks'
import { useEffect, useRef } from 'react'

interface SuspendedUsersTabWrapperProps {
  allowed: boolean
  showToast: (message: string, type?: 'success' | 'error') => void
}

export function SuspendedUsersTabWrapper({ allowed, showToast }: SuspendedUsersTabWrapperProps) {
  const suspended = useSuspendedTab({ showToast })
  const hasLoaded = useRef(false)

  // Load suspended users only once when tab becomes active
  useEffect(() => {
    if (allowed && !hasLoaded.current) {
      hasLoaded.current = true
      suspended.loadSuspendedUsers(allowed)
    }
  }, [allowed]) // Only depend on allowed, not suspended

  return (
    <SuspendedUsersTab
      users={suspended.suspendedUsers}
      isLoading={suspended.isSuspendedLoading}
      search={suspended.suspendedSearch}
      setSearch={suspended.setSuspendedSearch}
      onRestore={suspended.handleRestoreUser}
      onPermanentDelete={suspended.handlePermanentDelete}
      onBulkDelete={suspended.handleBulkDelete}
    />
  )
}
