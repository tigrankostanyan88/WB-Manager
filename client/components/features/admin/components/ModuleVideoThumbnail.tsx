'use client'

import { Play } from 'lucide-react'

interface ModuleVideoThumbnailProps {
  videoUrl: string
  onClick: () => void
}

export function ModuleVideoThumbnail({ videoUrl, onClick }: ModuleVideoThumbnailProps) {
  return (
    <div 
      className="relative w-24 h-16 bg-slate-900 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer group"
      onClick={() => {
        onClick()
      }}
    >
      {/* Video Preview */}
      <video
        src={videoUrl}
        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
        preload="metadata"
        muted
        playsInline
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        onLoadedMetadata={(e) => {
          const video = e.currentTarget
          const seekTime = Math.min(45, video.duration / 2 || 0)
          if (seekTime > 0) {
            video.currentTime = seekTime
          }
        }}
      />
      
      {/* Play Overlay */}
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
        <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Play className="w-4 h-4 text-violet-600 ml-0.5" fill="currentColor" />
        </div>
      </div>
    </div>
  )
}
