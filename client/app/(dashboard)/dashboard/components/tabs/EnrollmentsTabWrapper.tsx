'use client'

import { CourseRegistrationsTab } from '@/components/features/admin/tabs/course-registrations/CourseRegistrationsTab'
import { useEnrollmentsTab } from '@/app/(dashboard)/dashboard/hooks'

interface EnrollmentsTabWrapperProps {
  allowed: boolean
}

export function EnrollmentsTabWrapper({ allowed }: EnrollmentsTabWrapperProps) {
  const registrations = useEnrollmentsTab({ activeTab: 'enrollments', allowed })

  return (
    <CourseRegistrationsTab
      registrations={registrations.registrations}
      isLoading={registrations.isLoading}
      isDeleting={registrations.isDeleting}
      onDelete={registrations.deleteRegistration}
      onMarkViewed={registrations.markAsViewed}
    />
  )
}
