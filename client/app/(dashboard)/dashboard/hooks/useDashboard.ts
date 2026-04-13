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

    // Courses - map isLoading to isCoursesLoading
    showCourseForm: data.coursesData.showCourseForm,
    courseForm: data.coursesData.courseForm,
    setCourseForm: data.coursesData.setCourseForm,
    startNewCourse: data.coursesData.startNewCourse,
    editCourse: data.coursesData.editCourse,
    deleteCourse: data.coursesData.deleteCourse,
    cancelNewCourse: data.coursesData.cancelNewCourse,
    submitCourse: data.coursesData.submitCourse,
    courses: data.coursesData.courses,
    isCoursesLoading: data.coursesData.isLoading,
    getCourseFirstVideoUrl: data.coursesData.getCourseFirstVideoUrl,
    editingCourseId: data.coursesData.editingCourseId,
    editingCourse: data.coursesData.editingCourse,

    // Modules - destructure to avoid overwriting FAQ editingId
    showModuleForm: data.modulesData.showModuleForm,
    setShowModuleForm: data.modulesData.setShowModuleForm,
    moduleForm: data.modulesData.moduleForm,
    setModuleForm: data.modulesData.setModuleForm,
    allModules: data.modulesData.allModules,
    moduleCourses: data.modulesData.courses,
    isModulesLoading: data.modulesData.isLoading,
    editingModuleId: data.modulesData.editingId,
    startNewModule: data.modulesData.startNewModule,
    editModule: data.modulesData.editModule,
    cancelNewModule: data.modulesData.cancelNewModule,
    submitModule: data.modulesData.submitModule,
    deleteModule: data.modulesData.deleteModule,
    videoFile: data.modulesData.videoFile,
    isUploadingVideo: data.modulesData.isUploadingVideo,
    currentModuleVideos: data.modulesData.currentModuleVideos,
    deleteModuleVideo: data.modulesData.deleteModuleVideo,
    updateModuleVideo: data.modulesData.updateModuleVideo,
    handleVideoFileChange: data.modulesData.handleVideoFileChange,
    uploadModuleVideo: data.modulesData.uploadModuleVideo,
    getVideoUrl: data.modulesData.getVideoUrl,

    // Payments - map properties to match TabContent expectations
    payments: data.paymentsData.payments,
    paymentUsers: data.paymentsData.users,
    paymentCourses: data.paymentsData.courses,
    isPaymentsLoading: data.paymentsData.isLoading,
    isPaymentsSubmitting: data.paymentsData.isSubmitting,
    createPayment: data.paymentsData.createPayment,
    verifyPayment: data.paymentsData.verifyPayment,
    updatePaymentStatus: data.paymentsData.updatePaymentStatus,

    // Enrollments - map courses to enrollmentCourses to avoid conflict
    enrollments: data.enrollmentsData.enrollments,
    allEnrollments: data.enrollmentsData.allEnrollments,
    enrollmentCourses: data.enrollmentsData.courses,
    enrollmentsByCourse: data.enrollmentsData.enrollmentsByCourse,
    isEnrollmentsLoading: data.enrollmentsData.isLoading,
    selectedCourse: data.enrollmentsData.selectedCourse,
    setSelectedCourse: data.enrollmentsData.setSelectedCourse,
    enrollmentSearchTerm: data.enrollmentsData.searchTerm,
    setEnrollmentSearchTerm: data.enrollmentsData.setSearchTerm,
    revokeAccess: data.enrollmentsData.revokeAccess,

    // Course Registrations - map properties to match TabContent expectations
    courseRegistrations: data.courseRegistrationsData.registrations,
    isCourseRegistrationsLoading: data.courseRegistrationsData.isLoading,
    isDeletingCourseRegistration: data.courseRegistrationsData.isDeleting,
    deleteCourseRegistration: data.courseRegistrationsData.deleteRegistration,
    refreshCourseRegistrations: data.courseRegistrationsData.refresh,

    // Contact Messages - map properties to match TabContent expectations
    contactMessages: data.contactMessagesData.messages,
    isContactMessagesLoading: data.contactMessagesData.isLoading,
    isDeletingContactMessage: data.contactMessagesData.isDeleting,
    isMarkingContactMessageRead: data.contactMessagesData.isMarkingRead,
    deleteContactMessage: data.contactMessagesData.deleteMessage,
    markContactMessageAsRead: data.contactMessagesData.markAsRead,
    refreshContactMessages: data.contactMessagesData.refresh,

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
