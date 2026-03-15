'use client'

// client/components/MarketingLanding.tsx

import { useState } from 'react'
import { useSettings } from '@/context/SettingsContext' // moved from lib
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
  ContactSection,
  CtaSection,
} from '@/components/landing'

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
      <FaqSection />
      <ContactSection settings={settings} />
      <CtaSection onOpenModal={handleOpenModal} />

      {isModalOpen && (
        <RegistrationModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </>
  )
}
