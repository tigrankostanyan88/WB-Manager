'use client'

import { motion } from 'framer-motion'
import { Play, Sparkles } from 'lucide-react'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { VideoPlayerModal } from '@/components/shared'
import type { HeroContentData } from './types'

interface HeroVideoProps {
  content: HeroContentData | null
  playingVideo: string | null
  videoError: string | null
  onVideoError: () => void
  onPlay: (url: string) => void
  onClose: () => void
}

export function HeroVideo({ 
  content, 
  playingVideo, 
  videoError, 
  onVideoError, 
  onPlay, 
  onClose 
}: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  // Force reload video immediately when component mounts
  useLayoutEffect(() => {
    const video = videoRef.current
    if (video && content?.video_url) {
      video.load()
    }
  }, [content?.video_url])

  // 3D tilt effect on mouse move
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setTilt({
      x: (y - 0.5) * 10,
      y: (x - 0.5) * -10,
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 })
    setIsHovered(false)
  }, [])

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleVideoClick = useCallback(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3300'
    const defaultUrl = `${apiBase.replace(/\/$/, '')}/files/hero.mp4`
    const videoUrl = content?.video_url || defaultUrl
    onPlay(videoUrl)
  }, [content?.video_url, onPlay])

  const handleThumbnailLoaded = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const video = e.currentTarget
      const thumbnailTime = content?.thumbnail_time
      const seekTime = thumbnailTime !== undefined && thumbnailTime > 0 
        ? thumbnailTime 
        : Math.min(45, video.duration / 2 || 0)
      if (seekTime > 0) {
        video.currentTime = seekTime
      }
    },
    [content?.thumbnail_time]
  )

  return (
    <motion.div 
      ref={containerRef}
      className="relative group w-full max-w-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        perspective: '1000px',
      }}
      initial={{ opacity: 0, scale: 0.9, rotateY: -5 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] as const }}
    >
      <motion.div
        className="relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden cursor-pointer"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
        }}
        whileHover={{ scale: 1.02 }}
        onClick={handleVideoClick}
      >
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-blue-500 rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
        
        {/* Main container */}
        <div className="relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-white shadow-2xl shadow-violet-200/50 ring-1 ring-white/20">
          <div className="aspect-[16/10] w-full max-w-full relative overflow-hidden bg-slate-100">
            {/* Video Thumbnail with zoom effect */}
            <motion.div 
              className="h-full w-full"
              animate={{ scale: isHovered ? 1.08 : 1.03 }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const }}
            >
              {content?.video_url ? (
                <video
                  ref={videoRef}
                  src={content.video_url}
                  className="h-full w-full object-cover opacity-95 group-hover:opacity-100 transition-opacity duration-500"
                  preload="metadata"
                  muted
                  playsInline
                  onLoadedMetadata={handleThumbnailLoaded}
                  onError={onVideoError}
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse" />
              )}
            </motion.div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />

            {/* Play Button Overlay with enhanced animation */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all duration-500">
              <motion.div 
                className="relative flex items-center justify-center"
                animate={{ scale: isHovered ? 1.1 : 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Pulsing rings */}
                <motion.div 
                  className="absolute inset-0 rounded-full bg-white/20"
                  animate={{ 
                    scale: [1, 1.5, 1.5], 
                    opacity: [0.5, 0.3, 0] 
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
                <motion.div 
                  className="absolute inset-0 rounded-full bg-white/10"
                  animate={{ 
                    scale: [1, 1.8, 1.8], 
                    opacity: [0.3, 0.2, 0] 
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: 0.5
                  }}
                />
                
                {/* Main play button */}
                <motion.span 
                  className="relative grid place-items-center h-24 w-24 rounded-full bg-white shadow-2xl shadow-violet-500/40 ring-2 ring-white/50 backdrop-blur-sm"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="h-10 w-10 text-violet-600 fill-violet-600 ml-1" />
                  <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-violet-400" />
                </motion.span>
              </motion.div>
            </div>

            {/* Bottom info bar */}
            <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center">
                  <Play className="h-5 w-5 text-white fill-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Ներածական դաս</p>
                  <p className="text-white/70 text-xs">2:30 րոպե</p>
                </div>
              </div>
            </div>

            {videoError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
                <div className="text-center">
                  <Play className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Տեսանյութը հասանելի չէ</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {playingVideo && createPortal(
        <VideoPlayerModal 
          videoUrl={playingVideo} 
          onClose={onClose} 
        />,
        document.body
      )}
    </motion.div>
  )
}
