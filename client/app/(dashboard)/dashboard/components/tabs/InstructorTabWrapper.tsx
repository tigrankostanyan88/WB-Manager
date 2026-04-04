'use client'

import { InstructorTab } from '@/components/features/admin/tabs/instructor/InstructorTab'
import { InstructorTabSkeleton } from '@/components/features/admin/tabs/instructor/InstructorTabSkeleton'
import { useInstructorTab } from '@/app/(dashboard)/dashboard/hooks'

interface InstructorTabWrapperProps {
  allowed: boolean
  showToast: (message: string, type?: 'success' | 'error') => void
}

export function InstructorTabWrapper({ allowed, showToast }: InstructorTabWrapperProps) {
  const instructor = useInstructorTab({ activeTab: 'instructor', allowed, showToast })
  
  if (instructor.isInstructorLoading) {
    return <InstructorTabSkeleton />
  }
  
  return (
    <InstructorTab
      instructorForm={instructor.instructorForm}
      instructorErrors={instructor.instructorErrors}
      isInstructorLoading={instructor.isInstructorLoading}
      onAvatarFileSelect={instructor.onAvatarFile}
      onTitleChange={instructor.onTitleChange}
      onNameChange={instructor.onNameChange}
      onProfessionChange={instructor.onProfessionChange}
      onDescriptionChange={instructor.onDescriptionChange}
      onBadgeTextChange={instructor.onBadgeTextChange}
      onStatValueChange={instructor.onStatValueChange}
      onSubmit={instructor.saveInstructor}
    />
  )
}
