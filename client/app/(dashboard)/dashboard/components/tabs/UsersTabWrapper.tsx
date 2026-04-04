'use client'

import { EditUserModal } from '@/components/features/admin/EditUserModal'
import { UsersTab } from '@/components/features/admin/tabs/users/UsersTab'
import { UsersTabSkeleton } from '@/components/features/admin/tabs/users/UsersTabSkeleton'
import { useUsersTab } from '@/app/(dashboard)/dashboard/hooks'
import type { User } from '@/components/features/admin/types'

interface UsersTabWrapperProps {
  allowed: boolean
  currentUser: User | null
  showToast: (message: string, type?: 'success' | 'error') => void
  editingUser: (User & { __editScope?: 'users' }) | null
  setEditingUser: React.Dispatch<React.SetStateAction<(User & { __editScope?: 'users' }) | null>>
}

export function UsersTabWrapper({ allowed, currentUser, showToast, editingUser, setEditingUser }: UsersTabWrapperProps) {
  const users = useUsersTab({ activeTab: 'users', allowed, currentUser, showToast, setEditingUser, editingUser })
  
  if (users.isUsersLoading) {
    return <UsersTabSkeleton />
  }
  
  return (
    <>
      <UsersTab
        users={users.filteredUsers}
        isUsersLoading={users.isUsersLoading}
        userSearch={users.userSearch}
        setUserSearch={users.setUserSearch}
        getUserPaymentStatus={users.getUserPaymentStatus}
        onEdit={users.startEditUserModal}
        onDelete={users.handleDeleteUser}
      />
      {editingUser && editingUser.__editScope === 'users' && (
        <EditUserModal
          open={!!editingUser}
          onClose={() => setEditingUser(null)}
          user={editingUser}
          onSubmit={users.submitEditUser}
        />
      )}
    </>
  )
}
