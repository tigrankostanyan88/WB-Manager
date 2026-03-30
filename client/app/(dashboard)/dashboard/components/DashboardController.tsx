'use client'

import { Header, Footer } from '@/components/layout'
import { DashboardSidebar } from '@/components/features/admin'
import { CropModal } from '@/components/features/admin'
import { NotificationContainer } from '@/components/features/admin'
import { EditUserModal } from '@/components/features/admin'
import { useDashboard } from '../hooks/useDashboard'
import { LoadingState } from './LoadingState'
import { UnauthorizedState } from './UnauthorizedState'
import { TabContent } from './TabContent'

export function DashboardController() {
  const data = useDashboard()

  if (data.isAuthLoading) {
    return <LoadingState />
  }

  if (!data.allowed) {
    return <UnauthorizedState forceWhiteBackground />
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container max-w-[1400px] px-4 md:px-8 pt-24 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 mt-[120px] items-start">
          <div className="lg:sticky lg:top-24">
            <DashboardSidebar 
              menuItems={data.menuItems} 
              activeTab={data.activeTab} 
              onTabChange={data.setActiveTab} 
              badges={{ 
                'contact-messages': data.contactUnreadCount, 
                'course-registrations': data.courseRegistrations.length 
              }} 
            />
          </div>

          <div className="space-y-6">
            <TabContent activeTab={data.activeTab} data={data} />
          </div>
        </div>
      </main>

      <EditUserModal
        open={Boolean(data.editingUser)}
        user={data.editingUser}
        onClose={() => data.setEditingUser(null)}
        onSubmit={data.submitEditUser}
      />

      <CropModal
        open={data.cropModalOpen}
        cropImage={data.cropImage}
        crop={data.crop}
        zoom={data.zoom}
        setCrop={data.setCrop}
        setZoom={data.setZoom}
        onCropComplete={data.onCropComplete}
        onClose={data.closeCrop}
        onConfirm={data.createCroppedImage}
      />

      <CropModal
        open={data.instructorCropModalOpen}
        cropImage={data.instructorCropImage}
        crop={data.instructorCrop}
        zoom={data.instructorZoom}
        setCrop={data.setInstructorCrop}
        setZoom={data.setInstructorZoom}
        onCropComplete={data.onInstructorCropComplete}
        onClose={data.closeInstructorCropModal}
        onConfirm={data.confirmInstructorCrop}
      />

      <NotificationContainer notifications={data.notifications} onRemove={data.removeNotification} />

      <Footer />
    </div>
  )
}
