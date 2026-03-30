'use client'

import { User, Mail, Clock, CheckCheck, CheckCircle, Eye, Trash2 } from 'lucide-react'
import type { ContactMessage } from './utils'

interface MessageRowProps {
  message: ContactMessage
  isMarkingRead: number | null
  isDeleting: number | null
  onView: (msg: ContactMessage) => void
  onMarkAsRead: (id: number) => void
  onDelete: (id: number) => void
}

export function MessageRow({
  message,
  isMarkingRead,
  isDeleting,
  onView,
  onMarkAsRead,
  onDelete
}: MessageRowProps) {
  return (
    <tr className={`hover:bg-slate-50 ${!message.read ? 'bg-violet-50/50' : ''}`}>
      <td className="px-4 py-3 text-sm text-slate-500">#{message.id}</td>
      <td className="px-4 py-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${!message.read ? 'bg-violet-100 text-violet-600' : 'bg-slate-100 text-slate-600'}`}>
              <User className="w-4 h-4" />
            </div>
            <span className="font-medium text-slate-900">{message.name}</span>
            {!message.read && (
              <span className="w-2 h-2 rounded-full bg-violet-500" title="Չկարդացված" />
            )}
          </div>
          <p className="text-xs text-slate-500 ml-10">{message.email}</p>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-700">{message.subject}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <p className="text-sm text-slate-600 line-clamp-2 max-w-xs">{message.message}</p>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5 text-sm text-slate-500">
          <Clock className="w-3.5 h-3.5" />
          {new Date(message.createdAt).toLocaleDateString('hy-AM', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </td>
      <td className="px-4 py-3 text-center">
        {message.read ? (
          <CheckCheck className="w-5 h-5 text-green-500 mx-auto" />
        ) : (
          <span className="inline-flex items-center px-2 py-1 rounded-full bg-violet-100 text-violet-600 text-xs font-medium">
            Նոր
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => onView(message)}
            className="p-1.5 hover:bg-violet-50 rounded-lg transition-colors text-slate-400 hover:text-violet-600"
            title="Դիտել"
          >
            <Eye className="w-4 h-4" />
          </button>
          {!message.read && (
            <button
              onClick={() => onMarkAsRead(message.id)}
              disabled={isMarkingRead === message.id}
              className="p-1.5 hover:bg-green-50 rounded-lg transition-colors text-slate-400 hover:text-green-500 disabled:opacity-50"
              title="Նշել որպես կարդացված"
            >
              {isMarkingRead === message.id ? (
                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
            </button>
          )}
          <button
            onClick={() => onDelete(message.id)}
            disabled={isDeleting === message.id}
            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-slate-400 hover:text-red-500 disabled:opacity-50"
            title="Ջնջել"
          >
            {isDeleting === message.id ? (
              <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </td>
    </tr>
  )
}
