'use client'

import { useMemo, useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useConfirm } from '@/components/providers/ConfirmProvider'
import api from '@/lib/api'
import type { DashboardTabId, User, Payment } from '../types'

// Types
export interface EditUserForm {
  name: string
  email: string
  phone: string
  courseIds: (string | number)[]
}

interface UseUsersParams {
  activeTab: DashboardTabId
  allowed: boolean
  editingUser: (User & { __editScope?: 'users' }) | null
  setEditingUser: React.Dispatch<React.SetStateAction<(User & { __editScope?: 'users' }) | null>>
  showToast?: (message: string, type?: 'success' | 'error') => void
  currentUser?: User | null
}

// Query Keys
const USERS_QUERY_KEY = 'users'
const PAYMENTS_QUERY_KEY = 'payments'

// React Query Hooks
export function useUsersQuery(currentUserId?: string) {
  return useQuery({
    queryKey: [USERS_QUERY_KEY],
    queryFn: async () => {
      const res = await api.get('/api/v1/users')
      const users = (res.data?.users || []) as User[]
      return users.filter((u) => String(u.id || u._id) !== currentUserId)
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function usePaymentsQuery() {
  return useQuery({
    queryKey: [PAYMENTS_QUERY_KEY],
    queryFn: async () => {
      const res = await api.get('/api/v1/payments')
      return (res.data?.payments || res.data || []) as Payment[]
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number | string) => {
      await api.delete(`/api/v1/users/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] })
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number | string; data: Partial<User> }) => {
      await api.patch(`/api/v1/users/${id}`, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] })
    },
  })
}

export function useToggleUserPaid() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, isPaid }: { userId: number | string; isPaid: boolean }) => {
      await api.patch(`/api/v1/users/${userId}`, { isPaid: !isPaid })
      return { userId, isPaid: !isPaid }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] })
    },
  })
}

// Main Hook
export function useUsers({
  activeTab,
  allowed,
  editingUser,
  setEditingUser,
  showToast,
  currentUser,
}: UseUsersParams) {
  const queryClient = useQueryClient()
  const confirm = useConfirm()
  const [userSearch, setUserSearch] = useState('')

  const currentUserId = String(currentUser?.id || currentUser?._id)

  const { data: users = [], isLoading: isUsersLoading, refetch } = useQuery({
    queryKey: [USERS_QUERY_KEY],
    queryFn: async () => {
      const res = await api.get('/api/v1/users')
      return (res.data?.users || []) as User[]
    },
    staleTime: 1000 * 60 * 5,
    enabled: activeTab === 'users' && allowed,
  })

  useEffect(() => {
    if (activeTab === 'users' && allowed) {
      refetch()
    }
  }, [activeTab, allowed, refetch])

  const { data: payments = [] } = usePaymentsQuery()
  const deleteUser = useDeleteUser()
  const updateUser = useUpdateUser()
  const togglePaid = useToggleUserPaid()

  const getUserPaymentStatus = (userId: number | string) => {
    const userPayments = payments.filter((p) => String(p.user_id) === String(userId) && p.status === 'success')
    return userPayments.length > 0
  }

  const filteredUsers = useMemo(() => {
    if (!userSearch.trim()) return users.filter((u) => String(u.id || u._id) !== String(currentUser?.id || currentUser?._id))
    const term = userSearch.toLowerCase()
    return users.filter((u) => {
      if (String(u.id || u._id) === String(currentUser?.id || currentUser?._id)) return false
      return (
        u.name?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        u.phone?.toLowerCase().includes(term)
      )
    })
  }, [users, userSearch, currentUser])

  const handleDeleteUser = async (id: number | string) => {
    try {
      await deleteUser.mutateAsync(id)
    } catch (err: unknown) {
      throw err
    }
  }

  const handleTogglePaid = async (userId: string | number, currentIsPaid: boolean) => {
    await togglePaid.mutateAsync({ userId, isPaid: currentIsPaid })
  }

  const startEditUserModal = (u: User) => {
    setEditingUser({ ...(u as User), __editScope: 'users' })
  }

  const submitEditUser = async (data: EditUserForm) => {
    if (!editingUser || editingUser.__editScope !== 'users') return
    try {
      // Convert EditUserForm to Partial<User> through safe mapping
      const userData: Partial<User> = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        course_ids: data.courseIds
      }
      await updateUser.mutateAsync({ id: editingUser.id, data: userData })
      // Invalidate users cache to refresh the list
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setEditingUser(null)
      showToast?.('Օգտատերը հաջողությամբ թարմացվել է', 'success')
    } catch (err) {
      console.error('Edit user error:', err)
      showToast?.('Օգտատիրոջ թարմացման ժամանակ սխալ է տեղի ունեցել', 'error')
    }
  }

  return {
    users,
    filteredUsers,
    isUsersLoading,
    userSearch,
    setUserSearch,
    handleDeleteUser,
    getUserPaymentStatus,
    startEditUserModal,
    submitEditUser,
  }
}

