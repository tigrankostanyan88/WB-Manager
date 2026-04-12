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
      className="relative w-full min-h-screen pt-28 md:pt-32 lg:pt-36 pb-20 md:pb-28 overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-100/50 via-white to-slate-50"
    >
      {/* Static gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] opacity-30"
          style={{
            background: `
              radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.4) 0%, transparent 40%),
              radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 40%),
              radial-gradient(circle at 40% 40%, rgba(236, 72, 153, 0.2) 0%, transparent 30%)
            `,
          }}
        />
      </div>

      {/* Static gradient orbs */}
      <div 
        className="absolute top-20 left-10 w-[500px] h-[500px] rounded-full blur-[100px]"
        style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.4) 0%, rgba(124, 58, 237, 0.2) 100%)',
        }}
      />
      <div 
        className="absolute bottom-10 right-10 w-[600px] h-[600px] rounded-full blur-[120px]"
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(99, 102, 241, 0.2) 100%)',
        }}
      />
      <div 
        className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full blur-[80px] opacity-40"
        style={{
          background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%)',
        }}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        <div className="grid gap-12 lg:gap-16 xl:gap-20 lg:grid-cols-2 items-center min-h-[calc(100vh-200px)]">
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
