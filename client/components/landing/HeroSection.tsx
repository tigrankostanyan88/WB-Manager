'use client'

import { Button } from '@/components/ui/button'
import {
  ChevronRight,
  Globe,
  Play,
  Star,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { useState, useCallback, useEffect } from 'react'
import api from '@/lib/api'
import { VideoPlayerModal } from '@/components/shared'

interface HeroContent {
  id: number
  title: string
  name: string
  text: string
  video_url?: string
  thumbnail_time?: number
}

interface Review {
  id: number | string
  name?: string
  rating?: number
  comment?: string
  createdAt?: string
}

interface HeroSectionProps {
  isPlaying: boolean
  videoError: string | null
  onPlayVideo: () => void
  onVideoError: () => void
  onOpenModal: () => void
  content: HeroContent | null
}

const AVATAR_INDICES = [1, 2, 3] as const

export function HeroSection({
  isPlaying,
  videoError,
  onPlayVideo,
  onVideoError,
  onOpenModal,
  content,
}: HeroSectionProps) {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)
  const [latestReviews, setLatestReviews] = useState<Review[]>([])

  // Fetch latest reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get('/api/v1/reviews')
        const responseData = res.data?.data as { reviews?: Review[] }
        const list = Array.isArray(responseData?.reviews) ? responseData.reviews : []
        setLatestReviews(list.slice(0, 3))
      } catch {
        // Fail silently - reviews are optional
      }
    }
    fetchReviews()
  }, [])

  const handleVideoClick = useCallback(() => {
    const videoUrl = content?.video_url || '/files/hero.mp4'
    setPlayingVideo(videoUrl)
  }, [content?.video_url])

  const handleThumbnailLoaded = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const video = e.currentTarget
      const thumbnailTime = content?.thumbnail_time
      const seekTime = thumbnailTime !== undefined && thumbnailTime > 0 
        ? thumbnailTime 
        : Math.min(45, video.duration / 2 || 0)
      if (seekTime > 0) {
        video.currentTime = seekTime
      }
    },
    [content?.thumbnail_time]
  )

  return (
    <section
      id="hero"
      className="relative w-full pt-32 md:pt-40 lg:pt-48 pb-20 md:pb-32 overflow-hidden bg-slate-50/30"
    >
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-gradient-to-br from-violet-400/20 via-fuchsia-400/20 to-purple-400/20 rounded-full blur-[120px]" />
        <div className="absolute top-[0%] right-[-15%] w-[600px] h-[600px] bg-gradient-to-bl from-fuchsia-400/20 via-pink-400/20 to-rose-400/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[20%] left-[10%] w-[700px] h-[700px] bg-gradient-to-tr from-violet-400/20 via-indigo-400/20 to-blue-400/20 rounded-full blur-[120px]" />
      </div>

      <div className="container relative z-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
          <div className="flex flex-col gap-8">
            <div className="inline-flex items-center gap-2 self-start rounded-full bg-slate-50 border border-slate-100 px-4 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition-all hover:bg-slate-100 hover:border-slate-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-3 bg-violet-400 opacity-75" />
                <span className="relative inline-flex rounded-3 h-2 w-2 bg-violet-500" />
              </span>
              {content?.name || 'WB Mastery · Wildberries Academy'}
            </div>

            <div className="space-y-6 overflow-hidden">
              <h1 className="text-2xl sm:text-5xl md:text-6xl xl:text-7xl/none font-black tracking-tight text-slate-900 break-words">
                {content?.title || 'Սովորեք Ուայլդբերիի Մասնագետից'}
              </h1>
              <p className="max-w-[600px] text-slate-500 text-sm sm:text-lg md:text-xl leading-relaxed">
                {content?.text || 'Սովորեք քայլ առ քայլ՝ սկսած հաշվարկներից մինչև վաճառքի մասշտաբավորում՝ իրական փորձի հիման վրա։'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                className="rounded-full h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-bold bg-slate-900 text-white hover:bg-violet-600 transition-all shadow-xl shadow-slate-200 hover:shadow-violet-200 hover:scale-105 active:scale-95 w-full sm:w-auto"
                onClick={onOpenModal}
              >
                Սկսել հիմա <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Link href="/course" prefetch={true} className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="rounded-full h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-bold border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all w-full"
                >
                  Դիտել ծրագիրը
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-2.5 py-1 sm:px-4 sm:py-2 text-xs font-medium text-violet-700 ring-1 ring-violet-100">
                <Zap className="h-3.5 w-3.5 fill-current" />
                Արագ արդյունք
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-fuchsia-50 px-2.5 py-1 sm:px-4 sm:py-2 text-xs font-medium text-fuchsia-700 ring-1 ring-fuchsia-100">
                <Users className="h-3.5 w-3.5 fill-current" />
                Փակ համայնք
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 sm:px-4 sm:py-2 text-xs font-medium text-blue-700 ring-1 ring-blue-100">
                <Globe className="h-3.5 w-3.5" />
                Տեսադասեր
              </span>
            </div>
          </div>

          <div className="relative group perspective-1000 w-full">
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200 bg-white ring-1 ring-slate-100 transform transition-transform duration-700 group-hover:rotate-y-2 group-hover:scale-[1.02] cursor-pointer"
              onClick={handleVideoClick}>
              <div className="aspect-[16/10] w-full relative overflow-hidden bg-slate-100">
                {/* Video Thumbnail - shows preview frame like ModulesTab */}
                <video
                  src={content?.video_url || '/files/hero.mp4'}
                  className="h-full w-full object-cover scale-105 transition-transform duration-700 group-hover:scale-100 opacity-90 group-hover:opacity-100"
                  preload="metadata"
                  muted
                  playsInline
                  onLoadedMetadata={handleThumbnailLoaded}
                  onError={onVideoError}
                />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-all">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-white/30 rounded-full blur-xl transform scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="relative grid place-items-center h-20 w-20 rounded-full bg-white shadow-2xl shadow-violet-500/30 ring-1 ring-white/50 transform transition-all duration-300 group-hover:scale-110">
                      <Play className="h-8 w-8 text-slate-900 fill-slate-900 ml-1" />
                    </span>
                  </div>
                </div>

                {videoError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-400 text-sm">
                    Video placeholder
                  </div>
                )}
              </div>
            </div>

            {playingVideo && (
              <VideoPlayerModal 
                videoUrl={playingVideo} 
                onClose={() => setPlayingVideo(null)} 
              />
            )}

            {/* Latest Reviews Widget - Bottom Left */}
            {latestReviews.length > 0 && (
              <div className="absolute -bottom-3 -left-3 rotate-[5deg] hidden lg:flex items-center gap-3 p-4 bg-white rounded-2xl shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 transform transition-transform duration-500 hover:scale-105">
                {/* Overlapping Avatars */}
                <div className="flex -space-x-2">
                  {latestReviews.slice(0, 3).map((review, idx) => (
                    <div 
                      key={review.id || idx}
                      className="relative w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white overflow-hidden"
                    >
                      {review.name?.charAt(0).toUpperCase() || 'Ո'}
                    </div>
                  ))}
                </div>
                
                {/* Rating & Count */}
                <div className="flex flex-col leading-none">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-bold text-slate-900">
                      {(latestReviews.reduce((acc, r) => acc + (r.rating || 5), 0) / latestReviews.length).toFixed(1)}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {latestReviews.length}+ կարծիք
                  </span>
                </div>
              </div>
            )}

            <div className="absolute -top-6 -right-6 hidden lg:flex flex-col gap-2 p-4 bg-white rounded-2xl shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 transform rotate-3 transition-transform duration-500 hover:rotate-0 hover:scale-110">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Ամսական աճ</p>
                  <p className="text-lg font-bold text-slate-900">+340%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
