'use client'

import { useState, useCallback, useEffect } from 'react'
import type { Faq } from '../_types'

interface UseFaqProps {
  activeTab: string
  allowed: boolean
}

export function useFaq({ activeTab, allowed }: UseFaqProps) {
  const [faqs, setFaqs] = useState<Faq[]>([])
  const [faqForm, setFaqForm] = useState({ question: '', answer: '' })
  const [isFaqLoading, setIsFaqLoading] = useState(false)
  const [isFaqSubmitting, setIsFaqSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ question: '', answer: '' })
  const [isFaqUpdating, setIsFaqUpdating] = useState(false)

  const fetchFaqs = useCallback(async () => {
    if (activeTab !== 'faq' || !allowed) return
    setIsFaqLoading(true)
    try {
      const res = await fetch('/api/faqs')
      const data = await res.json()
      setFaqs(data.faqs || [])
    } catch (error) {
      console.error('Error fetching FAQs:', error)
    } finally {
      setIsFaqLoading(false)
    }
  }, [activeTab, allowed])

  useEffect(() => {
    fetchFaqs()
  }, [fetchFaqs])

  const submitFaq = useCallback(async () => {
    setIsFaqSubmitting(true)
    try {
      const res = await fetch('/api/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(faqForm)
      })
      if (res.ok) {
        setFaqForm({ question: '', answer: '' })
        fetchFaqs()
      }
    } catch (error) {
      console.error('Error submitting FAQ:', error)
    } finally {
      setIsFaqSubmitting(false)
    }
  }, [faqForm, fetchFaqs])

  const startEdit = useCallback((faq: Faq) => {
    setEditingId(faq._id)
    setEditForm({ question: faq.question, answer: faq.answer })
  }, [])

  const cancelEdit = useCallback(() => {
    setEditingId(null)
    setEditForm({ question: '', answer: '' })
  }, [])

  const updateFaq = useCallback(async () => {
    if (!editingId) return
    setIsFaqUpdating(true)
    try {
      const res = await fetch(`/api/faqs/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      })
      if (res.ok) {
        cancelEdit()
        fetchFaqs()
      }
    } catch (error) {
      console.error('Error updating FAQ:', error)
    } finally {
      setIsFaqUpdating(false)
    }
  }, [editingId, editForm, fetchFaqs, cancelEdit])

  const deleteFaq = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/faqs/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchFaqs()
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error)
    }
  }, [fetchFaqs])

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
