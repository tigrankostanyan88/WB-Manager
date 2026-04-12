'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import type { Course } from '../types'

interface Review {
  id?: string | number
  rating?: number
  name?: string
}

interface UseCoursesResult {
  courses: Course[]
  loading: boolean
  error: string | null
  refetch: () => void
  averageRating: number
  totalReviews: number
}

export function useCourses(): UseCoursesResult {
  const [courses, setCourses] = useState<Course[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch courses and reviews in parallel
      const [coursesRes, reviewsRes] = await Promise.all([
        api.get('/api/v1/courses'),
        api.get('/api/v1/reviews').catch(() => ({ data: { data: { reviews: [] } } }))
      ])
      
      const coursesData = coursesRes.data?.data || coursesRes.data?.courses || coursesRes.data || []
      setCourses(Array.isArray(coursesData) ? coursesData : [])
      
      const reviewsData = reviewsRes.data?.data?.reviews || reviewsRes.data?.reviews || reviewsRes.data || []
      setReviews(Array.isArray(reviewsData) ? reviewsData : [])
    } catch {
      setError('Դասընթացները բեռնելու ժամանակ սխալ է տեղի ունեցել')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Calculate average rating from reviews
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length
    : 0

  return {
    courses,
    loading,
    error,
    refetch: fetchData,
    averageRating,
    totalReviews: reviews.length
  }
}
