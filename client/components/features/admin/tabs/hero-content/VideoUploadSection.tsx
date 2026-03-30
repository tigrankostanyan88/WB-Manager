'use client'

import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, X, Film, Clock } from 'lucide-react'
import { VideoFrameScrubber } from './VideoFrameScrubber'

interface VideoUploadSectionProps {
  videoPreview: string | null
  videoFile: File | null
  thumbnailTime: number
  onThumbnailTimeChange: (time: number) => void
  onFileSelect: () => void
  onClear: () => void
  onVideoChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function VideoUploadSection({
  videoPreview,
  videoFile,
  thumbnailTime,
  onThumbnailTimeChange,
  onFileSelect,
  onClear,
  onVideoChange
}: VideoUploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="mb-10">
      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
        <Film className="w-4 h-4" /> Հերո վիդեո
      </p>

      {videoPreview ? (
        <div className="space-y-4">
          {/* Frame Scrubber - visual frame selector */}
          <VideoFrameScrubber
            videoUrl={videoPreview}
            thumbnailTime={thumbnailTime}
            onTimeChange={onThumbnailTimeChange}
          />

          {/* Thumbnail Time Input */}
          <div className="flex items-center gap-4 bg-slate-50 rounded-2xl p-4">
            <Clock className="w-5 h-5 text-slate-400" />
            <div className="flex-1">
              <label className="text-xs font-bold text-slate-600 block mb-1">
                Կադրի ժամանակը (վայրկյան)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={thumbnailTime}
                readOnly
                className="w-full h-10 bg-white border border-slate-200 rounded-xl px-3 text-sm font-medium focus:ring-2 focus:ring-violet-500 outline-none"
                placeholder="Օր․՝ 10.5"
              />
            </div>
            <p className="text-xs text-slate-400 max-w-[200px]">
              Ձախ-աջ քաշեք կադրը ընտրելու համար
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
              {videoFile ? (
                <span className="text-violet-600 font-medium">Նոր վիդեո՝ {videoFile.name}</span>
              ) : (
                <span className="text-slate-400">Ներկայիս վիդեո</span>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onFileSelect}
                className="rounded-xl h-10 px-4 font-bold text-sm border-slate-200"
              >
                <Upload className="w-4 h-4 mr-2" />
                Փոխել վիդեոն
              </Button>
              {videoFile && (
                <Button
                  variant="outline"
                  onClick={onClear}
                  className="rounded-xl h-10 px-4 font-bold text-sm border-slate-200 text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Չեղարկել
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center cursor-pointer hover:border-violet-400 hover:bg-violet-50/50 transition-colors"
          onClick={onFileSelect}
        >
          <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-violet-600" />
          </div>
          <p className="text-sm font-bold text-slate-700 mb-2">Վերբեռնել վիդեո</p>
          <p className="text-xs text-slate-400">MP4, AVI, MOV, MKV (առավելագույնը 500MB)</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={onVideoChange}
      />
    </div>
  )
}
