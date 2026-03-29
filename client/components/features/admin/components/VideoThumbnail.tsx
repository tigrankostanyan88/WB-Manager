'use client'

import { useEffect, useRef, useState } from 'react'

interface VideoThumbnailProps {
  videoUrl: string
  timestamp?: number
  className?: string
}

export function VideoThumbnail({ videoUrl, timestamp, className }: VideoThumbnailProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [frameReady, setFrameReady] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.onloadedmetadata = () => {
      const seekTime = timestamp !== undefined
        ? Math.min(timestamp, video.duration || timestamp)
        : Math.min(35, video.duration || 35)
      video.currentTime = seekTime
    }

    video.onseeked = () => {
      video.pause()
      setFrameReady(true)
    }

    video.load()
  }, [videoUrl, timestamp])

  return (
    <video
      ref={videoRef}
      src={videoUrl}
      className={className}
      muted
      playsInline
      style={{ opacity: frameReady ? 1 : 0, transition: 'opacity 0.3s' }}
    />
  )
}
