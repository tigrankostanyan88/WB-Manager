'use client'

import { useCourseRegistrations } from '@/components/features/admin/hooks/useCourseRegistrations'

interface UseCourseRegistrationsTabProps {
  activeTab: string
  allowed: boolean
}

export function useCourseRegistrationsTab({ activeTab, allowed }: UseCourseRegistrationsTabProps) {
  const {
    registrations,
    isLoading,
    isDeleting,
    deleteRegistration
  } = useCourseRegistrations({ activeTab, allowed })

  return {
    registrations,
    isLoading,
    isDeleting,
    deleteRegistration
  }
}
