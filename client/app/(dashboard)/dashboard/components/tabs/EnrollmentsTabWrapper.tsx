'use client'

import { EnrollmentsTab } from '@/components/features/admin/tabs/enrollments/EnrollmentsTab'
import { EnrollmentsTabSkeleton } from '@/components/features/admin/tabs/enrollments/EnrollmentsTabSkeleton'
import { useEnrollmentsTab } from '@/app/(dashboard)/dashboard/hooks'

interface EnrollmentsTabWrapperProps {
  allowed: boolean
}

export function EnrollmentsTabWrapper({ allowed }: EnrollmentsTabWrapperProps) {
  const enrollments = useEnrollmentsTab({ activeTab: 'enrollments', allowed })
  
  if (enrollments.isLoading) {
    return <EnrollmentsTabSkeleton />
  }
  
  return (
    <EnrollmentsTab
      enrollments={enrollments.enrollments}
      courses={enrollments.courses}
      enrollmentsByCourse={enrollments.enrollmentsByCourse}
      isLoading={enrollments.isLoading}
      selectedCourse={enrollments.selectedCourse}
      setSelectedCourse={enrollments.setSelectedCourse}
      searchTerm={enrollments.searchTerm}
      setSearchTerm={enrollments.setSearchTerm}
      revokeAccess={enrollments.revokeAccess}
    />
  )
}
