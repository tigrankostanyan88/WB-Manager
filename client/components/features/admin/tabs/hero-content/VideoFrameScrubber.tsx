'use client'

import { useState, useRef, useEffect } from 'react'
import { Scissors } from 'lucide-react'

interface VideoFrameScrubberProps {
  videoUrl: string
  thumbnailTime: number
  onTimeChange: (time: number) => void
}

export function VideoFrameScrubber({
  videoUrl,
  thumbnailTime,
  onTimeChange
}: VideoFrameScrubberProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [duration, setDuration] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Draw frame on time change
  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || !duration) return

    const drawFrame = () => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = video.videoWidth || 640
      canvas.height = video.videoHeight || 360
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    }

    const seekAndDraw = () => {
      video.currentTime = thumbnailTime
      video.addEventListener('seeked', drawFrame, { once: true })
    }

    seekAndDraw()
  }, [thumbnailTime, duration])

  // Set duration on video load
  const handleLoadedMetadata = () => {
    const video = videoRef.current
    if (!video) return
    setDuration(video.duration)
    video.currentTime = thumbnailTime || Math.min(45, video.duration / 2)
  }

  // Calculate time from click position
  const getTimeFromPosition = (clientX: number) => {
    const container = containerRef.current
    if (!container || !duration) return 0

    const rect = container.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(1, x / rect.width))
    return percentage * duration
  }

  // Start dragging
  const handleStart = (clientX: number) => {
    setIsDragging(true)
    const time = getTimeFromPosition(clientX)
    onTimeChange(Math.round(time * 10) / 10)
  }

  const handleMove = (clientX: number) => {
    if (!isDragging) return
    const time = getTimeFromPosition(clientX)
    onTimeChange(Math.round(time * 10) / 10)
  }

  const handleEnd = () => {
    setIsDragging(false)
  }

  const progressPercentage = duration ? (thumbnailTime / duration) * 100 : 0

  // Format time as MM:SS.ms
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    const ms = Math.floor((seconds % 1) * 10)
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms}`
  }

  return (
    <div className="space-y-3">
      {/* Hidden video for frame extraction */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="hidden"
        preload="metadata"
        crossOrigin="anonymous"
        onLoadedMetadata={handleLoadedMetadata}
      />

      {/* Canvas showing current frame */}
      <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-video">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover"
        />

        {/* Current time indicator on canvas */}
        <div className="absolute top-3 right-3 bg-black/70 text-white text-sm font-bold px-3 py-1.5 rounded-lg backdrop-blur-sm">
          {formatTime(thumbnailTime)}
        </div>

        {/* Instruction overlay */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm flex items-center gap-2">
          <Scissors className="w-3.5 h-3.5" />
          Ձախ-աջ քաշեք կադրը ընտրելու համար
        </div>
      </div>

      {/* Scrubber bar */}
      <div
        ref={containerRef}
        className="relative h-12 bg-slate-100 rounded-xl cursor-pointer select-none touch-none"
        onMouseDown={(e) => { e.preventDefault(); handleStart(e.clientX) }}
        onMouseMove={(e) => handleMove(e.clientX)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
      >
        {/* Progress track */}
        <div className="absolute inset-y-0 left-0 bg-violet-500/20 rounded-l-xl transition-all" style={{ width: `${progressPercentage}%` }} />

        {/* Progress bar */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-2 bg-violet-500 rounded-full transition-all"
          style={{ width: `${progressPercentage}%`, left: 0 }}
        />

        {/* Handle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-2 border-violet-500 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95"
          style={{ left: `calc(${progressPercentage}% - 12px)` }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-violet-500 rounded-full" />
          </div>
        </div>

        {/* Time markers */}
        <div className="absolute inset-x-0 bottom-1 flex justify-between px-3 text-[10px] text-slate-400 font-medium">
          <span>0:00</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  )
}
