'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Play, X, Upload, Film, Save, Trash2, Type, FileText, Clock, Scissors } from 'lucide-react'
import { useState, useRef, useCallback, useEffect } from 'react'
import type { HeroContentForm } from '../../_hooks/useHeroContent'

// Video Frame Scrubber Component - allows dragging to select thumbnail frame
function VideoFrameScrubber({ 
  videoUrl, 
  thumbnailTime, 
  onTimeChange 
}: { 
  videoUrl: string; 
  thumbnailTime: number; 
  onTimeChange: (time: number) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [duration, setDuration] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Update canvas when time changes
  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || !duration) return

    const drawFrame = () => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      
      canvas.width = video.videoWidth || 640
      canvas.height = video.videoHeight || 360
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    }

    const seekAndDraw = () => {
      video.currentTime = thumbnailTime
      video.addEventListener('seeked', drawFrame, { once: true })
    }

    seekAndDraw()
  }, [thumbnailTime, duration])

  // Handle video loaded
  const handleLoadedMetadata = () => {
    const video = videoRef.current
    if (!video) return
    setDuration(video.duration)
    // Seek to initial time
    video.currentTime = thumbnailTime || Math.min(45, video.duration / 2)
  }

  // Calculate time from mouse position
  const getTimeFromPosition = (clientX: number) => {
    const container = containerRef.current
    if (!container || !duration) return 0
    
    const rect = container.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(1, x / rect.width))
    return percentage * duration
  }

  // Handle mouse/touch events
  const handleStart = (clientX: number) => {
    setIsDragging(true)
    const time = getTimeFromPosition(clientX)
    onTimeChange(Math.round(time * 10) / 10)
  }

  const handleMove = (clientX: number) => {
    if (!isDragging) return
    const time = getTimeFromPosition(clientX)
    onTimeChange(Math.round(time * 10) / 10)
  }

  const handleEnd = () => {
    setIsDragging(false)
  }

  // Mouse events
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleStart(e.clientX)
  }

  const onMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX)
  }

  const onMouseUp = () => {
    handleEnd()
  }

  const onMouseLeave = () => {
    handleEnd()
  }

  // Touch events
  const onTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX)
  }

  const onTouchEnd = () => {
    handleEnd()
  }

  const progressPercentage = duration ? (thumbnailTime / duration) * 100 : 0

  // Format time as MM:SS.ms
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    const ms = Math.floor((seconds % 1) * 10)
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms}`
  }

  return (
    <div className="space-y-3">
      {/* Hidden video for frame extraction */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="hidden"
        preload="metadata"
        crossOrigin="anonymous"
        onLoadedMetadata={handleLoadedMetadata}
      />
      
      {/* Canvas showing current frame */}
      <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-video">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover"
        />
        
        {/* Current time indicator on canvas */}
        <div className="absolute top-3 right-3 bg-black/70 text-white text-sm font-bold px-3 py-1.5 rounded-lg backdrop-blur-sm">
          {formatTime(thumbnailTime)}
        </div>
        
        {/* Instruction overlay */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm flex items-center gap-2">
          <Scissors className="w-3.5 h-3.5" />
          Ձախ-աջ քաշեք կադրը ընտրելու համար
        </div>
      </div>

      {/* Scrubber bar */}
      <div
        ref={containerRef}
        className="relative h-12 bg-slate-100 rounded-xl cursor-pointer select-none touch-none"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Progress track */}
        <div className="absolute inset-y-0 left-0 bg-violet-500/20 rounded-l-xl transition-all" style={{ width: `${progressPercentage}%` }} />
        
        {/* Progress bar */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 h-2 bg-violet-500 rounded-full transition-all"
          style={{ width: `${progressPercentage}%`, left: 0 }}
        />
        
        {/* Handle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-2 border-violet-500 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95"
          style={{ left: `calc(${progressPercentage}% - 12px)` }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-violet-500 rounded-full" />
          </div>
        </div>
        
        {/* Time markers */}
        <div className="absolute inset-x-0 bottom-1 flex justify-between px-3 text-[10px] text-slate-400 font-medium">
          <span>0:00</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  )
}

// Video Player Modal
function VideoPlayerModal({ videoUrl, onClose }: { videoUrl: string; onClose: () => void }) {
  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <video
          src={videoUrl}
          controls
          autoPlay
          playsInline
          crossOrigin="anonymous"
          preload="auto"
          className="w-full aspect-video"
          key={videoUrl}
        />
      </div>
    </div>
  )
}

interface HeroContentTabProps {
  form: HeroContentForm
  setForm: React.Dispatch<React.SetStateAction<HeroContentForm>>
  isLoading: boolean
  isSubmitting: boolean
  videoFile: File | null
  videoPreview: string | null
  handleVideoChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  clearVideo: () => void
  submitContent: () => void
  deleteContent: () => void
}

export default function HeroContentTab({
  form,
  setForm,
  isLoading,
  isSubmitting,
  videoFile,
  videoPreview,
  handleVideoChange,
  clearVideo,
  submitContent,
  deleteContent
}: HeroContentTabProps) {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleVideoClick = useCallback(() => {
    if (videoPreview) {
      setPlayingVideo(videoPreview)
    }
  }, [videoPreview])

  if (isLoading) {
    return (
      <motion.div
        key="hero-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex items-center justify-center h-64"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600" />
      </motion.div>
    )
  }

  return (
    <motion.div
      key="hero-content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-black text-slate-900">Գլխավոր էջի բովանդակություն</h3>
      </div>

      <Card className="shadow-sm rounded-[2.5rem] bg-white border border-slate-100 overflow-hidden">
        <CardContent className="p-10">
          {/* Video Upload Section */}
          <div className="mb-10">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Film className="w-4 h-4" /> Հերո վիդեո
            </p>
            
            {videoPreview ? (
              <div className="space-y-4">
                {/* Frame Scrubber - visual frame selector */}
                <VideoFrameScrubber
                  videoUrl={videoPreview}
                  thumbnailTime={form.thumbnail_time || 0}
                  onTimeChange={(time) => setForm(prev => ({ ...prev, thumbnail_time: time }))}
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
                      value={form.thumbnail_time || 0}
                      onChange={(e) => setForm(prev => ({ ...prev, thumbnail_time: parseFloat(e.target.value) || 0 }))}
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
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-xl h-10 px-4 font-bold text-sm border-slate-200"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Փոխել վիդեոն
                    </Button>
                    {videoFile && (
                      <Button
                        variant="outline"
                        onClick={clearVideo}
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
                onClick={() => fileInputRef.current?.click()}
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
              onChange={handleVideoChange}
            />
          </div>

          {/* Text Fields */}
          <div className="grid grid-cols-1 gap-8">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Type className="w-4 h-4" /> Անվանում (Name)
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full h-14 bg-slate-50 border-none rounded-2xl px-4 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-violet-500 outline-none transition-all"
                placeholder="WB Mastery · Wildberries Academy"
              />
            </div>

            {/* Title Field */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Type className="w-4 h-4" /> Վերնագիր (Title)
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full h-14 bg-slate-50 border-none rounded-2xl px-4 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-violet-500 outline-none transition-all"
                placeholder="Սկսեք ձեր բիզնեսը"
              />
            </div>

            {/* Text Field */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Տեքստ (Text)
              </label>
              <textarea
                value={form.text}
                onChange={(e) => setForm(prev => ({ ...prev, text: e.target.value }))}
                className="w-full min-h-[120px] bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-violet-500 outline-none transition-all resize-none"
                placeholder="Սովորեք քայլ առ քայլ՝ սկսած հաշվարկներից մինչև վաճառքի մասշտաբավորում..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between">
            <Button
              onClick={submitContent}
              disabled={isSubmitting}
              className="bg-slate-900 text-white hover:bg-slate-800 rounded-2xl h-14 px-10 font-black text-sm shadow-xl flex items-center gap-3 transition-all active:scale-95"
            >
              <Save className="w-5 h-5" />
              {isSubmitting ? 'Պահպանվում է...' : 'Պահպանել փոփոխությունները'}
            </Button>
            
            <Button
              onClick={deleteContent}
              disabled={isSubmitting}
              variant="outline"
              className="rounded-2xl h-14 px-6 font-black text-sm border-red-200 text-red-500 hover:text-red-600 hover:bg-red-50 flex items-center gap-3 transition-all active:scale-95"
            >
              <Trash2 className="w-5 h-5" />
              Ջնջել
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Video Player Modal */}
      {playingVideo && (
        <VideoPlayerModal 
          videoUrl={playingVideo} 
          onClose={() => setPlayingVideo(null)} 
        />
      )}
    </motion.div>
  )
}
