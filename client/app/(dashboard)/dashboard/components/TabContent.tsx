'use client'

import OverviewTab from '@/components/features/admin/tabs/OverviewTab'
import UsersTab from '@/components/features/admin/tabs/UsersTab'
import SuspendedUsersTab from '@/components/features/admin/tabs/SuspendedUsersTab'
import EnrollmentsTab from '@/components/features/admin/tabs/EnrollmentsTab'
import CourseRegistrationsTab from '@/components/features/admin/tabs/CourseRegistrationsTab'
import ContactMessagesTab from '@/components/features/admin/tabs/ContactMessagesTab'
import { PaymentsTab } from '@/components/features/admin/tabs/payments'
import { BankCardsTab } from '@/components/features/admin/tabs/bankcards'
import CoursesTab from '@/components/features/admin/tabs/CoursesTab'
import { ModulesTab } from '@/components/features/admin/tabs/modules'
import CommentsTab from '@/components/features/admin/tabs/CommentsTab'
import { InstructorTab } from '@/components/features/admin/tabs/instructor'
import FaqTab from '@/components/features/admin/tabs/FaqTab'
import HeroContentTab from '@/components/features/admin/tabs/HeroContentTab'
import SettingsTab from '@/components/features/admin/tabs/SettingsTab'
import type { DashboardTabId } from '@/components/features/admin/types'
import type { ReturnTypeUseDashboard } from '../hooks/useDashboard'

interface TabContentProps {
  activeTab: DashboardTabId
  data: ReturnTypeUseDashboard
}

export function TabContent({ activeTab, data }: TabContentProps) {
  switch (activeTab) {
    case 'overview':
      return (
        <OverviewTab
          stats={data.stats}
          recentStudents={data.recentStudents}
          isRecentLoading={data.isRecentLoading}
          relativeTime={data.overviewRelativeTime}
        />
      )

    case 'users':
      return (
        <UsersTab
          users={data.filteredUsers}
          isUsersLoading={data.isUsersLoading}
          userSearch={data.userSearch}
          setUserSearch={data.setUserSearch}
          getUserPaymentStatus={data.getUserPaymentStatus}
          onEdit={data.startEditUserModal}
          onDelete={data.handleDeleteUser}
        />
      )

    case 'suspended-users':
      return (
        <SuspendedUsersTab
          users={data.suspendedUsers}
          isLoading={data.isSuspendedLoading}
          search={data.suspendedSearch}
          setSearch={data.setSuspendedSearch}
          onRestore={data.handleRestoreUser}
          onPermanentDelete={data.handlePermanentDelete}
          onBulkDelete={data.handleBulkDelete}
        />
      )

    case 'enrollments':
      return (
        <EnrollmentsTab
          enrollments={data.enrollments}
          courses={data.enrollmentCourses}
          enrollmentsByCourse={data.enrollmentsByCourse}
          isLoading={data.isEnrollmentsLoading}
          selectedCourse={data.selectedCourse}
          setSelectedCourse={data.setSelectedCourse}
          searchTerm={data.enrollmentSearchTerm}
          setSearchTerm={data.setEnrollmentSearchTerm}
          revokeAccess={data.revokeAccess}
        />
      )

    case 'course-registrations':
      return (
        <CourseRegistrationsTab
          registrations={data.courseRegistrations}
          isLoading={data.isCourseRegistrationsLoading}
          isDeleting={data.isDeletingCourseRegistration}
          onDelete={data.deleteCourseRegistration}
        />
      )

    case 'contact-messages':
      return (
        <ContactMessagesTab
          messages={data.contactMessages}
          isLoading={data.isContactMessagesLoading}
          isDeleting={data.isDeletingContactMessage}
          isMarkingRead={data.isMarkingContactMessageRead}
          onDelete={data.deleteContactMessage}
          onMarkAsRead={data.markContactMessageAsRead}
        />
      )

    case 'payments':
      return (
        <PaymentsTab
          payments={data.payments}
          users={data.paymentUsers}
          courses={data.paymentCourses}
          isLoading={data.isPaymentsLoading}
          isSubmitting={data.isPaymentsSubmitting}
          onCreatePayment={data.createPayment}
          onUpdateStatus={data.updatePaymentStatus}
        />
      )

    case 'bank-cards':
      return <BankCardsTab />

    case 'courses':
      return (
        <CoursesTab
          showCourseForm={data.showCourseForm}
          courseForm={data.courseForm}
          setCourseForm={data.setCourseForm}
          startNewCourse={data.startNewCourse}
          editCourse={data.editCourse}
          deleteCourse={data.deleteCourse}
          cancelNewCourse={data.cancelNewCourse}
          addLearningPoint={data.addLearningPoint}
          changeLearningPoint={data.changeLearningPoint}
          removeLearningPoint={data.removeLearningPoint}
          submitCourse={data.submitCourse}
          courses={data.courses}
          isLoading={data.isCoursesLoading}
          getCourseFirstVideoUrl={data.getCourseFirstVideoUrl}
          editingCourse={data.editingCourse}
        />
      )

    case 'modules':
      return (
        <ModulesTab
          showModuleForm={data.showModuleForm}
          moduleForm={data.moduleForm}
          setModuleForm={data.setModuleForm}
          allModules={data.allModules}
          courses={data.moduleCourses}
          isLoading={data.isModulesLoading}
          editingId={data.editingModuleId}
          startNewModule={data.startNewModule}
          editModule={data.editModule}
          cancelNewModule={data.cancelNewModule}
          submitModule={data.submitModule}
          deleteModule={data.deleteModule}
          videoFile={data.videoFile}
          isUploadingVideo={data.isUploadingVideo}
          currentModuleVideos={data.currentModuleVideos}
          deleteModuleVideo={data.deleteModuleVideo}
          updateModuleVideo={data.updateModuleVideo}
          handleVideoFileChange={data.handleVideoFileChange}
          uploadModuleVideo={data.uploadModuleVideo}
          getVideoUrl={data.getVideoUrl}
        />
      )

    case 'comments':
      return (
        <CommentsTab
          reviews={data.reviews}
          isReviewsLoading={data.isReviewsLoading}
          relativeTime={data.reviewsRelativeTime}
          isToday={data.isToday}
          onDeleteReview={data.handleDeleteReview}
        />
      )

    case 'instructor':
      return (
        <InstructorTab
          instructorForm={data.instructorForm}
          instructorErrors={data.instructorErrors}
          isInstructorLoading={data.isInstructorLoading}
          onAvatarFileSelect={data.onAvatarFile}
          onTitleChange={data.onTitleChange}
          onNameChange={data.onNameChange}
          onProfessionChange={data.onProfessionChange}
          onDescriptionChange={data.onDescriptionChange}
          onBadgeTextChange={data.onBadgeTextChange}
          onStatValueChange={data.onStatValueChange}
          onSubmit={data.saveInstructor}
        />
      )

    case 'faq':
      return (
        <FaqTab
          faqs={data.faqs}
          faqForm={data.faqForm}
          setFaqForm={data.setFaqForm}
          isFaqLoading={data.isFaqLoading}
          isFaqSubmitting={data.isFaqSubmitting}
          editingId={data.editingId}
          editForm={data.editForm}
          setEditForm={data.setEditForm}
          isFaqUpdating={data.isFaqUpdating}
          submitFaq={data.submitFaq}
          startEdit={data.startEdit}
          cancelEdit={data.cancelEdit}
          updateFaq={data.updateFaq}
          deleteFaq={data.deleteFaq}
        />
      )

    case 'hero-content':
      return (
        <HeroContentTab
          form={data.heroForm}
          setForm={data.setHeroForm}
          isLoading={data.isHeroLoading}
          isSubmitting={data.isHeroSubmitting}
          videoFile={data.heroVideoFile}
          videoPreview={data.heroVideoPreview}
          handleVideoChange={data.handleHeroVideoChange}
          clearVideo={data.clearHeroVideo}
          submitContent={data.submitHeroContent}
          deleteContent={data.deleteHeroContent}
        />
      )

    case 'settings':
      return (
        <SettingsTab
          siteSettings={data.siteSettings}
          setSiteSettings={data.setSiteSettings}
          workingHoursSchedule={data.workingHoursSchedule}
          setWorkingHoursSchedule={data.setWorkingHoursSchedule}
          isSettingsLoading={data.isSettingsLoading}
          saveSettings={data.saveSettings}
          onLogoFileSelect={data.onAvatarFile}
        />
      )

    default:
      return null
  }
}
