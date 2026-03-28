'use client'

import { useEffect, useMemo, useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { BookOpen, HelpCircle, Layers, LayoutDashboard, MessageSquare, Settings, Shield, UserCheck, Users, CreditCard, Building2, GraduationCap, Mail, UserX, Sparkles } from 'lucide-react'
import DashboardHeader from '@/app/dashboard/_components/DashboardHeader'
import DashboardSidebar from '@/app/dashboard/_components/DashboardSidebar'
import CropModal from '@/app/dashboard/_components/CropModal'
import { NotificationContainer, useNotification } from '@/app/dashboard/_components/Notification'
import EditUserModal from '@/app/dashboard/_components/EditUserModal'
import BankCardsTab from '@/app/dashboard/_components/tabs/BankCardsTab'
import CommentsTab from '@/app/dashboard/_components/tabs/CommentsTab'
import CoursesTab from '@/app/dashboard/_components/tabs/CoursesTab'
import FaqTab from '@/app/dashboard/_components/tabs/FaqTab'
import InstructorTab from '@/app/dashboard/_components/tabs/InstructorTab'
import ModulesTab from '@/app/dashboard/_components/tabs/ModulesTab'
import OverviewTab from '@/app/dashboard/_components/tabs/OverviewTab'
import PaymentsTab from '@/app/dashboard/_components/tabs/PaymentsTab'
import SettingsTab from '@/app/dashboard/_components/tabs/SettingsTab'
import UsersTab from '@/app/dashboard/_components/tabs/UsersTab'
import SuspendedUsersTab from '@/app/dashboard/_components/tabs/SuspendedUsersTab'
import EnrollmentsTab from '@/app/dashboard/_components/tabs/EnrollmentsTab'
import CourseRegistrationsTab from '@/app/dashboard/_components/tabs/CourseRegistrationsTab'
import ContactMessagesTab from '@/app/dashboard/_components/tabs/ContactMessagesTab'
import HeroContentTab from '@/app/dashboard/_components/tabs/HeroContentTab'
import useAuth from '@/app/dashboard/_hooks/useAuth'
import useCrop from '@/app/dashboard/_hooks/useCrop'
import useCourses from '@/app/dashboard/_hooks/useCourses'
import useFaq from '@/app/dashboard/_hooks/useFaq'
import useInstructor from '@/app/dashboard/_hooks/useInstructor'
import useModules from '@/app/dashboard/_hooks/useModules'
import useOverview from '@/app/dashboard/_hooks/useOverview'
import usePayments from '@/app/dashboard/_hooks/usePayments'
import useReviews from '@/app/dashboard/_hooks/useReviews'
import useSettings from '@/app/dashboard/_hooks/useSettings'
import useUsers from '@/app/dashboard/_hooks/useUsers'
import { useEnrollments } from '@/app/dashboard/_hooks/useEnrollments'
import { useCourseRegistrations } from '@/app/dashboard/_hooks/useCourseRegistrations'
import { useContactMessages } from '@/app/dashboard/_hooks/useContactMessages'
import { useHeroContent } from '@/app/dashboard/_hooks/useHeroContent'
import { userService } from '@/lib/api'
import type { DashboardMenuItem } from '@/app/dashboard/_components/DashboardSidebar'
import type { DashboardTabId, User } from '@/app/dashboard/_types'

type EditingUser = (User & { __editScope?: 'users' }) | null

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<DashboardTabId>('overview')
  const { notifications, showNotification, removeNotification } = useNotification()
  const [editingUser, setEditingUser] = useState<EditingUser>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    showNotification(message, type)
  }

  // Suspended users state
  const [suspendedUsers, setSuspendedUsers] = useState<User[]>([])
  const [isSuspendedLoading, setIsSuspendedLoading] = useState(false)
  const [suspendedSearch, setSuspendedSearch] = useState('')

  const loadSuspendedUsers = async () => {
    if (!allowed) return
    setIsSuspendedLoading(true)
    try {
      const { data } = await userService.getSuspendedUsers()
      setSuspendedUsers(data.users || [])
    } catch (err) {
      console.error('Failed to load suspended users:', err)
      showToast('Կասեցված օգտվողների ցուցակը բեռնել չհաջողվեց', 'error')
    } finally {
      setIsSuspendedLoading(false)
    }
  }

  const handleRestoreUser = async (id: number | string) => {
    try {
      await userService.restoreUser(id)
      showToast('Օգտատերը հաջողությամբ վերականգնվեց', 'success')
      loadSuspendedUsers()
    } catch (err) {
      console.error('Failed to restore user:', err)
      showToast('Վերականգնումը ձախողվեց', 'error')
    }
  }

  const handlePermanentDelete = async (id: number | string) => {
    try {
      await userService.permanentDeleteUser(id)
      showToast('Օգտատերը ընդմիշտ ջնջվեց', 'success')
      loadSuspendedUsers()
    } catch (err) {
      console.error('Failed to permanently delete user:', err)
      showToast('Ջնջումը ձախողվեց', 'error')
    }
  }

  const handleBulkDelete = async (ids: (number | string)[]) => {
    try {
      // Delete users one by one
      await Promise.all(ids.map(id => userService.permanentDeleteUser(id)))
      showToast(`${ids.length} օգտատեր ընդմիշտ ջնջվեց`, 'success')
      loadSuspendedUsers()
    } catch (err) {
      console.error('Failed to bulk delete users:', err)
      showToast('Կապակցված ջնջումը ձախողվեց', 'error')
    }
  }

  useEffect(() => {
    if (activeTab === 'suspended-users') {
      loadSuspendedUsers()
    }
  }, [activeTab])

  const { isAuthLoading, allowed, user: currentUser } = useAuth()

  const { recentStudents, isRecentLoading, statCounts, relativeTime: overviewRelativeTime } = useOverview({ activeTab, allowed })
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
  } = useUsers({ activeTab, allowed, editingUser, setEditingUser, showToast, currentUser })
  const { reviews, isReviewsLoading, relativeTime: reviewsRelativeTime, isToday, handleDeleteReview } = useReviews({ activeTab, allowed })
  const { faqs, faqForm, setFaqForm, isFaqLoading, isFaqSubmitting, editingId, editForm, setEditForm, isFaqUpdating, submitFaq, startEdit, cancelEdit, updateFaq, deleteFaq } =
    useFaq({ activeTab, allowed, showToast })
  const { siteSettings, setSiteSettings, workingHoursSchedule, setWorkingHoursSchedule, isSettingsLoading, saveSettings } = useSettings({
    activeTab,
    allowed,
    showToast
  })
  const { cropImage, cropModalOpen, crop, zoom, setCrop, setZoom, onCropComplete, onLogoFileSelect, createCroppedImage, closeCrop } = useCrop({
    setSiteSettings
  })
  const { instructorForm, instructorErrors, isInstructorLoading, onAvatarFile, onTitleChange, onNameChange, onProfessionChange, onDescriptionChange, onBadgeTextChange, onStatValueChange, saveInstructor, cropModalOpen: instructorCropModalOpen, cropImage: instructorCropImage, crop: instructorCrop, zoom: instructorZoom, setCrop: setInstructorCrop, setZoom: setInstructorZoom, onCropComplete: onInstructorCropComplete, closeCropModal: closeInstructorCropModal, confirmCrop: confirmInstructorCrop } =
    useInstructor({ activeTab, allowed, showToast })
  const { showCourseForm, courseForm, setCourseForm, startNewCourse, editCourse, cancelNewCourse, addLearningPoint, changeLearningPoint, removeLearningPoint, submitCourse, deleteCourse, courses, isLoading: isCoursesLoading, getCourseFirstVideoUrl, editingCourse } = useCourses({
    activeTab,
    showToast
  })
  const { showModuleForm, moduleForm, setModuleForm, allModules, courses: moduleCourses, isLoading: isModulesLoading, editingId: editingModuleId, startNewModule, editModule, cancelNewModule, submitModule, deleteModule, videoFile, isUploadingVideo, currentModuleVideos, deleteModuleVideo, updateModuleVideo, handleVideoFileChange, uploadModuleVideo, getVideoUrl } = useModules({
    activeTab,
    showToast
  })
  const { payments, users: paymentUsers, courses: paymentCourses, isLoading: isPaymentsLoading, isSubmitting: isPaymentsSubmitting, createPayment, updatePaymentStatus } = usePayments({
    activeTab,
    allowed
  })
  const { enrollments, courses: enrollmentCourses, enrollmentsByCourse, isLoading: isEnrollmentsLoading, selectedCourse, setSelectedCourse, searchTerm: enrollmentSearchTerm, setSearchTerm: setEnrollmentSearchTerm, revokeAccess } = useEnrollments({
    activeTab,
    allowed
  })
  const { registrations: courseRegistrations, isLoading: isCourseRegistrationsLoading, isDeleting: isDeletingCourseRegistration, deleteRegistration: deleteCourseRegistration } = useCourseRegistrations({
    activeTab,
    allowed
  })
  const { messages: contactMessages, isLoading: isContactMessagesLoading, isDeleting: isDeletingContactMessage, isMarkingRead: isMarkingContactMessageRead, unreadCount: contactUnreadCount, deleteMessage: deleteContactMessage, markAsRead: markContactMessageAsRead } = useContactMessages({
    activeTab,
    allowed
  })
  const { form, setForm, isLoading, isSubmitting, videoFile: heroVideoFile, videoPreview, handleVideoChange, clearVideo, submitContent, deleteContent } = useHeroContent({
    activeTab,
    allowed,
    showToast
  })
  const menuItems = useMemo<DashboardMenuItem[]>(
    () => [
      { id: 'overview', label: 'Վահանակ', icon: LayoutDashboard },
      { id: 'users', label: 'Օգտվողներ', icon: Users },
      { id: 'suspended-users', label: 'Կասեցվածներ', icon: UserX },
      { id: 'enrollments', label: 'Գրանցումներ', icon: GraduationCap },
      { id: 'course-registrations', label: 'Կուրսերի գրանցումներ', icon: BookOpen },
      { id: 'contact-messages', label: 'Կոնտակտներ', icon: Mail },
      { id: 'payments', label: 'Վճարումներ', icon: CreditCard },
      { id: 'bank-cards', label: 'Բանկային քարտեր', icon: Building2 },
      { id: 'courses', label: 'Դասընթացներ', icon: BookOpen },
      { id: 'modules', label: 'Մոդուլներ', icon: Layers },
      { id: 'comments', label: 'Մեկնաբանություններ', icon: MessageSquare },
      { id: 'instructor', label: 'Մենթոր', icon: Shield },
      { id: 'faq', label: 'ՀՏՀ', icon: HelpCircle },
      { id: 'hero-content', label: 'Հերո բովանդակություն', icon: Sparkles },
      { id: 'settings', label: 'Կարգավորումներ', icon: Settings }
    ],
    []
  )

  const stats = useMemo(
    () => [
      { label: 'Դասընթացի մասնակիցներ', value: `${statCounts.students}`, icon: UserCheck, trend: '+0%', color: 'text-violet-600', bg: 'bg-violet-50' },
      { label: 'Դասընթացներ', value: `${statCounts.courses}`, icon: BookOpen, trend: '+0%', color: 'text-emerald-600', bg: 'bg-emerald-50' },
      { label: 'Մեկնաբանություններ', value: `${statCounts.reviews}`, icon: MessageSquare, trend: '+0%', color: 'text-orange-600', bg: 'bg-orange-50' },
      { label: 'Օգտվողներ', value: `${statCounts.activeUsers}`, icon: Users, trend: '+0%', color: 'text-blue-600', bg: 'bg-blue-50' }
    ],
    [statCounts]
  )

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600" />
      </div>
    )
  }

  if (!allowed) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col">
        <Header forceWhiteBackground />
        <main className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="w-full max-w-xl bg-white rounded-[2.5rem] p-10 shadow-lg border border-slate-100 text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-red-600">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="mt-6 text-3xl font-black text-slate-900">Մուտքը սահմանափակված է</h1>
            <p className="mt-2 text-slate-500 font-medium">Այս էջը հասանելի է միայն ադմիններին</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Header />

      <main className="container max-w-[1400px] px-4 md:px-8 pt-24 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 mt-[120px] items-start">
          <div className="lg:sticky lg:top-24">
            <DashboardSidebar menuItems={menuItems} activeTab={activeTab} onTabChange={setActiveTab} badges={{ 'contact-messages': contactUnreadCount, 'course-registrations': courseRegistrations.length }} />
          </div>

          <div className="space-y-6">
              {activeTab === 'overview' && (
                  <OverviewTab stats={stats} recentStudents={recentStudents} isRecentLoading={isRecentLoading} relativeTime={overviewRelativeTime} />
              )}

              {activeTab === 'users' && (
                  <UsersTab
                    users={filteredUsers}
                    isUsersLoading={isUsersLoading}
                    userSearch={userSearch}
                    setUserSearch={setUserSearch}
                    getUserPaymentStatus={getUserPaymentStatus}
                    onEdit={startEditUserModal}
                    onDelete={handleDeleteUser}
                  />
              )}

              {activeTab === 'suspended-users' && (
                  <SuspendedUsersTab
                    users={suspendedUsers}
                    isLoading={isSuspendedLoading}
                    search={suspendedSearch}
                    setSearch={setSuspendedSearch}
                    onRestore={handleRestoreUser}
                    onPermanentDelete={handlePermanentDelete}
                    onBulkDelete={handleBulkDelete}
                  />
              )}

              {activeTab === 'enrollments' && (
                  <EnrollmentsTab
                    enrollments={enrollments}
                    courses={enrollmentCourses}
                    enrollmentsByCourse={enrollmentsByCourse}
                    isLoading={isEnrollmentsLoading}
                    selectedCourse={selectedCourse}
                    setSelectedCourse={setSelectedCourse}
                    searchTerm={enrollmentSearchTerm}
                    setSearchTerm={setEnrollmentSearchTerm}
                    revokeAccess={revokeAccess}
                  />
              )}

              {activeTab === 'course-registrations' && (
                  <CourseRegistrationsTab
                    registrations={courseRegistrations}
                    isLoading={isCourseRegistrationsLoading}
                    isDeleting={isDeletingCourseRegistration}
                    onDelete={deleteCourseRegistration}
                  />
              )}

              {activeTab === 'contact-messages' && (
                  <ContactMessagesTab
                    messages={contactMessages}
                    isLoading={isContactMessagesLoading}
                    isDeleting={isDeletingContactMessage}
                    isMarkingRead={isMarkingContactMessageRead}
                    onDelete={deleteContactMessage}
                    onMarkAsRead={markContactMessageAsRead}
                  />
              )}

              {activeTab === 'payments' && (
                  <PaymentsTab
                    payments={payments}
                    users={paymentUsers}
                    courses={paymentCourses}
                    isLoading={isPaymentsLoading}
                    isSubmitting={isPaymentsSubmitting}
                    onCreatePayment={createPayment}
                    onUpdateStatus={updatePaymentStatus}
                  />
              )}

              {activeTab === 'bank-cards' && (
                  <BankCardsTab />
              )}

              {activeTab === 'courses' && (
                <CoursesTab
                  showCourseForm={showCourseForm}
                  courseForm={courseForm}
                  setCourseForm={setCourseForm}
                  startNewCourse={startNewCourse}
                  editCourse={editCourse}
                  deleteCourse={deleteCourse}
                  cancelNewCourse={cancelNewCourse}
                  addLearningPoint={addLearningPoint}
                  changeLearningPoint={changeLearningPoint}
                  removeLearningPoint={removeLearningPoint}
                  submitCourse={submitCourse}
                  courses={courses}
                  isLoading={isCoursesLoading}
                  getCourseFirstVideoUrl={getCourseFirstVideoUrl}
                  editingCourse={editingCourse}
                />
              )}

              {activeTab === 'modules' && (
                  <ModulesTab
                    showModuleForm={showModuleForm}
                    moduleForm={moduleForm}
                    setModuleForm={setModuleForm}
                    allModules={allModules}
                    courses={moduleCourses}
                    isLoading={isModulesLoading}
                    editingId={editingModuleId}
                    startNewModule={startNewModule}
                    editModule={editModule}
                    cancelNewModule={cancelNewModule}
                    submitModule={submitModule}
                    deleteModule={deleteModule}
                    videoFile={videoFile}
                    isUploadingVideo={isUploadingVideo}
                    currentModuleVideos={currentModuleVideos}
                    deleteModuleVideo={deleteModuleVideo}
                    updateModuleVideo={updateModuleVideo}
                    handleVideoFileChange={handleVideoFileChange}
                    uploadModuleVideo={uploadModuleVideo}
                    getVideoUrl={getVideoUrl}
                  />
              )}

              {activeTab === 'comments' && (
                  <CommentsTab
                    reviews={reviews}
                    isReviewsLoading={isReviewsLoading}
                    relativeTime={reviewsRelativeTime}
                    isToday={isToday}
                    onDeleteReview={handleDeleteReview}
                  />
              )}

              {activeTab === 'instructor' && (
                  <InstructorTab
                    instructorForm={instructorForm}
                    instructorErrors={instructorErrors}
                    isInstructorLoading={isInstructorLoading}
                    onAvatarFileSelect={onAvatarFile}
                    onTitleChange={onTitleChange}
                    onNameChange={onNameChange}
                    onProfessionChange={onProfessionChange}
                    onDescriptionChange={onDescriptionChange}
                    onBadgeTextChange={onBadgeTextChange}
                    onStatValueChange={onStatValueChange}
                    onSubmit={saveInstructor}
                  />
              )}

              {activeTab === 'faq' && (
                  <FaqTab
                    faqs={faqs}
                    faqForm={faqForm}
                    setFaqForm={setFaqForm}
                    isFaqLoading={isFaqLoading}
                    isFaqSubmitting={isFaqSubmitting}
                    editingId={editingId}
                    editForm={editForm}
                    setEditForm={setEditForm}
                    isFaqUpdating={isFaqUpdating}
                    submitFaq={submitFaq}
                    startEdit={startEdit}
                    cancelEdit={cancelEdit}
                    updateFaq={updateFaq}
                    deleteFaq={deleteFaq}
                  />
              )}

              {activeTab === 'hero-content' && (
                  <HeroContentTab
                    form={form}
                    setForm={setForm}
                    isLoading={isLoading}
                    isSubmitting={isSubmitting}
                    videoFile={heroVideoFile}
                    videoPreview={videoPreview}
                    handleVideoChange={handleVideoChange}
                    clearVideo={clearVideo}
                    submitContent={submitContent}
                    deleteContent={deleteContent}
                  />
              )}

              {activeTab === 'settings' && (
                  <SettingsTab
                    siteSettings={siteSettings}
                    setSiteSettings={setSiteSettings}
                    workingHoursSchedule={workingHoursSchedule}
                    setWorkingHoursSchedule={setWorkingHoursSchedule}
                    isSettingsLoading={isSettingsLoading}
                    saveSettings={saveSettings}
                    onLogoFileSelect={onLogoFileSelect}
                  />
              )}
          </div>
        </div>
      </main>

      <EditUserModal
        open={Boolean(editingUser)}
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onSubmit={submitEditUser}
      />

      <CropModal
        open={cropModalOpen}
        cropImage={cropImage}
        crop={crop}
        zoom={zoom}
        setCrop={setCrop}
        setZoom={setZoom}
        onCropComplete={onCropComplete}
        onClose={closeCrop}
        onConfirm={createCroppedImage}
      />

      <CropModal
        open={instructorCropModalOpen}
        cropImage={instructorCropImage}
        crop={instructorCrop}
        zoom={instructorZoom}
        setCrop={setInstructorCrop}
        setZoom={setInstructorZoom}
        onCropComplete={onInstructorCropComplete}
        onClose={closeInstructorCropModal}
        onConfirm={confirmInstructorCrop}
      />

      <NotificationContainer notifications={notifications} onRemove={removeNotification} />

      <Footer />
    </div>
  )
}
