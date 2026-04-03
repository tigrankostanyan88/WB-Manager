'use client'

import { useHeroContent } from '@/hooks/admin/useHeroContent'

interface UseHeroContentTabProps {
  activeTab: string
  allowed: boolean
  showToast: (message: string, type?: 'success' | 'error') => void
}

export function useHeroContentTab({ activeTab, allowed, showToast }: UseHeroContentTabProps) {
  const {
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
  } = useHeroContent({ activeTab, allowed, showToast })

  return {
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
