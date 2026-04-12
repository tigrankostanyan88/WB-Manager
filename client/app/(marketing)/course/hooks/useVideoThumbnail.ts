'use client'

import { useState, useEffect, useMemo } from 'react'
import type { Course } from '../types'

interface UseVideoThumbnailResult {
  thumbnail: string | null
  loading: boolean
}

export function useVideoThumbnail(course: Course): UseVideoThumbnailResult {
  const [thumbnail, setThumbnail] = useState<string | null>(course.imageUrl || null)
  const [loading, setLoading] = useState(!course.imageUrl)

  const apiBase = process.env.NEXT_PUBLIC_API_URL || ''
  const origin = useMemo(() => {
    return /^https?:\/\//i.test(apiBase) ? apiBase.replace(/\/api.*$/, '') : ''
  }, [apiBase])

  useEffect(() => {
    // If course has imageUrl, use it immediately
    if (course.imageUrl) {
      setThumbnail(course.imageUrl)
      setLoading(false)
      return
    }

    // Find video file
    const firstModule = course.modules?.[0]
    const videoFiles = firstModule?.files?.filter((f) => f.name_used === 'module_video') || []
    const firstVideo = videoFiles[0]
    
    if (!firstVideo?.name || !firstVideo?.ext) {
      setLoading(false)
      return
    }

    // Build video URL
    const videoPath = `/files/modules/${firstVideo.name}${firstVideo.ext}`
    const videoUrl = `${origin}${videoPath}`

    // Quick approach: try to use video poster attribute or canvas capture
    const video = document.createElement('video')
    video.crossOrigin = 'anonymous'
    video.src = videoUrl
    video.preload = 'metadata'
    video.muted = true
    video.playsInline = true

    let timeoutId: NodeJS.Timeout

    const cleanup = () => {
      clearTimeout(timeoutId)
      video.onloadedmetadata = null
      video.onseeked = null
      video.onerror = null
      video.pause()
      video.src = ''
    }

    timeoutId = setTimeout(() => {
      cleanup()
      setLoading(false)
    }, 5000) // 5 second timeout

    video.onloadedmetadata = () => {
      // Seek to thumbnail time or middle of video
      const seekTime = course.thumbnail_time ?? Math.min(5, video.duration / 2)
      video.currentTime = seekTime
    }

    video.onseeked = () => {
      try {
        const canvas = document.createElement('canvas')
        // Smaller canvas for better performance
        canvas.width = 320
        canvas.height = 180
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(video, 0, 0, 320, 180)
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6)
          setThumbnail(dataUrl)
        }
      } catch (e) {
        // Ignore errors
      }
      cleanup()
      setLoading(false)
    }

    video.onerror = () => {
      cleanup()
      setLoading(false)
    }

    return () => cleanup()
  }, [course.imageUrl, course.modules, course.thumbnail_time, origin])

  return { thumbnail, loading }
}
