'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect } from 'react'

interface VideoPlayerModalProps {
  isOpen: boolean
  onClose: () => void
  videoUrl?: string
  title?: string
  duration?: string
}

export function VideoPlayerModal({ isOpen, onClose, videoUrl, title, duration }: VideoPlayerModalProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (!isOpen) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[2147483647] w-full h-full min-h-screen min-w-full bg-black/95 flex items-center justify-center"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, margin: 0, padding: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-5xl mx-auto bg-black flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-[10000] w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
              aria-label="Փակել տեսանյութը"
            >
              <X className="w-7 h-7" />
            </button>

            {/* Video player - natural aspect ratio */}
            <div className="w-full flex items-center justify-center bg-black">
              {videoUrl ? (
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full max-w-5xl aspect-video object-contain"
                  controlsList="nodownload"
                >
                  Ձեր browser-ը չի աջակցում վիդեո tag:
                </video>
              ) : (
                <div className="w-full aspect-video flex items-center justify-center text-white">
                  Վիդեոն հասանելի չէ
                </div>
              )}
            </div>

            {/* Video info - below video to avoid overlap with controls */}
            {title && (
              <div className="bg-slate-900/90 px-6 py-3 border-t border-white/10">
                <h3 className="text-white font-bold text-base">{title}</h3>
                {duration && <p className="text-slate-400 text-sm">{duration}</p>}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
