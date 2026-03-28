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
    
    video.addEventListener('loadeddata', () => {
      // Use provided time, or default to 30 seconds or 10% of video if shorter
      const seekTime = time ?? Math.min(30, video.duration * 0.1 || 30)
      video.currentTime = seekTime
    })
    
    video.addEventListener('seeked', () => {
      canvas.width = video.videoWidth || 320
      canvas.height = video.videoHeight || 180
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      try {
        const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.7)
        resolve(thumbnailUrl)
      } catch (e) {
        reject(e)
      }
    })
    
    video.addEventListener('error', () => {
      reject(new Error('Failed to load video'))
    })
  })
}

export default function VideoThumbnail({ videoUrl, time, className = '' }: VideoThumbnailProps) {
  const [thumbnail, setThumbnail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const generatedRef = useRef(false)
  
  useEffect(() => {
    if (!videoUrl || generatedRef.current) return
    
    generatedRef.current = true
    
    generateVideoThumbnail(videoUrl, time)
      .then(url => {
        setThumbnail(url)
        setLoading(false)
      })
      .catch(() => {
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
