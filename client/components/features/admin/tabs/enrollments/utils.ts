// Enrollments types and utilities

export interface Student {
  id: number | string
  name?: string
  email?: string
  phone?: string
  role?: string
}

export interface Course {
  id: number | string
  title: string
  description?: string
}

export interface Enrollment {
  id: number
  user_id: number
  course_id: number
  status: 'active' | 'expired' | 'pending'
  price_paid: number
  payment_method: string
  createdAt: string
  student?: Student
  course?: Course
}

export interface CourseEnrollmentGroup {
  course: Course
  enrollments: Enrollment[]
  count: number
  activeCount: number
  expiredCount: number
}

export interface EnrollmentsTabProps {
  enrollments: Enrollment[]
  courses: { id: number | string; title: string }[]
  enrollmentsByCourse: CourseEnrollmentGroup[]
  isLoading: boolean
  selectedCourse: number | null
  setSelectedCourse: (id: number | null) => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  revokeAccess: (userId: number, courseId: number) => Promise<boolean>
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('hy-AM', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
