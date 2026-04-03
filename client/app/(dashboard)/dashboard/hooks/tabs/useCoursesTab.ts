'use client'

import type { DashboardTabId } from '@/components/features/admin/types'
import { useCourses } from '@/hooks/admin/useCourses'

interface UseCoursesTabProps {
  activeTab: DashboardTabId
  showToast: (message: string, type?: 'success' | 'error') => void
}

export function useCoursesTab({ activeTab, showToast }: UseCoursesTabProps) {
  const {
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
    deleteCourse,
    courses,
    isLoading,
    getCourseFirstVideoUrl,
    editingCourse
  } = useCourses({ activeTab, showToast })

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
    deleteCourse,
    courses,
    isLoading,
    getCourseFirstVideoUrl,
    editingCourse
  }
}
