'use client'

import { Search } from 'lucide-react'

interface EnrollmentsFiltersProps {
  searchTerm: string
  selectedCourse: number | null
  courses: { id: number | string; title: string }[]
  onSearchChange: (term: string) => void
  onCourseChange: (id: number | null) => void
}

export function EnrollmentsFilters({
  searchTerm,
  selectedCourse,
  courses,
  onSearchChange,
  onCourseChange
}: EnrollmentsFiltersProps) {
  return (
    <div className="flex gap-4 flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Որոնել ուսանողի անունով կամ email-ով..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
        />
      </div>
      <select
        value={selectedCourse || ''}
        onChange={(e) => onCourseChange(e.target.value ? Number(e.target.value) : null)}
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
  )
}
