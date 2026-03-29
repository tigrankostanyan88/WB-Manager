'use client'

import { useState } from 'react'
import { Search, RefreshCw, Trash2, User as UserIcon, AlertTriangle } from 'lucide-react'
import type { User } from '../types'
import { withOrigin } from '../_utils/image'

interface SuspendedUsersTabProps {
  users: User[]
  isLoading: boolean
  search: string
  setSearch: (value: string) => void
  onRestore: (id: number | string) => void
  onPermanentDelete: (id: number | string) => void
  onBulkDelete?: (ids: (number | string)[]) => void
}

// Helper to get user avatar URL
function getUserAvatarUrl(user: User): string | null {
  const files = user.files
  if (!files || !Array.isArray(files) || files.length === 0) return null
  const avatarFile = files.find((f) => f?.name_used === 'user_img')
  if (!avatarFile) return null
  const path = `/images/users/large/${avatarFile.name}.${avatarFile.ext}`
  return withOrigin(path) || null
}

export default function SuspendedUsersTab({
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
  const filteredUsers = search.trim()
    ? users.filter(u => 
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
      )
    : users

  const toggleSelection = (id: number | string) => {
    const newSet = new Set(selectedIds)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setSelectedIds(newSet)
  }

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

  const confirmDelete = (id: number | string) => {
    setShowConfirmDelete(id)
  }

  const executeDelete = () => {
    if (showConfirmDelete) {
      onPermanentDelete(showConfirmDelete)
      setShowConfirmDelete(null)
    }
  }

  return (
    <>
      {/* Bulk delete confirmation modal */}
      {showBulkConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] overflow-y-auto py-8">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl my-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Հաստատել ջնջումը</h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-left w-full">
                <p className="text-red-800 text-sm font-medium mb-2">⚠️ Ուշադրություն</p>
                <p className="text-slate-600 text-sm">
                  Վստա՞հ եք, որ ցանկանում եք ընդմիշտ ջնջել <span className="font-medium text-slate-800">{selectedIds.size} օգտատիրոջը</span>։
                </p>
                <p className="text-slate-600 text-sm mt-2">
                  <span className="text-red-600 font-medium">Այս գործողությունը անվերադարձ է։</span>
                </p>
              </div>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowBulkConfirm(false)}
                  className="flex-1 px-4 py-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors font-medium"
                >
                  Չեղարկել
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-xl transition-colors font-medium"
                >
                  Ջնջել ընդմիշտ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Single delete confirmation modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] overflow-y-auto py-8">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl my-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Հաստատել ջնջումը</h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-left w-full">
                <p className="text-red-800 text-sm font-medium mb-2">⚠️ Ուշադրություն</p>
                <p className="text-slate-600 text-sm">
                  Վստա՞հ եք, որ ցանկանում եք ընդմիշտ ջնջել այս օգտատիրոջը։
                </p>
                <p className="text-slate-600 text-sm mt-2">
                  <span className="text-red-600 font-medium">Այս գործողությունը անվերադարձ է։</span>
                </p>
              </div>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowConfirmDelete(null)}
                  className="flex-1 px-4 py-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors font-medium"
                >
                  Չեղարկել
                </button>
                <button
                  onClick={executeDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-xl transition-colors font-medium"
                >
                  Ջնջել ընդմիշտ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Header with search and bulk actions */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-slate-900">Ժամանակավոր կասեցվածներ</h2>
          <div className="flex items-center gap-4">
            {selectedIds.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">{selectedIds.size} ընտրված</span>
                <button
                  onClick={() => setShowBulkConfirm(true)}
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
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-4 text-left text-sm font-medium text-slate-700 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === filteredUsers.length && filteredUsers.length > 0}
                      onChange={toggleAll}
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
                {filteredUsers.map((user) => {
                  const avatarUrl = getUserAvatarUrl(user)
                  const isSelected = selectedIds.has(user.id)
                  return (
                  <tr key={user.id} className={`hover:bg-slate-50 ${isSelected ? 'bg-violet-50/50' : ''}`}>
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelection(user.id)}
                        className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center">
                        {avatarUrl ? (
                          <img 
                            src={avatarUrl} 
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <UserIcon className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-slate-900">{user.name}</p>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-lg text-xs font-medium ${
                        user.role === 'admin' ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {user.role === 'admin' ? 'Ադմին' : 'Ուսանող'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 rounded-lg text-xs font-medium bg-red-100 text-red-700">
                        Այո
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onRestore(user.id)}
                          className="p-2 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Վերականգնել"
                        >
                          <RefreshCw className="w-4 h-4 text-emerald-500" />
                        </button>
                        <button
                          onClick={() => confirmDelete(user.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Ջնջել ընդմիշտ"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-500 text-center py-12">
            {search.trim() ? 'Ոչինչ չի գտնվել' : 'Ժամանակավոր կասեցված օգտվողներ չկան'}
          </p>
        )}
      </div>
    </>
  )
}
