'use client'

import { Header, Footer } from '@/components/layout'
import { DashboardSidebar } from '@/components/features/admin'
import { CropModal } from '@/components/features/admin'
import { NotificationContainer } from '@/components/features/admin'
import { useDashboardSimple as useDashboard } from '../hooks/useDashboardSimple'
import { useSuspendedTab, useInstructorTab, useCropTab, useContactMessagesTab, useCourseRegistrationsTab } from '../hooks/tabs'
import { LoadingState } from './LoadingState'
import { UnauthorizedState } from './UnauthorizedState'
import { TabContent } from './TabContentNew'

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

  // Get data for sidebar badges and modals
  const suspended = useSuspendedTab({ showToast })
  const instructor = useInstructorTab({ activeTab, allowed, showToast })
  const crop = useCropTab({ setSiteSettings: () => {} })
  const contactMessages = useContactMessagesTab({ activeTab, allowed })
  const registrations = useCourseRegistrationsTab({ activeTab, allowed })

  if (isAuthLoading) {
    return <LoadingState />
  }

  if (!allowed) {
    return <UnauthorizedState forceWhiteBackground />
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container max-w-[1400px] px-4 md:px-8 pt-24 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 mt-[120px] items-start">
          <div className="lg:sticky lg:top-24">
            <DashboardSidebar 
              menuItems={menuItems} 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
              badges={{ 
                'contact-messages': contactMessages.unreadCount || 0, 
                'course-registrations': registrations.registrations?.length || 0
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
      />

      <NotificationContainer notifications={notifications} onRemove={removeNotification} />

      <Footer />
    </div>
  )
}
