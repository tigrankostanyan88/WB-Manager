'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import api from '@/lib/api'

export interface HeroContent {
  id: number
  title: string
  name: string
  text: string
  thumbnail_time?: number
  video_url?: string
  file?: {
    name: string
    ext: string
    type: string
  }
  created_at?: string
  updated_at?: string
}

export interface HeroContentForm {
  title: string
  name: string
  text: string
  thumbnail_time: number
}

interface UseHeroContentProps {
  activeTab: string
  allowed: boolean
  showToast: (message: string, type: 'success' | 'error') => void
}

export function useHeroContent({ activeTab, allowed, showToast }: UseHeroContentProps) {
  const [content, setContent] = useState<HeroContent | null>(null)
  const [form, setForm] = useState<HeroContentForm>({
    title: '',
    name: '',
    text: '',
    thumbnail_time: 0
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const hasFetched = useRef(false)
  const isMounted = useRef(true)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  // Reset hasFetched when tab changes away
  useEffect(() => {
    if (activeTab !== 'hero-content') {
      hasFetched.current = false
    }
  }, [activeTab])

  // Fetch hero content - only once when tab is active
  useEffect(() => {
    // Early return conditions
    if (activeTab !== 'hero-content') return
    if (!allowed) return
    if (hasFetched.current) return
    
    // Mark as fetched immediately to prevent duplicate requests
    hasFetched.current = true
    setIsLoading(true)

    const fetchContent = async () => {
      try {
        const res = await api.get('/api/v1/hero-content')
        const data = res.data?.data
        
        // Only update state if component is still mounted
        if (!isMounted.current) return
        
        if (data) {
          setContent(data)
          setForm({
            title: data.title || '',
            name: data.name || '',
            text: data.text || '',
            thumbnail_time: data.thumbnail_time || 0
          })
          if (data.video_url) {
            setVideoPreview(data.video_url)
          }
        }
      } catch (err) {
        console.error('Failed to fetch hero content:', err)
      } finally {
        if (isMounted.current) {
          setIsLoading(false)
        }
      }
    }

    fetchContent()
  }, [activeTab, allowed])

  // Handle video file selection
  const handleVideoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        showToast('Խնդրում ենք ընտրել վիդեո ֆայլ', 'error')
        return
      }
      // Validate file size (max 500MB)
      if (file.size > 500 * 1024 * 1024) {
        showToast('Ֆայլի չափը չպետք է գերազանցի 500MB-ը', 'error')
        return
      }
      setVideoFile(file)
      // Create preview URL
      const url = URL.createObjectURL(file)
      setVideoPreview(url)
    }
  }, [showToast])

  // Clear video selection
  const clearVideo = useCallback(() => {
    setVideoFile(null)
    if (videoPreview && videoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(videoPreview)
    }
    setVideoPreview(content?.video_url || null)
  }, [content, videoPreview])

  // Submit form
  const submitContent = useCallback(async () => {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('name', form.name)
      formData.append('text', form.text)
      formData.append('thumbnail_time', String(form.thumbnail_time))

      if (videoFile) {
        formData.append('hero_video', videoFile)
      }

      const res = await api.patch('/api/v1/hero-content', formData)
      
      if (res.data?.status === 'success') {
        showToast(res.data?.message || 'Հերո բովանդակությունը պահպանված է', 'success')
        // Update local state with response
        const newData = res.data?.data?.content
        if (newData) {
          setContent(newData)
          if (newData.video_url) {
            setVideoPreview(newData.video_url)
          }
          setVideoFile(null)
        }
      }
    } catch (err: any) {
      console.error('Failed to save hero content:', err)
      showToast(err?.response?.data?.message || 'Պահպանման սխալ', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }, [form, videoFile, showToast])

  // Delete hero content
  const deleteContent = useCallback(async () => {
    if (!confirm('Հաստատեք ջնջումը?')) return
    
    setIsSubmitting(true)
    try {
      const res = await api.delete('/api/v1/hero-content')
      if (res.data?.status === 'success') {
        showToast('Հերո բովանդակությունը ջնջված է', 'success')
        setContent(null)
        setForm({ title: '', name: '', text: '', thumbnail_time: 0 })
        setVideoFile(null)
        setVideoPreview(null)
      }
    } catch (err: any) {
      console.error('Failed to delete hero content:', err)
      showToast(err?.response?.data?.message || 'Ջնջման սխալ', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }, [showToast])

  return {
    content,
    form,
    setForm,
    isLoading,
    isSubmitting,
    videoFile,
    videoPreview,
    handleVideoChange,
    clearVideo,
    submitContent,
    deleteContent
  }
}
