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
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  
  interface AvatarUpdaterState {
    logo?: string
    logoFile?: File
  }
  type AvatarUpdater = (prev: AvatarUpdaterState) => AvatarUpdaterState | AvatarUpdaterState

  const setInstructorAvatar = useCallback((updater: AvatarUpdater | AvatarUpdaterState) => {
    const newState = typeof updater === 'function' ? (updater as AvatarUpdater)({}) : updater
    if (newState.logo) {
      setInstructorForm(prev => ({ ...prev, avatarUrl: newState.logo }))
      setAvatarFile(newState.logoFile || null)
    }
  }, [])
  
  const crop = useCrop({ setSiteSettings: setInstructorAvatar, skipGlobalUpdate: true })
  
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
  const [isSaving, setIsSaving] = useState(false)

  // Populate form from instructor data
  useEffect(() => {
    if (instructor) {
      setInstructorForm({
        title: instructor.title || '',
        name: instructor.name || '',
        profession: instructor.profession || '',
        description: instructor.description || '',
        badgeText: instructor.badgeText || '',
        avatarUrl: instructor.avatarUrl || '',
        stats: instructor.stats || []
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
    const statLabels = ['Հաջողակ ուսանողներ', 'Շրջանառություն', 'Փորձ', 'Աջակցություն']
    setInstructorForm(prev => {
      const newStats = [...(prev.stats || [])]
      newStats[index] = {
        ...newStats[index],
        value,
        label: statLabels[index]
      }
      return { ...prev, stats: newStats }
    })
  }

  const saveInstructor = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault()
    setIsSaving(true)
    try {
      const formData = new FormData()
      formData.append('title', instructorForm.title)
      formData.append('name', instructorForm.name)
      formData.append('profession', instructorForm.profession)
      formData.append('description', instructorForm.description)
      formData.append('badgeText', instructorForm.badgeText)
      formData.append('stats_json', JSON.stringify(instructorForm.stats.length > 0 ? instructorForm.stats : []))
      if (avatarFile) {
        formData.append('avatar', avatarFile)
      }

      await api.post('/api/v1/instructor', formData)

      showToast('Դասընթացավարը պահպանված է', 'success')
    } catch {
      showToast('Սխալ պահպանելիս', 'error')
    } finally {
      setIsSaving(false)
    }
  }, [instructorForm, avatarFile, showToast])

  const closeCropModal = () => {
    crop.closeCrop()
  }

  const confirmCrop = async () => {
    await crop.createCroppedImage()
  }

  const skipCrop = () => {
    crop.skipCrop()
  }

  return {
    instructorForm,
    instructorErrors,
    isInstructorLoading,
    isSaving,
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
    confirmCrop,
    skipCrop
  }
}
