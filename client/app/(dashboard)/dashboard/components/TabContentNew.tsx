'use client'

import { lazy, Suspense, useMemo } from 'react'
import type { DashboardTabId } from '@/components/features/admin/types'
import type { User } from '@/components/features/admin/types'
import { TabErrorBoundary } from '@/components/error/TabErrorBoundary'
import { Skeleton } from '@/components/ui/skeleton'

// Lazy load all tab wrappers for code splitting
const OverviewTabWrapper = lazy(() => import('./tabs').then(m => ({ default: m.OverviewTabWrapper })))
const UsersTabWrapper = lazy(() => import('./tabs').then(m => ({ default: m.UsersTabWrapper })))
const SuspendedUsersTabWrapper = lazy(() => import('./tabs').then(m => ({ default: m.SuspendedUsersTabWrapper })))
const EnrollmentsTabWrapper = lazy(() => import('./tabs').then(m => ({ default: m.EnrollmentsTabWrapper })))
const CourseRegistrationsTabWrapper = lazy(() => import('./tabs').then(m => ({ default: m.CourseRegistrationsTabWrapper })))
const ContactMessagesTabWrapper = lazy(() => import('./tabs').then(m => ({ default: m.ContactMessagesTabWrapper })))
const PaymentsTabWrapper = lazy(() => import('./tabs').then(m => ({ default: m.PaymentsTabWrapper })))
const CoursesTabWrapper = lazy(() => import('./tabs').then(m => ({ default: m.CoursesTabWrapper })))
const ModulesTabWrapper = lazy(() => import('./tabs').then(m => ({ default: m.ModulesTabWrapper })))
const CommentsTabWrapper = lazy(() => import('./tabs').then(m => ({ default: m.CommentsTabWrapper })))
const InstructorTabWrapper = lazy(() => import('./tabs').then(m => ({ default: m.InstructorTabWrapper })))
const FaqTabWrapper = lazy(() => import('./tabs').then(m => ({ default: m.FaqTabWrapper })))
const HeroContentTabWrapper = lazy(() => import('./tabs').then(m => ({ default: m.HeroContentTabWrapper })))
const SettingsTabWrapper = lazy(() => import('./tabs').then(m => ({ default: m.SettingsTabWrapper })))
const BankCardsTabWrapper = lazy(() => import('./tabs').then(m => ({ default: m.BankCardsTabWrapper })))

// Smooth loading fallback - subtle spinner instead of skeleton blocks
function TabLoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px] bg-white/50 backdrop-blur-sm rounded-xl">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-violet-600" />
        <span className="text-sm text-slate-500 font-medium">Բեռնվում է...</span>
      </div>
    </div>
  )
}

interface TabContentProps {
  activeTab: DashboardTabId
  allowed: boolean
  currentUser: User | null
  showToast: (message: string, type?: 'success' | 'error') => void
  editingUser: (User & { __editScope?: 'users' }) | null
  setEditingUser: React.Dispatch<React.SetStateAction<(User & { __editScope?: 'users' }) | null>>
  onLogoFileSelect?: (e: React.ChangeEvent<HTMLInputElement>) => void
  siteSettings?: any
  setSiteSettings?: any
  workingHoursSchedule?: any
  setWorkingHoursSchedule?: any
  isSettingsLoading?: boolean
  saveSettings?: () => void
}

export function TabContent({ activeTab, allowed, currentUser, showToast, editingUser, setEditingUser, onLogoFileSelect, siteSettings, setSiteSettings, workingHoursSchedule, setWorkingHoursSchedule, isSettingsLoading, saveSettings }: TabContentProps) {
  const content = useMemo(() => {
    switch (activeTab) {
      case 'overview':
        return (
          <TabErrorBoundary tabName="Overview">
            <Suspense fallback={<TabLoadingFallback />}>
              <OverviewTabWrapper allowed={allowed} />
            </Suspense>
          </TabErrorBoundary>
        )

      case 'users':
        return (
          <TabErrorBoundary tabName="Users">
            <Suspense fallback={<TabLoadingFallback />}>
              <UsersTabWrapper allowed={allowed} currentUser={currentUser} showToast={showToast} setEditingUser={setEditingUser} editingUser={editingUser} />
            </Suspense>
          </TabErrorBoundary>
        )

      case 'suspended-users':
        return (
          <TabErrorBoundary tabName="Suspended Users">
            <Suspense fallback={<TabLoadingFallback />}>
              <SuspendedUsersTabWrapper allowed={allowed} showToast={showToast} />
            </Suspense>
          </TabErrorBoundary>
        )

      case 'enrollments':
        return (
          <TabErrorBoundary tabName="Enrollments">
            <Suspense fallback={<TabLoadingFallback />}>
              <EnrollmentsTabWrapper allowed={allowed} />
            </Suspense>
          </TabErrorBoundary>
        )

      case 'course-registrations':
        return (
          <TabErrorBoundary tabName="Course Registrations">
            <Suspense fallback={<TabLoadingFallback />}>
              <CourseRegistrationsTabWrapper allowed={allowed} />
            </Suspense>
          </TabErrorBoundary>
        )

      case 'contact-messages':
        return (
          <TabErrorBoundary tabName="Contact Messages">
            <Suspense fallback={<TabLoadingFallback />}>
              <ContactMessagesTabWrapper allowed={allowed} />
            </Suspense>
          </TabErrorBoundary>
        )

      case 'payments':
        return (
          <TabErrorBoundary tabName="Payments">
            <Suspense fallback={<TabLoadingFallback />}>
              <PaymentsTabWrapper allowed={allowed} />
            </Suspense>
          </TabErrorBoundary>
        )

      case 'bank-cards':
        return (
          <TabErrorBoundary tabName="Bank Cards">
            <Suspense fallback={<TabLoadingFallback />}>
              <BankCardsTabWrapper />
            </Suspense>
          </TabErrorBoundary>
        )

      case 'courses':
        return (
          <TabErrorBoundary tabName="Courses">
            <Suspense fallback={<TabLoadingFallback />}>
              <CoursesTabWrapper showToast={showToast} />
            </Suspense>
          </TabErrorBoundary>
        )

      case 'modules':
        return (
          <TabErrorBoundary tabName="Modules">
            <Suspense fallback={<TabLoadingFallback />}>
              <ModulesTabWrapper showToast={showToast} />
            </Suspense>
          </TabErrorBoundary>
        )

      case 'comments':
        return (
          <TabErrorBoundary tabName="Comments">
            <Suspense fallback={<TabLoadingFallback />}>
              <CommentsTabWrapper allowed={allowed} />
            </Suspense>
          </TabErrorBoundary>
        )

      case 'instructor':
        return (
          <TabErrorBoundary tabName="Instructor">
            <Suspense fallback={<TabLoadingFallback />}>
              <InstructorTabWrapper allowed={allowed} showToast={showToast} />
            </Suspense>
          </TabErrorBoundary>
        )

      case 'faq':
        return (
          <TabErrorBoundary tabName="FAQ">
            <Suspense fallback={<TabLoadingFallback />}>
              <FaqTabWrapper allowed={allowed} showToast={showToast} />
            </Suspense>
          </TabErrorBoundary>
        )

      case 'hero-content':
        return (
          <TabErrorBoundary tabName="Hero Content">
            <Suspense fallback={<TabLoadingFallback />}>
              <HeroContentTabWrapper allowed={allowed} showToast={showToast} />
            </Suspense>
          </TabErrorBoundary>
        )

      case 'settings':
        return (
          <TabErrorBoundary tabName="Settings">
            <Suspense fallback={<TabLoadingFallback />}>
              <SettingsTabWrapper 
                allowed={allowed} 
                showToast={showToast} 
                onLogoFileSelect={onLogoFileSelect || (() => {})}
                siteSettings={siteSettings || {}}
                setSiteSettings={setSiteSettings || (() => {})}
                workingHoursSchedule={workingHoursSchedule || {}}
                setWorkingHoursSchedule={setWorkingHoursSchedule || (() => {})}
                isSettingsLoading={isSettingsLoading || false}
                saveSettings={saveSettings || (() => {})}
              />
            </Suspense>
          </TabErrorBoundary>
        )

      default:
        return null
    }
  }, [activeTab, allowed, currentUser, showToast, editingUser, setEditingUser, onLogoFileSelect, siteSettings, setSiteSettings, workingHoursSchedule, setWorkingHoursSchedule, isSettingsLoading, saveSettings])

  return content
}
