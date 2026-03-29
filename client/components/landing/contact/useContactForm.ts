// landing/contact/useContactForm.ts - Contact form hook

'use client'

import { useState, FormEvent } from 'react'
import type { ContactFormData } from './types'

const emptyForm: ContactFormData = {
  name: '',
  email: '',
  subject: '',
  message: ''
}

export function useContactForm() {
  const [formData, setFormData] = useState<ContactFormData>(emptyForm)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const validateForm = (): string => {
    if (!formData.name.trim()) return 'Խնդրում ենք մուտքագրել ձեր անունը'
    if (!formData.email.trim()) return 'Խնդրում ենք մուտքագրել ձեր էլ. փոստը'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Էլ. փոստի ձևաչափը սխալ է'
    if (!formData.subject.trim()) return 'Խնդրում ենք մուտքագրել թեման'
    if (!formData.message.trim()) return 'Խնդրում ենք մուտքագրել հաղորդագրությունը'
    if (!privacyAccepted) return 'Խնդրում ենք համաձայնվել գաղտնիության քաղաքականությանը'
    return ''
  }

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()

    const validationError = validateForm()
    if (validationError) {
      setSubmitStatus('error')
      setErrorMessage(validationError)
      return
    }

    try {
      setIsSubmitting(true)
      setSubmitStatus('idle')
      setErrorMessage('')

      const response = await fetch('/api/v1/contact-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Հաղորդագրությունը չի ուղարկվել')
      }

      setSubmitStatus('success')
      setFormData(emptyForm)
      setPrivacyAccepted(false)
    } catch (err) {
      setSubmitStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Անհայտ սխալ է տեղի ունեցել')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData(emptyForm)
    setPrivacyAccepted(false)
    setSubmitStatus('idle')
    setErrorMessage('')
  }

  return {
    formData,
    privacyAccepted,
    isSubmitting,
    submitStatus,
    errorMessage,
    setPrivacyAccepted,
    handleInputChange,
    handleSubmit,
    resetForm
  }
}
