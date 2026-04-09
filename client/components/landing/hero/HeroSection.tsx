'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { HeroContent } from './HeroContent'
import { HeroVideo } from './HeroVideo'
import { HeroWidgets } from './HeroWidgets'
import type { HeroSectionProps, Review } from './types'

export function HeroSection({
  isPlaying,
  videoError,
  onPlayVideo,
  onVideoError,
  onOpenModal,
  content,
}: HeroSectionProps) {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)
  const [latestReviews, setLatestReviews] = useState<Review[]>([])

  // Fetch latest reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get('/api/v1/reviews')
        const responseData = res.data?.data as { reviews?: Review[] }
        const list = Array.isArray(responseData?.reviews) ? responseData.reviews : []
        setLatestReviews(list.slice(0, 3))
      } catch {
        // Fail silently - reviews are optional
      }
    }
    fetchReviews()
  }, [])

  const handlePlay = (url: string) => {
    setPlayingVideo(url)
    onPlayVideo()
  }

  const handleHeroPlay = () => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3300'
    const defaultUrl = `${apiBase.replace(/\/$/, '')}/files/hero.mp4`
    const videoUrl = content?.video_url || defaultUrl
    handlePlay(videoUrl)
  }

  const handleClose = () => {
    setPlayingVideo(null)
  }

  return (
    <section
      id="hero"
      className="relative w-full pt-32 md:pt-40 lg:pt-48 pb-20 md:pb-32 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-violet-50/30"
    >
      {/* Decorative gradient blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-violet-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-violet-100/20 to-blue-100/20 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        <div className="grid gap-8 lg:gap-12 xl:gap-16 lg:grid-cols-2 items-center">
          <div className="min-w-0">
            <HeroContent 
              content={content} 
              onOpenModal={onOpenModal} 
              onPlayVideo={handleHeroPlay}
            />
          </div>

          <div className="relative min-w-0">
            <HeroVideo
              content={content}
              playingVideo={playingVideo}
              videoError={videoError}
              onVideoError={onVideoError}
              onPlay={handlePlay}
              onClose={handleClose}
            />
            <HeroWidgets latestReviews={latestReviews} />
          </div>
        </div>
      </div>
    </section>
  )
}
