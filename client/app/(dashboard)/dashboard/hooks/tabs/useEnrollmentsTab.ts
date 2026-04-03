'use client'

import { useEnrollments } from '@/hooks/admin/useEnrollments'

interface UseEnrollmentsTabProps {
  activeTab: string
  allowed: boolean
}

export function useEnrollmentsTab({ activeTab, allowed }: UseEnrollmentsTabProps) {
  const {
    enrollments,
    courses,
    enrollmentsByCourse,
    isLoading,
    selectedCourse,
    setSelectedCourse,
    searchTerm,
    setSearchTerm,
    revokeAccess
  } = useEnrollments({ activeTab, allowed })

  return {
    enrollments,
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
