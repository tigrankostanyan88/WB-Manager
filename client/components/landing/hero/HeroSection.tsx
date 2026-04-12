'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '@/lib/api'
import { HeroContent } from './HeroContent'
import { HeroVideo } from './HeroVideo'
import { HeroWidgets } from './HeroWidgets'
import type { HeroSectionProps, Review } from './types'

// Floating particles component
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-violet-400/20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

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

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
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
      {/* Animated mesh gradient background */}
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

      {/* Floating particles */}
      <FloatingParticles />

      {/* Animated gradient orbs with parallax */}
      <motion.div 
        animate={{ 
          x: mousePosition.x * -1,
          y: mousePosition.y * -1,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 30 }}
        className="absolute top-20 left-10 w-[500px] h-[500px] rounded-full blur-[100px]"
        style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.4) 0%, rgba(124, 58, 237, 0.2) 100%)',
        }}
      >
        <motion.div 
          className="w-full h-full rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
      <motion.div 
        animate={{ 
          x: mousePosition.x * 1.5,
          y: mousePosition.y * 1.5,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 30 }}
        className="absolute bottom-10 right-10 w-[600px] h-[600px] rounded-full blur-[120px]"
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(99, 102, 241, 0.2) 100%)',
        }}
      >
        <motion.div 
          className="w-full h-full rounded-full"
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
      <motion.div 
        animate={{ 
          scale: [1, 1.4, 1],
          rotate: [0, 90, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full blur-[80px] opacity-40"
        style={{
          background: 'conic-gradient(from 0deg, rgba(236, 72, 153, 0.3), rgba(139, 92, 246, 0.3), rgba(59, 130, 246, 0.3), rgba(236, 72, 153, 0.3))',
        }}
      />

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Glowing line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        <div className="grid gap-12 lg:gap-16 xl:gap-20 lg:grid-cols-2 items-center min-h-[calc(100vh-200px)]">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="min-w-0"
          >
            <HeroContent 
              content={content} 
              onOpenModal={onOpenModal} 
              onPlayVideo={handleHeroPlay}
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative min-w-0"
            style={{
              transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
            }}
          >
            <HeroVideo
              content={content}
              playingVideo={playingVideo}
              videoError={videoError}
              onVideoError={onVideoError}
              onPlay={handlePlay}
              onClose={handleClose}
            />
            <HeroWidgets latestReviews={latestReviews} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
