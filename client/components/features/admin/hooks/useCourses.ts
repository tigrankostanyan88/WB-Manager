'use client'

import type { DashboardTabId } from '../types'
import type { CourseForm, ExtendedCourse } from './courseTypes'
import { useCoursesQuery, useDeleteCourse, getCourseFirstVideoUrl } from './useCourseQueries'
import { useCourseForm } from './useCourseForm'

interface UseCoursesParams {
  activeTab: DashboardTabId
  showToast: (message: string, type?: 'success' | 'error') => void
}

export function useCourses({ activeTab, showToast }: UseCoursesParams) {
  const { data: courses = [], isLoading: isCoursesLoading } = useCoursesQuery()
  const deleteCourse = useDeleteCourse()

  const {
    showCourseForm,
    setShowCourseForm,
    courseForm,
    setCourseForm,
    editingCourseId,
    editingCourse,
    startNewCourse,
    cancelNewCourse,
    editCourse,
    addLearningPoint,
    changeLearningPoint,
    removeLearningPoint,
    submitCourse,
    isSubmitting
  } = useCourseForm({ showToast })

  const isLoading = isCoursesLoading || isSubmitting || deleteCourse.isPending

  const handleDeleteCourse = async (id: string) => {
    try {
      await deleteCourse.mutateAsync(id)
      showToast('Դասընթացը ջնջվեց', 'success')
    } catch {
      showToast('Սխալ դասընթացը ջնջելիս', 'error')
    }
  }

  return {
    showCourseForm,
    courseForm,
    setCourseForm,
    startNewCourse,
    editCourse,
    cancelNewCourse,
    addLearningPoint,
    changeLearningPoint,
    removeLearningPoint,
    submitCourse,
    deleteCourse: handleDeleteCourse,
    courses,
    isLoading,
    getCourseFirstVideoUrl,
    editingCourseId,
    editingCourse
  }
}

// Re-export տիպեր՝ օգտագործողների համար
export type { CourseForm, ExtendedCourse }
export * from './courseTypes'
export * from './useCourseQueries'
export * from './useCourseForm'
