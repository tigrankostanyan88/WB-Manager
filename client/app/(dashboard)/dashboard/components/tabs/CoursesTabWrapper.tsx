'use client'

import { CoursesTab } from '@/components/features/admin/tabs/courses/CoursesTab'
import { CoursesTabSkeleton } from '@/components/features/admin/tabs/courses/CoursesTabSkeleton'
import { useCoursesTab } from '@/app/(dashboard)/dashboard/hooks'

interface CoursesTabWrapperProps {
  showToast: (message: string, type?: 'success' | 'error') => void
}

export function CoursesTabWrapper({ showToast }: CoursesTabWrapperProps) {
  const courses = useCoursesTab({ activeTab: 'courses', showToast })
  
  if (courses.isLoading) {
    return <CoursesTabSkeleton />
  }
  
  return (
    <CoursesTab
      showCourseForm={courses.showCourseForm}
      courseForm={courses.courseForm}
      setCourseForm={courses.setCourseForm}
      startNewCourse={courses.startNewCourse}
      editCourse={courses.editCourse}
      deleteCourse={courses.deleteCourse}
      cancelNewCourse={courses.cancelNewCourse}
      addLearningPoint={courses.addLearningPoint}
      changeLearningPoint={courses.changeLearningPoint}
      removeLearningPoint={courses.removeLearningPoint}
      submitCourse={courses.submitCourse}
      courses={courses.courses}
      isLoading={courses.isLoading}
      getCourseFirstVideoUrl={courses.getCourseFirstVideoUrl}
      editingCourse={courses.editingCourse}
    />
  )
}
