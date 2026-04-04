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
      className="fixed inset-0 z-[2147483647] w-full h-full min-h-screen min-w-full bg-black/95 flex items-center justify-center"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, margin: 0, padding: 0 }}
      onClick={onClose}
    >
      <div
        className={`relative w-full h-full max-w-6xl max-h-screen mx-auto bg-black flex flex-col items-center justify-center ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-[10000] w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          aria-label="Փակել տեսանյութը"
        >
          <X className="w-7 h-7" />
        </button>
        <div className="w-full h-full flex items-center justify-center bg-black">
          <video
            src={videoUrl}
            className="w-full h-full max-h-screen object-contain"
            controls
            autoPlay
            playsInline
            crossOrigin="anonymous"
            preload="auto"
          />
        </div>
      </div>
    </div>
  )
}

export default VideoPlayerModal
