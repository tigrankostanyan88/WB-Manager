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

  const handleClose = () => {
    setPlayingVideo(null)
  }

  return (
    <section
      id="hero"
      className="relative w-full pt-32 md:pt-40 lg:pt-48 pb-20 md:pb-32 overflow-hidden bg-slate-50/30"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      {/* Gradient Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-gradient-to-br from-violet-400/20 via-fuchsia-400/20 to-purple-400/20 rounded-full blur-[120px]" />
        <div className="absolute top-[0%] right-[-15%] w-[600px] h-[600px] bg-gradient-to-bl from-fuchsia-400/20 via-pink-400/20 to-rose-400/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[20%] left-[10%] w-[700px] h-[700px] bg-gradient-to-tr from-violet-400/20 via-indigo-400/20 to-blue-400/20 rounded-full blur-[120px]" />
      </div>

      <div className="container relative z-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
          <HeroContent content={content} onOpenModal={onOpenModal} />

          <div className="relative">
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
