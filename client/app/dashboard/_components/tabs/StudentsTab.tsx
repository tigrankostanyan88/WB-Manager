'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Pencil, Search, Trash2 } from 'lucide-react'
import type { User } from '../../_types'

interface StudentsTabProps {
  students: User[]
  isStudentsLoading: boolean
  studentSearch: string
  setStudentSearch: (v: string) => void
  onTogglePaid: (u: User) => void
  onEdit: (u: User) => void
  onDelete: (id: number | string) => void
}

export default function StudentsTab({
  students,
  isStudentsLoading,
  studentSearch,
  setStudentSearch,
  onTogglePaid,
  onEdit,
  onDelete
}: StudentsTabProps) {
  return (
    <motion.div
      key="students"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-black text-slate-900">Ուսանողների կառավարում</h3>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              type="text"
              placeholder="Փնտրել ուսանող…"
              className="bg-slate-50 border-none rounded-2xl pl-11 pr-4 py-3 text-sm font-medium w-64 focus:ring-2 focus:ring-violet-500 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <Card className="border-0 shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
        <CardContent className="p-0">
          {isStudentsLoading ? (
            <div className="py-10 text-center text-slate-400 font-bold">Բեռնվում է…</div>
          ) : students.length === 0 ? (
            <div className="py-10 text-center text-slate-400 font-bold">Ուսանողներ չեն գտնվել</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0 w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left px-6 py-4 text-slate-500 text-xs font-black uppercase">Անուն</th>
                    <th className="text-left px-6 py-4 text-slate-500 text-xs font-black uppercase">Էլ․ հասցե</th>
                    <th className="text-left px-6 py-4 text-slate-500 text-xs font-black uppercase">Հեռախոս</th>
                    <th className="text-left px-6 py-4 text-slate-500 text-xs font-black uppercase">Վճարված</th>
                    <th className="text-right px-6 py-4 text-slate-500 text-xs font-black uppercase">Գործողություններ</th>
                  </tr>
                </thead>
                <tbody>
                  {students
                    .filter((u) => [u.name, u.email, u.phone].join(' ').toLowerCase().includes(studentSearch.toLowerCase()))
                    .map((u) => (
                      <tr key={u.id} className="border-t border-slate-100">
                        <td className="px-6 py-4">
                          <div className="font-black text-slate-900 text-sm">{String(u.name ?? '')}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-slate-600 text-sm">{String(u.email ?? '')}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-slate-600 text-sm">{String(u.phone ?? '')}</div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => onTogglePaid(u)}
                            className={cn(
                              'px-3 py-1 rounded-lg text-[10px] font-black uppercase',
                              u.isPaid ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
                            )}
                          >
                            {u.isPaid ? 'Վճարված' : 'Չվճարված'}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button size="icon" variant="ghost" onClick={() => onEdit(u)} className="rounded-xl">
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => onDelete(u.id)}
                              className="rounded-xl text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
