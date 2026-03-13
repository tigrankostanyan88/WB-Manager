'use client'

import { useState, useCallback, useEffect } from 'react'
import type { Review } from '../_types'

interface UseReviewsProps {
  activeTab: string
  allowed: boolean
}

export function useReviews({ activeTab, allowed }: UseReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isReviewsLoading, setIsReviewsLoading] = useState(false)

  const relativeTime = (date: string) => {
    const now = new Date()
    const past = new Date(date)
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'հիմա'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} րոպե առաջ`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ժամ առաջ`
    return `${Math.floor(diffInSeconds / 86400)} օր առաջ`
  }

  const isToday = (date: string) => {
    const d = new Date(date)
    const today = new Date()
    return d.toDateString() === today.toDateString()
  }

  const fetchReviews = useCallback(async () => {
    if (activeTab !== 'comments' || !allowed) return
    setIsReviewsLoading(true)
    try {
      const res = await fetch('/api/reviews')
      const data = await res.json()
      setReviews(data.reviews || [])
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setIsReviewsLoading(false)
    }
  }, [activeTab, allowed])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const handleDeleteReview = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchReviews()
      }
    } catch (error) {
      console.error('Error deleting review:', error)
    }
  }, [fetchReviews])

  return { reviews, isReviewsLoading, relativeTime, isToday, handleDeleteReview }
}
