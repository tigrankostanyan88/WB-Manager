'use client'

import { useState } from 'react'
import { useUsers } from '@/components/features/admin/hooks/useUsers'
import type { User } from '@/components/features/admin/types'

interface UseUsersTabProps {
  activeTab: string
  allowed: boolean
  currentUser: User | null
  showToast: (message: string, type: 'success' | 'error') => void
  editingUser: (User & { __editScope?: 'users' }) | null
  setEditingUser: React.Dispatch<React.SetStateAction<(User & { __editScope?: 'users' }) | null>>
}

export function useUsersTab({ activeTab, allowed, currentUser, showToast, editingUser, setEditingUser }: UseUsersTabProps) {
  const [editingUserLocal, setEditingUserLocal] = useState<(User & { __editScope?: 'users' }) | null>(null)

  const {
    users,
    filteredUsers,
    isUsersLoading,
    userSearch,
    setUserSearch,
    handleDeleteUser,
    getUserPaymentStatus,
    submitEditUser
  } = useUsers({
    activeTab: activeTab as any,
    allowed,
    editingUser,
    setEditingUser,
    showToast,
    currentUser
  })

  const startEditUserModal = (user: User) => {
    const userWithScope = { ...user, __editScope: 'users' as const }
    setEditingUserLocal(userWithScope)
    setEditingUser(userWithScope)
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
    submitEditUser
  }
}
