import { useEffect, useState } from 'react'
import api from '@/lib/api'

export interface Enrollment {
  id: number
  user_id: number
  course_id: number
  status: 'active' | 'expired' | 'pending'
  price_paid: number
  payment_method: string
  createdAt: string
  updatedAt: string
  student?: {
    id: number
    name: string
    email: string
    phone?: string
    role: string
  }
  course?: {
    id: number
    title: string
    description?: string
  }
}

export interface Course {
  id: number
  title: string
}

export function useEnrollments({ activeTab, allowed }: { activeTab: string; allowed: boolean }) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch all enrollments
  useEffect(() => {
    if (activeTab !== 'enrollments' || !allowed) return

    const fetchEnrollments = async () => {
      setIsLoading(true)
      try {
        const res = await api.get('/api/v1/student-courses')
        const data = res.data?.data || []
        setEnrollments(data)
      } catch (err) {
        console.error('Failed to fetch enrollments:', err)
        setEnrollments([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchEnrollments()
  }, [activeTab, allowed])

  // Fetch courses for filter dropdown
  useEffect(() => {
    if (activeTab !== 'enrollments' || !allowed) return

    const fetchCourses = async () => {
      try {
        const res = await api.get('/api/v1/courses')
        const data = res.data?.data || []
        setCourses(data.map((c: any) => ({ id: c.id, title: c.title })))
      } catch (err) {
        console.error('Failed to fetch courses:', err)
        setCourses([])
      }
    }

    fetchCourses()
  }, [activeTab, allowed])

  // Filter enrollments by course and search term
  const filteredEnrollments = enrollments.filter((enrollment) => {
    const matchesCourse = selectedCourse ? enrollment.course_id === selectedCourse : true
    const matchesSearch = searchTerm
      ? enrollment.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.student?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.course?.title?.toLowerCase().includes(searchTerm.toLowerCase())
      : true
    return matchesCourse && matchesSearch
  })

  // Group enrollments by course
  const enrollmentsByCourse = courses.map((course) => ({
    course,
    enrollments: enrollments.filter((e) => e.course_id === course.id),
    count: enrollments.filter((e) => e.course_id === course.id).length
  })).filter((c) => c.count > 0)

  const revokeAccess = async (userId: number, courseId: number) => {
    try {
      await api.post('/api/v1/student-courses/revoke', { userId, courseId })
      setEnrollments((prev) =>
        prev.map((e) =>
          e.user_id === userId && e.course_id === courseId ? { ...e, status: 'expired' as const } : e
        )
      )
      return true
    } catch (err) {
      console.error('Failed to revoke access:', err)
      return false
    }
  }

  return {
    enrollments: filteredEnrollments,
    allEnrollments: enrollments,
    courses,
    enrollmentsByCourse,
    isLoading,
    selectedCourse,
    setSelectedCourse,
    searchTerm,
    setSearchTerm,
    revokeAccess
  }
}
