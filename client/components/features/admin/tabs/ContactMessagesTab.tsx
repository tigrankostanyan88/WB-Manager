'use client'

import { useState } from 'react'
import { Search, Mail, User, X, Trash2, CheckCircle, MessageSquare, Clock, CheckCheck, Eye } from 'lucide-react'

interface ContactMessage {
  id: number
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  createdAt: string
}

interface ContactMessagesTabProps {
  messages: ContactMessage[]
  isLoading: boolean
  isDeleting: number | null
  isMarkingRead: number | null
  onDelete: (id: number) => Promise<boolean>
  onMarkAsRead: (id: number) => Promise<boolean>
}

export function ContactMessagesTab({
  messages,
  isLoading,
  isDeleting,
  isMarkingRead,
  onDelete,
  onMarkAsRead
}: ContactMessagesTabProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('hy-AM', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredMessages = messages.filter(msg =>
    msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.message.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const unreadCount = messages.filter(m => !m.read).length

  const handleViewMessage = (msg: ContactMessage) => {
    setSelectedMessage(msg)
    if (!msg.read) {
      onMarkAsRead(msg.id)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
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
          onChange={(e) => setSearchTerm(e.target.value)}
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
                <tr key={msg.id} className={`hover:bg-slate-50 ${!msg.read ? 'bg-violet-50/50' : ''}`}>
                  <td className="px-4 py-3 text-sm text-slate-500">#{msg.id}</td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${!msg.read ? 'bg-violet-100 text-violet-600' : 'bg-slate-100 text-slate-600'}`}>
                          <User className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-slate-900">{msg.name}</span>
                        {!msg.read && (
                          <span className="w-2 h-2 rounded-full bg-violet-500" title="Չկարդացված" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 ml-10">{msg.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-700">{msg.subject}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-slate-600 line-clamp-2 max-w-xs">{msg.message}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-sm text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDate(msg.createdAt)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {msg.read ? (
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
                        onClick={() => handleViewMessage(msg)}
                        className="p-1.5 hover:bg-violet-50 rounded-lg transition-colors text-slate-400 hover:text-violet-600"
                        title="Դիտել"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {!msg.read && (
                        <button
                          onClick={() => onMarkAsRead(msg.id)}
                          disabled={isMarkingRead === msg.id}
                          className="p-1.5 hover:bg-green-50 rounded-lg transition-colors text-slate-400 hover:text-green-500 disabled:opacity-50"
                          title="Նշել որպես կարդացված"
                        >
                          {isMarkingRead === msg.id ? (
                            <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => onDelete(msg.id)}
                        disabled={isDeleting === msg.id}
                        className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-slate-400 hover:text-red-500 disabled:opacity-50"
                        title="Ջնջել"
                      >
                        {isDeleting === msg.id ? (
                          <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${!selectedMessage.read ? 'bg-violet-100 text-violet-600' : 'bg-slate-100 text-slate-600'}`}>
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{selectedMessage.name}</h3>
                  <p className="text-sm text-slate-500">{selectedMessage.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
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
                  <p className="text-lg font-medium text-slate-900">{selectedMessage.subject}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-slate-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-500 uppercase mb-1">Հաղորդագրություն</p>
                  <div className="bg-slate-50 rounded-xl p-4 text-slate-700 whitespace-pre-wrap">
                    {selectedMessage.message}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500 pt-2">
                <Clock className="w-4 h-4" />
                <span>Ուղարկված: {formatDate(selectedMessage.createdAt)}</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t border-slate-100 bg-slate-50">
              {!selectedMessage.read && (
                <button
                  onClick={() => {
                    onMarkAsRead(selectedMessage.id)
                    setSelectedMessage({ ...selectedMessage, read: true })
                  }}
                  disabled={isMarkingRead === selectedMessage.id}
                  className="px-4 py-2 text-sm font-medium text-violet-600 hover:bg-violet-50 rounded-xl transition-colors disabled:opacity-50"
                >
                  {isMarkingRead === selectedMessage.id ? 'Հ 처리վում է...' : 'Նշել որպես կարդացված'}
                </button>
              )}
              <button
                onClick={() => {
                  onDelete(selectedMessage.id)
                  setSelectedMessage(null)
                }}
                disabled={isDeleting === selectedMessage.id}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
              >
                {isDeleting === selectedMessage.id ? 'Ջնջվում է...' : 'Ջնջել'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
