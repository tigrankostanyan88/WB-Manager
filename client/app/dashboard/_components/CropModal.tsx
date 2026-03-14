'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Cropper from 'react-easy-crop'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Area, Point } from 'react-easy-crop'

interface CropModalProps {
  open: boolean
  cropImage: string | null
  crop: Point
  zoom: number
  setCrop: (p: Point) => void
  setZoom: (z: number) => void
  onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void
  onClose: () => void
  onConfirm: () => void
}

export default function CropModal({ open, cropImage, crop, zoom, setCrop, setZoom, onCropComplete, onClose, onConfirm }: CropModalProps) {
  return (
    <AnimatePresence>
      {open && cropImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">Խմբագրել նկարը</h3>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="relative w-full h-80 bg-slate-900">
              <Cropper
                image={cropImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>Մոտեցնել</span>
                  <span>{zoom.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold">
                  Չեղարկել
                </Button>
                <Button onClick={onConfirm} className="rounded-xl bg-slate-900 hover:bg-slate-800 font-bold px-6">
                  Հաստատել
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

