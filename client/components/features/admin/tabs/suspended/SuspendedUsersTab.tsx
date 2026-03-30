'use client'

import { useState } from 'react'
import { UsersTable } from './UsersTable'
import { ConfirmationModal } from '@/components/shared'
import type { SuspendedUsersTabProps } from './utils'

export function SuspendedUsersTab({
  users,
  isLoading,
  search,
  setSearch,
  onRestore,
  onPermanentDelete,
  onBulkDelete
}: SuspendedUsersTabProps) {
  const [selectedIds, setSelectedIds] = useState<Set<number | string>>(new Set())
  const [showConfirmDelete, setShowConfirmDelete] = useState<number | string | null>(null)
  const [showBulkConfirm, setShowBulkConfirm] = useState(false)

  const toggleSelection = (id: number | string) => {
    const newSet = new Set(selectedIds)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setSelectedIds(newSet)
  }

  const filteredUsers = search.trim()
    ? users.filter(u => 
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
      )
    : users

  const toggleAll = () => {
    if (selectedIds.size === filteredUsers.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredUsers.map(u => u.id)))
    }
  }

  const handleBulkDelete = () => {
    if (onBulkDelete && selectedIds.size > 0) {
      onBulkDelete(Array.from(selectedIds))
      setSelectedIds(new Set())
      setShowBulkConfirm(false)
    }
  }

  const executeDelete = () => {
    if (showConfirmDelete) {
      onPermanentDelete(showConfirmDelete)
      setShowConfirmDelete(null)
    }
  }

  return (
    <>
      <ConfirmationModal
        isOpen={showBulkConfirm}
        title="Հաստատել ջնջումը"
        message=""
        count={selectedIds.size}
        onCancel={() => setShowBulkConfirm(false)}
        onConfirm={handleBulkDelete}
      />

      <ConfirmationModal
        isOpen={!!showConfirmDelete}
        title="Հաստատել ջնջումը"
        message="Վստա՞հ եք, որ ցանկանում եք ընդմիշտ ջնջել այս օգտատիրոջը։"
        onCancel={() => setShowConfirmDelete(null)}
        onConfirm={executeDelete}
      />

      <UsersTable
        users={users}
        selectedIds={selectedIds}
        search={search}
        isLoading={isLoading}
        onSearchChange={setSearch}
        onToggleSelection={toggleSelection}
        onToggleAll={toggleAll}
        onRestore={onRestore}
        onDelete={(id) => setShowConfirmDelete(id)}
        onBulkDeleteClick={() => setShowBulkConfirm(true)}
      />
    </>
  )
}
