'use client'

import { CourseRegistrationsTab } from '@/components/features/admin/tabs/course-registrations/CourseRegistrationsTab'
import { useCourseRegistrationsTab } from '@/app/(dashboard)/dashboard/hooks'

interface CourseRegistrationsTabWrapperProps {
  allowed: boolean
}

export function CourseRegistrationsTabWrapper({ allowed }: CourseRegistrationsTabWrapperProps) {
  const registrations = useCourseRegistrationsTab({ activeTab: 'enrollments', allowed })
  return (
    <CourseRegistrationsTab
      registrations={registrations.registrations}
      isLoading={registrations.isLoading}
      isDeleting={registrations.isDeleting}
      onDelete={registrations.deleteRegistration}
    />
  )
}
