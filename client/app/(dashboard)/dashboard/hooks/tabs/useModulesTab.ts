'use client'

import { useModules } from '@/components/features/admin/hooks/modules/useModules'

interface UseModulesTabProps {
  activeTab: string
  showToast: (message: string, type: 'success' | 'error') => void
}

export function useModulesTab({ activeTab, showToast }: UseModulesTabProps) {
  const {
    showModuleForm,
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
    getVideoUrl
  } = useModules({ activeTab: activeTab as any, showToast })

  return {
    showModuleForm,
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
    getVideoUrl
  }
}
