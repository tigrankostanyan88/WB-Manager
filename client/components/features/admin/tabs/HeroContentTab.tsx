'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { useState, useRef, useCallback } from 'react'
import type { HeroContentForm } from '../hooks/useHeroContent'
import { VideoPlayerModal } from '@/components/shared'
import { VideoUploadSection, TextFieldsSection, ActionButtons } from './hero-content'

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

export function HeroContentTab({
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

  const handleFileSelect = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleThumbnailTimeChange = useCallback((time: number) => {
    setForm(prev => ({ ...prev, thumbnail_time: time }))
  }, [setForm])

  const handleNameChange = useCallback((value: string) => {
    setForm(prev => ({ ...prev, name: value }))
  }, [setForm])

  const handleTitleChange = useCallback((value: string) => {
    setForm(prev => ({ ...prev, title: value }))
  }, [setForm])

  const handleTextChange = useCallback((value: string) => {
    setForm(prev => ({ ...prev, text: value }))
  }, [setForm])

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
          <VideoUploadSection
            videoPreview={videoPreview}
            videoFile={videoFile}
            thumbnailTime={form.thumbnail_time || 0}
            onThumbnailTimeChange={handleThumbnailTimeChange}
            onFileSelect={handleFileSelect}
            onClear={clearVideo}
            onVideoChange={handleVideoChange}
          />

          <TextFieldsSection
            name={form.name}
            title={form.title}
            text={form.text}
            onNameChange={handleNameChange}
            onTitleChange={handleTitleChange}
            onTextChange={handleTextChange}
          />

          <ActionButtons
            isSubmitting={isSubmitting}
            onSubmit={submitContent}
            onDelete={deleteContent}
          />
        </CardContent>
      </Card>

      {/* Video Player Modal */}
      {playingVideo && (
        <VideoPlayerModal
          videoUrl={playingVideo}
          onClose={() => setPlayingVideo(null)}
        />
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleVideoChange}
      />
    </motion.div>
  )
}
