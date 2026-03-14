'use client'

import { Search, Edit, Trash2, User as UserIcon } from 'lucide-react'
import type { User } from '../../_types'
import { withOrigin } from '../../_utils/image'

interface UsersTabProps {
  users: User[]
  isUsersLoading: boolean
  userSearch: string
  setUserSearch: (value: string) => void
  onTogglePaid: (userId: string, isPaid: boolean) => void
  onEdit: (user: User) => void
  onDelete: (id: string) => void
}

// Helper to get user avatar URL
function getUserAvatarUrl(user: User): string | null {
  if (!user.files || user.files.length === 0) return null
  const avatarFile = user.files.find((f: any) => f?.name_used === 'user_img')
  if (!avatarFile) return null
  const path = `/images/users/large/${avatarFile.name}${avatarFile.ext}`
  return withOrigin(path) || null
}

export default function UsersTab({
  users,
  isUsersLoading,
  userSearch,
  setUserSearch,
  onTogglePaid,
  onEdit,
  onDelete
}: UsersTabProps) {
  return (
    <div className="space-y-6">
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
                <tr key={user._id} className="hover:bg-slate-50">
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
                    <p className="font-medium text-slate-900">{user.firstName} {user.lastName}</p>
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
                    <button
                      onClick={() => onTogglePaid(user._id, !user.isPaid)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        user.isPaid ? 'bg-emerald-500' : 'bg-slate-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        user.isPaid ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
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
                        onClick={() => onDelete(user._id)}
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
