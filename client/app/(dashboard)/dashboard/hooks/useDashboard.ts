'use client'

import { useEffect } from 'react'
import useAuth from '@/hooks/admin/useAuth'
import { useDashboardState } from './useDashboardState'
import { useDashboardData } from './useDashboardData'
import type { User } from '@/components/features/admin/types'

export function useDashboard() {
  // Core state management
  const {
    activeTab,
    setActiveTab,
    editingUser,
    setEditingUser,
    showToast,
    notifications,
    removeNotification,
  } = useDashboardState()

  // Auth
  const { isAuthLoading, allowed, user: currentUser } = useAuth()

  // Data layer - all feature hooks composed
  const data = useDashboardData({
    activeTab,
    allowed,
    showToast,
    editingUser,
    setEditingUser,
    currentUser: currentUser as User | null,
  })

  // Load suspended users when tab changes
  useEffect(() => {
    if (activeTab === 'suspended-users') {
      data.suspendedUsersData.loadSuspendedUsers(allowed)
    }
  }, [activeTab, allowed, data.suspendedUsersData])

  // Flatten return for backward compatibility
  return {
    // State
    activeTab,
    setActiveTab,
    editingUser,
    setEditingUser,
    showToast,
    notifications,
    removeNotification,

    // Auth
    isAuthLoading,
    allowed,
    currentUser,

    // Menu & Overview
    menuItems: data.menuItems,
    stats: data.stats,
    recentStudents: data.recentStudents,
    isRecentLoading: data.isRecentLoading,
    overviewRelativeTime: data.overviewRelativeTime,

    // Users
    ...data.usersData,

    // Reviews
    reviews: data.reviews,
    isReviewsLoading: data.isReviewsLoading,
    reviewsRelativeTime: data.reviewsRelativeTime,
    isToday: data.isToday,
    handleDeleteReview: data.handleDeleteReview,

    // FAQ
    ...data.faqData,

    // Settings
    ...data.settingsData,

    // Crop
    ...data.cropData,

    // Instructor
    ...data.instructorData,

    // Courses
    ...data.coursesData,

    // Modules
    ...data.modulesData,

    // Payments
    ...data.paymentsData,

    // Enrollments
    ...data.enrollmentsData,

    // Course Registrations
    ...data.courseRegistrationsData,

    // Contact Messages
    ...data.contactMessagesData,

    // Hero Content - with aliasing
    heroForm: data.heroContentData.form,
    setHeroForm: data.heroContentData.setForm,
    isHeroLoading: data.heroContentData.isLoading,
    isHeroSubmitting: data.heroContentData.isSubmitting,
    heroVideoFile: data.heroContentData.videoFile,
    heroVideoPreview: data.heroContentData.videoPreview,
    handleHeroVideoChange: data.heroContentData.handleVideoChange,
    clearHeroVideo: data.heroContentData.clearVideo,
    submitHeroContent: data.heroContentData.submitContent,
    deleteHeroContent: data.heroContentData.deleteContent,

    // Suspended Users
    ...data.suspendedUsersData,
  }
}

export type ReturnTypeUseDashboard = ReturnType<typeof useDashboard>
