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
  // Block body scroll when modal is open
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
            className="relative w-full h-screen max-w-none mx-auto bg-black flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-[10000] w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
              aria-label="Փակել տեսանյութը"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Video player - fills remaining space */}
            <div className="w-full flex-1 flex items-center justify-center bg-black min-h-0">
              {videoUrl ? (
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                  controlsList="nodownload"
                >
                  Ձեր browser-ը չի աջակցում վիդեո tag:
                </video>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  Վիդեոն հասանելի չէ
                </div>
              )}
            </div>

            {/* Video info */}
            {title && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-white font-bold text-lg">{title}</h3>
                {duration && <p className="text-slate-300 text-sm">Տևողություն՝ {duration}</p>}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
