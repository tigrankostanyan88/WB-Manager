'use client'

import { useEffect, useMemo, useState } from 'react'
import { userService } from '@/lib/api'
import { useConfirm } from '@/components/providers/ConfirmProvider'
import type { DashboardTabId, User } from '../_types'

interface Payment {
  id: number
  user_id: number
  course_id: number
  amount: number
  status: 'pending' | 'success' | 'failed'
}

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
  currentUser?: User
}

export default function useUsers({ activeTab, allowed, editingUser, setEditingUser, showToast, currentUser }: UseUsersParams) {
  const confirm = useConfirm()
  const [users, setUsers] = useState<User[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [isUsersLoading, setIsUsersLoading] = useState(false)
  const [userSearch, setUserSearch] = useState('')

  useEffect(() => {
    if (!allowed) return
    if (activeTab !== 'users') return
    let cancelled = false
    ;(async () => {
      setIsUsersLoading(true)
      try {
        // Fetch users and payments in parallel
        const [usersRes, paymentsRes] = await Promise.all([
          userService.getAllUsers(),
          fetch('/api/v1/payments').then(r => r.json()).catch(() => ({ payments: [] }))
        ])
        const currentUserId = String(currentUser?.id || currentUser?._id)
        const list = ((usersRes.data?.users || []) as User[]).filter((u) => {
          const userId = String(u.id || u._id)
          return userId !== currentUserId
        })
        const paymentsList = (paymentsRes.payments || paymentsRes.data || []) as Payment[]
        if (!cancelled) {
          setUsers(list)
          setPayments(paymentsList)
        }
      } finally {
        if (!cancelled) setIsUsersLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [activeTab, allowed])

  // Check if user has successful payment
  const getUserPaymentStatus = (userId: number | string) => {
    const userPayments = payments.filter(p => 
      String(p.user_id) === String(userId) && p.status === 'success'
    )
    return userPayments.length > 0
  }

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
      const currentUserId = String(currentUser?.id || currentUser?._id)
      setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? { ...u, ...data } : u)).filter((u) => String(u.id || u._id) !== currentUserId))
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
    getUserPaymentStatus,
    startEditUserModal,
    submitEditUser
  }
}

