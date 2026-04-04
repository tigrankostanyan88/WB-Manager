'use client'

import { useHeroContent } from '@/hooks/admin/useHeroContent'

export function useHeroContentTab({ activeTab, allowed, showToast }: { activeTab: string; allowed: boolean; showToast: (message: string, type?: 'success' | 'error') => void }) {
  return useHeroContent({ activeTab, allowed, showToast })
}
