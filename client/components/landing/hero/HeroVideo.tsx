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
    <div className="relative group w-full max-w-full overflow-hidden">
      <div 
        className="relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200 bg-white ring-1 ring-slate-100 cursor-pointer max-w-full"
        onClick={handleVideoClick}
      >
        <div className="aspect-[16/10] w-full max-w-full relative overflow-hidden bg-slate-100">
          {/* Video Thumbnail - scales on hover */}
          <div className="h-full w-full transition-transform duration-700 group-hover:scale-[1.03]">
            {content?.video_url ? (
              <video
                ref={videoRef}
                src={content.video_url}
                className="h-full w-full object-cover scale-105 opacity-90 group-hover:opacity-100 transition-opacity"
                preload="metadata"
                muted
                playsInline
                onLoadedMetadata={handleThumbnailLoaded}
                onError={onVideoError}
              />
            ) : (
              <div className="h-full w-full bg-slate-200 animate-pulse" />
            )}
          </div>

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-all">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-white/30 rounded-full blur-xl transform scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative grid place-items-center h-20 w-20 rounded-full bg-white shadow-2xl shadow-violet-500/30 ring-1 ring-white/50 transform transition-all duration-300 group-hover:scale-110">
                <Play className="h-8 w-8 text-slate-900 fill-slate-900 ml-1" />
              </span>
            </div>
          </div>

          {videoError && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-400 text-sm">
              Video placeholder
            </div>
          )}
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
