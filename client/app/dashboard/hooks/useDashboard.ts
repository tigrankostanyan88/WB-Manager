'use client'

import { useEffect, useMemo, useState } from 'react'
import { useNotification } from '@/components/features/admin/Notification'
import useAuth from '@/components/features/admin/hooks/useAuth'
import useOverview from '@/components/features/admin/hooks/useOverview'
import { useUsers } from '@/components/features/admin/hooks/useUsers'
import useReviews from '@/components/features/admin/hooks/useReviews'
import useFaq from '@/components/features/admin/hooks/useFaq'
import useSettings from '@/components/features/admin/hooks/useSettings'
import useCrop from '@/components/features/admin/hooks/useCrop'
import useInstructor from '@/components/features/admin/hooks/useInstructor'
import { useCourses } from '@/components/features/admin/hooks/useCourses'
import { useModules } from '@/components/features/admin/hooks/useModules'
import { usePayments } from '@/components/features/admin/hooks/usePayments'
import { useEnrollments } from '@/components/features/admin/hooks/useEnrollments'
import { useCourseRegistrations } from '@/components/features/admin/hooks/useCourseRegistrations'
import { useContactMessages } from '@/components/features/admin/hooks/useContactMessages'
import { useHeroContent } from '@/components/features/admin/hooks/useHeroContent'
import { useSuspendedUsers } from './useSuspendedUsers'
import { userService } from '@/lib/api'
import type { DashboardTabId, User } from '@/components/features/admin/types'
import type { DashboardMenuItem } from '@/components/features/admin/DashboardSidebar'
import { menuItems, createStats } from '../lib/menuItems'

type EditingUser = (User & { __editScope?: 'users' }) | null

export function useDashboard() {
  const [activeTab, setActiveTab] = useState<DashboardTabId>('overview')
  const { notifications, showNotification, removeNotification } = useNotification()
  const [editingUser, setEditingUser] = useState<EditingUser>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    showNotification(message, type)
  }

  const { isAuthLoading, allowed, user: currentUser } = useAuth()

  // Overview
  const { recentStudents, isRecentLoading, statCounts, relativeTime: overviewRelativeTime } = useOverview({ activeTab, allowed })
  const stats = useMemo(() => createStats(statCounts), [statCounts])

  // Users
  const {
    users,
    filteredUsers,
    isUsersLoading,
    userSearch,
    setUserSearch,
    handleDeleteUser,
    getUserPaymentStatus,
    startEditUserModal,
    submitEditUser
  } = useUsers({ activeTab, allowed, editingUser, setEditingUser, showToast, currentUser: currentUser as User | null })

  // Reviews
  const { reviews, isReviewsLoading, relativeTime: reviewsRelativeTime, isToday, handleDeleteReview } = useReviews({ activeTab, allowed })

  // FAQ
  const { faqs, faqForm, setFaqForm, isFaqLoading, isFaqSubmitting, editingId, editForm, setEditForm, isFaqUpdating, submitFaq, startEdit, cancelEdit, updateFaq, deleteFaq } =
    useFaq({ activeTab, allowed, showToast })

  // Settings
  const { siteSettings, setSiteSettings, workingHoursSchedule, setWorkingHoursSchedule, isSettingsLoading, saveSettings } = useSettings({
    activeTab,
    allowed,
    showToast
  })

  // Crop
  const { cropImage, cropModalOpen, crop, zoom, setCrop, setZoom, onCropComplete, onLogoFileSelect, createCroppedImage, closeCrop } = useCrop({
    setSiteSettings
  })

  // Instructor
  const { instructorForm, instructorErrors, isInstructorLoading, onAvatarFile, onTitleChange, onNameChange, onProfessionChange, onDescriptionChange, onBadgeTextChange, onStatValueChange, saveInstructor, cropModalOpen: instructorCropModalOpen, cropImage: instructorCropImage, crop: instructorCrop, zoom: instructorZoom, setCrop: setInstructorCrop, setZoom: setInstructorZoom, onCropComplete: onInstructorCropComplete, closeCropModal: closeInstructorCropModal, confirmCrop: confirmInstructorCrop } =
    useInstructor({ activeTab, allowed, showToast })

  // Courses
  const { showCourseForm, courseForm, setCourseForm, startNewCourse, editCourse, cancelNewCourse, addLearningPoint, changeLearningPoint, removeLearningPoint, submitCourse, deleteCourse, courses, isLoading: isCoursesLoading, getCourseFirstVideoUrl, editingCourse } = useCourses({
    activeTab,
    showToast
  })

  // Modules
  const { showModuleForm, moduleForm, setModuleForm, allModules, courses: moduleCourses, isLoading: isModulesLoading, editingId: editingModuleId, startNewModule, editModule, cancelNewModule, submitModule, deleteModule, videoFile, isUploadingVideo, currentModuleVideos, deleteModuleVideo, updateModuleVideo, handleVideoFileChange, uploadModuleVideo, getVideoUrl } = useModules({
    activeTab,
    showToast
  })

  // Payments
  const { payments, users: paymentUsers, courses: paymentCourses, isLoading: isPaymentsLoading, isSubmitting: isPaymentsSubmitting, createPayment, updatePaymentStatus } = usePayments({
    activeTab,
    allowed
  })

  // Enrollments
  const { enrollments, courses: enrollmentCourses, enrollmentsByCourse, isLoading: isEnrollmentsLoading, selectedCourse, setSelectedCourse, searchTerm: enrollmentSearchTerm, setSearchTerm: setEnrollmentSearchTerm, revokeAccess } = useEnrollments({
    activeTab,
    allowed
  })

  // Course Registrations
  const { registrations: courseRegistrations, isLoading: isCourseRegistrationsLoading, isDeleting: isDeletingCourseRegistration, deleteRegistration: deleteCourseRegistration } = useCourseRegistrations({
    activeTab,
    allowed
  })

  // Contact Messages
  const { messages: contactMessages, isLoading: isContactMessagesLoading, isDeleting: isDeletingContactMessage, isMarkingRead: isMarkingContactMessageRead, unreadCount: contactUnreadCount, deleteMessage: deleteContactMessage, markAsRead: markContactMessageAsRead } = useContactMessages({
    activeTab,
    allowed
  })

  // Hero Content
  const { form, setForm, isLoading, isSubmitting, videoFile: heroVideoFile, videoPreview, handleVideoChange, clearVideo, submitContent, deleteContent } = useHeroContent({
    activeTab,
    allowed,
    showToast
  })

  // Suspended Users
  const {
    suspendedUsers,
    isSuspendedLoading,
    suspendedSearch,
    setSuspendedSearch,
    loadSuspendedUsers,
    handleRestoreUser,
    handlePermanentDelete,
    handleBulkDelete
  } = useSuspendedUsers(showToast)

  // Load suspended users when tab changes
  useEffect(() => {
    if (activeTab === 'suspended-users') {
      loadSuspendedUsers(allowed)
    }
  }, [activeTab, allowed])

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
    
    // Menu
    menuItems,
    
    // Overview
    stats,
    recentStudents,
    isRecentLoading,
    overviewRelativeTime,
    
    // Users
    users,
    filteredUsers,
    isUsersLoading,
    userSearch,
    setUserSearch,
    handleDeleteUser,
    getUserPaymentStatus,
    startEditUserModal,
    submitEditUser,
    
    // Suspended
    suspendedUsers,
    isSuspendedLoading,
    suspendedSearch,
    setSuspendedSearch,
    loadSuspendedUsers,
    handleRestoreUser,
    handlePermanentDelete,
    handleBulkDelete,
    
    // Reviews
    reviews,
    isReviewsLoading,
    reviewsRelativeTime,
    isToday,
    handleDeleteReview,
    
    // FAQ
    faqs,
    faqForm,
    setFaqForm,
    isFaqLoading,
    isFaqSubmitting,
    editingId,
    editForm,
    setEditForm,
    isFaqUpdating,
    submitFaq,
    startEdit,
    cancelEdit,
    updateFaq,
    deleteFaq,
    
    // Settings
    siteSettings,
    setSiteSettings,
    workingHoursSchedule,
    setWorkingHoursSchedule,
    isSettingsLoading,
    saveSettings,
    
    // Crop
    cropImage,
    cropModalOpen,
    crop,
    zoom,
    setCrop,
    setZoom,
    onCropComplete,
    onLogoFileSelect,
    createCroppedImage,
    closeCrop,
    
    // Instructor
    instructorForm,
    instructorErrors,
    isInstructorLoading,
    onAvatarFile,
    onTitleChange,
    onNameChange,
    onProfessionChange,
    onDescriptionChange,
    onBadgeTextChange,
    onStatValueChange,
    saveInstructor,
    instructorCropModalOpen,
    instructorCropImage,
    instructorCrop,
    instructorZoom,
    setInstructorCrop,
    setInstructorZoom,
    onInstructorCropComplete,
    closeInstructorCropModal,
    confirmInstructorCrop,
    
    // Courses
    showCourseForm,
    courseForm,
    setCourseForm,
    startNewCourse,
    editCourse,
    cancelNewCourse,
    addLearningPoint,
    changeLearningPoint,
    removeLearningPoint,
    submitCourse,
    deleteCourse,
    courses,
    isCoursesLoading,
    getCourseFirstVideoUrl,
    editingCourse,
    
    // Modules
    showModuleForm,
    moduleForm,
    setModuleForm,
    allModules,
    moduleCourses,
    isModulesLoading,
    editingModuleId,
    startNewModule,
    editModule,
    cancelNewModule,
    submitModule,
    deleteModule,
    videoFile,
    isUploadingVideo,
    currentModuleVideos,
    deleteModuleVideo,
    updateModuleVideo,
    handleVideoFileChange,
    uploadModuleVideo,
    getVideoUrl,
    
    // Payments
    payments,
    paymentUsers,
    paymentCourses,
    isPaymentsLoading,
    isPaymentsSubmitting,
    createPayment,
    updatePaymentStatus,
    
    // Enrollments
    enrollments,
    enrollmentCourses,
    enrollmentsByCourse,
    isEnrollmentsLoading,
    selectedCourse,
    setSelectedCourse,
    enrollmentSearchTerm,
    setEnrollmentSearchTerm,
    revokeAccess,
    
    // Course Registrations
    courseRegistrations,
    isCourseRegistrationsLoading,
    isDeletingCourseRegistration,
    deleteCourseRegistration,
    
    // Contact Messages
    contactMessages,
    isContactMessagesLoading,
    isDeletingContactMessage,
    isMarkingContactMessageRead,
    contactUnreadCount,
    deleteContactMessage,
    markContactMessageAsRead,
    
    // Hero Content
    heroForm: form,
    setHeroForm: setForm,
    isHeroLoading: isLoading,
    isHeroSubmitting: isSubmitting,
    heroVideoFile,
    heroVideoPreview: videoPreview,
    handleHeroVideoChange: handleVideoChange,
    clearHeroVideo: clearVideo,
    submitHeroContent: submitContent,
    deleteHeroContent: deleteContent
  }
}

export type ReturnTypeUseDashboard = ReturnType<typeof useDashboard>
