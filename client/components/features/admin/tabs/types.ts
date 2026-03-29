import type { CourseForm } from '@/components/features/admin/hooks/useCourses'
import type { Course } from '@/components/features/admin/types'

export interface CoursesTabProps {
  showCourseForm: boolean
  courseForm: CourseForm
  setCourseForm: React.Dispatch<React.SetStateAction<CourseForm>>
  startNewCourse: () => void
  editCourse: (course: Course) => void
  deleteCourse: (id: string) => Promise<void>
  cancelNewCourse: () => void
  submitCourse: (e: React.FormEvent) => Promise<void>
  courses: Course[]
  isLoading: boolean
  onImageFileSelect?: (e: React.ChangeEvent<HTMLInputElement>) => void
  addLearningPoint: () => void
  changeLearningPoint: (index: number, value: string) => void
  removeLearningPoint: (index: number) => void
  getCourseFirstVideoUrl: (course: Course) => string | null
  editingCourse?: Course | null
}
