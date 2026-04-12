'use client'

import React, { useMemo } from 'react'
import useAuth from '@/hooks/admin/useAuth'
import useOverview from '@/hooks/admin/useOverview'
import useReviews from '@/hooks/admin/useReviews'
import useFaq from '@/hooks/admin/useFaq'
import useSettings from '@/hooks/admin/useSettings'
import useCrop from '@/hooks/admin/useCrop'
import useInstructor from '@/hooks/admin/useInstructor'
import { useCourses } from '@/hooks/admin/useCourses'
import { useModules } from '@/hooks/admin/modules/useModules'
import { usePayments } from '@/hooks/admin/usePayments'
import { useEnrollments } from '@/hooks/admin/useEnrollments'
import { useCourseRegistrations } from '@/hooks/admin/useCourseRegistrations'
import { useContactMessages } from '@/hooks/admin/useContactMessages'
import { useHeroContent } from '@/hooks/admin/useHeroContent'
import { useSuspendedUsers } from './useSuspendedUsers'
import { useUsers } from '@/hooks/admin/useUsers'
import { menuItems, createStats } from '../lib/menuItems'
import type { DashboardTabId, User } from '@/components/features/admin/types'

type EditingUser = (User & { __editScope?: 'users' }) | null

interface UseDashboardDataParams {
  activeTab: DashboardTabId
  allowed: boolean
  showToast: (message: string, type?: 'success' | 'error') => void
  editingUser: EditingUser
  setEditingUser: React.Dispatch<React.SetStateAction<EditingUser>>
  currentUser: User | null
}

export function useDashboardData({
  activeTab,
  allowed,
  showToast,
  editingUser,
  setEditingUser,
  currentUser,
}: UseDashboardDataParams) {
  // Auth already loaded by useAuth in parent
  
  // Overview
  const { recentStudents, isRecentLoading, statCounts, relativeTime: overviewRelativeTime } = useOverview({ activeTab, allowed })
  const stats = useMemo(() => createStats(statCounts), [statCounts])

  // Users
  const usersData = useUsers({
    activeTab,
    allowed,
    editingUser,
    setEditingUser,
    showToast,
    currentUser,
  })

  // Reviews
  const { reviews, isReviewsLoading, relativeTime: reviewsRelativeTime, isToday, handleDeleteReview } = useReviews({ activeTab, allowed })

  // FAQ
  const faqData = useFaq({ activeTab, allowed, showToast })

  // Settings
  const settingsData = useSettings({ activeTab, allowed, showToast })

  // Crop (for logo/settings image cropping)
  const cropData = useCrop({ setSiteSettings: settingsData.setSiteSettings })

  // Instructor
  const instructorData = useInstructor({ activeTab, allowed, showToast })

  // Courses
  const coursesData = useCourses({ activeTab, showToast })

  // Modules
  const modulesData = useModules({ activeTab, showToast })

  // Payments
  const paymentsData = usePayments({ activeTab, allowed })

  // Enrollments
  const enrollmentsData = useEnrollments({ activeTab, allowed })

  // Course Registrations
  const courseRegistrationsData = useCourseRegistrations({ activeTab, allowed })

  // Contact Messages
  const contactMessagesData = useContactMessages({ activeTab, allowed })

  // Hero Content
  const heroContentData = useHeroContent({ activeTab, allowed, showToast })

  // Suspended Users
  const suspendedUsersData = useSuspendedUsers(showToast)

  return {
    menuItems,
    stats,
    recentStudents,
    isRecentLoading,
    overviewRelativeTime,
    usersData,
    reviews,
    isReviewsLoading,
    reviewsRelativeTime,
    isToday,
    handleDeleteReview,
    faqData,
    settingsData,
    cropData,
    instructorData,
    coursesData,
    modulesData,
    paymentsData,
    enrollmentsData,
    courseRegistrationsData,
    contactMessagesData,
    heroContentData,
    suspendedUsersData,
  }
}
