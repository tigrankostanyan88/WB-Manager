'use client'

import { useInstructor } from '@/hooks/useInstructor'
import useCrop from '@/hooks/admin/useCrop'
import { useState, useEffect, useCallback } from 'react'
import api from '@/lib/api'
import type { InstructorForm, InstructorErrors } from '@/components/features/admin/tabs/instructor/types'

interface UseInstructorTabParams {
  activeTab: string
  allowed: boolean
  showToast: (message: string, type?: 'success' | 'error') => void
}

export function useInstructorTab({ activeTab, allowed, showToast }: UseInstructorTabParams) {
  const { instructor, loading: isInstructorLoading } = useInstructor()
  const crop = useCrop({ setSiteSettings: () => {} })
  
  const [instructorForm, setInstructorForm] = useState<InstructorForm>({
    title: '',
    name: '',
    profession: '',
    description: '',
    badgeText: '',
    avatarUrl: '',
    stats: []
  })
  
  const [instructorErrors, setInstructorErrors] = useState<InstructorErrors>({
    name: false,
    profession: false,
    description: false,
    stats: []
  })
  
  const [cropModalOpen, setCropModalOpen] = useState(false)
  const [cropImage, setCropImage] = useState<string | null>(null)

  // Populate form from instructor data
  useEffect(() => {
    if (instructor) {
      setInstructorForm({
        title: instructor.title || '',
        name: instructor.name || '',
        profession: instructor.profession || '',
        description: instructor.description || '',
        badgeText: instructor.badgeText || ''
      })
    }
  }, [instructor])

  const onAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    crop.onLogoFileSelect(e)
  }

  const onTitleChange = (value: string) => {
    setInstructorForm(prev => ({ ...prev, title: value }))
  }

  const onNameChange = (value: string) => {
    setInstructorForm(prev => ({ ...prev, name: value }))
  }

  const onProfessionChange = (value: string) => {
    setInstructorForm(prev => ({ ...prev, profession: value }))
  }

  const onDescriptionChange = (value: string) => {
    setInstructorForm(prev => ({ ...prev, description: value }))
  }

  const onBadgeTextChange = (value: string) => {
    setInstructorForm(prev => ({ ...prev, badgeText: value }))
  }

  const onStatValueChange = (index: number, value: string) => {
    // Handle stat value changes
  }

  const saveInstructor = useCallback(async () => {
    try {
      // Save instructor logic here
      showToast('Դասընթացավարը պահպանված է', 'success')
    } catch {
      showToast('Սխալ պահպանելիս', 'error')
    }
  }, [instructorForm, showToast])

  const closeCropModal = () => {
    crop.closeCrop()
  }

  const confirmCrop = async () => {
    await crop.createCroppedImage()
  }

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
    // Crop modal props
    cropModalOpen: crop.cropModalOpen,
    cropImage: crop.cropImage,
    crop: crop.crop,
    zoom: crop.zoom,
    setCrop: crop.setCrop,
    setZoom: crop.setZoom,
    onCropComplete: crop.onCropComplete,
    closeCropModal,
    confirmCrop
  }
}
