'use client'

// client/hooks/useVideoPlayer.ts

import { useState, useCallback } from 'react'

interface UseVideoPlayerReturn {
  isPlaying: boolean
  videoError: string | null
  playVideo: () => void
  setVideoError: (error: string | null) => void
}

export function useVideoPlayer(): UseVideoPlayerReturn {
  const [isPlaying, setIsPlaying] = useState(false)
  const [videoError, setVideoErrorState] = useState<string | null>(null)

  const playVideo = useCallback(() => {
    setIsPlaying(true)
    const el = document.getElementById('heroVideo') as HTMLVideoElement | null
    if (!el) return
    el.muted = false
    el.volume = 1
    void el.play()
  }, [])

  const setVideoError = useCallback((error: string | null) => {
    setVideoErrorState(error)
  }, [])

  return {
    isPlaying,
    videoError,
    playVideo,
    setVideoError,
  }
}
