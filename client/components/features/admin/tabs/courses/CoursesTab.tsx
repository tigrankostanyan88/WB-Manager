'use client'

import { useMemo } from 'react'
import type { Course } from '@/components/features/admin/types'
import { useConfirm } from '@/components/providers/ConfirmProvider'
import { CourseFormComponent } from './_components/CourseForm'
import { CourseList } from './_components/CourseList'

interface CoursesTabProps {
  showCourseForm: boolean
  courseForm: any
  setCourseForm: React.Dispatch<React.SetStateAction<any>>
  startNewCourse: () => void
  editCourse: (course: Course) => void
  deleteCourse: (courseId: string) => void
  cancelNewCourse: () => void
  submitCourse: (e: React.FormEvent) => Promise<void>
  courses: Course[]
  isLoading: boolean
  onImageFileSelect?: (e: React.ChangeEvent<HTMLInputElement>) => void
  getCourseFirstVideoUrl?: (course: Course) => string | null
  editingCourse?: Course | null
}

export function CoursesTab({
  showCourseForm,
  courseForm,
  setCourseForm,
  startNewCourse,
  editCourse,
  deleteCourse,
  cancelNewCourse,
  submitCourse,
  courses,
  isLoading,
  onImageFileSelect,
  getCourseFirstVideoUrl,
  editingCourse
}: CoursesTabProps) {
  const confirm = useConfirm()

  // Get video URL for the editing course (memoized)
  const editingCourseVideoUrl = useMemo(() => {
    if (!editingCourse) return null
    return getCourseFirstVideoUrl?.(editingCourse) ?? null
  }, [editingCourse, getCourseFirstVideoUrl])

  // Handle delete with confirmation
  const handleDelete = async (course: Course) => {
    const confirmed = await confirm({
      title: 'Ջնջել դասընթացը',
      message: `Վստա՞հ եք, որ ցանկանում եք ջնջել "${course.title}" դասընթացը:`,
      confirmText: 'Ջնջել',
      cancelText: 'Չեղարկել',
      tone: 'danger'
    })

    if (confirmed) {
      await deleteCourse(course._id || String(course.id))
    }
  }

  // Show form view
  if (showCourseForm) {
    return (
      <CourseFormComponent
        courseForm={courseForm}
        setCourseForm={setCourseForm}
        isEditing={Boolean(editingCourse)}
        editingCourseVideoUrl={editingCourseVideoUrl}
        onCancel={cancelNewCourse}
        onSubmit={submitCourse}
        onImageFileSelect={onImageFileSelect}
      />
    )
  }

  // Show list view
  return (
    <div className="space-y-6">
      <CourseList
        courses={courses}
        isLoading={isLoading}
        onEdit={editCourse}
        onDelete={handleDelete}
        onCreateNew={startNewCourse}
        getCourseFirstVideoUrl={getCourseFirstVideoUrl ?? (() => null)}
      />
    </div>
  )
}
