'use client'

import { BookOpen, Users } from 'lucide-react'
import { StudentRow } from './StudentRow'
import type { CourseEnrollmentGroup } from './utils'

interface CourseCardProps {
  group: CourseEnrollmentGroup
  isExpanded: boolean
  revokingId: { userId: number; courseId: number } | null
  onToggle: () => void
  onRevoke: (userId: number, courseId: number) => void
}

export function CourseCard({ group, isExpanded, revokingId, onToggle, onRevoke }: CourseCardProps) {
  const { course, enrollments, count, activeCount, expiredCount } = group

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
      {/* Course Header */}
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-violet-600" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-slate-900">{course.title}</h3>
            <p className="text-sm text-slate-500">
              <Users className="w-3 h-3 inline mr-1" />
              {count} ուսանող
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 font-medium">
            {activeCount} ակտիվ
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
            {expiredCount} ավարտված
          </span>
        </div>
      </button>

      {/* Enrolled Students List */}
      {isExpanded && (
        <div className="border-t border-slate-100">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Ուսանող</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Հեռախոս</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Կարգավիճակ</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Գրանցման ամսաթիվ</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Գործողություն</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {enrollments.map((enrollment) => (
                <StudentRow
                  key={enrollment.id}
                  enrollment={enrollment}
                  isRevoking={revokingId?.userId === enrollment.user_id && revokingId?.courseId === enrollment.course_id}
                  onRevoke={onRevoke}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
