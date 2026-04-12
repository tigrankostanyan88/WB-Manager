'use client'

import { useState, useCallback } from 'react'
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
  onSkipCrop?: () => void // Use full image without cropping
}

export function CropModal({ open, cropImage, crop, zoom, setCrop, setZoom, onCropComplete, onClose, onConfirm, onSkipCrop }: CropModalProps) {
  const [cropWidth, setCropWidth] = useState(300)
  const [cropHeight, setCropHeight] = useState(300)

  if (!open || !cropImage) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[600px]">
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
            cropSize={{ width: cropWidth, height: cropHeight }}
            objectFit="contain"
            showGrid={true}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>

        {/* Custom crop dimensions */}
        <div className="px-6 pt-4 pb-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-500">Լայնություն (px)</label>
              <input
                type="number"
                value={cropWidth}
                onChange={(e) => setCropWidth(Number(e.target.value))}
                min={50}
                max={800}
                className="w-20 px-2 py-1 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-500">Բարձրություն (px)</label>
              <input
                type="number"
                value={cropHeight}
                onChange={(e) => setCropHeight(Number(e.target.value))}
                min={50}
                max={800}
                className="w-20 px-2 py-1 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 space-y-4">
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
            {onSkipCrop && (
              <Button variant="ghost" onClick={onSkipCrop} className="rounded-xl font-bold text-slate-600 hover:text-slate-900">
                Չկտրել
              </Button>
            )}
            <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold">
              Չեղարկել
            </Button>
            <Button type="button" onClick={onConfirm} className="rounded-xl bg-slate-900 hover:bg-slate-800 font-bold px-6">
              Հաստատել
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

