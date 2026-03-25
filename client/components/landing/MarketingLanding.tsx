'use client'

// client/components/MarketingLanding.tsx

import { useState, Suspense, lazy } from 'react'
import { useSettings } from '@/context/SettingsContext'
import { useInstructor } from '@/hooks/useInstructor'
import { useVideoPlayer } from '@/hooks/useVideoPlayer'
import RegistrationModal from '@/components/modals/RegistrationModal'
import {
  HeroSection,
  LearnSection,
  ImpactSection,
  FeaturesSection,
  CurriculumSection,
  InstructorSection,
  FaqSection,
} from '@/components/landing'

// Lazy load sections below the fold
const ReviewsSection = lazy(() => import('./ReviewsSection').then(m => ({ default: m.ReviewsSection })))
const ContactSection = lazy(() => import('./ContactSection').then(m => ({ default: m.ContactSection })))
const CtaSection = lazy(() => import('./CtaSection').then(m => ({ default: m.CtaSection })))

function SectionLoader() {
  return (
    <div className="w-full py-20 flex justify-center">
      <div className="animate-pulse h-8 w-32 bg-slate-200 rounded-full" />
    </div>
  )
}

export default function MarketingLanding() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { settings } = useSettings()
  const { instructor } = useInstructor()
  const { isPlaying, videoError, playVideo, setVideoError } = useVideoPlayer()

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  return (
    <>
      <HeroSection
        isPlaying={isPlaying}
        videoError={videoError}
        onPlayVideo={playVideo}
        onVideoError={() => setVideoError('notfound')}
        onOpenModal={handleOpenModal}
      />
      <LearnSection />
      <ImpactSection />
      <FeaturesSection />
      <CurriculumSection />
      <InstructorSection
        instructor={instructor}
        onOpenModal={handleOpenModal}
      />
      <Suspense fallback={<SectionLoader />}>
        <ReviewsSection />
      </Suspense>
      <FaqSection />
      <Suspense fallback={<SectionLoader />}>
        <ContactSection settings={settings} />
        <CtaSection onOpenModal={handleOpenModal} />
      </Suspense>

      {isModalOpen && (
        <RegistrationModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </>
  )
}
