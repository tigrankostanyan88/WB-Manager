'use client'

import { useState, useCallback, useEffect } from 'react'
import type { Module } from '../_types'

interface UseModulesProps {
  activeTab: string
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
}

export function useModules({ activeTab, showToast }: UseModulesProps) {
  const [showModuleForm, setShowModuleForm] = useState(false)
  const [moduleForm, setModuleForm] = useState({
    title: '',
    description: '',
    courseId: ''
  })
  const [allModules, setAllModules] = useState<Module[]>([])
  const [courses, setCourses] = useState<{ _id: string; title: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [isUploadingVideo, setIsUploadingVideo] = useState(false)
  const [currentModuleVideos, setCurrentModuleVideos] = useState<any[]>([])

  const fetchModules = useCallback(async () => {
    if (activeTab !== 'modules') return
    setIsLoading(true)
    try {
      const [modulesRes, coursesRes] = await Promise.all([
        fetch('/api/modules'),
        fetch('/api/courses')
      ])
      const modulesData = await modulesRes.json()
      const coursesData = await coursesRes.json()
      setAllModules(modulesData.modules || [])
      setCourses(coursesData.courses || [])
    } catch (error) {
      console.error('Error fetching modules:', error)
    } finally {
      setIsLoading(false)
    }
  }, [activeTab])

  useEffect(() => {
    fetchModules()
  }, [fetchModules])

  const startNewModule = useCallback(() => {
    setModuleForm({ title: '', description: '', courseId: '' })
    setEditingId(null)
    setShowModuleForm(true)
  }, [])

  const editModule = useCallback((module: Module) => {
    setModuleForm({
      title: module.title,
      description: module.description,
      courseId: module.courseId
    })
    setEditingId(module._id)
    setShowModuleForm(true)
  }, [])

  const cancelNewModule = useCallback(() => {
    setShowModuleForm(false)
    setEditingId(null)
  }, [])

  const submitModule = useCallback(async () => {
    try {
      const url = editingId ? `/api/modules/${editingId}` : '/api/modules'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(moduleForm)
      })
      if (res.ok) {
        showToast(editingId ? 'Մոդուլը թարմացված է' : 'Մոդուլը ստեղծված է')
        setShowModuleForm(false)
        fetchModules()
      } else {
        showToast('Սխալ է տեղի ունեցել', 'error')
      }
    } catch {
      showToast('Սխալ է տեղի ունեցել', 'error')
    }
  }, [moduleForm, editingId, showToast, fetchModules])

  const deleteModule = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/modules/${id}`, { method: 'DELETE' })
      if (res.ok) {
        showToast('Մոդուլը ջնջված է')
        fetchModules()
      } else {
        showToast('Սխալ է տեղի ունեցել', 'error')
      }
    } catch {
      showToast('Սխալ է տեղի ունեցել', 'error')
    }
  }, [showToast, fetchModules])

  const handleVideoFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setVideoFile(file)
    }
  }, [])

  const uploadModuleVideo = useCallback(async (moduleId: string) => {
    if (!videoFile) return
    setIsUploadingVideo(true)
    try {
      const formData = new FormData()
      formData.append('video', videoFile)
      const res = await fetch(`/api/modules/${moduleId}/videos`, {
        method: 'POST',
        body: formData
      })
      if (res.ok) {
        showToast('Վիդեոն բեռնված է')
        setVideoFile(null)
      } else {
        showToast('Սխալ է տեղի ունեցել', 'error')
      }
    } catch {
      showToast('Սխալ է տեղի ունեցել', 'error')
    } finally {
      setIsUploadingVideo(false)
    }
  }, [videoFile, showToast])

  const deleteModuleVideo = useCallback(async (moduleId: string, videoId: string) => {
    try {
      const res = await fetch(`/api/modules/${moduleId}/videos/${videoId}`, { method: 'DELETE' })
      if (res.ok) {
        showToast('Վիդեոն ջնջված է')
      } else {
        showToast('Սխալ է տեղի ունեցել', 'error')
      }
    } catch {
      showToast('Սխալ է տեղի ունեցել', 'error')
    }
  }, [showToast])

  const getVideoUrl = useCallback((videoId: string) => {
    return `/api/videos/${videoId}`
  }, [])

  const reorderVideos = useCallback(async (moduleId: string, videoIds: string[]) => {
    try {
      await fetch(`/api/modules/${moduleId}/videos/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoIds })
      })
    } catch (error) {
      console.error('Error reordering videos:', error)
    }
  }, [])

  return {
    showModuleForm,
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
    getVideoUrl,
    reorderVideos
  }
}
