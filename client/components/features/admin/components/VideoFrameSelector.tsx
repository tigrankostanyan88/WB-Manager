'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Camera } from 'lucide-react'

interface VideoFrameSelectorProps {
  isOpen: boolean
  videoUrl: string
  onFrameCapture: (dataUrl: string, timestamp: number) => void
  onClose: () => void
}

export function VideoFrameSelector({ isOpen, videoUrl, onFrameCapture, onClose }: VideoFrameSelectorProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const [isSeeking, setIsSeeking] = useState(false)

  useEffect(() => {
    if (!isOpen || !videoRef.current) return

    const video = videoRef.current
    setIsReady(false)
    setIsSeeking(true)

    video.onloadedmetadata = () => {
      setDuration(video.duration || 0)
      video.currentTime = Math.min(35, video.duration || 35)
    }

    video.onseeked = () => {
      setIsSeeking(false)
      setIsReady(true)
      setCurrentTime(video.currentTime)
    }

    video.load()
  }, [videoUrl, isOpen])

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    setCurrentTime(time)
    if (videoRef.current) {
      videoRef.current.currentTime = time
    }
  }

  const captureFrame = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || isSeeking) return

    video.pause()
    canvas.width = video.videoWidth || 1280
    canvas.height = video.videoHeight || 720
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
    onFrameCapture(dataUrl, currentTime)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-5">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Ընտրեք կադր դասընթացի պատկերի համար</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden">
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full"
              muted
              playsInline
              preload="metadata"
              controls
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Ժամանակ: {currentTime.toFixed(1)} վ</span>
              <span>Տևողություն: {duration.toFixed(1)} վ</span>
            </div>
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
            />
            <p className="text-xs text-slate-500">Տեղափոխեք սլայդերը կադր ընտրելու համար</p>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
            >
              Չեղարկել
            </button>
            <button
              onClick={captureFrame}
              disabled={!isReady || isSeeking}
              className="px-6 py-2.5 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              Ընտրել այս կադրը
            </button>
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
