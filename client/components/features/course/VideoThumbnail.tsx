'use client'

import { useEffect, useRef, useState } from 'react'

interface VideoThumbnailProps {
  videoUrl: string
  time?: number
  className?: string
}

export function generateVideoThumbnail(videoUrl: string, time?: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) {
      reject(new Error('Could not get canvas context'))
      return
    }
    
    video.crossOrigin = 'anonymous'
    video.src = videoUrl
    video.muted = true
    
    const cleanup = () => {
      video.removeEventListener('loadeddata', onLoadedData)
      video.removeEventListener('seeked', onSeeked)
      video.removeEventListener('error', onError)
      video.src = ''
      video.load()
    }
    
    const onLoadedData = () => {
      // Cap seek time to video duration - thumbnail_time might exceed video length
      const maxTime = Math.max(0, video.duration - 1)
      const seekTime = time ? Math.min(time, maxTime) : Math.min(30, video.duration * 0.1 || 30)
      // Use setTimeout to ensure the seek happens after loadeddata is fully processed
      setTimeout(() => {
        video.currentTime = seekTime
      }, 0)
    }
    
    const onLoadedMetadata = () => {
      // Don't seek here - wait for loadeddata to have enough buffered data
    }
    
    const onSeeked = () => {
      canvas.width = video.videoWidth || 320
      canvas.height = video.videoHeight || 180
      
      try {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.7)
        cleanup()
        resolve(thumbnailUrl)
      } catch (e) {
        cleanup()
        reject(e)
      }
    }
    
    const onError = (e: Event) => {
      cleanup()
      reject(new Error('Failed to load video'))
    }
    
    const onCanPlay = () => {
      // If we haven't seeked yet, do it now
      if (video.currentTime === 0 && video.duration > 0) {
        const maxTime = Math.max(0, video.duration - 1)
        const seekTime = time ? Math.min(time, maxTime) : Math.min(30, video.duration * 0.1 || 30)
        video.currentTime = seekTime
      }
    }
    
    const onCanPlayThrough = () => {
      // Video fully buffered, no action needed
    }
    
    video.addEventListener('loadeddata', onLoadedData)
    video.addEventListener('loadedmetadata', onLoadedMetadata)
    video.addEventListener('seeked', onSeeked)
    video.addEventListener('error', onError)
    video.addEventListener('canplay', onCanPlay)
    video.addEventListener('canplaythrough', onCanPlayThrough)
    
    // Start loading the video
    video.load()
  })
}

export function VideoThumbnail({ videoUrl, time, className = '' }: VideoThumbnailProps) {
  const [thumbnail, setThumbnail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const generatedRef = useRef(false)
  
  useEffect(() => {
    // Reset when videoUrl changes
    generatedRef.current = false
    setThumbnail(null)
    setLoading(true)
    
    if (!videoUrl) {
      setLoading(false)
      return
    }
    
    generatedRef.current = true
    
    // Generate thumbnail in background (non-blocking)
    const timer = setTimeout(() => {
      generateVideoThumbnail(videoUrl, time)
        .then(url => {
          if (generatedRef.current) {
            setThumbnail(url)
            setLoading(false)
          }
        })
        .catch(() => {
          if (generatedRef.current) {
            setLoading(false)
          }
        })
    }, 100) // Small delay to not block initial render
    
    return () => {
      clearTimeout(timer)
      generatedRef.current = false
    }
  }, [videoUrl, time])
  
  // Show gradient placeholder while loading (no spinner to avoid layout shift)
  if (loading) {
    return (
      <div className={`bg-gradient-to-br from-violet-600 to-indigo-700 ${className}`}>
        <div className="w-full h-full flex items-center justify-center opacity-50">
          <svg className="w-12 h-12 text-white/60" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
          </svg>
        </div>
      </div>
    )
  }
  
  if (thumbnail) {
    return (
      <img 
        src={thumbnail} 
        alt="Video thumbnail"
        className={`w-full h-full object-cover ${className}`}
        loading="eager"
      />
    )
  }
  
  // Fallback gradient
  return (
    <div className={`bg-gradient-to-br from-violet-600 to-indigo-700 ${className}`}>
      <div className="w-full h-full flex items-center justify-center opacity-50">
        <svg className="w-12 h-12 text-white/60" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
        </svg>
      </div>
    </div>
  )
}
