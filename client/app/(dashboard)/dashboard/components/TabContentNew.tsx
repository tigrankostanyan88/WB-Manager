'use client'

import { lazy, Suspense, memo, type Dispatch, type SetStateAction } from 'react'
import type { DashboardTabId, SiteSettings, WorkingHoursSchedule, WorkingHoursDay } from '@/components/features/admin/types'
import type { User } from '@/components/features/admin/types'
import { TabErrorBoundary } from '@/components/error/TabErrorBoundary'

// Eagerly import frequently used tabs (faster navigation)
import { OverviewTabWrapper } from './tabs'
import { UsersTabWrapper } from './tabs'
import { CoursesTabWrapper } from './tabs'
import { PaymentsTabWrapper } from './tabs'
import { SettingsTabWrapper } from './tabs'

// Lazy load less frequently used tabs
const SuspendedUsersTabWrapper = lazy(() => import('./tabs').then(m => ({ default: m.SuspendedUsersTabWrapper })))
const EnrollmentsTabWrapper = lazy(() => import('./tabs').then(m => ({ default: m.EnrollmentsTabWrapper })))
const CourseRegistrationsTabWrapper = lazy(() => import('./tabs').then(m => ({ default: m.CourseRegistrationsTabWrapper })))
const ContactMessagesTabWrapper = lazy(() => import('./tabs').then(m => ({ default: m.ContactMessagesTabWrapper })))
const ModulesTabWrapper = lazy(() => import('./tabs').then(m => ({ default: m.ModulesTabWrapper })))
const CommentsTabWrapper = lazy(() => import('./tabs').then(m => ({ default: m.CommentsTabWrapper })))
const InstructorTabWrapper = lazy(() => import('./tabs').then(m => ({ default: m.InstructorTabWrapper })))
const FaqTabWrapper = lazy(() => import('./tabs').then(m => ({ default: m.FaqTabWrapper })))
const HeroContentTabWrapper = lazy(() => import('./tabs').then(m => ({ default: m.HeroContentTabWrapper })))
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
  setEditingUser: Dispatch<SetStateAction<(User & { __editScope?: 'users' }) | null>>
  onLogoFileSelect?: (e: React.ChangeEvent<HTMLInputElement>) => void
  siteSettings?: SiteSettings
  setSiteSettings?: Dispatch<SetStateAction<SiteSettings>>
  workingHoursSchedule?: WorkingHoursSchedule
  setWorkingHoursSchedule?: Dispatch<SetStateAction<WorkingHoursSchedule>>
  isSettingsLoading?: boolean
  saveSettings?: () => void
}

const OverviewContent = memo(({ allowed }: { allowed: boolean }) => (
  <TabErrorBoundary tabName="Overview">
    <OverviewTabWrapper allowed={allowed} />
  </TabErrorBoundary>
))

const UsersContent = memo(({ allowed, currentUser, showToast, editingUser, setEditingUser }: { allowed: boolean; currentUser: User | null; showToast: (msg: string, type?: 'success' | 'error') => void; editingUser: (User & { __editScope?: 'users' }) | null; setEditingUser: React.Dispatch<React.SetStateAction<(User & { __editScope?: 'users' }) | null>> }) => (
  <TabErrorBoundary tabName="Users">
    <UsersTabWrapper allowed={allowed} currentUser={currentUser} showToast={showToast} setEditingUser={setEditingUser} editingUser={editingUser} />
  </TabErrorBoundary>
))

const CoursesContent = memo(({ showToast }: { showToast: (msg: string, type?: 'success' | 'error') => void }) => (
  <TabErrorBoundary tabName="Courses">
    <CoursesTabWrapper showToast={showToast} />
  </TabErrorBoundary>
))

const PaymentsContent = memo(({ allowed }: { allowed: boolean }) => (
  <TabErrorBoundary tabName="Payments">
    <Suspense fallback={<TabLoadingFallback />}>
      <PaymentsTabWrapper allowed={allowed} />
    </Suspense>
  </TabErrorBoundary>
))

// Default values for SiteSettings
const defaultSiteSettings: SiteSettings = {
  siteName: '',
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  address: '',
  facebook: '',
  instagram: '',
  telegram: '',
  whatsapp: '',
  logo: '',
  logoFile: null
}

// Default values for WorkingHoursSchedule
const defaultWorkingHoursDay: WorkingHoursDay = { open: '09:00', close: '18:00', closed: false }
const defaultWorkingHoursSchedule: WorkingHoursSchedule = {
  mon: defaultWorkingHoursDay,
  tue: defaultWorkingHoursDay,
  wed: defaultWorkingHoursDay,
  thu: defaultWorkingHoursDay,
  fri: defaultWorkingHoursDay,
  sat: { open: '09:00', close: '18:00', closed: true },
  sun: { open: '09:00', close: '18:00', closed: true }
}

// No-op setters for defaults
const noopSetSiteSettings: Dispatch<SetStateAction<SiteSettings>> = () => {}
const noopSetWorkingHoursSchedule: Dispatch<SetStateAction<WorkingHoursSchedule>> = () => {}

const SettingsContent = memo(({ allowed, showToast, onLogoFileSelect, siteSettings, setSiteSettings, workingHoursSchedule, setWorkingHoursSchedule, isSettingsLoading, saveSettings }: TabContentProps) => (
  <TabErrorBoundary tabName="Settings">
    <SettingsTabWrapper 
      allowed={allowed} 
      showToast={showToast} 
      onLogoFileSelect={onLogoFileSelect || (() => {})}
      siteSettings={siteSettings || defaultSiteSettings}
      setSiteSettings={setSiteSettings || noopSetSiteSettings}
      workingHoursSchedule={workingHoursSchedule || defaultWorkingHoursSchedule}
      setWorkingHoursSchedule={setWorkingHoursSchedule || noopSetWorkingHoursSchedule}
      isSettingsLoading={isSettingsLoading || false}
      saveSettings={saveSettings || (() => {})}
    />
  </TabErrorBoundary>
))

const LazyContent = memo(({ tabName, children }: { tabName: string; children: React.ReactNode }) => (
  <TabErrorBoundary tabName={tabName}>
    <Suspense fallback={<TabLoadingFallback />}>
      {children}
    </Suspense>
  </TabErrorBoundary>
))

export function TabContent(props: TabContentProps) {
  const { activeTab, allowed, currentUser, showToast, editingUser, setEditingUser, onLogoFileSelect, siteSettings, setSiteSettings, workingHoursSchedule, setWorkingHoursSchedule, isSettingsLoading, saveSettings } = props

  switch (activeTab) {
    case 'overview':
      return <OverviewContent allowed={allowed} />

    case 'users':
      return <UsersContent allowed={allowed} currentUser={currentUser} showToast={showToast} editingUser={editingUser} setEditingUser={setEditingUser} />

    case 'courses':
      return <CoursesContent showToast={showToast} />

    case 'payments':
      return <PaymentsContent allowed={allowed} />

    case 'settings':
      return <SettingsContent {...props} />

    case 'suspended-users':
      return <LazyContent tabName="Suspended Users"><SuspendedUsersTabWrapper allowed={allowed} showToast={showToast} /></LazyContent>

    case 'enrollments':
      return <LazyContent tabName="Enrollments"><EnrollmentsTabWrapper allowed={allowed} /></LazyContent>

    case 'course-registrations':
      return <LazyContent tabName="Course Registrations"><CourseRegistrationsTabWrapper allowed={allowed} /></LazyContent>

    case 'contact-messages':
      return <LazyContent tabName="Contact Messages"><ContactMessagesTabWrapper allowed={allowed} /></LazyContent>

    case 'bank-cards':
      return <LazyContent tabName="Bank Cards"><BankCardsTabWrapper /></LazyContent>

    case 'modules':
      return <LazyContent tabName="Modules"><ModulesTabWrapper showToast={showToast} /></LazyContent>

    case 'comments':
      return <LazyContent tabName="Comments"><CommentsTabWrapper allowed={allowed} /></LazyContent>

    case 'instructor':
      return <LazyContent tabName="Instructor"><InstructorTabWrapper allowed={allowed} showToast={showToast} /></LazyContent>

    case 'faq':
      return <LazyContent tabName="FAQ"><FaqTabWrapper allowed={allowed} showToast={showToast} /></LazyContent>

    case 'hero-content':
      return <LazyContent tabName="Hero Content"><HeroContentTabWrapper allowed={allowed} showToast={showToast} /></LazyContent>

    default:
      return null
  }
}
