'use client'

import useFaq from '@/components/features/admin/hooks/useFaq'

interface UseFaqTabProps {
  activeTab: string
  allowed: boolean
  showToast: (message: string, type?: 'success' | 'error') => void
}

export function useFaqTab({ activeTab, allowed, showToast }: UseFaqTabProps) {
  const {
    faqs,
    faqForm,
    setFaqForm,
    isFaqLoading,
    isFaqSubmitting,
    editingId,
    editForm,
    setEditForm,
    isFaqUpdating,
    submitFaq,
    startEdit,
    cancelEdit,
    updateFaq,
    deleteFaq
  } = useFaq({ activeTab: activeTab as string, allowed, showToast })

  return {
    faqs,
    faqForm,
    setFaqForm,
    isFaqLoading,
    isFaqSubmitting,
    editingId,
    editForm,
    setEditForm,
    isFaqUpdating,
    submitFaq,
    startEdit,
    cancelEdit,
    updateFaq,
    deleteFaq
  }
}
