'use client'

import { useEffect, useState } from 'react'
import { userService } from '@/lib/api'
import api from '@/lib/api'
import type { DashboardTabId, User } from '../_types'

interface StatCounts {
  students: number
  courses: number
  reviews: number
  activeUsers: number
}

interface UseOverviewParams {
  activeTab: DashboardTabId
  allowed: boolean
}

export default function useOverview({ activeTab, allowed }: UseOverviewParams) {
  const [recentStudents, setRecentStudents] = useState<User[]>([])
  const [isRecentLoading, setIsRecentLoading] = useState(false)
  const [statCounts, setStatCounts] = useState<StatCounts>({ students: 0, courses: 0, reviews: 0, activeUsers: 0 })

  const relativeTime = (iso?: string) => {
    if (!iso) return ''
    const dt = new Date(iso)
    const diffMs = Date.now() - dt.getTime()
    const mins = Math.floor(diffMs / 60000)
    if (mins < 60) return `${mins} րոպե առաջ`
    const hrs = Math.floor(mins / 60)
    if (hrs < 48) return `${hrs} ժամ առաջ`
    const days = Math.floor(hrs / 24)
    return `${days} օր առաջ`
  }

  useEffect(() => {
    if (!allowed) return
    if (activeTab !== 'overview') return
    let cancelled = false
    ;(async () => {
      setIsRecentLoading(true)
      try {
        const resUsers = await userService.getAllUsers()
        const allUsers = (resUsers.data?.users || []) as User[]
        const usersList = allUsers
          .filter((u) => u.role === 'student')
          .sort((a, b) => new Date(String(b.createdAt || 0)).getTime() - new Date(String(a.createdAt || 0)).getTime())
          .slice(0, 5)

        const studentsCount = allUsers.filter((u) => u.role === 'student').length
        const activeUsersCount = allUsers.filter((u) => u.role === 'user').length
        const coursesCount = 2

        const resReviews = await api.get('/api/v1/reviews')
        const payload = resReviews.data as { reviews?: unknown; data?: unknown }
        let reviewsList: unknown[] = []
        if (Array.isArray(payload.reviews)) {
          reviewsList = payload.reviews
        } else if (payload.data && typeof payload.data === 'object') {
          const inner = payload.data as { reviews?: unknown }
          if (Array.isArray(inner.reviews)) reviewsList = inner.reviews
        }
        const reviewsCount = reviewsList.length

        if (!cancelled) {
          setRecentStudents(usersList)
          setStatCounts({ students: studentsCount, courses: coursesCount, reviews: reviewsCount, activeUsers: activeUsersCount })
        }
      } finally {
        if (!cancelled) setIsRecentLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [activeTab, allowed])

  return { recentStudents, isRecentLoading, statCounts, relativeTime }
}
