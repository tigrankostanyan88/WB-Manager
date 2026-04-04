'use client'

import { HeroContentTab } from '@/components/features/admin/tabs/hero-content/HeroContentTab'
import { useHeroContentTab } from '@/app/(dashboard)/dashboard/hooks'

interface HeroContentTabWrapperProps {
  allowed: boolean
  showToast: (message: string, type?: 'success' | 'error') => void
}

export function HeroContentTabWrapper({ allowed, showToast }: HeroContentTabWrapperProps) {
  const hero = useHeroContentTab({ activeTab: 'hero-content', allowed, showToast })
  return (
    <HeroContentTab
      form={hero.form}
      setForm={hero.setForm}
      isLoading={hero.isLoading}
      isSubmitting={hero.isSubmitting}
      videoFile={hero.videoFile}
      videoPreview={hero.videoPreview}
      handleVideoChange={hero.handleVideoChange}
      clearVideo={hero.clearVideo}
      submitContent={hero.submitContent}
    />
  )
}
