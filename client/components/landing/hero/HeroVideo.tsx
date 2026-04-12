'use client'

import { Play } from 'lucide-react'
import { useCallback, useLayoutEffect, useRef } from 'react'
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

  // Force reload video immediately when component mounts
  useLayoutEffect(() => {
    const video = videoRef.current
    if (video && content?.video_url) {
      video.load()
    }
  }, [content?.video_url])

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
    <div 
      className="relative group w-full max-w-full"
      onClick={handleVideoClick}
    >
      <div className="relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform duration-300">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-blue-500 rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
        
        {/* Main container */}
        <div className="relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-white shadow-2xl shadow-violet-200/50 ring-1 ring-white/20">
          <div className="aspect-[16/10] w-full max-w-full relative overflow-hidden bg-slate-100">
            {/* Video Thumbnail */}
            <div className="h-full w-full group-hover:scale-105 transition-transform duration-500">
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
            </div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all duration-500">
              <div className="relative flex items-center justify-center">
                {/* Pulsing rings - CSS animation */}
                <span className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
                
                {/* Main play button */}
                <span className="relative grid place-items-center h-24 w-24 rounded-full bg-white shadow-2xl shadow-violet-500/40 ring-2 ring-white/50 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                  <Play className="h-10 w-10 text-violet-600 fill-violet-600 ml-1" />
                </span>
              </div>
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
      </div>

      {playingVideo && createPortal(
        <VideoPlayerModal 
          videoUrl={playingVideo} 
          onClose={onClose} 
        />,
        document.body
      )}
    </div>
  )
}
