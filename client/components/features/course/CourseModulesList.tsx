'use client'

import Image from 'next/image'
import { Lock, Play, FileText } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { VideoThumbnail } from './VideoThumbnail'
import { VideoPlayerModal } from './VideoPlayerModal'
import { useState, useEffect } from 'react'

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

export function CourseModulesList({ modules }: CourseModulesListProps) {
  const [playingVideo, setPlayingVideo] = useState<VideoItem | null>(null)
  const [openModule, setOpenModule] = useState<string | undefined>(undefined)

  // Listen for START COURSE click - client-side only
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const checkAndPlay = () => {
      const videoId = localStorage.getItem('playVideoId')
      if (videoId) {
        // Find and play the video
        for (let i = 0; i < modules.length; i++) {
          const module = modules[i]
          const video = module.videos.find(v => String(v.id) === videoId && !v.isLocked && v.videoUrl)
          if (video) {
            setOpenModule(`module-${i}`)
            setPlayingVideo(video)
            localStorage.removeItem('playVideoId')
            break
          }
        }
      }
    }

    // Check immediately and also set up storage event listener
    checkAndPlay()
    window.addEventListener('storage', checkAndPlay)
    
    // Custom event for same-tab communication
    const handleCustomEvent = () => checkAndPlay()
    window.addEventListener('startCourse', handleCustomEvent)
    
    return () => {
      window.removeEventListener('storage', checkAndPlay)
      window.removeEventListener('startCourse', handleCustomEvent)
    }
  }, [modules])

  const handleVideoClick = (video: VideoItem) => {
    if (video.isLocked || !video.videoUrl) return
    setPlayingVideo(video)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-black text-slate-900">Դասընթացի բովանդակությունը</h2>
      
      <Accordion type="single" collapsible value={openModule} onValueChange={setOpenModule} className="space-y-3 w-full">
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
                        <VideoThumbnail videoUrl={video.videoUrl} time={15} className="opacity-90" />
                      ) : video.thumbnail ? (
                        <Image
                          src={video.thumbnail}
                          alt={video.title}
                          fill
                          className="object-cover opacity-90"
                          sizes="80px"
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

      {/* Video Player Modal - Reusable Component */}
      <VideoPlayerModal
        isOpen={!!playingVideo}
        onClose={() => setPlayingVideo(null)}
        videoUrl={playingVideo?.videoUrl}
        title={playingVideo?.title}
        duration={playingVideo?.duration}
      />
    </div>
  )
}
