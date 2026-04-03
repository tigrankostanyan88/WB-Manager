'use client'

import useInstructor from '@/hooks/admin/useInstructor'

interface UseInstructorTabProps {
  activeTab: string
  allowed: boolean
  showToast: (message: string, type: 'success' | 'error') => void
}

export function useInstructorTab({ activeTab, allowed, showToast }: UseInstructorTabProps) {
  const {
    instructorForm,
    instructorErrors,
    isInstructorLoading,
    onAvatarFile,
    onTitleChange,
    onNameChange,
    onProfessionChange,
    onDescriptionChange,
    onBadgeTextChange,
    onStatValueChange,
    saveInstructor,
    cropModalOpen,
    cropImage,
    crop,
    zoom,
    setCrop,
    setZoom,
    onCropComplete,
    closeCropModal,
    confirmCrop
  } = useInstructor({ activeTab, allowed, showToast })

  return {
    instructorForm,
    instructorErrors,
    isInstructorLoading,
    onAvatarFile,
    onTitleChange,
    onNameChange,
    onProfessionChange,
    onDescriptionChange,
    onBadgeTextChange,
    onStatValueChange,
    saveInstructor,
    cropModalOpen,
    cropImage,
    crop,
    zoom,
    setCrop,
    setZoom,
    onCropComplete,
    closeCropModal,
    confirmCrop
  }
}
