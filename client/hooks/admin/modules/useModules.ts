// hooks/modules/useModules.ts - Main module management hook

'use client'

import { useState } from 'react'
import { useConfirm } from '@/components/providers/ConfirmProvider'
import type { DashboardTabId } from '@/components/features/admin/types'
import type { ModuleFile, ModuleItem, ModuleForm } from './types'
import { mapModule, getVideoUrl } from './utils'
import { useModulesQuery, useModuleCoursesQuery } from './queries'
import {
  useCreateModule,
  useUpdateModule,
  useDeleteModule,
  useUploadModuleVideo,
  useDeleteModuleVideo,
  useUpdateVideoTitle,
} from './mutations'

interface UseModulesParams {
  activeTab: DashboardTabId
  showToast: (message: string, type?: 'success' | 'error') => void
}

const emptyForm: ModuleForm = { title: '', courseId: '', description: '' }

export function useModules({ showToast }: UseModulesParams) {
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
      courseId: module.courseId,
      description: '',
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
            courseId: newModule.courseId,
            description: '',
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

  const handleDeleteModuleVideo = async (fileId: string) => {
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

  const handleUpdateModuleVideo = async (fileId: string, title: string) => {
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
    deleteModuleVideo: handleDeleteModuleVideo,
    updateModuleVideo: handleUpdateModuleVideo,
    handleVideoFileChange,
    uploadModuleVideo,
    getVideoUrl,
  }
}

// Re-export for backwards compatibility
export * from './types'
export * from './utils'
export * from './queries'
export * from './mutations'
