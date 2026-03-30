'use client'

import { Search, Mail } from 'lucide-react'
import { MessageRow } from './MessageRow'
import type { ContactMessage } from './utils'

interface MessagesTableProps {
  messages: ContactMessage[]
  searchTerm: string
  isLoading: boolean
  isMarkingRead: number | null
  isDeleting: number | null
  unreadCount: number
  onSearchChange: (value: string) => void
  onViewMessage: (msg: ContactMessage) => void
  onMarkAsRead: (id: number) => void
  onDelete: (id: number) => void
}

export function MessagesTable({
  messages,
  searchTerm,
  isLoading,
  isMarkingRead,
  isDeleting,
  unreadCount,
  onSearchChange,
  onViewMessage,
  onMarkAsRead,
  onDelete
}: MessagesTableProps) {
  const filteredMessages = messages.filter(msg =>
    msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.message.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Կոնտակտային հաղորդագրություններ</h2>
          <p className="text-sm text-slate-500 mt-1">
            {unreadCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-700 text-xs font-medium mr-2">
                <Mail className="w-3 h-3" />
                {unreadCount} չկարդացված
              </span>
            )}
            Ընդհանուր {messages.length} հաղորդագրություն
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Որոնել անունով, email-ով, թեմայով..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
        />
      </div>

      {/* Messages Table */}
      {filteredMessages.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
          <Mail className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">Հաղորդագրություններ չկան</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm max-h-[calc(100vh-200px)] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-slate-50 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Ուղարկող</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Թեմա</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Հաղորդագրություն</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Ամսաթիվ</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Կարդացված</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Գործողություն</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMessages.map((msg) => (
                <MessageRow
                  key={msg.id}
                  message={msg}
                  isMarkingRead={isMarkingRead}
                  isDeleting={isDeleting}
                  onView={onViewMessage}
                  onMarkAsRead={onMarkAsRead}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
