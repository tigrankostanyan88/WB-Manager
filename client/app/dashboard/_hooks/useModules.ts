import { useEffect, useState } from 'react'
import type { DashboardTabId } from '../_types'
import api from '@/lib/api'
import { useConfirm } from '@/components/ConfirmProvider'

export interface ModuleFile {
  id: string
  name: string
  ext: string
  name_used?: string
  table_name?: string
}

export interface ModuleItem {
  id: string
  title: string
  duration: string
  description: string
  courseId: string
  files?: ModuleFile[]
}

export interface ModuleForm {
  title: string
  duration: string
  description: string
  courseId: string
}

interface UseModulesParams {
  activeTab: DashboardTabId
  showToast: (message: string, type?: 'success' | 'error') => void
}

export interface CourseOption {
  id: string
  title: string
}

const emptyForm: ModuleForm = { title: '', duration: '', description: '', courseId: '' }

const mapModule = (m: unknown): ModuleItem => {
  const mm = m as { id?: unknown; title?: unknown; duration?: unknown; description?: unknown; course_id?: unknown; courseId?: unknown; files?: unknown[] }
  return {
    id: String(mm?.id ?? ''),
    title: String(mm?.title ?? ''),
    duration: String(mm?.duration ?? ''),
    description: String(mm?.description ?? ''),
    courseId: String(mm?.course_id ?? mm?.courseId ?? ''),
    files: Array.isArray(mm?.files) ? mm.files.map((f: unknown) => {
      const ff = f as { id?: unknown; name?: unknown; ext?: unknown; name_used?: unknown; table_name?: unknown }
      return { id: String(ff?.id ?? ''), name: String(ff?.name ?? ''), ext: String(ff?.ext ?? ''), name_used: String(ff?.name_used ?? ''), table_name: String(ff?.table_name ?? '') }
    }) : []
  }
}

const parseModules = (data: unknown): ModuleItem[] => {
  const arr = Array.isArray(data) ? data : []
  return arr.map(mapModule)
}

export default function useModules({ activeTab, showToast }: UseModulesParams) {
  const confirm = useConfirm()
  const [showModuleForm, setShowModuleForm] = useState(false)
  const [moduleForm, setModuleForm] = useState<ModuleForm>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [allModules, setAllModules] = useState<ModuleItem[]>([])
  const [courses, setCourses] = useState<CourseOption[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [isUploadingVideo, setIsUploadingVideo] = useState(false)
  const [currentModuleVideos, setCurrentModuleVideos] = useState<ModuleFile[]>([])

  const getModuleVideos = (module: ModuleItem): ModuleFile[] => {
    return module.files?.filter((f) => f.name_used === 'module_video') || []
  }

  const getVideoUrl = (file: ModuleFile) => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || ''
    const origin = /^https?:\/\//i.test(apiBase) ? apiBase.replace(/\/api.*$/, '') : ''
    return `${origin}/files/modules/${file.name}${file.ext}`
  }

  useEffect(() => {
    if (activeTab !== 'modules') {
      setShowModuleForm(false)
      setEditingId(null)
      return
    }

    let cancelled = false

    ;(async () => {
      try {
        setIsLoading(true)

        const [coursesRes, modulesRes] = await Promise.all([api.get('/api/v1/courses'), api.get('/api/v1/modules')])

        const coursesData = Array.isArray(coursesRes.data?.data)
          ? coursesRes.data.data
          : coursesRes.data?.data?.courses || coursesRes.data?.courses || []
        const nextCourses = Array.isArray(coursesData)
          ? coursesData
              .map((c: unknown) => {
                const cc = c as { id?: unknown; title?: unknown }
                return { id: String(cc?.id ?? ''), title: String(cc?.title ?? '') }
              })
              .filter((c: CourseOption) => c.id && c.title)
          : []

        const modulesData = Array.isArray(modulesRes.data?.data)
          ? modulesRes.data.data
          : modulesRes.data?.data?.modules || modulesRes.data?.modules || []
        if (!cancelled) {
          setCourses(nextCourses)
          setAllModules(parseModules(modulesData))
        }
      } catch {
        showToast('Սխալ մոդուլները/դասընթացները բեռնելիս', 'error')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()

    return () => {
      cancelled = true
      setShowModuleForm(false)
      setEditingId(null)
    }
  }, [activeTab])

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
      description: module.description,
      courseId: module.courseId
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
    setIsUploadingVideo(true)
    try {
      const formData = new FormData()
      formData.append('module_video', videoFile)
      const res = await api.post(`/api/v1/modules/${editingId}/video`, formData)
      const updated = (res.data as { data?: unknown }).data as { files?: unknown[] } | undefined
      const newVideos = updated?.files?.map((f: unknown) => {
        const ff = f as { id?: unknown; name?: unknown; ext?: unknown; name_used?: unknown; table_name?: unknown }
        return { id: String(ff?.id ?? ''), name: String(ff?.name ?? ''), ext: String(ff?.ext ?? ''), name_used: String(ff?.name_used ?? ''), table_name: String(ff?.table_name ?? '') }
      }).filter((f) => f.name_used === 'module_video') || []
      setCurrentModuleVideos(newVideos)
      setVideoFile(null)
      setAllModules((prev) => prev.map((m) => m.id === editingId ? { ...m, files: updated?.files as ModuleFile[] || m.files } : m))
      showToast('Վիդեոն հաջողությամբ ավելացվեց', 'success')
    } catch (err: any) {
      console.error('Video upload error:', err)
      const errorMsg = err?.response?.data?.message || err?.message || 'Սխալ վիդեոն վերբեռնելիս'
      showToast(errorMsg, 'error')
    } finally {
      setIsUploadingVideo(false)
    }
  }

  const submitModule = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!moduleForm.courseId) {
      showToast('Ընտրեք դասընթացը', 'error')
      return
    }
    try {
      setIsLoading(true)

      if (editingId) {
        await api.patch(`/api/v1/modules/${editingId}`, {
          title: moduleForm.title.trim(),
          duration: moduleForm.duration.trim(),
          description: moduleForm.description.trim(),
          courseId: moduleForm.courseId
        })
        const modulesRes = await api.get('/api/v1/modules')
        const modulesData = Array.isArray(modulesRes.data?.data)
          ? modulesRes.data.data
          : modulesRes.data?.data?.modules || modulesRes.data?.modules || []
        
        setAllModules(parseModules(modulesData))
        showToast('Մոդուլը հաջողությամբ թարմացվեց', 'success')
      } else {
        await api.post('/api/v1/modules', {
          title: moduleForm.title,
          duration: moduleForm.duration,
          description: moduleForm.description,
          courseId: Number(moduleForm.courseId)
        })
        const modulesRes = await api.get('/api/v1/modules')
        const modulesData = Array.isArray(modulesRes.data?.data)
          ? modulesRes.data.data
          : modulesRes.data?.data?.modules || modulesRes.data?.modules || []
        setAllModules(parseModules(modulesData))
        showToast('Մոդուլը հաջողությամբ ավելացվեց', 'success')
      }

      setModuleForm(emptyForm)
      setShowModuleForm(false)
      setEditingId(null)
    } catch {
      showToast(editingId ? 'Սխալ մոդուլը թարմացնելիս' : 'Սխալ մոդուլ ավելացնելիս', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const deleteModuleVideo = async (fileId: string) => {
    const ok = await confirm({
      title: 'Ջնջել վիդեոն',
      message: 'Վստահ՞ եք, որ ցանկանում եք ջնջել այս վիդեոն:',
      confirmText: 'Ջնջել',
      cancelText: 'Չեղարկել',
      tone: 'danger'
    })
    if (!ok) return
    try {
      setIsUploadingVideo(true)
      await api.delete(`/api/v1/modules/${editingId}/video/${fileId}`)
      setCurrentModuleVideos((prev) => prev.filter((v) => v.id !== fileId))
      setAllModules((prev) => prev.map((m) => m.id === editingId ? { ...m, files: m.files?.filter((f) => f.id !== fileId) } : m))
      showToast('Վիդեոն ջնջվեց', 'success')
    } catch {
      showToast('Սխալ վիդեոն ջնջելիս', 'error')
    } finally {
      setIsUploadingVideo(false)
    }
  }

  const deleteModule = async (id: string) => {
    const ok = await confirm({
      title: 'Ջնջել մոդուլը',
      message: 'Վստահ՞ եք, որ ցանկանում եք ջնջել այս մոդուլը: Գործողությունը չի վերադարձվի',
      confirmText: 'Ջնջել',
      cancelText: 'Չեղարկել',
      tone: 'danger'
    })
    if (!ok) return
    try {
      setIsLoading(true)
      await api.delete(`/api/v1/modules/${id}`)
      setAllModules((prev) => prev.filter((m) => m.id !== id))
      showToast('Մոդուլը ջնջվեց', 'success')
    } catch {
      showToast('Սխալ մոդուլը ջնջելիս', 'error')
    } finally {
      setIsLoading(false)
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
    deleteModule,
    videoFile,
    isUploadingVideo,
    currentModuleVideos,
    deleteModuleVideo,
    handleVideoFileChange,
    uploadModuleVideo,
    getVideoUrl
  }
}
