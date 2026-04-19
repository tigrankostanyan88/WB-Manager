'use client'

import { useState, useCallback } from 'react'
import { Footer } from '@/components/layout'
import { DashboardSidebar } from '@/components/features/admin'
import { CropModal } from '@/components/features/admin'
import { NotificationContainer } from '@/components/features/admin'
import { useDashboardSimple as useDashboard } from '../hooks/useDashboardSimple'
import { useSuspendedUsers } from '@/app/(dashboard)/dashboard/hooks/useSuspendedUsers'
import { useInstructorTab } from '@/app/(dashboard)/dashboard/hooks/useInstructorTab'
import useSettings from '@/hooks/admin/useSettings'
import useCrop from '@/hooks/admin/useCrop'
import { useContactMessages } from '@/hooks/admin/useContactMessages'
import { useCourseRegistrations } from '@/hooks/admin/useCourseRegistrations'
import { LoadingState } from './LoadingState'
import { UnauthorizedState } from './UnauthorizedState'
import { TabContent } from './TabContentNew'
import type { DashboardTabId } from '@/components/features/admin/types'

export function DashboardController() {
  const {
    activeTab,
    setActiveTab,
    menuItems,
    isAuthLoading,
    allowed,
    currentUser,
    editingUser,
    setEditingUser,
    showToast,
    notifications,
    removeNotification
  } = useDashboard()

  // Track visited tabs to reset badges
  const [visitedTabs, setVisitedTabs] = useState<Set<DashboardTabId>>(new Set())

  // Settings for logo crop
  const { siteSettings, setSiteSettings, workingHoursSchedule, setWorkingHoursSchedule, isSettingsLoading, saveSettings } = useSettings({ activeTab, allowed, showToast })

  // Get data for sidebar badges and modals
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const suspended = useSuspendedUsers(showToast)
  const instructor = useInstructorTab({ activeTab, allowed, showToast })
  const crop = useCrop({ setSiteSettings })
  const contactMessages = useContactMessages({ activeTab, allowed })
  const registrations = useCourseRegistrations({ activeTab, allowed })

  // Handle tab change with visited tracking
  const handleTabChange = useCallback((tabId: DashboardTabId) => {
    setActiveTab(tabId)
    setVisitedTabs(prev => new Set(prev).add(tabId))
  }, [setActiveTab])

  if (isAuthLoading) {
    return <LoadingState />
  }

  if (!allowed) {
    return <UnauthorizedState forceWhiteBackground />
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="container mx-auto px-4 pt-4 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 mt-5 items-start py-10">
          <div className="lg:sticky lg:top-24">
            <DashboardSidebar
              menuItems={menuItems}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              badges={{
                'contact-messages': visitedTabs.has('contact-messages') ? 0 : (contactMessages.unreadCount || 0),
                'enrollments': visitedTabs.has('enrollments') ? 0 : (registrations.registrations?.length || 0)
              }}
            />
          </div>

          <div className="space-y-6">
            <TabContent 
              activeTab={activeTab} 
              allowed={allowed}
              currentUser={currentUser}
              showToast={showToast}
              editingUser={editingUser}
              setEditingUser={setEditingUser}
              onLogoFileSelect={crop.onLogoFileSelect}
              siteSettings={siteSettings}
              setSiteSettings={setSiteSettings}
              workingHoursSchedule={workingHoursSchedule}
              setWorkingHoursSchedule={setWorkingHoursSchedule}
              isSettingsLoading={isSettingsLoading}
              saveSettings={saveSettings}
            />
          </div>
        </div>
      </main>

      <CropModal
        open={crop.cropModalOpen}
        cropImage={crop.cropImage}
        crop={crop.crop}
        zoom={crop.zoom}
        setCrop={crop.setCrop}
        setZoom={crop.setZoom}
        onCropComplete={crop.onCropComplete}
        onClose={crop.closeCrop}
        onConfirm={crop.createCroppedImage}
        onSkipCrop={crop.skipCrop}
      />

      <CropModal
        open={instructor.cropModalOpen}
        cropImage={instructor.cropImage}
        crop={instructor.crop}
        zoom={instructor.zoom}
        setCrop={instructor.setCrop}
        setZoom={instructor.setZoom}
        onCropComplete={instructor.onCropComplete}
        onClose={instructor.closeCropModal}
        onConfirm={instructor.confirmCrop}
        onSkipCrop={instructor.skipCrop}
      />

      <NotificationContainer notifications={notifications} onRemove={removeNotification} />

      <Footer />
    </div>
  )
}
