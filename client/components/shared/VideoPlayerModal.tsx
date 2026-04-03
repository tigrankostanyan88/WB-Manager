// components/shared/VideoPlayerModal.tsx - Shared video player modal

'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'

interface VideoPlayerModalProps {
  videoUrl: string
  onClose: () => void
  className?: string
}

export function VideoPlayerModal({ videoUrl, onClose, className = '' }: VideoPlayerModalProps) {
  // Block body scroll when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-[2147483647] w-screen h-screen bg-black/90 flex items-center justify-center p-4"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-5xl bg-black rounded-xl overflow-hidden z-[2147483648] ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-[10000] w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          aria-label="Փակել տեսանյութը"
        >
          <X className="w-6 h-6" />
        </button>
        <video
          src={videoUrl}
          className="w-full aspect-video"
          controls
          autoPlay
          playsInline
          crossOrigin="anonymous"
          preload="auto"
        />
      </div>
    </div>
  )
}

export default VideoPlayerModal
