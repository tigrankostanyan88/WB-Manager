// tabs/modules/ModulesTab.tsx - Main module tab orchestrator

'use client'

import type { ModuleItem, ModuleFile, CourseOption } from '@/hooks/admin/modules/types'
import { ModuleForm } from './ModuleForm'
import { ModuleList } from './ModuleList'

interface ModulesTabProps {
  showModuleForm: boolean
  setShowModuleForm: (show: boolean) => void
  moduleForm: { title: string; description: string; courseId: string }
  setModuleForm: React.Dispatch<React.SetStateAction<{ title: string; description: string; courseId: string }>>
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

export function ModulesTab({
  showModuleForm,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setShowModuleForm,
  moduleForm,
  setModuleForm,
  allModules,
  courses,
  isLoading,
  editingId,
  startNewModule,
  editModule,
  cancelNewModule,
  submitModule,
  deleteModule,
  videoFile,
  isUploadingVideo,
  currentModuleVideos,
  deleteModuleVideo,
  updateModuleVideo,
  handleVideoFileChange,
  uploadModuleVideo,
  getVideoUrl,
}: ModulesTabProps) {
  if (showModuleForm) {
    return (
      <ModuleForm
        moduleForm={moduleForm}
        setModuleForm={setModuleForm}
        courses={courses}
        editingId={editingId}
        currentModuleVideos={currentModuleVideos}
        videoFile={videoFile}
        isUploadingVideo={isUploadingVideo}
        onSubmit={submitModule}
        onCancel={cancelNewModule}
        onVideoFileChange={handleVideoFileChange}
        onUploadVideo={uploadModuleVideo}
        onDeleteVideo={deleteModuleVideo}
        onUpdateVideo={updateModuleVideo}
        getVideoUrl={getVideoUrl}
      />
    )
  }

  return (
    <ModuleList
      modules={allModules}
      courses={courses}
      isLoading={isLoading}
      onAdd={startNewModule}
      onEdit={editModule}
      onDelete={deleteModule}
    />
  )
}

// Default export for dynamic imports
export default ModulesTab
