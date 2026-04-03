'use client'

import type { DashboardTabId } from '@/components/features/admin/types'
import { useModules } from '@/hooks/admin/modules/useModules'

interface UseModulesTabProps {
  activeTab: DashboardTabId
  showToast: (message: string, type?: 'success' | 'error') => void
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
  } = useModules({ activeTab, showToast })

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
