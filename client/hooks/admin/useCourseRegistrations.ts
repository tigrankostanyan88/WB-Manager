'use client'

import { useState, useEffect, useCallback } from 'react'
import api from '@/lib/api'

export interface CourseRegistration {
  id: number
  course_id: number
  name: string
  phone: string
  createdAt: string
  updatedAt: string
}

export function useCourseRegistrations({ activeTab, allowed }: { activeTab: string; allowed: boolean }) {
  const [registrations, setRegistrations] = useState<CourseRegistration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)

  const fetchRegistrations = useCallback(async () => {
    if (activeTab !== 'enrollments' || !allowed) return
    
    try {
      setIsLoading(true)
      const res = await api.get('/api/v1/register-course')
      const data = res.data?.data || []
      setRegistrations(Array.isArray(data) ? data : [])
    } catch (err) {
      setRegistrations([])
    } finally {
      setIsLoading(false)
    }
  }, [activeTab, allowed])

  const deleteRegistration = useCallback(async (id: number) => {
    try {
      setIsDeleting(id)
      await api.delete(`/api/v1/register-course/${id}`)
      setRegistrations(prev => prev.filter(r => r.id !== id))
      return true
    } catch (err) {
      return false
    } finally {
      setIsDeleting(null)
    }
  }, [])

  useEffect(() => {
    fetchRegistrations()
  }, [fetchRegistrations])

  return {
    registrations,
    isLoading,
    isDeleting,
    deleteRegistration,
    refresh: fetchRegistrations
  }
}
