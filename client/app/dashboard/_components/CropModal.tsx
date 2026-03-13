'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface CropModalProps {
  open: boolean
  cropImage: string
  crop: { x: number; y: number }
  zoom: number
  setCrop: (crop: { x: number; y: number }) => void
  setZoom: (zoom: number) => void
  onCropComplete: (croppedArea: any, croppedAreaPixels: any) => void
  onClose: () => void
  onConfirm: () => void
}

export default function CropModal({
  open,
  cropImage,
  zoom,
  setZoom,
  onClose,
  onConfirm
}: CropModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  if (!open || !cropImage) return null

  const handleConfirm = async () => {
    setIsProcessing(true)
    try {
      await onConfirm()
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900">Կտրվել պատկերը</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="relative aspect-video bg-slate-100 rounded-xl overflow-hidden">
            <img
              src={cropImage}
              alt="Crop preview"
              className="w-full h-full object-contain"
            />
          </div>
          
          <div className="mt-4">
            <label className="text-sm font-medium text-slate-700">Խոշորացում</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full mt-2"
            />
          </div>
        </div>
        
        <div className="flex gap-3 p-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-slate-700 font-medium hover:bg-slate-50 rounded-xl transition-colors"
          >
            Չեղարկել
          </button>
          <button
            onClick={handleConfirm}
            disabled={isProcessing}
            className="flex-1 px-4 py-2.5 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-50"
          >
            {isProcessing ? 'Պահպանվում է...' : 'Հաստատել'}
          </button>
        </div>
      </div>
    </div>
  )
}
