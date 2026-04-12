'use client'

import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { queryKeys } from '@/lib/queryKeys'
import type { Enrollment, Course } from '@/components/features/admin/types'

interface UseEnrollmentsParams {
  activeTab: string
  allowed: boolean
}

// React Query Hooks
export function useEnrollmentsQuery() {
  return useQuery({
    queryKey: queryKeys.enrollments,
    queryFn: async () => {
      const res = await api.get('/api/v1/student-courses')
      return (res.data?.data || []) as Enrollment[]
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function useEnrollmentCoursesQuery() {
  return useQuery({
    queryKey: queryKeys.courses,
    queryFn: async () => {
      const res = await api.get('/api/v1/courses')
      const data = res.data?.data || []
      return data.map((c: { id: number; title: string }) => ({ id: c.id, title: c.title })) as Course[]
    },
    staleTime: 1000 * 60 * 10,
  })
}

export function useRevokeAccess() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, courseId }: { userId: number; courseId: number }) => {
      await api.post('/api/v1/student-courses/revoke', { userId, courseId })
      return { userId, courseId }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.enrollments })
    },
  })
}

// Main Hook
export function useEnrollments({ activeTab, allowed }: UseEnrollmentsParams) {
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const { data: enrollments = [], isLoading: isEnrollmentsLoading } = useEnrollmentsQuery()
  const { data: courses = [], isLoading: isCoursesLoading } = useEnrollmentCoursesQuery()
  const revokeAccessMutation = useRevokeAccess()

  const isLoading = isEnrollmentsLoading || isCoursesLoading

  const filteredEnrollments = useMemo(() => {
    return enrollments.filter((enrollment) => {
      const matchesCourse = selectedCourse ? enrollment.course_id === selectedCourse : true
      const matchesSearch = searchTerm
        ? enrollment.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          enrollment.student?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          enrollment.course?.title?.toLowerCase().includes(searchTerm.toLowerCase())
        : true
      return matchesCourse && matchesSearch
    })
  }, [enrollments, selectedCourse, searchTerm])

  const enrollmentsByCourse = useMemo(() => {
    return courses
      .map((course) => {
        const courseEnrollments = enrollments.filter((e) => e.course_id === course.id)
        const count = courseEnrollments.length
        const activeCount = courseEnrollments.filter((e) => e.status === 'active').length
        const expiredCount = courseEnrollments.filter((e) => e.status === 'expired').length
        return {
          course,
          enrollments: courseEnrollments,
          count,
          activeCount,
          expiredCount,
        }
      })
      .filter((c) => c.count > 0)
  }, [courses, enrollments])

  const revokeAccess = async (userId: number, courseId: number) => {
    try {
      await revokeAccessMutation.mutateAsync({ userId, courseId })
      return true
    } catch {
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
    revokeAccess,
  }
}
