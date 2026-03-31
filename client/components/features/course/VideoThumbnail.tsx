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
      console.log('[VideoThumbnail] Video loadeddata fired, duration:', video.duration, 'readyState:', video.readyState)
      // Cap seek time to video duration - thumbnail_time might exceed video length
      const maxTime = Math.max(0, video.duration - 1)
      const seekTime = time ? Math.min(time, maxTime) : Math.min(30, video.duration * 0.1 || 30)
      console.log('[VideoThumbnail] Seeking to time:', seekTime, '(thumbnail_time was:', time, ')')
      video.currentTime = seekTime
    }
    
    const onLoadedMetadata = () => {
      console.log('[VideoThumbnail] Video loadedmetadata fired, duration:', video.duration)
      // Try seeking here too if loadeddata doesn't fire
      if (video.duration > 0) {
        const maxTime = Math.max(0, video.duration - 1)
        const seekTime = time ? Math.min(time, maxTime) : Math.min(30, video.duration * 0.1 || 30)
        video.currentTime = seekTime
      }
    }
    
    const onSeeked = () => {
      console.log('[VideoThumbnail] Video seeked, drawing to canvas, video size:', video.videoWidth, 'x', video.videoHeight)
      canvas.width = video.videoWidth || 320
      canvas.height = video.videoHeight || 180
      
      try {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.7)
        console.log('[VideoThumbnail] Canvas to data URL success, length:', thumbnailUrl.length)
        cleanup()
        resolve(thumbnailUrl)
      } catch (e) {
        console.error('[VideoThumbnail] Canvas draw/toDataURL failed:', e)
        cleanup()
        reject(e)
      }
    }
    
    const onError = (e: Event) => {
      console.error('[VideoThumbnail] Video load error:', e, 'Video error code:', video.error?.code, 'message:', video.error?.message)
      cleanup()
      reject(new Error('Failed to load video'))
    }
    
    const onCanPlay = () => {
      console.log('[VideoThumbnail] Video can play event fired, duration:', video.duration)
      // Seek using canplay since loadeddata may not fire consistently
      if (video.duration > 0 && video.currentTime === 0) {
        const maxTime = Math.max(0, video.duration - 1)
        const seekTime = time ? Math.min(time, maxTime) : Math.min(30, video.duration * 0.1 || 30)
        console.log('[VideoThumbnail] Seeking from canplay to:', seekTime)
        video.currentTime = seekTime
      }
    }
    
    const onCanPlayThrough = () => {
      console.log('[VideoThumbnail] Video canplaythrough event fired, duration:', video.duration)
    }
    
    video.addEventListener('loadeddata', onLoadedData)
    video.addEventListener('loadedmetadata', onLoadedMetadata)
    video.addEventListener('seeked', onSeeked)
    video.addEventListener('error', onError)
    video.addEventListener('canplay', onCanPlay)
    video.addEventListener('canplaythrough', onCanPlayThrough)
    
    // Start loading the video
    console.log('[VideoThumbnail] Starting video load:', videoUrl)
    video.load()
  })
}

export function VideoThumbnail({ videoUrl, time, className = '' }: VideoThumbnailProps) {
  const [thumbnail, setThumbnail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const generatedRef = useRef(false)
  
  useEffect(() => {
    console.log('[VideoThumbnail] videoUrl:', videoUrl, 'time:', time)
    if (!videoUrl || generatedRef.current) return
    
    generatedRef.current = true
    
    generateVideoThumbnail(videoUrl, time)
      .then(url => {
        console.log('[VideoThumbnail] Generated thumbnail successfully')
        setThumbnail(url)
        setLoading(false)
      })
      .catch((err) => {
        console.error('[VideoThumbnail] Failed to generate thumbnail:', err)
        setLoading(false)
      })
  }, [videoUrl, time])
  
  if (loading) {
    return (
      <div className={`bg-gradient-to-br from-violet-600/20 to-indigo-700/20 animate-pulse ${className}`}>
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-violet-600/30 border-t-violet-600 rounded-full animate-spin" />
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
      />
    )
  }
  
  return (
    <div className={`bg-gradient-to-br from-violet-600 to-indigo-700 ${className}`} />
  )
}
