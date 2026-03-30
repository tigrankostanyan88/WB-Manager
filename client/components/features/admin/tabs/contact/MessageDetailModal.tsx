'use client'

import { User, Mail, X, MessageSquare, Clock } from 'lucide-react'
import type { ContactMessage } from './utils'

interface MessageDetailModalProps {
  message: ContactMessage | null
  isMarkingRead: number | null
  isDeleting: number | null
  onClose: () => void
  onMarkAsRead: (id: number) => void
  onDelete: (id: number) => void
}

export function MessageDetailModal({
  message,
  isMarkingRead,
  isDeleting,
  onClose,
  onMarkAsRead,
  onDelete
}: MessageDetailModalProps) {
  if (!message) return null

  const handleMarkAsRead = () => {
    onMarkAsRead(message.id)
  }

  const handleDelete = () => {
    onDelete(message.id)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${!message.read ? 'bg-violet-100 text-violet-600' : 'bg-slate-100 text-slate-600'}`}>
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{message.name}</h3>
              <p className="text-sm text-slate-500">{message.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">Թեմա</p>
              <p className="text-lg font-medium text-slate-900">{message.subject}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MessageSquare className="w-5 h-5 text-slate-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-medium text-slate-500 uppercase mb-1">Հաղորդագրություն</p>
              <div className="bg-slate-50 rounded-xl p-4 text-slate-700 whitespace-pre-wrap">
                {message.message}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 pt-2">
            <Clock className="w-4 h-4" />
            <span>Ուղարկված: {new Date(message.createdAt).toLocaleDateString('hy-AM', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</span>
          </div>
        </div>
        <div className="flex justify-end gap-2 p-4 border-t border-slate-100 bg-slate-50">
          {!message.read && (
            <button
              onClick={handleMarkAsRead}
              disabled={isMarkingRead === message.id}
              className="px-4 py-2 text-sm font-medium text-violet-600 hover:bg-violet-50 rounded-xl transition-colors disabled:opacity-50"
            >
              {isMarkingRead === message.id ? 'Համարվում է...' : 'Նշել որպես կարդացված'}
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={isDeleting === message.id}
            className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
          >
            {isDeleting === message.id ? 'Ջնջվում է...' : 'Ջնջել'}
          </button>
        </div>
      </div>
    </div>
  )
}
