'use client'

import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import api from '@/lib/api'
import { useConfirm } from '@/components/providers/ConfirmProvider'
import type { DashboardTabId, FAQ } from '../types'

interface UseFaqParams {
  activeTab: DashboardTabId
  allowed: boolean
  showToast: (message: string, type?: 'success' | 'error') => void
}

export default function useFaq({ activeTab, allowed, showToast }: UseFaqParams) {
  const confirm = useConfirm()
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [faqForm, setFaqForm] = useState({ title: '', text: '' })
  const [isFaqLoading, setIsFaqLoading] = useState(false)
  const [isFaqSubmitting, setIsFaqSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({ title: '', text: '' })
  const [isFaqUpdating, setIsFaqUpdating] = useState(false)

  useEffect(() => {
    if (!allowed) return
    if (activeTab !== 'faq') return
    let cancelled = false
    ;(async () => {
      setIsFaqLoading(true)
      try {
        const res = await api.get('/api/v1/faq')
        const data = res.data as { faqs?: unknown }
        const list = Array.isArray(data.faqs) ? (data.faqs as FAQ[]) : []
        if (!cancelled) setFaqs(list)
      } finally {
        if (!cancelled) setIsFaqLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [activeTab, allowed])

  const submitFaq = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!faqForm.title.trim()) {
      showToast('Լրացրեք հարցը', 'error')
      return
    }
    if (!faqForm.text.trim()) {
      showToast('Լրացրեք պատասխանը', 'error')
      return
    }
    setIsFaqSubmitting(true)
    try {
      const res = await api.post('/api/v1/faq', { title: faqForm.title.trim(), text: faqForm.text.trim() })
      const created = (res.data as { item?: unknown }).item as FAQ | undefined
      if (created) setFaqs([created, ...faqs])
      setFaqForm({ title: '', text: '' })
    } finally {
      setIsFaqSubmitting(false)
    }
  }

  const startEdit = (f: FAQ) => {
    setEditingId(f.id)
    setEditForm({ title: f.question, text: f.answer })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({ title: '', text: '' })
  }

  const updateFaq = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editForm.title.trim()) {
      showToast('Լրացրեք հարցը', 'error')
      return
    }
    if (!editForm.text.trim()) {
      showToast('Լրացրեք պատասխանը', 'error')
      return
    }
    if (!editingId) return
    setIsFaqUpdating(true)
    try {
      const res = await api.put(`/api/v1/faq/${editingId}`, { title: editForm.title.trim(), text: editForm.text.trim() })
      const updated = (res.data as { item?: unknown }).item as FAQ | undefined
      if (updated) {
        setFaqs(faqs.map((f) => (f.id === editingId ? { id: updated.id, question: updated.question, answer: updated.answer } : f)))
      } else {
        setFaqs(faqs.map((f) => (f.id === editingId ? { ...f, question: editForm.title, answer: editForm.text } : f)))
      }
      cancelEdit()
    } finally {
      setIsFaqUpdating(false)
    }
  }

  const deleteFaq = async (id: number) => {
    const ok = await confirm({
      title: 'Ջնջե՞լ հարցը',
      message: 'Գործողությունը չի վերադարձվի',
      confirmText: 'Ջնջել',
      cancelText: 'Չեղարկել',
      tone: 'danger'
    })
    if (!ok) return
    await api.delete(`/api/v1/faq/${id}`)
    setFaqs(faqs.filter((f) => f.id !== id))
  }

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
