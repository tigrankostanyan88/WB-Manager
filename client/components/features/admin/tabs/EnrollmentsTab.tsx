'use client'

import { useState, useMemo } from 'react'
import { Search, BookOpen, Users, X, CheckCircle, AlertCircle, GraduationCap } from 'lucide-react'
import { withOrigin } from '../_utils/image'

interface Student {
  id: number | string
  name?: string
  email?: string
  phone?: string
  role?: string
}

interface Course {
  id: number | string
  title: string
  description?: string
}

interface Enrollment {
  id: number
  user_id: number
  course_id: number
  status: 'active' | 'expired' | 'pending'
  price_paid: number
  payment_method: string
  createdAt: string
  student?: Student
  course?: Course
}

interface EnrollmentsTabProps {
  enrollments: Enrollment[]
  courses: { id: number | string; title: string }[]
  enrollmentsByCourse: { course: Course; enrollments: Enrollment[]; count: number; activeCount: number; expiredCount: number }[]
  isLoading: boolean
  selectedCourse: number | null
  setSelectedCourse: (id: number | null) => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  revokeAccess: (userId: number, courseId: number) => Promise<boolean>
}

export function EnrollmentsTab({
  enrollments,
  courses,
  enrollmentsByCourse,
  isLoading,
  selectedCourse,
  setSelectedCourse,
  searchTerm,
  setSearchTerm,
  revokeAccess
}: EnrollmentsTabProps) {
  const [expandedCourse, setExpandedCourse] = useState<number | string | null>(null)
  const [revoking, setRevoking] = useState<{ userId: number; courseId: number } | null>(null)

  const handleRevoke = async (userId: number, courseId: number) => {
    setRevoking({ userId, courseId })
    await revokeAccess(userId, courseId)
    setRevoking(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('hy-AM', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
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
        <h2 className="text-xl font-semibold text-slate-900">Դասընթացների գրանցումներ</h2>
        <div className="text-sm text-slate-500">
          Ընդհանուր: <span className="font-semibold text-violet-600">{enrollments.length}</span> գրանցում
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Որոնել ուսանողի անունով կամ email-ով..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
          />
        </div>
        <select
          value={selectedCourse || ''}
          onChange={(e) => setSelectedCourse(e.target.value ? Number(e.target.value) : null)}
          className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm bg-white"
        >
          <option value="">Բոլոր դասընթացները</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      {/* Course Cards with Enrollments */}
      {enrollmentsByCourse.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
          <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">Դասընթացներում գրանցումներ չկան</p>
        </div>
      ) : (
        <div className="space-y-4">
          {enrollmentsByCourse.map(({ course, enrollments: courseEnrollments, count, activeCount, expiredCount }) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm"
            >
              {/* Course Header */}
              <button
                onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
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
              {expandedCourse === course.id && (
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
                      {courseEnrollments.map((enrollment) => (
                        <tr key={enrollment.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-600">
                                {enrollment.student?.name?.charAt(0).toUpperCase() || '?'}
                              </div>
                              <span className="font-medium text-slate-900">{enrollment.student?.name || 'Անհայտ'}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">{enrollment.student?.email || '-'}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{enrollment.student?.phone || '-'}</td>
                          <td className="px-4 py-3">
                            {enrollment.status === 'active' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                                <CheckCircle className="w-3 h-3" />
                                Ակտիվ
                              </span>
                            ) : enrollment.status === 'expired' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                                <AlertCircle className="w-3 h-3" />
                                Ավարտված
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                                <AlertCircle className="w-3 h-3" />
                                Սպասող
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-500">{formatDate(enrollment.createdAt)}</td>
                          <td className="px-4 py-3 text-right">
                            {enrollment.status === 'active' && (
                              <button
                                onClick={() => handleRevoke(enrollment.user_id, enrollment.course_id)}
                                disabled={revoking?.userId === enrollment.user_id && revoking?.courseId === enrollment.course_id}
                                className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-slate-400 hover:text-red-500 disabled:opacity-50"
                                title="Հետ կանչել մուտքը"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
