'use client'

import { useMemo, useEffect, useState } from 'react'
import { EditUserModal } from '@/components/features/admin/EditUserModal'
import { OverviewTab } from '@/components/features/admin/tabs/OverviewTab'
import { UsersTab } from '@/components/features/admin/tabs/UsersTab'
import { SuspendedUsersTab } from '@/components/features/admin/tabs/suspended'
import { EnrollmentsTab } from '@/components/features/admin/tabs/enrollments'
import { CourseRegistrationsTab } from '@/components/features/admin/tabs/CourseRegistrationsTab'
import { ContactMessagesTab } from '@/components/features/admin/tabs/contact'
import { PaymentsTab } from '@/components/features/admin/tabs/payments'
import { BankCardsTab } from '@/components/features/admin/tabs/bankcards'
import { CoursesTab } from '@/components/features/admin/tabs/CoursesTab'
import { ModulesTab } from '@/components/features/admin/tabs/modules'
import { CommentsTab } from '@/components/features/admin/tabs/CommentsTab'
import { InstructorTab } from '@/components/features/admin/tabs/instructor'
import { FaqTab } from '@/components/features/admin/tabs/FaqTab'
import { HeroContentTab } from '@/components/features/admin/tabs/HeroContentTab'
import { SettingsTab } from '@/components/features/admin/tabs/SettingsTab'
import type { DashboardTabId } from '@/components/features/admin/types'
import type { User } from '@/components/features/admin/types'
import {
  useOverviewTab,
  useUsersTab,
  useSuspendedTab,
  useReviewsTab,
  useFaqTab,
  useSettingsTab,
  useCoursesTab,
  useModulesTab,
  usePaymentsTab,
  useEnrollmentsTab,
  useCourseRegistrationsTab,
  useContactMessagesTab,
  useInstructorTab,
  useHeroContentTab
} from '@/app/(dashboard)/dashboard/hooks/tabs'

interface TabContentProps {
  activeTab: DashboardTabId
  allowed: boolean
  currentUser: User | null
  showToast: (message: string, type?: 'success' | 'error') => void
  editingUser: (User & { __editScope?: 'users' }) | null
  setEditingUser: React.Dispatch<React.SetStateAction<(User & { __editScope?: 'users' }) | null>>
}

// Individual tab components to isolate hook calls
function OverviewTabWrapper({ allowed }: { allowed: boolean }) {
  const overview = useOverviewTab({ activeTab: 'overview', allowed })
  return (
    <OverviewTab
      stats={overview.stats}
      recentStudents={overview.recentStudents}
      isRecentLoading={overview.isRecentLoading}
      relativeTime={overview.relativeTime}
    />
  )
}

function UsersTabWrapper({ allowed, currentUser, showToast, setEditingUser, editingUser }: {
  allowed: boolean
  currentUser: User | null
  showToast: (message: string, type?: 'success' | 'error') => void
  setEditingUser: React.Dispatch<React.SetStateAction<(User & { __editScope?: 'users' }) | null>>
  editingUser: (User & { __editScope?: 'users' }) | null
}) {
  const users = useUsersTab({ activeTab: 'users', allowed, currentUser, showToast, setEditingUser, editingUser })
  return (
    <>
      <UsersTab
        users={users.filteredUsers}
        isUsersLoading={users.isUsersLoading}
        userSearch={users.userSearch}
        setUserSearch={users.setUserSearch}
        getUserPaymentStatus={users.getUserPaymentStatus}
        onEdit={users.startEditUserModal}
        onDelete={users.handleDeleteUser}
      />
      {editingUser && editingUser.__editScope === 'users' && (
        <EditUserModal
          open={!!editingUser}
          onClose={() => setEditingUser(null)}
          user={editingUser}
          onSubmit={users.submitEditUser}
        />
      )}
    </>
  )
}

function SuspendedUsersTabWrapper({ allowed, showToast }: { allowed: boolean; showToast: (message: string, type?: 'success' | 'error') => void }) {
  const suspended = useSuspendedTab({ showToast })
  
  // Load suspended users when tab becomes active
  useEffect(() => {
    suspended.loadSuspendedUsers(allowed)
  }, [allowed])
  
  return (
    <SuspendedUsersTab
      users={suspended.suspendedUsers}
      isLoading={suspended.isSuspendedLoading}
      search={suspended.suspendedSearch}
      setSearch={suspended.setSuspendedSearch}
      onRestore={suspended.handleRestoreUser}
      onPermanentDelete={suspended.handlePermanentDelete}
      onBulkDelete={suspended.handleBulkDelete}
    />
  )
}

function EnrollmentsTabWrapper({ allowed }: { allowed: boolean }) {
  const enrollments = useEnrollmentsTab({ activeTab: 'enrollments', allowed })
  return (
    <EnrollmentsTab
      enrollments={enrollments.enrollments}
      courses={enrollments.courses}
      enrollmentsByCourse={enrollments.enrollmentsByCourse}
      isLoading={enrollments.isLoading}
      selectedCourse={enrollments.selectedCourse}
      setSelectedCourse={enrollments.setSelectedCourse}
      searchTerm={enrollments.searchTerm}
      setSearchTerm={enrollments.setSearchTerm}
      revokeAccess={enrollments.revokeAccess}
    />
  )
}

function CourseRegistrationsTabWrapper({ allowed }: { allowed: boolean }) {
  const registrations = useCourseRegistrationsTab({ activeTab: 'course-registrations', allowed })
  return (
    <CourseRegistrationsTab
      registrations={registrations.registrations}
      isLoading={registrations.isLoading}
      isDeleting={registrations.isDeleting}
      onDelete={registrations.deleteRegistration}
    />
  )
}

function ContactMessagesTabWrapper({ allowed }: { allowed: boolean }) {
  const contact = useContactMessagesTab({ activeTab: 'contact-messages', allowed })
  return (
    <ContactMessagesTab
      messages={contact.messages}
      isLoading={contact.isLoading}
      isDeleting={contact.isDeleting}
      isMarkingRead={contact.isMarkingRead}
      onDelete={contact.deleteMessage}
      onMarkAsRead={contact.markAsRead}
    />
  )
}

function PaymentsTabWrapper({ allowed }: { allowed: boolean }) {
  const payments = usePaymentsTab({ activeTab: 'payments', allowed })
  return (
    <PaymentsTab
      payments={payments.payments}
      users={payments.users}
      courses={payments.courses}
      isLoading={payments.isLoading}
      isSubmitting={payments.isSubmitting}
      onCreatePayment={payments.createPayment}
      onUpdateStatus={payments.updatePaymentStatus}
    />
  )
}

function CoursesTabWrapper({ showToast }: { showToast: (message: string, type?: 'success' | 'error') => void }) {
  const courses = useCoursesTab({ activeTab: 'courses', showToast })
  return (
    <CoursesTab
      showCourseForm={courses.showCourseForm}
      courseForm={courses.courseForm}
      setCourseForm={courses.setCourseForm}
      startNewCourse={courses.startNewCourse}
      editCourse={courses.editCourse}
      deleteCourse={courses.deleteCourse}
      cancelNewCourse={courses.cancelNewCourse}
      addLearningPoint={courses.addLearningPoint}
      changeLearningPoint={courses.changeLearningPoint}
      removeLearningPoint={courses.removeLearningPoint}
      submitCourse={courses.submitCourse}
      courses={courses.courses}
      isLoading={courses.isLoading}
      getCourseFirstVideoUrl={courses.getCourseFirstVideoUrl}
      editingCourse={courses.editingCourse}
    />
  )
}

function ModulesTabWrapper({ showToast }: { showToast: (message: string, type?: 'success' | 'error') => void }) {
  const modules = useModulesTab({ activeTab: 'modules', showToast })
  return (
    <ModulesTab
      showModuleForm={modules.showModuleForm}
      setShowModuleForm={modules.setShowModuleForm}
      moduleForm={modules.moduleForm}
      setModuleForm={modules.setModuleForm}
      allModules={modules.allModules}
      courses={modules.courses}
      isLoading={modules.isLoading}
      editingId={modules.editingId}
      startNewModule={modules.startNewModule}
      editModule={modules.editModule}
      cancelNewModule={modules.cancelNewModule}
      submitModule={modules.submitModule}
      deleteModule={modules.deleteModule}
      videoFile={modules.videoFile}
      isUploadingVideo={modules.isUploadingVideo}
      currentModuleVideos={modules.currentModuleVideos}
      deleteModuleVideo={modules.deleteModuleVideo}
      updateModuleVideo={modules.updateModuleVideo}
      handleVideoFileChange={modules.handleVideoFileChange}
      uploadModuleVideo={modules.uploadModuleVideo}
      getVideoUrl={modules.getVideoUrl}
    />
  )
}

function CommentsTabWrapper({ allowed }: { allowed: boolean }) {
  const reviews = useReviewsTab({ activeTab: 'comments', allowed })
  return (
    <CommentsTab
      reviews={reviews.reviews}
      isReviewsLoading={reviews.isReviewsLoading}
      relativeTime={reviews.relativeTime}
      isToday={reviews.isToday}
      onDeleteReview={reviews.handleDeleteReview}
    />
  )
}

function InstructorTabWrapper({ allowed, showToast }: { allowed: boolean; showToast: (message: string, type?: 'success' | 'error') => void }) {
  const instructor = useInstructorTab({ activeTab: 'instructor', allowed, showToast })
  return (
    <InstructorTab
      instructorForm={instructor.instructorForm}
      instructorErrors={instructor.instructorErrors}
      isInstructorLoading={instructor.isInstructorLoading}
      onAvatarFileSelect={instructor.onAvatarFile}
      onTitleChange={instructor.onTitleChange}
      onNameChange={instructor.onNameChange}
      onProfessionChange={instructor.onProfessionChange}
      onDescriptionChange={instructor.onDescriptionChange}
      onBadgeTextChange={instructor.onBadgeTextChange}
      onStatValueChange={instructor.onStatValueChange}
      onSubmit={instructor.saveInstructor}
    />
  )
}

function FaqTabWrapper({ allowed, showToast }: { allowed: boolean; showToast: (message: string, type?: 'success' | 'error') => void }) {
  const faq = useFaqTab({ activeTab: 'faq', allowed, showToast })
  return (
    <FaqTab
      faqs={faq.faqs}
      faqForm={faq.faqForm}
      setFaqForm={faq.setFaqForm}
      isFaqLoading={faq.isFaqLoading}
      isFaqSubmitting={faq.isFaqSubmitting}
      editingId={faq.editingId}
      editForm={faq.editForm}
      setEditForm={faq.setEditForm}
      isFaqUpdating={faq.isFaqUpdating}
      submitFaq={faq.submitFaq}
      startEdit={faq.startEdit}
      cancelEdit={faq.cancelEdit}
      updateFaq={faq.updateFaq}
      deleteFaq={faq.deleteFaq}
    />
  )
}

function HeroContentTabWrapper({ allowed, showToast }: { allowed: boolean; showToast: (message: string, type?: 'success' | 'error') => void }) {
  const hero = useHeroContentTab({ activeTab: 'hero-content', allowed, showToast })
  return (
    <HeroContentTab
      form={hero.form}
      setForm={hero.setForm}
      isLoading={hero.isLoading}
      isSubmitting={hero.isSubmitting}
      videoFile={hero.videoFile}
      videoPreview={hero.videoPreview}
      handleVideoChange={hero.handleVideoChange}
      clearVideo={hero.clearVideo}
      submitContent={hero.submitContent}
    />
  )
}

function SettingsTabWrapper({ allowed, showToast, onLogoFileSelect }: {
  allowed: boolean
  showToast: (message: string, type?: 'success' | 'error') => void
  onLogoFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  const settings = useSettingsTab({ activeTab: 'settings', allowed, showToast })
  return (
    <SettingsTab
      siteSettings={settings.siteSettings}
      setSiteSettings={settings.setSiteSettings}
      workingHoursSchedule={settings.workingHoursSchedule}
      setWorkingHoursSchedule={settings.setWorkingHoursSchedule}
      isSettingsLoading={settings.isSettingsLoading}
      saveSettings={settings.saveSettings}
      onLogoFileSelect={onLogoFileSelect}
    />
  )
}

export function TabContent({ activeTab, allowed, currentUser, showToast, editingUser, setEditingUser }: TabContentProps) {
  // Use memo to prevent unnecessary re-renders
  const content = useMemo(() => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTabWrapper allowed={allowed} />

      case 'users':
        return <UsersTabWrapper allowed={allowed} currentUser={currentUser} showToast={showToast} setEditingUser={setEditingUser} editingUser={editingUser} />

      case 'suspended-users':
        return <SuspendedUsersTabWrapper allowed={allowed} showToast={showToast} />

      case 'enrollments':
        return <EnrollmentsTabWrapper allowed={allowed} />

      case 'course-registrations':
        return <CourseRegistrationsTabWrapper allowed={allowed} />

      case 'contact-messages':
        return <ContactMessagesTabWrapper allowed={allowed} />

      case 'payments':
        return <PaymentsTabWrapper allowed={allowed} />

      case 'bank-cards':
        return <BankCardsTab />

      case 'courses':
        return <CoursesTabWrapper showToast={showToast} />

      case 'modules':
        return <ModulesTabWrapper showToast={showToast} />

      case 'comments':
        return <CommentsTabWrapper allowed={allowed} />

      case 'instructor':
        return <InstructorTabWrapper allowed={allowed} showToast={showToast} />

      case 'faq':
        return <FaqTabWrapper allowed={allowed} showToast={showToast} />

      case 'hero-content':
        return <HeroContentTabWrapper allowed={allowed} showToast={showToast} />

      case 'settings':
        return <SettingsTabWrapper allowed={allowed} showToast={showToast} onLogoFileSelect={() => {}} />

      default:
        return null
    }
  }, [activeTab, allowed, currentUser, showToast, editingUser, setEditingUser])

  return content
}
