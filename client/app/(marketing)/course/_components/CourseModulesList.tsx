'use client'

import { Lock, Play, FileText, X } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import VideoThumbnail from './VideoThumbnail'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface VideoItem {
  id: string | number
  title: string
  thumbnail?: string
  duration: string
  fileName?: string
  type: 'video' | 'file'
  isLocked: boolean
  videoUrl?: string
}

export interface ModuleWithVideos {
  id: string | number
  title: string
  lectures: number
  duration: string
  videos: VideoItem[]
}

interface CourseModulesListProps {
  modules: ModuleWithVideos[]
}

export default function CourseModulesList({ modules }: CourseModulesListProps) {
  const [playingVideo, setPlayingVideo] = useState<VideoItem | null>(null)

  const handleVideoClick = (video: VideoItem) => {
    if (video.isLocked || !video.videoUrl) return
    setPlayingVideo(video)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-black text-slate-900">Դասընթացի բովանդակությունը</h2>
      
      <Accordion type="single" collapsible className="space-y-3 w-full">
        {modules.map((module, moduleIndex) => (
          <AccordionItem 
            key={module.id || moduleIndex} 
            value={`module-${moduleIndex}`} 
            className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm"
          >
            <AccordionTrigger className="px-6 py-4 hover:bg-slate-50 hover:no-underline transition-colors">
              <div className="flex items-center gap-4 text-left w-full">
                <span className="font-black text-slate-900 text-lg flex-1">{module.title}</span>
                <span className="text-xs font-medium text-slate-500 hidden sm:block shrink-0">
                  {module.videos.length} դաս • {module.duration}
                </span>
              </div>
            </AccordionTrigger>
            
            <AccordionContent className="bg-slate-50/50 border-t border-slate-100">
              <div className="p-4 space-y-3">
                {module.videos.map((video, videoIndex) => (
                  <div
                    key={video.id || videoIndex}
                    onClick={() => handleVideoClick(video)}
                    className={`
                      flex items-center gap-4 p-3 bg-white rounded-xl border border-slate-200
                      ${video.isLocked 
                        ? 'opacity-80 cursor-not-allowed' 
                        : 'hover:border-violet-300 hover:shadow-sm transition-all cursor-pointer'
                      }
                    `}
                  >
                    {/* Video Thumbnail */}
                    <div className="relative shrink-0 w-32 aspect-video rounded-lg overflow-hidden bg-slate-900">
                      {video.videoUrl && !video.isLocked ? (
                        <VideoThumbnail videoUrl={video.videoUrl} className="opacity-90" />
                      ) : video.thumbnail ? (
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          className="w-full h-full object-cover opacity-90"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-violet-600 to-indigo-700" />
                      )}
                      
                      {/* Play Button Overlay - only if not locked */}
                      {!video.isLocked && video.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                            <Play className="w-4 h-4 text-slate-900 fill-slate-900 ml-0.5" />
                          </div>
                        </div>
                      )}
                      
                      {/* File icon for non-video */}
                      {video.type === 'file' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                            <FileText className="w-4 h-4 text-slate-600" />
                          </div>
                        </div>
                      )}
                      
                      {/* Duration Badge */}
                      <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/70 rounded text-[10px] font-bold text-white">
                        {video.duration}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 text-sm mb-0.5 truncate">{video.title}</h3>
                      <p className="text-xs text-slate-500">Տևողություն՝ {video.duration}</p>
                    </div>

                    {/* Lock Icon - on the RIGHT side */}
                    {video.isLocked && (
                      <div className="shrink-0 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-slate-400" />
                      </div>
                    )}
                  </div>
                ))}
                
                {module.videos.length === 0 && (
                  <div className="text-center py-4 text-sm text-slate-500 italic">
                    Վիդեո դասեր չկան
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {/* Video Player Modal */}
      <AnimatePresence>
        {playingVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setPlayingVideo(null)}
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
                onClick={() => setPlayingVideo(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Video player - absolute fill to prevent letterboxing */}
              <div className="relative aspect-video bg-black">
                {playingVideo.videoUrl ? (
                  <video
                    src={playingVideo.videoUrl}
                    controls
                    autoPlay
                    playsInline
                    className="absolute inset-0 w-full h-full bg-black object-cover"
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
              <div className="p-4 bg-slate-900">
                <h3 className="text-white font-bold">{playingVideo.title}</h3>
                <p className="text-slate-400 text-sm">Տևողություն՝ {playingVideo.duration}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
