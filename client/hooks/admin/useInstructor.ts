'use client'

import { useEffect, useState, useCallback } from 'react'
import api from '@/lib/api'
import type { Area, Point } from 'react-easy-crop'
import { getCroppedImg } from '@/components/features/admin/_utils/image'

interface InstructorStat {
  value: string
  label: string
}

interface InstructorData {
  title?: string
  name?: string
  profession?: string
  description?: string
  badge_text?: string
  avatar_url?: string
  stats_json?: string
  stats?: InstructorStat[]
}

interface InstructorApiResponse {
  instructors?: InstructorData[]
}

interface InstructorForm {
  title: string
  name: string
  profession: string
  description: string
  badgeText: string
  avatarUrl: string
  avatarFile: File | null
  stats: { value: string; label: string }[]
}

interface InstructorErrors {
  name: boolean
  profession: boolean
  description: boolean
  stats: boolean[]
}

interface UseInstructorParams {
  activeTab: string
  allowed: boolean
  showToast: (message: string, type?: 'success' | 'error') => void
}

const defaultStats = [
  { value: '500+', label: 'Հաջողակ ուսանողներ' },
  { value: '120M+', label: 'Ուսանողների ընդհանուր շրջանառություն' },
  { value: '5 տարի', label: 'Փորձ e-commerce ոլորտում' },
  { value: '24/7', label: 'Անհատական աջակցություն' }
]

function extractErrorMessage(err: unknown): string | null {
  if (!err || typeof err !== 'object') return null
  const resp = (err as { response?: unknown }).response
  if (!resp || typeof resp !== 'object') return null
  const data = (resp as { data?: unknown }).data
  if (!data || typeof data !== 'object') return null
  const msg = (data as { message?: unknown }).message
  return typeof msg === 'string' ? msg : null
}

export function useInstructor({ activeTab, allowed, showToast }: UseInstructorParams) {
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
  
  const [cropModalOpen, setCropModalOpen] = useState(false)
  const [cropImage, setCropImage] = useState<string | null>(null)
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)

  useEffect(() => {
    if (!allowed || activeTab !== 'instructor') return
    let cancelled = false
    ;(async () => {
      setIsInstructorLoading(true)
      try {
        const res = await api.get('/api/v1/instructor')
        const payload = res.data as InstructorApiResponse
        const list = payload.instructors || []
        const first = list[0] || {}

        let statsArr: InstructorStat[] = []
        if (typeof first.stats_json === 'string' && first.stats_json) {
          try {
            const parsed = JSON.parse(first.stats_json) as InstructorStat[] | unknown
            statsArr = Array.isArray(parsed) ? parsed : []
          } catch {
            statsArr = []
          }
        } else if (Array.isArray(first.stats)) {
          statsArr = first.stats
        }
        
        const normalizedStats = statsArr.length
          ? statsArr.map((s, i) => ({
              value: String(s?.value ?? defaultStats[i]?.value ?? ''),
              label: String(s?.label ?? defaultStats[i]?.label ?? '')
            }))
          : [...defaultStats]

        if (!cancelled) {
          setInstructorForm({
            title: first.title || 'Սովորեք Ուայլդբերիի Մասնագետից',
            name: first.name || '',
            profession: first.profession || '',
            description: first.description || '',
            badgeText: first.badge_text || 'Վերադարձված մենթորություն',
            avatarUrl: first.avatar_url || '',
            avatarFile: null,
            stats: normalizedStats
          })
        }
      } finally {
        if (!cancelled) setIsInstructorLoading(false)
      }
    })()
    return () => { cancelled = true }
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

  const onTitleChange = (value: string) => setInstructorForm((prev) => ({ ...prev, title: value }))
  const onNameChange = (value: string) => {
    setInstructorForm((prev) => ({ ...prev, name: value }))
    if (instructorErrors.name && value.trim()) setInstructorErrors((err) => ({ ...err, name: false }))
  }
  const onProfessionChange = (value: string) => {
    setInstructorForm((prev) => ({ ...prev, profession: value }))
    if (instructorErrors.profession && value.trim()) setInstructorErrors((err) => ({ ...err, profession: false }))
  }
  const onDescriptionChange = (value: string) => {
    setInstructorForm((prev) => ({ ...prev, description: value }))
    if (instructorErrors.description && value.trim()) setInstructorErrors((err) => ({ ...err, description: false }))
  }
  const onBadgeTextChange = (value: string) => setInstructorForm((prev) => ({ ...prev, badgeText: value }))
  const onStatValueChange = (index: number, value: string) => {
    setInstructorForm((prev) => ({ ...prev, stats: prev.stats.map((s, i) => (i === index ? { ...s, value } : s)) }))
    if (instructorErrors.stats[index] && value.trim()) {
      setInstructorErrors((err) => { const arr = [...err.stats]; arr[index] = false; return { ...err, stats: arr } })
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
        if (!String(s.value || '').trim()) { missing.push(s.label); statErrors[i] = true }
      })
      
      if (missing.length) {
        setInstructorErrors({ name: !String(instructorForm.name || '').trim(), profession: !String(instructorForm.profession || '').trim(), description: !String(instructorForm.description || '').trim(), stats: statErrors })
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
      
      if (instructorForm.avatarFile) fd.append('avatar', instructorForm.avatarFile)
      else if (instructorForm.avatarUrl) fd.append('avatar_url', instructorForm.avatarUrl)

      await api.post('/api/v1/instructor', fd)
      showToast('Մենթորի տվյալները պահպանվեցին', 'success')
    } catch (err: unknown) {
      showToast(extractErrorMessage(err) || 'Չհաջողվեց պահպանել', 'error')
    } finally {
      setIsInstructorLoading(false)
    }
  }

  return {
    instructorForm, instructorErrors, isInstructorLoading,
    onAvatarFile, onTitleChange, onNameChange, onProfessionChange, onDescriptionChange,
    onBadgeTextChange, onStatValueChange, saveInstructor,
    cropModalOpen, cropImage, crop, zoom, setCrop, setZoom, onCropComplete, closeCropModal, confirmCrop
  }
}

export default useInstructor
