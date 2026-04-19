// landing/contact/useContactForm.ts - Contact form hook

'use client'

import { useState, FormEvent } from 'react'
import { ContactFormSchema } from '@/lib/validation'
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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
    // Clear field error when user types
    if (fieldErrors[id]) {
      setFieldErrors(prev => ({ ...prev, [id]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const result = ContactFormSchema.safeParse(formData)
    
    if (!result.success) {
      const errors: Record<string, string> = {}
      result.error.errors.forEach((err) => {
        const field = err.path[0] as string
        if (!errors[field]) {
          errors[field] = err.message
        }
      })
      setFieldErrors(errors)
      return false
    }
    
    // Check privacy separately
    if (!privacyAccepted) {
      setFieldErrors({ privacy: 'Խնդրում ենք համաձայնվել գաղտնիության քաղաքականությանը' })
      return false
    }
    
    setFieldErrors({})
    return true
  }

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()

    if (!validateForm()) {
      setSubmitStatus('error')
      setErrorMessage('Խնդրում ենք ուղղել սխալները ձևում')
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
      setFieldErrors({})
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
    setFieldErrors({})
  }

  return {
    formData,
    privacyAccepted,
    isSubmitting,
    submitStatus,
    errorMessage,
    fieldErrors,
    setPrivacyAccepted,
    handleInputChange,
    handleSubmit,
    resetForm
  }
}
