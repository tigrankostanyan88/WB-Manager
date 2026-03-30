'use client'

import { useState } from 'react'
import { GraduationCap } from 'lucide-react'
import { EnrollmentsFilters } from './EnrollmentsFilters'
import { CourseCard } from './CourseCard'
import type { EnrollmentsTabProps } from './utils'

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

  const handleToggle = (courseId: number | string) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId)
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-900">Դասընթացների գրանցումներ</h2>
        <div className="text-sm text-slate-500">
          Ընդհանուր: <span className="font-semibold text-violet-600">{enrollments.length}</span> գրանցում
        </div>
      </div>

      {/* Filters */}
      <EnrollmentsFilters
        searchTerm={searchTerm}
        selectedCourse={selectedCourse}
        courses={courses}
        onSearchChange={setSearchTerm}
        onCourseChange={setSelectedCourse}
      />

      {/* Course Cards with Enrollments */}
      {enrollmentsByCourse.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
          <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">Դասընթացներում գրանցումներ չկան</p>
        </div>
      ) : (
        <div className="space-y-4">
          {enrollmentsByCourse.map((group) => (
            <CourseCard
              key={group.course.id}
              group={group}
              isExpanded={expandedCourse === group.course.id}
              revokingId={revoking}
              onToggle={() => handleToggle(group.course.id)}
              onRevoke={handleRevoke}
            />
          ))}
        </div>
      )}
    </div>
  )
}
