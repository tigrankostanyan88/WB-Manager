// tabs/instructor/types.ts - Instructor tab types

export interface InstructorStat {
  value: string
  label: string
  icon?: 'users' | 'revenue' | 'experience' | 'support'
}

export interface InstructorForm {
  title: string
  name: string
  profession: string
  description: string
  badgeText: string
  avatarUrl: string
  stats: InstructorStat[]
}

export interface InstructorErrors {
  name: boolean
  profession: boolean
  description: boolean
  stats: boolean[]
}

export interface InstructorTabProps {
  instructorForm: InstructorForm
  instructorErrors: InstructorErrors
  isInstructorLoading: boolean
  onAvatarFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  onTitleChange: (value: string) => void
  onNameChange: (value: string) => void
  onProfessionChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onBadgeTextChange: (value: string) => void
  onStatValueChange: (index: number, value: string) => void
  onSubmit: (e: React.FormEvent) => void
  // Crop modal props
  cropModalOpen?: boolean
  cropImage?: string | null
  crop?: { x: number; y: number }
  zoom?: number
  setCrop?: (crop: { x: number; y: number }) => void
  setZoom?: (zoom: number) => void
  onCropComplete?: (croppedArea: any, croppedAreaPixels: any) => void
  closeCropModal?: () => void
  confirmCrop?: () => void
}

export const statConfig = [
  { label: 'Հաջողակ ուսանողներ', icon: 'users' as const, color: 'text-violet-500', bg: 'bg-violet-50' },
  { label: 'Շրջանառություն', icon: 'revenue' as const, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { label: 'Փորձ', icon: 'experience' as const, color: 'text-orange-500', bg: 'bg-orange-50' },
  { label: 'Աջակցություն', icon: 'support' as const, color: 'text-blue-500', bg: 'bg-blue-50' }
]
