'use client'

import { useState, useCallback, useEffect } from 'react'
import type { User } from '../_types'

interface UseUsersProps {
  activeTab: string
  allowed: boolean
  editingUser: User | null
  setEditingUser: React.Dispatch<React.SetStateAction<User | null>>
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
}

export function useUsers({ activeTab, allowed, editingUser, setEditingUser, showToast }: UseUsersProps) {
  const [users, setUsers] = useState<User[]>([])
  const [isUsersLoading, setIsUsersLoading] = useState(false)
  const [userSearch, setUserSearch] = useState('')

  const fetchUsers = useCallback(async () => {
    if (activeTab !== 'users' || !allowed) return
    setIsUsersLoading(true)
    try {
      const res = await fetch('/api/users')
      const data = await res.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setIsUsersLoading(false)
    }
  }, [activeTab, allowed])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleDeleteUser = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' })
      if (res.ok) {
        showToast('Օգտվողը ջնջված է')
        fetchUsers()
      } else {
        showToast('Սխալ է տեղի ունեցել', 'error')
      }
    } catch {
      showToast('Սխալ է տեղի ունեցել', 'error')
    }
  }, [showToast, fetchUsers])

  const handleTogglePaid = useCallback(async (userId: string, isPaid: boolean) => {
    try {
      const res = await fetch(`/api/users/${userId}/paid`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPaid })
      })
      if (res.ok) {
        showToast(isPaid ? 'Վճարումը ակտիվացված է' : 'Վճարումը ապաակտիվացված է')
        fetchUsers()
      }
    } catch {
      showToast('Սխալ է տեղի ունեցել', 'error')
    }
  }, [showToast, fetchUsers])

  const startEditUserModal = useCallback((user: User) => {
    setEditingUser(user)
  }, [setEditingUser])

  const submitEditUser = useCallback(async (updatedUser: User) => {
    try {
      const res = await fetch(`/api/users/${updatedUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      })
      if (res.ok) {
        showToast('Օգտվողը թարմացված է')
        setEditingUser(null)
        fetchUsers()
      } else {
        showToast('Սխալ է տեղի ունեցել', 'error')
      }
    } catch {
      showToast('Սխալ է տեղի ունեցել', 'error')
    }
  }, [showToast, setEditingUser, fetchUsers])

  const filteredUsers = users.filter(user => {
    const search = userSearch.toLowerCase()
    return (
      user.firstName.toLowerCase().includes(search) ||
      user.lastName.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search)
    )
  })

  return {
    users: filteredUsers,
    isUsersLoading,
    userSearch,
    setUserSearch,
    handleDeleteUser,
    handleTogglePaid,
    startEditUserModal,
    submitEditUser
  }
}
