'use client'

import { useState, useCallback } from 'react'
import { userService } from '@/lib/api'
import type { User } from '@/components/features/admin/types'

interface UseSuspendedUsersResult {
  suspendedUsers: User[]
  isSuspendedLoading: boolean
  suspendedSearch: string
  setSuspendedSearch: (value: string) => void
  loadSuspendedUsers: (allowed: boolean) => Promise<void>
  handleRestoreUser: (id: number | string) => Promise<void>
  handlePermanentDelete: (id: number | string) => Promise<void>
  handleBulkDelete: (ids: (number | string)[]) => Promise<void>
}

export function useSuspendedUsers(
  showToast: (message: string, type: 'success' | 'error') => void
): UseSuspendedUsersResult {
  const [suspendedUsers, setSuspendedUsers] = useState<User[]>([])
  const [isSuspendedLoading, setIsSuspendedLoading] = useState(false)
  const [suspendedSearch, setSuspendedSearch] = useState('')

  const loadSuspendedUsers = useCallback(async (allowed: boolean) => {
    if (!allowed) return
    setIsSuspendedLoading(true)
    try {
      const { data } = await userService.getSuspendedUsers()
      setSuspendedUsers(data.users || [])
    } catch {
      showToast('Կասեցված օգտվողների ցուցակը բեռնել չհաջողվեց', 'error')
    } finally {
      setIsSuspendedLoading(false)
    }
  }, [showToast])

  const handleRestoreUser = useCallback(async (id: number | string) => {
    try {
      await userService.restoreUser(id)
      showToast('Օգտատերը հաջողությամբ վերականգնվեց', 'success')
    } catch {
      showToast('Վերականգնումը ձախողվեց', 'error')
    }
  }, [showToast])

  const handlePermanentDelete = useCallback(async (id: number | string) => {
    try {
      await userService.permanentDeleteUser(id)
      showToast('Օգտատերը ընդմիշտ ջնջվեց', 'success')
    } catch {
      showToast('Ջնջումը ձախողվեց', 'error')
    }
  }, [showToast])

  const handleBulkDelete = useCallback(async (ids: (number | string)[]) => {
    try {
      await Promise.all(ids.map(id => userService.permanentDeleteUser(id)))
      showToast(`${ids.length} օգտատեր ընդմիշտ ջնջվեց`, 'success')
    } catch {
      showToast('Կապակցված ջնջումը ձախողվեց', 'error')
    }
  }, [showToast])

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
