'use client'

import { useEffect, useMemo, useState } from 'react'
import { userService } from '@/lib/api'
import { useConfirm } from '@/components/ConfirmProvider'
import type { DashboardTabId, User } from '../_types'

type EditingUser = (User & { __editScope?: 'users' }) | null

interface EditUserForm {
  name: string
  email: string
  phone: string
  courseIds: (string | number)[]
}

interface UseUsersParams {
  activeTab: DashboardTabId
  allowed: boolean
  editingUser: EditingUser
  setEditingUser: React.Dispatch<React.SetStateAction<EditingUser>>
  showToast?: (message: string, type?: 'success' | 'error') => void
}

export default function useUsers({ activeTab, allowed, editingUser, setEditingUser, showToast }: UseUsersParams) {
  const confirm = useConfirm()
  const [users, setUsers] = useState<User[]>([])
  const [isUsersLoading, setIsUsersLoading] = useState(false)
  const [userSearch, setUserSearch] = useState('')

  useEffect(() => {
    if (!allowed) return
    if (activeTab !== 'users') return
    let cancelled = false
    ;(async () => {
      setIsUsersLoading(true)
      try {
        const res = await userService.getAllUsers()
        const list = ((res.data?.users || []) as User[]).filter((u) => u.role === 'user')
        if (!cancelled) setUsers(list)
      } finally {
        if (!cancelled) setIsUsersLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [activeTab, allowed])

  const filteredUsers = useMemo(() => {
    const q = userSearch.trim().toLowerCase()
    if (!q) return users
    return users.filter((u) => [u.name, u.email, u.phone, u.role].join(' ').toLowerCase().includes(q))
  }, [users, userSearch])

  const handleDeleteUser = async (id: number | string) => {
    const ok = await confirm({
      title: 'Ջնջե՞լ օգտատիրոջը',
      message: 'Գործողությունը չի վերադարձվի',
      confirmText: 'Ջնջել',
      cancelText: 'Չեղարկել',
      tone: 'danger'
    })
    if (!ok) return
    await userService.deleteUser(id)
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }

  const handleTogglePaid = async (userId: string | number, currentIsPaid: boolean) => {
    const next = !currentIsPaid
    await userService.updateUser(userId, { isPaid: next })
    setUsers((prev) => prev.map((x) => (x.id === userId ? { ...x, isPaid: next } : x)))
  }

  const startEditUserModal = (u: User) => {
    setEditingUser({ ...(u as User), __editScope: 'users' })
  }

  const submitEditUser = async (data: EditUserForm) => {
    if (!editingUser || editingUser.__editScope !== 'users') return
    try {
      await userService.updateUser(editingUser.id, data as unknown as Record<string, unknown>)
      setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? { ...u, ...data } : u)).filter((u) => u.role === 'user'))
      setEditingUser(null)
      showToast?.('Օգտատերը հաջողությամբ թարմացվել է', 'success')
    } catch (error) {
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
    handleTogglePaid,
    startEditUserModal,
    submitEditUser
  }
}

