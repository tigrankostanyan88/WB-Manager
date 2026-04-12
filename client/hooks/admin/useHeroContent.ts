'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useHeroContentQuery, useUpdateHeroContentMutation, useDeleteHeroContentMutation } from '@/hooks/queries/useHeroContentQuery'
import type { HeroContent } from '@/types/domain'

export interface HeroContentForm {
  title: string
  name: string
  text: string
  thumbnail_time: number
}

interface UseHeroContentProps {
  activeTab: string
  allowed: boolean
  showToast: (message: string, type?: 'success' | 'error') => void
}

export function useHeroContent({ activeTab, allowed, showToast }: UseHeroContentProps) {
  const isActive = allowed && activeTab === 'hero-content'
  const { data: content, isLoading: isQueryLoading } = useHeroContentQuery(isActive)
  const updateMutation = useUpdateHeroContentMutation()
  const deleteMutation = useDeleteHeroContentMutation()
  
  const [form, setForm] = useState<HeroContentForm>({
    title: '',
    name: '',
    text: '',
    thumbnail_time: 0
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const blobUrlRef = useRef<string | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current)
        blobUrlRef.current = null
      }
    }
  }, [])

  // Sync form with query data
  useEffect(() => {
    if (!content || !isActive) return
    
    setForm({
      title: content.title || '',
      name: content.name || '',
      text: content.text || '',
      thumbnail_time: content.thumbnail_time || 0
    })
    if (content.video_url) {
      setVideoPreview(content.video_url)
    }
  }, [content, isActive])

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
      // Revoke previous blob URL if exists
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current)
      }
      setVideoFile(file)
      // Create preview URL
      const url = URL.createObjectURL(file)
      blobUrlRef.current = url
      setVideoPreview(url)
    }
  }, [showToast])

  // Clear video selection
  const clearVideo = useCallback(() => {
    setVideoFile(null)
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current)
      blobUrlRef.current = null
    }
    setVideoPreview(content?.video_url || null)
  }, [content])

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

      const result = await updateMutation.mutateAsync(formData)
      
      if (result?.status === 'success') {
        showToast(result?.message || 'Հերո բովանդակությունը պահպանված է', 'success')
        // Update local state with response
        const newData = result?.data?.content as HeroContent | undefined
        if (newData?.video_url) {
          setVideoPreview(newData.video_url)
        }
        setVideoFile(null)
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string }
      showToast(error?.response?.data?.message || error?.message || 'Պահպանման սխալ', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }, [form, videoFile, updateMutation, showToast])

  // Delete hero content
  const deleteContent = useCallback(async () => {
    if (!confirm('Հաստատեք ջնջումը?')) return
    
    setIsSubmitting(true)
    try {
      const result = await deleteMutation.mutateAsync()
      if (result?.status === 'success') {
        showToast('Հերո բովանդակությունը ջնջված է', 'success')
        setForm({ title: '', name: '', text: '', thumbnail_time: 0 })
        setVideoFile(null)
        setVideoPreview(null)
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string }
      showToast(error?.response?.data?.message || error?.message || 'Ջնջման սխալ', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }, [deleteMutation, showToast])

  const combinedLoading = isQueryLoading || isSubmitting || updateMutation.isPending || deleteMutation.isPending

  return {
    content,
    form,
    setForm,
    isLoading: combinedLoading,
    isSubmitting,
    videoFile,
    videoPreview,
    handleVideoChange,
    clearVideo,
    submitContent,
    deleteContent
  }
}
