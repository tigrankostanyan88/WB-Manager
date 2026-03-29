'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useConfirm } from '@/components/providers/ConfirmProvider'
import api from '@/lib/api'
import type { DashboardTabId } from '../types'

// Types
export interface ModuleFile {
  id: string
  name: string
  ext: string
  title?: string
  name_used?: string
  table_name?: string
}

export interface ModuleItem {
  id: string
  title: string
  duration: string
  courseId: string
  files?: ModuleFile[]
}

export interface CourseOption {
  id: string
  title: string
}

export interface ModuleForm {
  title: string
  duration: string
  courseId: string
  description?: string
}

interface UseModulesParams {
  activeTab: DashboardTabId
  showToast: (message: string, type?: 'success' | 'error') => void
}

// Query Keys
const MODULES_QUERY_KEY = 'modules'
const COURSES_QUERY_KEY = 'courses'

// Helper Functions
export const mapModule = (m: unknown): ModuleItem => {
  const mm = m as {
    id?: unknown
    title?: unknown
    duration?: unknown
    course_id?: unknown
    courseId?: unknown
    files?: unknown[]
  }
  return {
    id: String(mm?.id ?? ''),
    title: String(mm?.title ?? ''),
    duration: String(mm?.duration ?? ''),
    courseId: String(mm?.course_id ?? mm?.courseId ?? ''),
    files: Array.isArray(mm?.files)
      ? mm.files.map((f: unknown) => {
          const ff = f as {
            id?: unknown
            name?: unknown
            ext?: unknown
            title?: unknown
            name_used?: unknown
            table_name?: unknown
          }
          return {
            id: String(ff?.id ?? ''),
            name: String(ff?.name ?? ''),
            ext: String(ff?.ext ?? ''),
            title: String(ff?.title ?? ''),
            name_used: String(ff?.name_used ?? ''),
            table_name: String(ff?.table_name ?? ''),
          }
        })
      : [],
  }
}

export const parseModules = (data: unknown): ModuleItem[] => {
  const arr = Array.isArray(data) ? data : []
  return arr.map(mapModule)
}

// Format duration string (HH:MM:SS or MM:SS)
export function formatDuration(duration: string): string {
  if (!duration) return '00:00'
  const parts = duration.split(':')
  if (parts.length === 2) {
    const [minutes, seconds] = parts
    return `${minutes}:${seconds}`
  }
  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts
    if (hours === '00') return `${minutes}:${seconds}`
    return `${hours}:${minutes}:${seconds}`
  }
  return duration
}

// Convert duration to minutes
export function durationToMinutes(duration: string): number {
  if (!duration) return 0
  const parts = duration.split(':').map(Number)
  if (parts.length === 2) {
    return parts[0] + parts[1] / 60
  }
  if (parts.length === 3) {
    return parts[0] * 60 + parts[1] + parts[2] / 60
  }
  return 0
}

// Get video count from module files
export function getVideoCount(module: ModuleItem): number {
  return module.files?.filter(f => f.name_used === 'module_video').length || 0
}

// Get total video duration (uses module.duration)
export function getTotalVideoDuration(module: ModuleItem): number {
  return durationToMinutes(module.duration)
}

// Format minutes to hours/minutes string
export function formatMinutes(minutes: number): string {
  if (minutes === 0) return '0 րոպե'
  if (minutes < 60) return `${Math.round(minutes)} րոպե`
  const hours = Math.floor(minutes / 60)
  const mins = Math.round(minutes % 60)
  if (mins === 0) return `${hours} ժամ`
  return `${hours} ժ ${mins} ր`
}

// React Query Hooks
export function useModulesQuery() {
  return useQuery({
    queryKey: [MODULES_QUERY_KEY],
    queryFn: async () => {
      const res = await api.get('/api/v1/modules')
      const modulesData = Array.isArray(res.data?.data)
        ? res.data.data
        : res.data?.data?.modules || res.data?.modules || []
      return parseModules(modulesData)
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function useModuleCoursesQuery() {
  return useQuery({
    queryKey: [COURSES_QUERY_KEY, 'options'],
    queryFn: async () => {
      const res = await api.get('/api/v1/courses')
      const coursesData = Array.isArray(res.data?.data)
        ? res.data.data
        : res.data?.data?.courses || res.data?.courses || []
      const courses = Array.isArray(coursesData)
        ? coursesData
            .map((c: unknown) => {
              const cc = c as { id?: unknown; title?: unknown }
              return { id: String(cc?.id ?? ''), title: String(cc?.title ?? '') }
            })
            .filter((c: CourseOption) => c.id && c.title)
        : []
      return courses
    },
    staleTime: 1000 * 60 * 10,
  })
}

export function useCreateModule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: ModuleForm) => {
      const res = await api.post('/api/v1/modules', {
        title: data.title,
        duration: data.duration,
        courseId: Number(data.courseId),
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MODULES_QUERY_KEY] })
    },
  })
}

export function useUpdateModule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ModuleForm }) => {
      const res = await api.patch(`/api/v1/modules/${id}`, {
        title: data.title.trim(),
        duration: data.duration.trim(),
        courseId: data.courseId,
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MODULES_QUERY_KEY] })
    },
  })
}

export function useDeleteModule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/v1/modules/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MODULES_QUERY_KEY] })
    },
  })
}

export function useUploadModuleVideo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ moduleId, videoFile }: { moduleId: string; videoFile: File }) => {
      const formData = new FormData()
      formData.append('module_video', videoFile)
      const res = await api.post(`/api/v1/modules/${moduleId}/video`, formData)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MODULES_QUERY_KEY] })
    },
  })
}

export function useDeleteModuleVideo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (fileId: string) => {
      await api.delete(`/api/v1/files/${fileId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MODULES_QUERY_KEY] })
    },
  })
}

export function useUpdateVideoTitle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ fileId, title }: { fileId: string; title: string }) => {
      await api.patch(`/api/v1/files/${fileId}`, { title })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MODULES_QUERY_KEY] })
    },
  })
}

const emptyForm: ModuleForm = { title: '', duration: '', courseId: '' }

// Main Hook
export function useModules({ activeTab, showToast }: UseModulesParams) {
  const confirm = useConfirm()
  const [showModuleForm, setShowModuleForm] = useState(false)
  const [moduleForm, setModuleForm] = useState<ModuleForm>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [currentModuleVideos, setCurrentModuleVideos] = useState<ModuleFile[]>([])

  const { data: allModules = [], isLoading: isModulesLoading } = useModulesQuery()
  const { data: courses = [], isLoading: isCoursesLoading } = useModuleCoursesQuery()
  const createModule = useCreateModule()
  const updateModule = useUpdateModule()
  const deleteModule = useDeleteModule()
  const uploadVideo = useUploadModuleVideo()
  const deleteVideo = useDeleteModuleVideo()
  const updateVideo = useUpdateVideoTitle()

  const isLoading =
    isModulesLoading || isCoursesLoading || createModule.isPending || updateModule.isPending || deleteModule.isPending
  const isUploadingVideo = uploadVideo.isPending || deleteVideo.isPending || updateVideo.isPending

  const getModuleVideos = (module: ModuleItem): ModuleFile[] => {
    return module.files?.filter((f) => f.name_used === 'module_video') || []
  }

  const getVideoUrl = (file: ModuleFile) => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || ''
    const origin = /^https?:\/\//i.test(apiBase) ? apiBase.replace(/\/api.*$/, '') : ''
    return `${origin}/files/modules/${file.name}${file.ext}`
  }

  const startNewModule = () => {
    if (!courses.length) {
      showToast('Սկզբում ավելացրեք դասընթաց, հետո ավելացրեք մոդուլ', 'error')
      return
    }
    setEditingId(null)
    setModuleForm({ ...emptyForm, courseId: courses[0]?.id || '' })
    setShowModuleForm(true)
  }

  const editModule = (module: ModuleItem) => {
    setEditingId(module.id)
    setModuleForm({
      title: module.title,
      duration: module.duration,
      courseId: module.courseId,
    })
    const videos = getModuleVideos(module)
    setCurrentModuleVideos(videos)
    setVideoFile(null)
    setShowModuleForm(true)
  }

  const cancelNewModule = () => {
    setShowModuleForm(false)
    setModuleForm(emptyForm)
    setEditingId(null)
    setVideoFile(null)
    setCurrentModuleVideos([])
  }

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoFile(e.target.files?.[0] || null)
  }

  const uploadModuleVideo = async () => {
    if (!editingId || !videoFile) return
    try {
      await uploadVideo.mutateAsync({ moduleId: editingId, videoFile })
      setVideoFile(null)
      showToast('Վիդեոն հաջողությամբ ավելացվեց', 'success')
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string }
      const errorMsg = error?.response?.data?.message || error?.message || 'Սխալ վիդեոն վերբեռնելիս'
      showToast(errorMsg, 'error')
    }
  }

  const submitModule = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!moduleForm.courseId) {
      showToast('Ընտրեք դասընթացը', 'error')
      return
    }
    if (!moduleForm.title.trim()) {
      showToast('Լրացրեք մոդուլի անվանումը', 'error')
      return
    }
    try {
      if (editingId) {
        await updateModule.mutateAsync({ id: editingId, data: moduleForm })
        showToast('Մոդուլը հաջողությամբ թարմացվեց', 'success')
        setModuleForm(emptyForm)
        setShowModuleForm(false)
        setEditingId(null)
      } else {
        const res = await createModule.mutateAsync(moduleForm)
        const newModuleData = res?.data || res?.module || res
        const newModule = newModuleData ? mapModule(newModuleData) : null

        if (newModule && newModule.id) {
          setEditingId(newModule.id)
          setModuleForm({
            title: newModule.title,
            duration: newModule.duration,
            courseId: newModule.courseId,
          })
          const videos = getModuleVideos(newModule)
          setCurrentModuleVideos(videos)
          setVideoFile(null)
          showToast('Մոդուլը ստեղծվեց։ Այժմ կարող եք վիդեո ավելացնել։', 'success')
        } else {
          setModuleForm(emptyForm)
          setShowModuleForm(false)
          setEditingId(null)
          showToast('Մոդուլը հաջողությամբ ավելացվեց', 'success')
        }
      }
    } catch {
      showToast(editingId ? 'Սխալ մոդուլը թարմացնելիս' : 'Սխալ մոդուլ ավելացնելիս', 'error')
    }
  }

  const deleteModuleVideo = async (fileId: string) => {
    const ok = await confirm({
      title: 'Ջնջել վիդեոն',
      message: 'Վստահ՞ եք, որ ցանկանում եք ջնջել այս վիդեոն։',
      confirmText: 'Ջնջել',
      cancelText: 'Չեղարկել',
      tone: 'danger',
    })
    if (!ok) return
    try {
      await deleteVideo.mutateAsync(fileId)
      setCurrentModuleVideos((prev) => prev.filter((v) => v.id !== fileId))
      showToast('Վիդեոն ջնջվեց', 'success')
    } catch {
      showToast('Սխալ վիդեոն ջնջելիս', 'error')
    }
  }

  const updateModuleVideo = async (fileId: string, title: string) => {
    try {
      await updateVideo.mutateAsync({ fileId, title })
      setCurrentModuleVideos((prev) => prev.map((v) => (v.id === fileId ? { ...v, title } : v)))
      showToast('Վիդեոյի անվանումը թարմացվեց', 'success')
    } catch {
      showToast('Սխալ վիդեոյի անվանումը թարմացնելիս', 'error')
    }
  }

  const handleDeleteModule = async (id: string) => {
    const ok = await confirm({
      title: 'Ջնջել մոդուլը',
      message: 'Վստահ՞ եք, որ ցանկանում եք ջնջել այս մոդուլը։ Գործողությունը չի վերադարձվի։',
      confirmText: 'Ջնջել',
      cancelText: 'Չեղարկել',
      tone: 'danger',
    })
    if (!ok) return
    try {
      await deleteModule.mutateAsync(id)
      showToast('Մոդուլը ջնջվեց', 'success')
    } catch {
      showToast('Սխալ մոդուլը ջնջելիս', 'error')
    }
  }

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
    deleteModule: handleDeleteModule,
    videoFile,
    isUploadingVideo,
    currentModuleVideos,
    deleteModuleVideo,
    updateModuleVideo,
    handleVideoFileChange,
    uploadModuleVideo,
    getVideoUrl,
  }
}
