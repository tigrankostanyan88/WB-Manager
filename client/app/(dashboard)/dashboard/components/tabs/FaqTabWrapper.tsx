'use client'

import { FaqTab } from '@/components/features/admin/tabs/faq/FaqTab'
import { useFaqTab } from '@/app/(dashboard)/dashboard/hooks'

interface FaqTabWrapperProps {
  allowed: boolean
  showToast: (message: string, type?: 'success' | 'error') => void
}

export function FaqTabWrapper({ allowed, showToast }: FaqTabWrapperProps) {
  const faq = useFaqTab({ activeTab: 'faq', allowed, showToast })
  return (
    <FaqTab
      faqs={faq.faqs}
      faqForm={faq.faqForm}
      setFaqForm={faq.setFaqForm}
      isFaqLoading={faq.isFaqLoading}
      isFaqSubmitting={faq.isFaqSubmitting}
      editingId={faq.editingId}
      editForm={faq.editForm}
      setEditForm={faq.setEditForm}
      isFaqUpdating={faq.isFaqUpdating}
      submitFaq={faq.submitFaq}
      startEdit={faq.startEdit}
      cancelEdit={faq.cancelEdit}
      updateFaq={faq.updateFaq}
      deleteFaq={faq.deleteFaq}
    />
  )
}
