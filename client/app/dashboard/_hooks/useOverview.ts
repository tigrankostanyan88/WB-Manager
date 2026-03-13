'use client'

import { useCallback, useEffect, useState } from 'react'
import type { DashboardTabId } from '../_types'

interface UseOverviewProps {
  activeTab: DashboardTabId
  allowed: boolean
}

export function useOverview({ activeTab, allowed }: UseOverviewProps) {
  const [recentStudents, setRecentStudents] = useState([])
  const [isRecentLoading, setIsRecentLoading] = useState(false)
  const [statCounts, setStatCounts] = useState({
    students: 0,
    courses: 0,
    reviews: 0,
    activeUsers: 0
  })

  const relativeTime = (date: string) => {
    const now = new Date()
    const past = new Date(date)
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'հիմա'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} րոպե առաջ`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ժամ առաջ`
    return `${Math.floor(diffInSeconds / 86400)} օր առաջ`
  }

  const fetchOverview = useCallback(async () => {
    if (activeTab !== 'overview' || !allowed) return
    setIsRecentLoading(true)
    try {
      const [usersRes, coursesRes, reviewsRes] = await Promise.all([
        fetch('/api/users?limit=5'),
        fetch('/api/courses'),
        fetch('/api/reviews')
      ])
      
      const usersData = await usersRes.json()
      const coursesData = await coursesRes.json()
      const reviewsData = await reviewsRes.json()
      
      setRecentStudents(usersData.users || [])
      setStatCounts({
        students: usersData.total || 0,
        courses: coursesData.courses?.length || 0,
        reviews: reviewsData.reviews?.length || 0,
        activeUsers: usersData.users?.filter((u: { isPaid?: boolean }) => u.isPaid).length || 0
      })
    } catch (error) {
      console.error('Error fetching overview:', error)
    } finally {
      setIsRecentLoading(false)
    }
  }, [activeTab, allowed])

  useEffect(() => {
    fetchOverview()
  }, [fetchOverview])

  return { recentStudents, isRecentLoading, statCounts, relativeTime }
}
