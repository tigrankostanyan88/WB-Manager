'use client'

import { X } from 'lucide-react'

interface VideoPlayerModalProps {
  videoUrl: string
  onClose: () => void
}

export function VideoPlayerModal({ videoUrl, onClose }: VideoPlayerModalProps) {
  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <video
          src={videoUrl}
          className="w-full aspect-video"
          controls
          autoPlay
          playsInline
        />
      </div>
    </div>
  )
}
