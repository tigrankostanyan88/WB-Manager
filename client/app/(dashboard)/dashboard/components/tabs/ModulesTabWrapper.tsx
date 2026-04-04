'use client'

import { ModulesTab } from '@/components/features/admin/tabs/modules/ModulesTab'
import { ModulesTabSkeleton } from '@/components/features/admin/tabs/modules/ModulesTabSkeleton'
import { useModulesTab } from '@/app/(dashboard)/dashboard/hooks'

interface ModulesTabWrapperProps {
  showToast: (message: string, type?: 'success' | 'error') => void
}

export function ModulesTabWrapper({ showToast }: ModulesTabWrapperProps) {
  const modules = useModulesTab({ activeTab: 'modules', showToast })
  
  if (modules.isLoading) {
    return <ModulesTabSkeleton />
  }
  
  return (
    <ModulesTab
      showModuleForm={modules.showModuleForm}
      setShowModuleForm={modules.setShowModuleForm}
      moduleForm={modules.moduleForm}
      setModuleForm={modules.setModuleForm}
      allModules={modules.allModules}
      courses={modules.courses}
      isLoading={modules.isLoading}
      editingId={modules.editingId}
      startNewModule={modules.startNewModule}
      editModule={modules.editModule}
      cancelNewModule={modules.cancelNewModule}
      submitModule={modules.submitModule}
      deleteModule={modules.deleteModule}
      videoFile={modules.videoFile}
      isUploadingVideo={modules.isUploadingVideo}
      currentModuleVideos={modules.currentModuleVideos}
      deleteModuleVideo={modules.deleteModuleVideo}
      updateModuleVideo={modules.updateModuleVideo}
      handleVideoFileChange={modules.handleVideoFileChange}
      uploadModuleVideo={modules.uploadModuleVideo}
      getVideoUrl={modules.getVideoUrl}
    />
  )
}
