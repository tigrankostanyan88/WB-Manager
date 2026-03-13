'use client'

import { useState, useCallback, useEffect } from 'react'
import type { Instructor } from '../_types'

interface UseInstructorProps {
  activeTab: string
  allowed: boolean
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
}

export function useInstructor({ activeTab, allowed, showToast }: UseInstructorProps) {
  const [instructorForm, setInstructorForm] = useState({
    name: '',
    profession: '',
    description: '',
    avatar: ''
  })
  const [instructorErrors, setInstructorErrors] = useState<Record<string, string>>({})
  const [isInstructorLoading, setIsInstructorLoading] = useState(false)
  const [cropImage, setCropImage] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  const fetchInstructor = useCallback(async () => {
    if (activeTab !== 'instructor' || !allowed) return
    setIsInstructorLoading(true)
    try {
      const res = await fetch('/api/instructor')
      const data = await res.json()
      if (data.instructor) {
        setInstructorForm({
          name: data.instructor.name || '',
          profession: data.instructor.profession || '',
          description: data.instructor.description || '',
          avatar: data.instructor.avatar || ''
        })
      }
    } catch (error) {
      console.error('Error fetching instructor:', error)
    } finally {
      setIsInstructorLoading(false)
    }
  }, [activeTab, allowed])

  useEffect(() => {
    fetchInstructor()
  }, [fetchInstructor])

  const onAvatarFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setCropImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const onNameChange = useCallback((value: string) => {
    setInstructorForm(prev => ({ ...prev, name: value }))
  }, [])

  const onProfessionChange = useCallback((value: string) => {
    setInstructorForm(prev => ({ ...prev, profession: value }))
  }, [])

  const onDescriptionChange = useCallback((value: string) => {
    setInstructorForm(prev => ({ ...prev, description: value }))
  }, [])

  const onStatValueChange = useCallback((index: number, field: string, value: string) => {
    // Implementation for stats if needed
  }, [])

  const saveInstructor = useCallback(async () => {
    try {
      const res = await fetch('/api/instructor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(instructorForm)
      })
      if (res.ok) {
        showToast('Մենթորի տվյալները պահպանված են')
      } else {
        showToast('Սխալ է տեղի ունեցել', 'error')
      }
    } catch {
      showToast('Սխալ է տեղի ունեցել', 'error')
    }
  }, [instructorForm, showToast])

  const onCropComplete = useCallback(() => {
    if (cropImage) {
      setInstructorForm(prev => ({ ...prev, avatar: cropImage }))
    }
  }, [cropImage])

  const onCropConfirm = useCallback(() => {
    if (cropImage) {
      setInstructorForm(prev => ({ ...prev, avatar: cropImage }))
    }
    setCropImage(null)
  }, [cropImage])

  const onCropClose = useCallback(() => {
    setCropImage(null)
  }, [])

  return {
    instructorForm,
    instructorErrors,
    isInstructorLoading,
    onAvatarFile,
    onNameChange,
    onProfessionChange,
    onDescriptionChange,
    onStatValueChange,
    saveInstructor,
    cropImage,
    crop,
    zoom,
    setCrop,
    setZoom,
    onCropComplete,
    onCropConfirm,
    onCropClose
  }
}
