'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import type { Course } from '../types'

interface UseCoursesResult {
  courses: Course[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useCourses(): UseCoursesResult {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCourses = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await api.get('/api/v1/courses')
      const coursesData = res.data?.data || res.data?.courses || res.data || []
      setCourses(Array.isArray(coursesData) ? coursesData : [])
    } catch {
      setError('Դասընթացները բեռնելու ժամանակ սխալ է տեղի ունեցել')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  return {
    courses,
    loading,
    error,
    refetch: fetchCourses
  }
}
