'use client'

import { useState, useEffect, useCallback } from 'react'
import api from '@/lib/api'

export interface ContactMessage {
  id: number
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  createdAt: string
  updatedAt: string
}

export function useContactMessages({ activeTab, allowed }: { activeTab: string; allowed: boolean }) {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)
  const [isMarkingRead, setIsMarkingRead] = useState<number | null>(null)

  const fetchMessages = useCallback(async () => {
    if (!allowed) return
    
    try {
      setIsLoading(true)
      const res = await api.get('/api/v1/contact-info')
      const data = res.data?.data || []
      setMessages(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to fetch contact messages:', err)
      setMessages([])
    } finally {
      setIsLoading(false)
    }
  }, [allowed])

  const deleteMessage = useCallback(async (id: number) => {
    try {
      setIsDeleting(id)
      await api.delete(`/api/v1/contact-info/${id}`)
      setMessages(prev => prev.filter(m => m.id !== id))
      return true
    } catch (err) {
      console.error('Failed to delete message:', err)
      return false
    } finally {
      setIsDeleting(null)
    }
  }, [])

  const markAsRead = useCallback(async (id: number) => {
    try {
      setIsMarkingRead(id)
      const res = await api.patch(`/api/v1/contact-info/${id}/read`)
      const updatedMessage = res.data?.data
      if (updatedMessage) {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m))
      }
      return true
    } catch (err) {
      console.error('Failed to mark as read:', err)
      return false
    } finally {
      setIsMarkingRead(null)
    }
  }, [])

  const unreadCount = messages.filter(m => !m.read).length

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  return {
    messages,
    isLoading,
    isDeleting,
    isMarkingRead,
    unreadCount,
    deleteMessage,
    markAsRead,
    refresh: fetchMessages
  }
}
