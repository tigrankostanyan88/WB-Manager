'use client'

import { useUsers } from '@/hooks/admin/useUsers'
import type { DashboardTabId, User } from '@/components/features/admin/types'

interface UseUsersTabParams {
  activeTab: DashboardTabId
  allowed: boolean
  currentUser: User | null
  showToast: (message: string, type?: 'success' | 'error') => void
  editingUser: (User & { __editScope?: 'users' }) | null
  setEditingUser: React.Dispatch<React.SetStateAction<(User & { __editScope?: 'users' }) | null>>
}

export function useUsersTab(params: UseUsersTabParams) {
  return useUsers(params)
}
