'use client'

import { useState } from 'react'
import { Search, BookOpen, Users, Trash2, GraduationCap, Phone, User, X } from 'lucide-react'

interface CourseRegistration {
  id: number
  course_id: number
  name: string
  phone: string
  createdAt: string
  course?: {
    id: number
    title: string
  }
}

interface CourseRegistrationsTabProps {
  registrations: CourseRegistration[]
  isLoading: boolean
  isDeleting: number | null
  onDelete: (id: number) => Promise<boolean>
}

export function CourseRegistrationsTab(props: CourseRegistrationsTabProps) {
  const { registrations, isLoading, isDeleting, onDelete } = props
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  // DEBUG: Log registrations data
  console.log('[DEBUG] CourseRegistrationsTab - registrations:', registrations)
  console.log('[DEBUG] registrations.length:', registrations?.length)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('hy-AM', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredRegistrations = registrations.filter(reg =>
    reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.phone.includes(searchTerm) ||
    reg.course?.title.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-900">Գրանցումներ</h2>
        <div className="text-sm text-slate-500">
          Ընդհանուր: <span className="font-semibold text-violet-600">{registrations.length}</span> գրանցում
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Որոնել անունով, հեռախոսով կամ դասընթացով..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
        />
      </div>

      {/* Registrations Table */}
      {filteredRegistrations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
          <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">Գրանցումներ չկան</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Անուն</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Հեռախոս</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Դասընթաց</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Ամսաթիվ</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Գործողություն</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRegistrations.map((reg) => (
                <tr key={reg.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-500">#{reg.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-xs font-medium text-violet-600">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-slate-900">{reg.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="w-3 h-3" />
                      {reg.phone}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-violet-100 flex items-center justify-center">
                        <BookOpen className="w-3 h-3 text-violet-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        {reg.course?.title || `Դասընթաց #${reg.course_id}`}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">
                    {formatDate(reg.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setDeleteConfirm(reg.id)}
                      disabled={isDeleting === reg.id}
                      className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-slate-400 hover:text-red-500 disabled:opacity-50"
                      title="Ջնջել"
                    >
                      {isDeleting === reg.id ? (
                        <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Հաստատեք ջնջումը</h3>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <p className="text-slate-600 mb-6">
              Դուք համոզված եք, որ ցանկանում եք ջնջել այս գրանցումը?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Չեղարկել
              </button>
              <button
                onClick={() => {
                  onDelete(deleteConfirm)
                  setDeleteConfirm(null)
                }}
                disabled={isDeleting === deleteConfirm}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {isDeleting === deleteConfirm ? 'Ջնջում...' : 'Ջնջել'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
