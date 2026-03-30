'use client'

import { useState } from 'react'
import { Search, Edit, Trash2, User as UserIcon, AlertTriangle, UserX } from 'lucide-react'
import type { User } from '../types'
import { withOrigin } from '../_utils/image'

interface UsersTabProps {
  users: User[]
  isUsersLoading: boolean
  userSearch: string
  setUserSearch: (value: string) => void
  getUserPaymentStatus: (userId: number | string) => boolean
  onEdit: (user: User) => void
  onDelete: (id: string) => void
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

export function UsersTab({
  users,
  isUsersLoading,
  userSearch,
  setUserSearch,
  getUserPaymentStatus,
  onEdit,
  onDelete
}: UsersTabProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user)
    setShowConfirmDelete(String(user.id))
  }

  const confirmDelete = () => {
    if (showConfirmDelete) {
      onDelete(showConfirmDelete)
      setShowConfirmDelete(null)
      setUserToDelete(null)
    }
  }

  const cancelDelete = () => {
    setShowConfirmDelete(null)
    setUserToDelete(null)
  }
  return (
    <div className="space-y-6">
      {/* Delete confirmation modal */}
      {showConfirmDelete && userToDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] overflow-y-auto py-8">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl my-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <UserX className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Ջնջե՞լ օգտատիրոջը</h3>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 text-left">
                <p className="text-amber-800 text-sm font-medium mb-2">⚠️ Կասեցման վերաբերյալ</p>
                <p className="text-slate-600 text-sm">
                  <span className="font-medium text-slate-800">{userToDelete.name}</span> օգտատերը կտեղափոխվի <span className="font-medium text-slate-800">«Ժամանակավոր կասեցվածներ»</span> բաժին։
                </p>
                <p className="text-slate-600 text-sm mt-2">
                  Օգտատերը չի կարողանա մուտք գործել իր պրոֆիլը, քանի դեռ ադմինը չի վերականգնի նրան։
                </p>
              </div>
              <div className="flex gap-3 w-full">
                <button
                  onClick={cancelDelete}
                  className="flex-1 px-4 py-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors font-medium"
                >
                  Չեղարկել
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-xl transition-colors font-medium"
                >
                  Ջնջել
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-900">Օգտվողներ</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Որոնել..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
      </div>

      {isUsersLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
        </div>
      ) : users.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-4 py-4 text-left text-sm font-medium text-slate-700">Նկար</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-slate-700">Անուն</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-slate-700">Էլ. փոստ</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-slate-700">Դեր</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-slate-700">Վճարում</th>
                <th className="px-4 py-4 text-right text-sm font-medium text-slate-700">Գործողություններ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => {
                const avatarUrl = getUserAvatarUrl(user)
                return (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-4 py-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center">
                      {avatarUrl ? (
                        <img 
                          src={avatarUrl} 
                          alt={`${user.firstName} ${user.lastName}`}
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
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                      getUserPaymentStatus(String(user.id))
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {getUserPaymentStatus(String(user.id)) ? 'Վճարված' : 'Չվճարված'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(user)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4 text-slate-500" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
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
        <p className="text-slate-500 text-center py-12">Օգտվողներ չկան</p>
      )}
    </div>
  )
}
