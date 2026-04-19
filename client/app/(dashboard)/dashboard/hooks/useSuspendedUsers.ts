'use client'

import { useState, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
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
  const queryClient = useQueryClient()
  const [suspendedUsers, setSuspendedUsers] = useState<User[]>([])
  const [isSuspendedLoading, setIsSuspendedLoading] = useState(false)
  const [suspendedSearch, setSuspendedSearch] = useState('')

  const loadSuspendedUsers = useCallback(async (allowed: boolean) => {
    if (!allowed) return
    setIsSuspendedLoading(true)
    try {
      const { data } = await userService.getSuspendedUsers() as { data: { users?: User[] } }
      setSuspendedUsers(data?.users || [])
    } catch {
      // Silent error - toast shown by caller if needed
    } finally {
      setIsSuspendedLoading(false)
    }
  }, []) // Remove showToast from deps

  const handleRestoreUser = useCallback(async (id: number | string) => {
    try {
      await userService.restoreUser(id)
      // Remove user from local state immediately
      setSuspendedUsers(prev => prev.filter(user => user.id !== id))
      // Invalidate users query to refresh the users list
      queryClient.invalidateQueries({ queryKey: ['users'] })
      showToast('Օգտատերը հաջողությամբ վերականգնվեց', 'success')
    } catch {
      showToast('Վերականգնումը ձախողվեց', 'error')
    }
  }, [showToast, queryClient])

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
