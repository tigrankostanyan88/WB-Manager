'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, RotateCcw, Check, ZoomIn, ZoomOut, Move } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AvatarCropModalProps {
  isOpen: boolean
  imageSrc: string | null
  onClose: () => void
  onCropComplete: (croppedImage: Blob) => void
}

export default function AvatarCropModal({ isOpen, imageSrc, onClose, onCropComplete }: AvatarCropModalProps) {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleZoomIn = () => setScale(s => Math.min(s + 0.1, 3))
  const handleZoomOut = () => setScale(s => Math.max(s - 0.1, 0.5))
  const handleReset = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
  }, [position])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    })
  }, [isDragging, dragStart])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const getCroppedImage = useCallback(() => {
    if (!imageRef.current || !containerRef.current) return

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const size = 400
    canvas.width = size
    canvas.height = size

    const img = imageRef.current
    const container = containerRef.current
    const containerRect = container.getBoundingClientRect()
    const containerSize = containerRect.width

    // Calculate the source coordinates
    const sourceSize = Math.min(img.naturalWidth, img.naturalHeight)
    const sourceX = (img.naturalWidth - sourceSize) / 2
    const sourceY = (img.naturalHeight - sourceSize) / 2

    // Draw circular clip
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.clip()

    // Draw the image with transformations
    const drawSize = sourceSize / scale
    const offsetX = (size - drawSize) / 2 + position.x * (sourceSize / containerSize) / scale
    const offsetY = (size - drawSize) / 2 + position.y * (sourceSize / containerSize) / scale

    ctx.drawImage(
      img,
      sourceX, sourceY, sourceSize, sourceSize,
      offsetX, offsetY, drawSize, drawSize
    )

    canvas.toBlob((blob) => {
      if (blob) {
        onCropComplete(blob)
      }
    }, 'image/jpeg', 0.9)
  }, [position, scale, onCropComplete])

  if (!isOpen || !imageSrc) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Կտրել նկարը</h3>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Crop Area */}
          <div className="p-4">
            <div
              ref={containerRef}
              className="relative w-full aspect-square bg-slate-100 rounded-xl overflow-hidden cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Grid overlay */}
              <div className="absolute inset-0 pointer-events-none z-10">
                <div className="absolute inset-0 border-2 border-white/50 rounded-full" />
                <div className="absolute inset-4 border border-white/30 rounded-full" />
                <div className="absolute top-1/2 left-0 right-0 h-px bg-white/30" />
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/30" />
              </div>

              {/* Image */}
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Crop"
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                }}
                draggable={false}
              />

              {/* Instructions */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full pointer-events-none">
                Քաշեք և մեծացրեք
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                onClick={handleZoomOut}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <ZoomOut className="w-5 h-5 text-slate-600" />
              </button>
              <span className="text-sm font-medium text-slate-600 min-w-[60px] text-center">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <ZoomIn className="w-5 h-5 text-slate-600" />
              </button>
              <button
                onClick={handleReset}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors ml-2"
              >
                <RotateCcw className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-slate-100 flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-xl"
            >
              Չեղարկել
            </Button>
            <Button
              onClick={getCroppedImage}
              className="flex-1 rounded-xl bg-violet-600 hover:bg-violet-700"
            >
              <Check className="w-4 h-4 mr-2" />
              Պահպանել
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
