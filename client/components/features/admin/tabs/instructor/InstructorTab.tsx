// tabs/instructor/InstructorTab.tsx - Main instructor tab orchestrator

import { Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { InstructorPhoto } from './InstructorPhoto'
import { InstructorFormFields } from './InstructorFormFields'
import type { InstructorTabProps } from './types'

export function InstructorTab({
  instructorForm,
  instructorErrors,
  isInstructorLoading,
  onAvatarFileSelect,
  onTitleChange,
  onNameChange,
  onProfessionChange,
  onDescriptionChange,
  onBadgeTextChange,
  onStatValueChange,
  onSubmit
}: InstructorTabProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Մենթոր</h2>
        <Button
          type="submit"
          className="rounded-lg bg-violet-600 hover:bg-violet-700"
          disabled={isInstructorLoading}
        >
          {isInstructorLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Պահպանել
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-0">
          <InstructorPhoto
            avatarUrl={instructorForm.avatarUrl}
            name={instructorForm.name}
            profession={instructorForm.profession}
            onAvatarFileSelect={onAvatarFileSelect}
          />
          <InstructorFormFields
            form={instructorForm}
            errors={instructorErrors}
            onTitleChange={onTitleChange}
            onBadgeTextChange={onBadgeTextChange}
            onNameChange={onNameChange}
            onProfessionChange={onProfessionChange}
            onDescriptionChange={onDescriptionChange}
            onStatValueChange={onStatValueChange}
          />
        </div>
      </div>
    </form>
  )
}

export default InstructorTab
