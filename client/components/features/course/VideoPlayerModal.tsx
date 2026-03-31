'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface VideoPlayerModalProps {
  isOpen: boolean
  onClose: () => void
  videoUrl?: string
  title?: string
  duration?: string
}

export function VideoPlayerModal({ isOpen, onClose, videoUrl, title, duration }: VideoPlayerModalProps) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-4xl bg-black overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Video player */}
            <div className="relative aspect-video bg-black flex items-center justify-center">
              {videoUrl ? (
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full bg-black object-contain"
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
              <div className="p-4 bg-slate-900">
                <h3 className="text-white font-bold">{title}</h3>
                {duration && <p className="text-slate-400 text-sm">Տևողություն՝ {duration}</p>}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
