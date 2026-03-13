'use client'

import { useMemo, useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { AnimatePresence } from 'framer-motion'
import { BookOpen, CreditCard, HelpCircle, Layers, LayoutDashboard, MessageSquare, Settings, Shield, UserCheck, Users } from 'lucide-react'
import DashboardSidebar from '@/app/dashboard/_components/DashboardSidebar'
import CropModal from '@/app/dashboard/_components/CropModal'
import DashboardToast from '@/app/dashboard/_components/DashboardToast'
import EditUserModal from '@/app/dashboard/_components/EditUserModal'
import CommentsTab from '@/app/dashboard/_components/tabs/CommentsTab'
import CoursesTab from '@/app/dashboard/_components/tabs/CoursesTab'
import FaqTab from '@/app/dashboard/_components/tabs/FaqTab'
import InstructorTab from '@/app/dashboard/_components/tabs/InstructorTab'
import ModulesTab from '@/app/dashboard/_components/tabs/ModulesTab'
import StudentCoursesTab from '@/app/dashboard/_components/tabs/StudentCoursesTab'
import OverviewTab from '@/app/dashboard/_components/tabs/OverviewTab'
import SettingsTab from '@/app/dashboard/_components/tabs/SettingsTab'
import BankCardsTab from '@/app/dashboard/_components/tabs/BankCardsTab'
import UsersTab from '@/app/dashboard/_components/tabs/UsersTab'
import { useAuth } from '@/app/dashboard/_hooks/useAuth'
import { useCrop } from '@/app/dashboard/_hooks/useCrop'
import { useCourses } from '@/app/dashboard/_hooks/useCourses'
import { useFaq } from '@/app/dashboard/_hooks/useFaq'
import { useInstructor } from '@/app/dashboard/_hooks/useInstructor'
import { useModules } from '@/app/dashboard/_hooks/useModules'
import { useOverview } from '@/app/dashboard/_hooks/useOverview'
import { useReviews } from '@/app/dashboard/_hooks/useReviews'
import { useSettings } from '@/app/dashboard/_hooks/useSettings'
import { useUsers } from '@/app/dashboard/_hooks/useUsers'
import type { DashboardMenuItem } from '@/app/dashboard/_components/DashboardSidebar'
import type { DashboardTabId, ToastState, User } from '@/app/dashboard/_types'

type EditingUser = User | null

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<DashboardTabId>('overview')
  const [toast, setToast] = useState<ToastState | null>(null)
  const [editingUser, setEditingUser] = useState<EditingUser>(null)

  const showToast = (message: string, type: ToastState['type'] = 'success') => {
    setToast({ message, type })
    window.setTimeout(() => setToast(null), 3000)
  }

  const { isAuthLoading, allowed } = useAuth()

  const { recentStudents, isRecentLoading, statCounts, relativeTime: overviewRelativeTime } = useOverview({ activeTab, allowed })
  const {
    users,
    isUsersLoading,
    userSearch,
    setUserSearch,
    handleDeleteUser,
    handleTogglePaid: handleToggleUserPaid,
    startEditUserModal,
    submitEditUser
  } = useUsers({ activeTab, allowed, editingUser, setEditingUser, showToast })
  const { reviews, isReviewsLoading, relativeTime: reviewsRelativeTime, isToday, handleDeleteReview } = useReviews({ activeTab, allowed })
  const { faqs, faqForm, setFaqForm, isFaqLoading, isFaqSubmitting, editingId, editForm, setEditForm, isFaqUpdating, submitFaq, startEdit, cancelEdit, updateFaq, deleteFaq } =
    useFaq({ activeTab, allowed })
  const { instructorForm, instructorErrors, isInstructorLoading, onAvatarFile, onNameChange, onProfessionChange, onDescriptionChange, onStatValueChange, saveInstructor, cropImage: instructorCropImage, crop: instructorCrop, zoom: instructorZoom, setCrop: setInstructorCrop, setZoom: setInstructorZoom, onCropComplete: onInstructorCropComplete, onCropConfirm, onCropClose } =
    useInstructor({ activeTab, allowed, showToast })
  const { siteSettings, setSiteSettings, workingHoursSchedule, setWorkingHoursSchedule, isSettingsLoading, saveSettings } = useSettings({
    activeTab,
    allowed,
    showToast
  })
  const { cropImage, cropModalOpen, crop, zoom, setCrop, setZoom, onCropComplete, onLogoFileSelect, createCroppedImage, closeCrop } = useCrop({
    setSiteSettings
  })
  const { showCourseForm, courseForm, setCourseForm, startNewCourse, editCourse, cancelNewCourse, addLearningPoint, changeLearningPoint, removeLearningPoint, submitCourse, deleteCourse, courses, isLoading: isCoursesLoading, cropImage: courseCropImage, crop: courseCrop, zoom: courseZoom, setCrop: setCourseCrop, setZoom: setCourseZoom, onImageFileSelect, onCropComplete: onCourseCropComplete, onCropConfirm: onCourseCropConfirm, onCropClose: onCourseCropClose } = useCourses({
    activeTab,
    showToast
  })
  const { showModuleForm, moduleForm, setModuleForm, allModules, courses: moduleCourses, isLoading: isModulesLoading, editingId: editingModuleId, startNewModule, editModule, cancelNewModule, submitModule, deleteModule, videoFile, isUploadingVideo, currentModuleVideos, deleteModuleVideo, handleVideoFileChange, uploadModuleVideo, getVideoUrl, reorderVideos } = useModules({
    activeTab,
    showToast
  })
  const menuItems = useMemo<DashboardMenuItem[]>(
    () => [
      { id: 'overview', label: 'Վահանակ', icon: LayoutDashboard },
      { id: 'bank-cards', label: 'Բանկային քարտեր', icon: CreditCard },
      { id: 'users', label: 'Օգտվողներ', icon: Users },
      { id: 'courses', label: 'Դասընթացներ', icon: BookOpen },
      { id: 'modules', label: 'Մոդուլներ', icon: Layers },
      { id: 'student-courses', label: 'Գրանցումներ', icon: UserCheck },
      { id: 'comments', label: 'Մեկնաբանություններ', icon: MessageSquare },
      { id: 'instructor', label: 'Մենթոր', icon: Shield },
      { id: 'faq', label: 'ՀՏՀ', icon: HelpCircle },
      { id: 'settings', label: 'Կարգավորումներ', icon: Settings }
    ],
    []
  )

  const stats = useMemo(
    () => [
      { label: 'Ուսանողներ', value: `${statCounts.students}`, icon: UserCheck, trend: '+0%', color: 'text-violet-600', bg: 'bg-violet-50' },
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
      <div className="min-h-screen bg-slate-50/50">
        <Header />
        <main className="container max-w-[1400px] px-4 md:px-8 pt-48 pb-32 flex justify-center">
          <div className="w-full max-w-xl bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 text-center mt-10">
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
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 mt-[80px] items-start">
          <DashboardSidebar menuItems={menuItems} activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="space-y-6 lg:min-h-[calc(100dvh-12rem)]">
            {activeTab === 'overview' && (
              <OverviewTab stats={stats} recentStudents={recentStudents} isRecentLoading={isRecentLoading} relativeTime={overviewRelativeTime} />
            )}

            {activeTab === 'bank-cards' && (
              <BankCardsTab />
            )}

            {activeTab === 'users' && (
              <UsersTab
                users={users}
                isUsersLoading={isUsersLoading}
                userSearch={userSearch}
                setUserSearch={setUserSearch}
                onTogglePaid={handleToggleUserPaid}
                onEdit={startEditUserModal}
                onDelete={handleDeleteUser}
              />
            )}

            {activeTab === 'courses' && (
              <CoursesTab
              showCourseForm={showCourseForm}
              courseForm={courseForm}
              setCourseForm={setCourseForm}
              startNewCourse={startNewCourse}
              onEditCourse={editCourse}
              onDeleteCourse={deleteCourse}
              cancelNewCourse={cancelNewCourse}
              addLearningPoint={addLearningPoint}
              changeLearningPoint={changeLearningPoint}
              removeLearningPoint={removeLearningPoint}
              submitCourse={submitCourse}
              courses={courses}
              isLoading={isCoursesLoading}
              onImageFileSelect={onImageFileSelect}
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
                handleVideoFileChange={handleVideoFileChange}
                uploadModuleVideo={uploadModuleVideo}
                getVideoUrl={getVideoUrl}
                reorderVideos={reorderVideos}
              />
            )}

            {activeTab === 'student-courses' && (
              <StudentCoursesTab showToast={showToast} />
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
                onAvatarFile={onAvatarFile}
                onNameChange={onNameChange}
                onProfessionChange={onProfessionChange}
                onDescriptionChange={onDescriptionChange}
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

            {activeTab === 'settings' && (
              <SettingsTab
                siteSettings={siteSettings}
                setSiteSettings={setSiteSettings}
                workingHoursSchedule={setWorkingHoursSchedule}
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
        courses={courses}
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
        open={!!instructorCropImage}
        cropImage={instructorCropImage || ''}
        crop={instructorCrop}
        zoom={instructorZoom}
        setCrop={setInstructorCrop}
        setZoom={setInstructorZoom}
        onCropComplete={onInstructorCropComplete}
        onClose={onCropClose}
        onConfirm={onCropConfirm}
      />

      <CropModal
        open={!!courseCropImage}
        cropImage={courseCropImage || ''}
        crop={courseCrop}
        zoom={courseZoom}
        setCrop={setCourseCrop}
        setZoom={setCourseZoom}
        onCropComplete={onCourseCropComplete}
        onClose={onCourseCropClose}
        onConfirm={onCourseCropConfirm}
      />

      <DashboardToast toast={toast} onClose={() => setToast(null)} />

      <Footer />
    </div>
  )
}
