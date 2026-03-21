'use client'

import { useEffect, useState, useCallback } from 'react'
import api from '@/lib/api'
import type { Area, Point } from 'react-easy-crop'
import type { DashboardTabId, InstructorErrors, InstructorForm } from '../_types'
import { fixLarge, withOrigin } from '../_utils/image'

// Helper function to create cropped image
const createImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })

const getRadianAngle = (degreeValue: number) => (degreeValue * Math.PI) / 180

const rotateSize = (width: number, height: number, rotation: number) => {
  const rotRad = getRadianAngle(rotation)
  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height)
  }
}

const getCroppedImg = async (imageSrc: string, pixelCrop: Area, rotation = 0) => {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('No canvas context')

  const rotRad = getRadianAngle(rotation)
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(image.width, image.height, rotation)
  canvas.width = bBoxWidth
  canvas.height = bBoxHeight

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
  ctx.rotate(rotRad)
  ctx.translate(-image.width / 2, -image.height / 2)
  ctx.drawImage(image, 0, 0)

  const data = ctx.getImageData(pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height)
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height
  ctx.putImageData(data, 0, 0)

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error('Canvas is empty'))
      resolve(blob)
    }, 'image/png')
  })
}

interface UseInstructorParams {
  activeTab: DashboardTabId
  allowed: boolean
  showToast: (message: string, type?: 'success' | 'error') => void
}

const defaultStats = [
  { value: '500+', label: 'Հաջողակ ուսանողներ' },
  { value: '120M+', label: 'Ուսանողների ընդհանուր շրջանառություն' },
  { value: '5 տարի', label: 'Փորձ e-commerce ոլորտում' },
  { value: '24/7', label: 'Անհատական աջակցություն' }
]

export default function useInstructor({ activeTab, allowed, showToast }: UseInstructorParams) {
  const [isInstructorLoading, setIsInstructorLoading] = useState(false)
  const [instructorForm, setInstructorForm] = useState<InstructorForm>({
    title: 'Սովորեք Ուայլդբերիի Մասնագետից',
    name: '',
    profession: '',
    description: '',
    badgeText: 'Վերադարձված մենթորություն',
    avatarUrl: '',
    avatarFile: null,
    stats: [...defaultStats]
  })
  const [instructorErrors, setInstructorErrors] = useState<InstructorErrors>({
    name: false,
    profession: false,
    description: false,
    stats: [false, false, false, false]
  })
  
  // Crop modal state
  const [cropModalOpen, setCropModalOpen] = useState(false)
  const [cropImage, setCropImage] = useState<string | null>(null)
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)

  const extractErrorMessage = (err: unknown): string | null => {
    if (!err || typeof err !== 'object') return null
    const resp = (err as { response?: unknown }).response
    if (!resp || typeof resp !== 'object') return null
    const data = (resp as { data?: unknown }).data
    if (!data || typeof data !== 'object') return null
    const msg = (data as { message?: unknown }).message
    return typeof msg === 'string' ? msg : null
  }

  useEffect(() => {
    if (!allowed) return
    if (activeTab !== 'instructor') return
    let cancelled = false
    ;(async () => {
      setIsInstructorLoading(true)
      try {
        const res = await api.get('/api/v1/instructor')
        console.log('Instructor API response:', res.data)
        const payload = res.data as { instructors?: unknown }
        const list = Array.isArray(payload.instructors) ? payload.instructors : []
        console.log('Instructor list:', list)
        const first = list[0]
        const data = first && typeof first === 'object' ? (first as Record<string, unknown>) : {}
        console.log('First instructor data:', data)

        let statsArr: unknown[] = []
        const statsJson = data.stats_json
        if (typeof statsJson === 'string' && statsJson) {
          try {
            const parsed = JSON.parse(statsJson) as unknown
            statsArr = Array.isArray(parsed) ? parsed : []
          } catch {
            statsArr = []
          }
        } else if (Array.isArray(data.stats)) {
          statsArr = data.stats as unknown[]
        }
        
        const normalizedStats = statsArr.length
          ? statsArr.map((s, i) => {
              const rec = s && typeof s === 'object' ? (s as Record<string, unknown>) : {}
              return { 
                value: String(rec.value ?? defaultStats[i]?.value ?? ''), 
                label: String(rec.label ?? defaultStats[i]?.label ?? '') 
              }
            })
          : [...defaultStats]

        if (!cancelled) {
          // Debug: log all possible avatar-related fields
          console.log('DEBUG - All data fields:', Object.keys(data))
          console.log('DEBUG - avatar_url:', data.avatar_url)
          console.log('DEBUG - files:', data.files)
          
          // DEBUG: Always use hardcoded test image for now
          const rawAvatar = '/images/instructors/large/26bb2cffb8d9f89f66ce033a6b4c3d476df8d8ee.png'
          console.log('DEBUG - Using hardcoded avatar:', rawAvatar)
          
          const fixedAvatar = fixLarge(rawAvatar)
          const finalAvatar = withOrigin(fixedAvatar) || ''
          
          console.log('DEBUG - Final avatar URL:', finalAvatar)
          
          setInstructorForm({
            title: typeof data.title === 'string' ? data.title : 'Սովորեք Ուայլդբերիի Մասնագետից',
            name: typeof data.name === 'string' ? data.name : '',
            profession: typeof data.profession === 'string' ? data.profession : '',
            description: typeof data.description === 'string' ? data.description : '',
            badgeText: typeof data.badge_text === 'string' ? data.badge_text : 'Վերադարձված մենթորություն',
            avatarUrl: finalAvatar,
            avatarFile: null,
            stats: normalizedStats
          })
        }
      } finally {
        if (!cancelled) setIsInstructorLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [activeTab, allowed])

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPx: Area) => {
    setCroppedAreaPixels(croppedAreaPx)
  }, [])

  const onAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    const url = URL.createObjectURL(f)
    setCropImage(url)
    setPendingFile(f)
    setCropModalOpen(true)
  }
  
  const closeCropModal = () => {
    setCropModalOpen(false)
    setCropImage(null)
    setPendingFile(null)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
  }
  
  const confirmCrop = async () => {
    if (!cropImage || !croppedAreaPixels || !pendingFile) return
    try {
      const blob = await getCroppedImg(cropImage, croppedAreaPixels, 0)
      const file = new File([blob], `instructor_avatar_${Date.now()}.png`, { type: 'image/png' })
      const url = URL.createObjectURL(file)
      setInstructorForm((prev) => ({ ...prev, avatarFile: file, avatarUrl: url }))
      closeCropModal()
    } catch {
      showToast('Նկարի կտրման սխալ', 'error')
    }
  }

  const onTitleChange = (value: string) => {
    setInstructorForm((prev) => ({ ...prev, title: value }))
  }

  const onNameChange = (value: string) => {
    setInstructorForm((prev) => ({ ...prev, name: value }))
    if (instructorErrors.name && value.trim()) {
      setInstructorErrors((err) => ({ ...err, name: false }))
    }
  }

  const onProfessionChange = (value: string) => {
    setInstructorForm((prev) => ({ ...prev, profession: value }))
    if (instructorErrors.profession && value.trim()) {
      setInstructorErrors((err) => ({ ...err, profession: false }))
    }
  }

  const onDescriptionChange = (value: string) => {
    setInstructorForm((prev) => ({ ...prev, description: value }))
    if (instructorErrors.description && value.trim()) {
      setInstructorErrors((err) => ({ ...err, description: false }))
    }
  }

  const onBadgeTextChange = (value: string) => {
    setInstructorForm((prev) => ({ ...prev, badgeText: value }))
  }

  const onStatValueChange = (index: number, value: string) => {
    setInstructorForm((prev) => ({
      ...prev,
      stats: prev.stats.map((s, i) => (i === index ? { ...s, value } : s))
    }))
    if (instructorErrors.stats[index] && value.trim()) {
      setInstructorErrors((err) => {
        const arr = [...err.stats]
        arr[index] = false
        return { ...err, stats: arr }
      })
    }
  }

  const saveInstructor = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsInstructorLoading(true)
    try {
      const missing: string[] = []
      const statErrors = [false, false, false, false]
      
      if (!String(instructorForm.name || '').trim()) missing.push('Անուն')
      if (!String(instructorForm.profession || '').trim()) missing.push('Մասնագիտություն')
      if (!String(instructorForm.description || '').trim()) missing.push('Նկարագրություն')
      
      instructorForm.stats.forEach((s, i) => {
        if (!String(s.value || '').trim()) {
          missing.push(s.label)
          statErrors[i] = true
        }
      })
      
      if (missing.length) {
        setInstructorErrors({
          name: !String(instructorForm.name || '').trim(),
          profession: !String(instructorForm.profession || '').trim(),
          description: !String(instructorForm.description || '').trim(),
          stats: statErrors
        })
        showToast('Լրացրու պարտադիր դաշտերը', 'error')
        return
      }
      
      setInstructorErrors({ name: false, profession: false, description: false, stats: [false, false, false, false] })
      
      const fd = new FormData()
      fd.append('title', instructorForm.title || '')
      fd.append('name', instructorForm.name || '')
      fd.append('profession', instructorForm.profession || '')
      fd.append('description', instructorForm.description || '')
      fd.append('badge_text', instructorForm.badgeText || '')
      fd.append('stats_json', JSON.stringify(instructorForm.stats))
      
      // Send new avatar file if selected, otherwise send existing avatarUrl
      if (instructorForm.avatarFile) {
        fd.append('avatar', instructorForm.avatarFile)
      } else if (instructorForm.avatarUrl) {
        // Extract path from full URL if needed
        const avatarPath = instructorForm.avatarUrl.includes('/images/') 
          ? instructorForm.avatarUrl.split('/images/')[1] 
            ? '/images/' + instructorForm.avatarUrl.split('/images/')[1]
            : instructorForm.avatarUrl
          : instructorForm.avatarUrl
        fd.append('avatar_url', avatarPath)
      }

      await api.post('/api/v1/instructor', fd)
      showToast('Մենթորի տվյալները պահպանվեցին', 'success')
    } catch (err: unknown) {
      showToast(extractErrorMessage(err) || (err instanceof Error ? err.message : 'Չհաջողվեց պահպանել'), 'error')
    } finally {
      setIsInstructorLoading(false)
    }
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
    // Crop modal exports
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
