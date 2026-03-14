'use client'

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { User as UserIcon, Settings, LayoutDashboard, Wallet, MessageSquare, FileText, type LucideIcon } from 'lucide-react'
 
import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProfileSidebar from './_components/ProfileSidebar'
import ProBanner from './_components/ProBanner'
import Toast from './_components/Toast'
import PaymentModal from './_components/modals/PaymentModal'
import PasswordModal from './_components/modals/PasswordModal'
import TransactionModal from './_components/modals/TransactionModal'
import ProfileTab from './_components/tabs/ProfileTab'
import CoursesTab from './_components/tabs/CoursesTab'
import PaymentsTab from './_components/tabs/PaymentsTab'
import SettingsTab from './_components/tabs/SettingsTab'
import CommentsTab from './_components/tabs/CommentsTab'
import PersonalDataTab from './_components/tabs/PersonalDataTab'
import { useProfileData } from './_hooks/useProfileData'
import type { ProfileUser } from './_hooks/useProfileData'
import { useProfileSettings } from './_hooks/useProfileSettings'
import { useReviews } from './_hooks/useReviews'
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

  const { user, setUser, isLoadingData, myReview, setMyReview, myCourses, myPayments, stats } = useProfileData({ authUser: authUser as unknown as ProfileUser | null, isLoaded, logout })

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

  // Fetch total courses count for points calculation
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
  const currentUser = user || (authUser as unknown as ProfileUser | null);
  const isReady = isLoaded && currentUser;

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    )
  }

  const sidebarLinks: SidebarLink[] = [
    { id: 'profile', label: 'Պրոֆիլ', icon: UserIcon },
    { id: 'personal', label: 'Անձնական տվյալներ', icon: FileText },
    { id: 'comments', label: 'Մեկնաբանություններ', icon: MessageSquare },
    { id: 'payments', label: 'Վճարումներ', icon: Wallet },
    { id: 'settings', label: 'Կարգավորումներ', icon: Settings },
  ]

  if (currentUser?.role === 'admin') {
    sidebarLinks.splice(1, 0, { id: 'dashboard', label: 'Վահանակ', icon: LayoutDashboard, href: '/dashboard' })
  }

  return (
    <div className="min-h-screen bg-slate-50/50 ">
      <PaymentModal open={showPaymentModal} onClose={() => setShowPaymentModal(false)} />

      <Header />
      
      <main className="container max-w-[1400px] px-4 md:px-8 pt-24 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 mt-[80px]">
          
          <ProfileSidebar
            user={currentUser as any}
            activeTab={activeTab}
            isUploadingAvatar={isUploadingAvatar}
            avatarPreview={avatarPreview}
            sidebarLinks={sidebarLinks}
            onTabChange={(t) => setActiveTab(t)}
            onAvatarUpload={handleAvatarUpload}
            onShowPaymentModal={() => setShowPaymentModal(true)}
            onLogout={logout}
          />

          <div className="space-y-6">
            <ProBanner user={currentUser as any} myPayments={myPayments} totalCoursesCount={totalCoursesCount} onShowPaymentModal={() => setShowPaymentModal(true)} />

            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <ProfileTab
                  user={currentUser as any}
                  stats={stats}
                  isLoadingData={isLoadingData}
                  myCourses={myCourses}
                  onViewAllCourses={handleViewAllCourses}
                />
              )}

              {activeTab === 'personal' && (
                <PersonalDataTab 
                  user={currentUser as any} 
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
                <PaymentsTab user={currentUser as any} />
              )}

              {activeTab === 'settings' && (
                <SettingsTab user={currentUser as any} isUpdating={isUpdating} onSubmit={handleUpdateProfile} onShowPasswordModal={() => setShowPasswordModal(true)} />
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
  )
}
