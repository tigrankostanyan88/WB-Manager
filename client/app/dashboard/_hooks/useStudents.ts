import { useEffect, useMemo, useState } from 'react'
import { userService } from '@/lib/api'
import { useConfirm } from '@/components/ConfirmProvider'
import type { DashboardTabId, User } from '../_types'

type EditScope = 'users' | 'students'
type EditingUser = (User & { __editScope?: EditScope }) | null

interface EditUserForm {
  name: string
  email: string
  phone: string
  role: string
  isPaid: boolean
}

interface UseStudentsParams {
  activeTab: DashboardTabId
  allowed: boolean
  editingUser: EditingUser
  setEditingUser: (u: EditingUser) => void
}

export default function useStudents({ activeTab, allowed, editingUser, setEditingUser }: UseStudentsParams) {
  const confirm = useConfirm()
  const [students, setStudents] = useState<User[]>([])
  const [isStudentsLoading, setIsStudentsLoading] = useState(false)
  const [studentSearch, setStudentSearch] = useState('')

  useEffect(() => {
    if (!allowed) return
    if (activeTab !== 'students') return
    let cancelled = false
    ;(async () => {
      setIsStudentsLoading(true)
      try {
        const res = await userService.getAllUsers()
        const list = ((res.data?.users || []) as User[]).filter((u) => u.role === 'student')
        if (!cancelled) setStudents(list)
      } finally {
        if (!cancelled) setIsStudentsLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [activeTab, allowed])

  const filteredStudents = useMemo(() => {
    const q = studentSearch.trim().toLowerCase()
    if (!q) return students
    return students.filter((u) => [u.name, u.email, u.phone, u.role].join(' ').toLowerCase().includes(q))
  }, [students, studentSearch])

  const handleDeleteStudent = async (id: number | string) => {
    const ok = await confirm({
      title: 'Ջնջե՞լ օգտատիրոջը',
      message: 'Գործողությունը չի վերադարձվի',
      confirmText: 'Ջնջել',
      cancelText: 'Չեղարկել',
      tone: 'danger'
    })
    if (!ok) return
    await userService.deleteUser(id)
    setStudents((prev) => prev.filter((u) => u.id !== id))
  }

  const handleTogglePaid = async (u: User) => {
    const next = !u.isPaid
    await userService.updateUser(u.id, { isPaid: next })
    setStudents((prev) => prev.map((x) => (x.id === u.id ? { ...x, isPaid: next } : x)))
  }

  const startEditStudentModal = (u: User) => {
    setEditingUser({ ...(u as User), __editScope: 'students' })
  }

  const submitEditStudent = async (data: EditUserForm) => {
    if (!editingUser || editingUser.__editScope !== 'students') return
    await userService.updateUser(editingUser.id, data as unknown as Record<string, unknown>)
    setStudents((prev) => prev.map((u) => (u.id === editingUser.id ? { ...u, ...data } : u)).filter((u) => u.role === 'student'))
    setEditingUser(null)
  }

  return {
    students,
    filteredStudents,
    isStudentsLoading,
    studentSearch,
    setStudentSearch,
    handleDeleteStudent,
    handleTogglePaid,
    startEditStudentModal,
    submitEditStudent
  }
}

