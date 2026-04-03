'use client'

import { useEffect, useState } from 'react'

interface StudentCoursesTabProps {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
}

interface Enrollment {
  _id: string
  userName: string
  courseName: string
  enrolledAt: string
  progress?: number
}

export function StudentCoursesTab({ showToast }: StudentCoursesTabProps) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function fetchEnrollments() {
      setIsLoading(true)
      try {
        const res = await fetch('/api/student-courses')
        const data = await res.json()
        setEnrollments(data.enrollments || [])
      } catch {
        // Fail silently - enrollments are optional
      } finally {
        setIsLoading(false)
      }
    }
    fetchEnrollments()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">Գրանցումներ</h2>

      {enrollments.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Ուսանող</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Դասընթաց</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Ամսաթիվ</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Պրոգրես</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {enrollments.map((enrollment) => (
                <tr key={enrollment._id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900">{enrollment.userName}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{enrollment.courseName}</td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(enrollment.enrolledAt).toLocaleDateString('hy-AM')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-violet-600 rounded-full"
                          style={{ width: `${enrollment.progress || 0}%` }}
                        />
                      </div>
                      <span className="text-sm text-slate-600">{enrollment.progress || 0}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-slate-500 text-center py-12">Գրանցումներ չկան</p>
      )}
    </div>
  )
}
