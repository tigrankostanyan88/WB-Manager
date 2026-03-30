'use client'

import Image from 'next/image'
import { RefreshCw, Trash2, User as UserIcon } from 'lucide-react'
import type { User } from '../../types'
import { getUserAvatarUrl } from './utils'

interface UserRowProps {
  user: User
  isSelected: boolean
  onToggle: (id: number | string) => void
  onRestore: (id: number | string) => void
  onDelete: (id: number | string) => void
}

export function UserRow({ user, isSelected, onToggle, onRestore, onDelete }: UserRowProps) {
  const avatarUrl = getUserAvatarUrl(user)

  return (
    <tr className={`hover:bg-slate-50 ${isSelected ? 'bg-violet-50/50' : ''}`}>
      <td className="px-4 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggle(user.id)}
          className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
        />
      </td>
      <td className="px-4 py-4">
        <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center">
          {avatarUrl ? (
            <Image
              src={avatarUrl || ''}
              alt={user.name}
              fill
              className="object-cover"
              sizes="40px"
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
            onClick={() => onDelete(user.id)}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
            title="Ջնջել ընդմիշտ"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </td>
    </tr>
  )
}
