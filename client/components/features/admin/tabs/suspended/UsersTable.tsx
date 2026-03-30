'use client'

import { Search, Trash2 } from 'lucide-react'
import { UserRow } from './UserRow'
import type { User } from '../../types'

interface UsersTableProps {
  users: User[]
  selectedIds: Set<number | string>
  search: string
  isLoading: boolean
  onSearchChange: (value: string) => void
  onToggleSelection: (id: number | string) => void
  onToggleAll: () => void
  onRestore: (id: number | string) => void
  onDelete: (id: number | string) => void
  onBulkDeleteClick: () => void
}

export function UsersTable({
  users,
  selectedIds,
  search,
  isLoading,
  onSearchChange,
  onToggleSelection,
  onToggleAll,
  onRestore,
  onDelete,
  onBulkDeleteClick
}: UsersTableProps) {
  const filteredUsers = search.trim()
    ? users.filter(u => 
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
      )
    : users

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
      </div>
    )
  }

  if (filteredUsers.length === 0) {
    return (
      <p className="text-slate-500 text-center py-12">
        {search.trim() ? 'Ոչինչ չի գտնվել' : 'Ժամանակավոր կասեցված օգտվողներ չկան'}
      </p>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with search and bulk actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-900">Ժամանակավոր կասեցվածներ</h2>
        <div className="flex items-center gap-4">
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">{selectedIds.size} ընտրված</span>
              <button
                onClick={onBulkDeleteClick}
                className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Ջնջել
              </button>
            </div>
          )}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Որոնել..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-4 py-4 text-left text-sm font-medium text-slate-700 w-10">
                <input
                  type="checkbox"
                  checked={selectedIds.size === filteredUsers.length && filteredUsers.length > 0}
                  onChange={onToggleAll}
                  className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                />
              </th>
              <th className="px-4 py-4 text-left text-sm font-medium text-slate-700">Նկար</th>
              <th className="px-4 py-4 text-left text-sm font-medium text-slate-700">Անուն</th>
              <th className="px-4 py-4 text-left text-sm font-medium text-slate-700">Էլ. փոստ</th>
              <th className="px-4 py-4 text-left text-sm font-medium text-slate-700">Դեր</th>
              <th className="px-4 py-4 text-left text-sm font-medium text-slate-700">Ջնջված</th>
              <th className="px-4 py-4 text-right text-sm font-medium text-slate-700">Գործողություններ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                isSelected={selectedIds.has(user.id)}
                onToggle={onToggleSelection}
                onRestore={onRestore}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
