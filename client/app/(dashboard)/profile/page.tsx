'use client'

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { User as UserIcon, Settings, LayoutDashboard, Wallet, MessageSquare, FileText, BookOpen, type LucideIcon } from 'lucide-react'
 
import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Header, Footer } from '@/components/layout'
import { ProfileSidebar, ProBanner, Toast } from '@/components/features/profile'
import { PaymentModal, PasswordModal, TransactionModal } from '@/components/features/profile'
import { ProfileTab, CoursesTab, PaymentsTab, SettingsTab, CommentsTab, PersonalDataTab } from '@/components/features/profile'
import { useProfileData } from '@/components/features/profile/hooks/useProfileData'
import type { ProfileUser } from '@/components/features/profile/hooks/useProfileData'
import { useProfileSettings } from '@/components/features/profile/hooks/useProfileSettings'
import { useReviews } from '@/components/features/profile/hooks/useReviews'
import api from '@/lib/api'

interface SidebarLink {
  id: string
  label: string
  icon: LucideIcon
  count?: number
  href?: string
}

interface StatsData {
  currentLessons?: string
  progress?: number
  points?: number
  certificates?: string
  [key: string]: unknown
}

interface CourseItem {
  id: string
  title: string
  desc: string
  status: string
  lessons?: number
  progress: number
  color?: string
  borderColor?: string
  [key: string]: unknown
}

interface Transaction {
  id: string
  title: string
  date: string
  status: 'completed' | 'pending'
  price: string
  type: 'deposit' | 'withdraw'
}

export default function ProfilePage() {
  const { user: authUser, isLoaded, isLoggedIn, logout, setUser: setAuthUser } = useAuth()
  const router = useRouter()

  const { user, setUser, isLoadingData, myReview, setMyReview, myCourses, myPayments, stats } = useProfileData({ authUser: authUser as ProfileUser | null, isLoaded, logout })

  useEffect(() => {
    // If we have a user (even optimistically), we stay on the page.
    if (isLoaded && !isLoggedIn && !isLoadingData && !user) {
      router.replace('/')
    }
  }, [isLoaded, isLoggedIn, isLoadingData, user, router])

  const [activeTab, setActiveTab] = useState('profile')
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordData, setPasswordData] = useState({
    passwordCurrent: '',
    password: '',
    passwordConfirm: ''
  })
  
  const [totalCoursesCount, setTotalCoursesCount] = useState(0)
  
  // Data States - now fetched from useProfileData hook
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const { isUpdating, handleUpdateProfile, handleAvatarUpload, handleUpdatePassword } = useProfileSettings({
    passwordData,
    setPasswordData,
    setShowPasswordModal,
    setIsUploadingAvatar,
    setAvatarPreview,
    setUser,
    setAuthUser,
    showToast
  })

  const { reviewForm, setReviewForm, isReviewSubmitting, handleEditReview, handleSubmitReviewUpdate, handleSubmitReviewCreate } = useReviews({
    myReview,
    setMyReview,
    showToast
  })

  useEffect(() => {
    const fetchTotalCourses = async () => {
      try {
        const res = await api.get('/api/v1/courses')
        const coursesData = Array.isArray(res.data?.data) ? res.data.data : (res.data?.data?.courses || res.data?.courses || [])
        setTotalCoursesCount(coursesData.length)
      } catch {
        setTotalCoursesCount(0)
      }
    }
    fetchTotalCourses()
  }, [])

  const handleViewAllCourses = () => {
    setActiveTab('courses')
  }

  // We are "ready" if we have a user (either from auth or from profile data fetch)
  const currentUser = user || (authUser as ProfileUser | null);
  const isReady = isLoaded && currentUser;

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    )
  }

  const allSidebarLinks: SidebarLink[] = [
    { id: 'profile', label: 'Պրոֆիլ', icon: UserIcon },
    { id: 'courses', label: 'Իմ դասընթացները', icon: BookOpen, count: myCourses?.length || 0 },
    { id: 'personal', label: 'Անձնական տվյալներ', icon: FileText },
    { id: 'comments', label: 'Մեկնաբանություններ', icon: MessageSquare },
    { id: 'payments', label: 'Վճարումներ', icon: Wallet },
    { id: 'settings', label: 'Կարգավորումներ', icon: Settings },
  ]

  // Build sidebar links based on role
  const sidebarLinks: SidebarLink[] = currentUser?.role === 'admin' 
    ? [
        { id: 'profile', label: 'Պրոֆիլ', icon: UserIcon },
        { id: 'dashboard', label: 'Վահանակ', icon: LayoutDashboard, href: '/dashboard' },
        { id: 'personal', label: 'Անձնական տվյալներ', icon: FileText },
        { id: 'settings', label: 'Կարգավորումներ', icon: Settings },
      ]
    : allSidebarLinks

  return (
    <>
      <div className="min-h-screen">
        <PaymentModal open={showPaymentModal} onClose={() => setShowPaymentModal(false)} />

        <Header />
        
        <main className="container max-w-[1400px] mx-auto px-4 md:px-8 pt-24 pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 mt-[120px] items-start">
            
            <ProfileSidebar
              user={currentUser}
              activeTab={activeTab}
              isUploadingAvatar={isUploadingAvatar}
              avatarPreview={avatarPreview}
              sidebarLinks={sidebarLinks}
              onTabChange={(t) => setActiveTab(t)}
              onAvatarUpload={handleAvatarUpload}
              onShowPaymentModal={() => setShowPaymentModal(true)}
              onLogout={logout}
            />

          <div className="space-y-6 min-h-[850px]">
            {currentUser?.role !== 'admin' && (
              <ProBanner user={currentUser} myCourses={myCourses} totalCoursesCount={totalCoursesCount} onShowPaymentModal={() => setShowPaymentModal(true)} />
            )}

            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <ProfileTab
                  user={currentUser}
                  stats={stats}
                  isLoadingData={isLoadingData}
                  myCourses={myCourses}
                  myPayments={myPayments}
                  onViewAllCourses={handleViewAllCourses}
                />
              )}

              {activeTab === 'personal' && (
                <PersonalDataTab 
                  user={currentUser} 
                  myCoursesCount={myCourses?.length || 0}
                  totalCoursesCount={totalCoursesCount}
                  isLoadingData={isLoadingData}
                />
              )}

              {activeTab === 'courses' && (
                <CoursesTab isLoadingData={isLoadingData} myCourses={myCourses} />
              )}

              {activeTab === 'comments' && (
                <CommentsTab
                  myReview={myReview}
                  reviewForm={reviewForm}
                  isReviewSubmitting={isReviewSubmitting}
                  onEditReview={handleEditReview}
                  onSubmitReviewUpdate={handleSubmitReviewUpdate}
                  onSubmitReviewCreate={handleSubmitReviewCreate}
                  onReviewRatingChange={(rating) => setReviewForm({ ...reviewForm, rating })}
                  onReviewCommentChange={(comment) => setReviewForm({ ...reviewForm, comment })}
                />
              )}

              {activeTab === 'payments' && (
                <PaymentsTab user={currentUser} />
              )}

              {activeTab === 'settings' && (
                <SettingsTab user={currentUser} isUpdating={isUpdating} onSubmit={handleUpdateProfile} onShowPasswordModal={() => setShowPasswordModal(true)} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <PasswordModal
        open={showPasswordModal}
        isUpdating={isUpdating}
        passwordData={passwordData}
        onClose={() => setShowPasswordModal(false)}
        onSubmit={handleUpdatePassword}
        onChange={(id, v) => setPasswordData({ ...passwordData, [id]: v })}
      />
      <TransactionModal transaction={selectedTransaction} onClose={() => setSelectedTransaction(null)} />
      <Toast toast={toast} onClose={() => setToast(null)} />
      <Footer />
      </div>
    </>
  )
}
