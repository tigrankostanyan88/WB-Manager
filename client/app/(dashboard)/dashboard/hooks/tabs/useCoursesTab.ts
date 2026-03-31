'use client'

import { useCourses } from '@/components/features/admin/hooks/useCourses'

interface UseCoursesTabProps {
  activeTab: string
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
  } = useCourses({ activeTab: activeTab as any, showToast })

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
