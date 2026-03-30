'use client'

import Image from 'next/image'
import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, ZoomIn, ZoomOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AvatarCropModalProps {
  isOpen: boolean
  imageSrc: string | null
  onClose: () => void
  onCropComplete: (croppedImage: Blob) => void
}

export function AvatarCropModal({ isOpen, imageSrc, onClose, onCropComplete }: AvatarCropModalProps) {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleReset = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    setPosition(prev => ({
      x: prev.x + e.movementX,
      y: prev.y + e.movementY
    }))
  }, [isDragging])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const getCroppedImage = useCallback(() => {
    if (!imageRef.current) return

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const size = 400
    canvas.width = size
    canvas.height = size

    const img = imageRef.current
    const naturalWidth = img.naturalWidth
    const naturalHeight = img.naturalHeight
    const minDimension = Math.min(naturalWidth, naturalHeight)
    
    // Draw circular clip
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.clip()

    // Calculate position to center the crop
    const scaledSize = minDimension * scale
    const offsetX = (size - scaledSize) / 2 + position.x
    const offsetY = (size - scaledSize) / 2 + position.y

    ctx.drawImage(
      img,
      0, 0, naturalWidth, naturalHeight,
      offsetX, offsetY, scaledSize, scaledSize
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
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-[400px] bg-white rounded-3xl shadow-2xl"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-violet-50 to-white rounded-t-3xl">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Պրոֆիլի նկար</h3>
              <p className="text-xs text-slate-500">Հարմարեցրեք նկարը կլոր շրջանակում</p>
            </div>
            <button 
              onClick={onClose} 
              className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
              aria-label="Փակել"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Crop Area */}
          <div className="p-5">
            <div className="flex flex-col items-center">
              {/* Circular Preview */}
              <div
                ref={containerRef}
                className="relative w-[220px] h-[220px] rounded-full overflow-hidden bg-slate-100 shadow-inner cursor-move ring-4 ring-violet-100"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <Image
                  ref={imageRef as React.Ref<HTMLImageElement>}
                  src={imageSrc}
                  alt="Preview"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 500px"
                  draggable={false}
                />
                
                {isDragging && (
                  <div className="absolute inset-0 bg-violet-500/10 pointer-events-none" />
                )}
              </div>

              {/* Zoom Controls */}
              <div className="mt-4 w-full max-w-[220px]">
                <div className="flex items-center gap-2">
                  <ZoomOut className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="range"
                    min="50"
                    max="300"
                    value={Math.round(scale * 100)}
                    onChange={(e) => setScale(Number(e.target.value) / 100)}
                    className="flex-1 h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-violet-600 min-w-0"
                  />
                  <ZoomIn className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
                <p className="text-center text-xs text-slate-400 mt-2">
                  {Math.round(scale * 100)}% • Քաշեք նկարը տեղափոխելու համար
                </p>
              </div>
            </div>
          </div>

          {/* Buttons - Grid layout, always visible */}
          <div className="px-5 pb-5 pt-2">
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                onClick={handleReset}
                className="rounded-xl h-11 text-xs font-medium"
              >
                Վերականգնել
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="rounded-xl h-11 text-xs font-medium"
              >
                Չեղարկել
              </Button>
              <Button
                onClick={getCroppedImage}
                className="rounded-xl h-11 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-lg shadow-violet-200"
              >
                <Check className="w-4 h-4 mr-1" />
                Հաստատել
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
