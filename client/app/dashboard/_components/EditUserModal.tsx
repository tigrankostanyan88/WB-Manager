'use client'

import { Save, X, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import type { User } from '../_types'
import api from '@/lib/api'

interface Course {
  id: string | number
  title: string
}

interface EditUserForm {
  name: string
  email: string
  phone: string
  courseIds: (string | number)[]
}

interface EditUserModalProps {
  user: User | null
  open: boolean
  onClose: () => void
  onSubmit: (data: EditUserForm) => Promise<void> | void
}

export default function EditUserModal({ user, open, onClose, onSubmit }: EditUserModalProps) {
  const [form, setForm] = useState<EditUserForm>({ name: '', email: '', phone: '', courseIds: [] })
  const [courses, setCourses] = useState<Course[]>([])

  useEffect(() => {
    if (!user) return
    const courseIdsFromBackend = (user as unknown as { course_ids?: (string | number)[]; courseIds?: (string | number)[] }).course_ids 
      || (user as unknown as { courseIds?: (string | number)[] }).courseIds 
      || []
    setForm({
      name: String(user.name || ''),
      email: String(user.email || ''),
      phone: String(user.phone || ''),
      courseIds: courseIdsFromBackend
    })
  }, [user])

  useEffect(() => {
    if (!open) return
    const fetchCourses = async () => {
      try {
        const res = await api.get('/api/v1/courses')
        const coursesData = Array.isArray(res.data?.data) ? res.data.data : (res.data?.data?.courses || res.data?.courses || [])
        setCourses(coursesData.map((c: { id: string | number; title: string }) => ({ id: c.id, title: c.title })))
      } catch {
        setCourses([])
      }
    }
    fetchCourses()
  }, [open])

  const toggleCourse = (courseId: string | number) => {
    setForm((f) => ({
      ...f,
      courseIds: f.courseIds.includes(courseId)
        ? f.courseIds.filter((id) => id !== courseId)
        : [...f.courseIds, courseId]
    }))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(form)
  }

  if (!open || !user) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden h-[600px] flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-900">Թարմացնել օգտատիրոջը</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              type="text"
              placeholder="Անուն Ազգանուն"
              className="w-full h-12 rounded-xl bg-slate-50 border border-slate-200 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
            <input
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              type="tel"
              placeholder="099 99 99 99"
              className="w-full h-12 rounded-xl bg-slate-50 border border-slate-200 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
          </div>
          <input
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            type="email"
            placeholder="example@gmail.com"
            className="w-full h-12 rounded-xl bg-slate-50 border border-slate-200 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          />
          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Դասընթացների մուտք
            </h4>
            <div className="max-h-48 overflow-y-auto space-y-2 bg-slate-50 rounded-xl p-3">
              {courses.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">Դասընթացներ չկան</p>
              ) : (
                courses.map((course) => (
                  <label
                    key={course.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={form.courseIds.includes(course.id)}
                      onChange={() => toggleCourse(course.id)}
                      className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                    />
                    <span className="text-sm font-medium text-slate-700">{course.title}</span>
                  </label>
                ))
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl">
              Չեղարկել
            </Button>
            <Button type="submit" className="rounded-xl bg-slate-900 hover:bg-slate-800">
              <Save className="w-4 h-4 mr-2" />
              Պահպանել
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

