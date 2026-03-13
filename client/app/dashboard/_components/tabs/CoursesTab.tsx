'use client'

import { Plus, Edit, Trash2 } from 'lucide-react'
import type { Course } from '../../_types'

interface CoursesTabProps {
  showCourseForm: boolean
  courseForm: {
    title: string
    description: string
    price: string
    image: string
    learningPoints: string[]
  }
  setCourseForm: React.Dispatch<React.SetStateAction<any>>
  startNewCourse: () => void
  onEditCourse: (course: Course) => void
  onDeleteCourse: (id: string) => void
  cancelNewCourse: () => void
  addLearningPoint: () => void
  changeLearningPoint: (index: number, value: string) => void
  removeLearningPoint: (index: number) => void
  submitCourse: () => void
  courses: Course[]
  isLoading: boolean
  onImageFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function CoursesTab({
  showCourseForm,
  courseForm,
  setCourseForm,
  startNewCourse,
  onEditCourse,
  onDeleteCourse,
  cancelNewCourse,
  addLearningPoint,
  changeLearningPoint,
  removeLearningPoint,
  submitCourse,
  courses,
  isLoading,
  onImageFileSelect
}: CoursesTabProps) {
  if (showCourseForm) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Նոր դասընթաց</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Անվանում</label>
            <input
              type="text"
              value={courseForm.title}
              onChange={(e) => setCourseForm((prev: any) => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Նկարագրություն</label>
            <textarea
              value={courseForm.description}
              onChange={(e) => setCourseForm((prev: any) => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Գին</label>
            <input
              type="number"
              value={courseForm.price}
              onChange={(e) => setCourseForm((prev: any) => ({ ...prev, price: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Նկար</label>
            <input
              type="file"
              accept="image/*"
              onChange={onImageFileSelect}
              className="w-full"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={cancelNewCourse}
              className="px-4 py-2 text-slate-700 font-medium hover:bg-slate-50 rounded-xl transition-colors"
            >
              Չեղարկել
            </button>
            <button
              type="button"
              onClick={submitCourse}
              className="px-4 py-2 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 transition-colors"
            >
              Պահպանել
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-900">Դասընթացներ</h2>
        <button
          onClick={startNewCourse}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Ավելացնել
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
        </div>
      ) : courses.length > 0 ? (
        <div className="grid gap-4">
          {courses.map((course) => (
            <div key={course._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  {course.image && (
                    <img src={course.image} alt={course.title} className="w-20 h-20 rounded-xl object-cover" />
                  )}
                  <div>
                    <h3 className="font-semibold text-slate-900">{course.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">{course.description}</p>
                    <p className="text-violet-600 font-medium mt-2">{course.price} դրամ</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEditCourse(course)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Edit className="w-5 h-5 text-slate-500" />
                  </button>
                  <button
                    onClick={() => onDeleteCourse(course._id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-500 text-center py-12">Դասընթացներ չկան</p>
      )}
    </div>
  )
}
