'use client'

import { useEffect, useState } from 'react'
import type { Course } from '../types'

interface UseVideoThumbnailResult {
  thumbnail: string | null
  loading: boolean
}

export function useVideoThumbnail(course: Course): UseVideoThumbnailResult {
  const [thumbnail, setThumbnail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const apiBase = process.env.NEXT_PUBLIC_API_URL || ''
  const origin = /^https?:\/\//i.test(apiBase) ? apiBase.replace(/\/api.*$/, '') : ''

  const firstModule = course.modules?.[0]
  const videoFiles = firstModule?.files?.filter((f: { name_used?: string }) => f.name_used === 'module_video') || []
  const firstVideo = videoFiles[0]
  const hasVideo = firstVideo?.name && firstVideo?.ext

  useEffect(() => {
    if (!hasVideo) {
      setLoading(false)
      return
    }

    const videoPath = `/files/modules/${firstVideo.name}${firstVideo.ext}`
    const videoUrl = `${origin}${videoPath}`

    const video = document.createElement('video')
    video.crossOrigin = 'anonymous'
    video.src = videoUrl
    video.preload = 'metadata'

    video.onloadedmetadata = () => {
      const defaultTime = Math.min(30, video.duration / 2)
      const seekTime = course.thumbnail_time ?? defaultTime
      video.currentTime = seekTime
    }

    video.onseeked = () => {
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth || 640
      canvas.height = video.videoHeight || 360
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        setThumbnail(canvas.toDataURL('image/jpeg', 0.8))
      }
      setLoading(false)
    }

    video.onerror = () => {
      setLoading(false)
    }
  }, [firstVideo, hasVideo, origin, course.thumbnail_time])

  return { thumbnail, loading }
}
