// tabs/modules/types.ts - Module tab shared types

import type { ModuleItem, ModuleFile, CourseOption } from '@/hooks/admin/modules/types'

export interface ModuleFormData {
  title: string
  description: string
  courseId: string
}

export interface ModulesTabProps {
  showModuleForm: boolean
  moduleForm: ModuleFormData
  setModuleForm: React.Dispatch<React.SetStateAction<ModuleFormData>>
  allModules: ModuleItem[]
  courses: CourseOption[]
  isLoading: boolean
  editingId: string | null
  startNewModule: () => void
  editModule: (module: ModuleItem) => void
  cancelNewModule: () => void
  submitModule: (e: React.FormEvent) => Promise<void>
  deleteModule: (id: string) => void
  videoFile: File | null
  isUploadingVideo: boolean
  currentModuleVideos: ModuleFile[]
  deleteModuleVideo: (videoId: string) => void
  updateModuleVideo: (videoId: string, title: string) => void
  handleVideoFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  uploadModuleVideo: () => void
  getVideoUrl: (file: ModuleFile) => string
}
