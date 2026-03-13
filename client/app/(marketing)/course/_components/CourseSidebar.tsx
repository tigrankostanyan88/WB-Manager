import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Award, FileText, Infinity, Layers, Play, Smartphone } from 'lucide-react'
import { useEffect, useState } from 'react'

interface CourseSidebarProps {
  price: string
  originalPrice: string
  discount: string
  includes: string[]
  modules?: unknown[]
  isEnrolled?: boolean
}

export default function CourseSidebar({ price, originalPrice, discount, includes, modules, isEnrolled = false }: CourseSidebarProps) {
  const [thumbnail, setThumbnail] = useState<string | null>(null)
  const [thumbnailLoading, setThumbnailLoading] = useState(true)
  const apiBase = process.env.NEXT_PUBLIC_API_URL || ''
  const origin = /^https?:\/\//i.test(apiBase) ? apiBase.replace(/\/api.*$/, '') : ''

  // Get first video from first module
  const firstModule = modules?.[0] as { files?: Array<{ name?: string; ext?: string; name_used?: string }> } | undefined
  const videoFiles = firstModule?.files?.filter((f) => f.name_used === 'module_video') || []
  const firstVideo = videoFiles[0]
  const hasVideo = firstVideo?.name && firstVideo?.ext

  useEffect(() => {
    if (!hasVideo) {
      setThumbnailLoading(false)
      return
    }

    const videoPath = `/files/modules/${firstVideo.name}${firstVideo.ext}`
    const videoUrl = `${origin}${videoPath}`

    const video = document.createElement('video')
    video.crossOrigin = 'anonymous'
    video.src = videoUrl
    video.preload = 'metadata'

    video.onloadedmetadata = () => {
      // Seek to 30 seconds or the middle if video is shorter
      const seekTime = Math.min(30, video.duration / 2)
      video.currentTime = seekTime
    }

    video.onseeked = () => {
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth || 640
      canvas.height = video.videoHeight || 360
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        setThumbnail(canvas.toDataURL('image/jpeg', 0.8))
      }
      setThumbnailLoading(false)
    }

    video.onerror = () => {
      setThumbnailLoading(false)
    }
  }, [firstVideo, hasVideo, origin])

  const imageSrc = thumbnail || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop'

  return (
    <div className="lg:w-1/3 relative">
      <div className="sticky top-24 space-y-6">
        <Card className="border-0 shadow-2xl shadow-slate-200 rounded-2xl overflow-hidden bg-white ring-1 ring-slate-100">
          <div className="aspect-video relative bg-slate-900 group cursor-pointer overflow-hidden">
            {thumbnailLoading ? (
              <div className="w-full h-full bg-slate-800 animate-pulse" />
            ) : (
              <img
                src={imageSrc}
                alt="Preview"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-60 group-hover:scale-105 transition-all duration-500"
              />
            )}
            <div className="absolute inset-0 grid place-items-center">
              <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                <Play className="w-6 h-6 text-slate-900 fill-slate-900 ml-1" />
              </div>
            </div>
            <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
              Դիտել նախադիտումը
            </div>
          </div>
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-4xl font-black text-slate-900">{price}</span>
              <span className="text-lg text-slate-400 line-through font-medium">{originalPrice}</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md ml-auto">{discount}</span>
            </div>

            <div className="space-y-3">
              {isEnrolled ? (
                <Button 
                  disabled 
                  className="w-full h-12 rounded-xl bg-emerald-500 text-white text-base font-bold shadow-lg cursor-default"
                >
                  Ակտիվ
                </Button>
              ) : (
                <Button className="w-full h-12 rounded-xl bg-violet-600 hover:bg-violet-700 text-base font-bold shadow-lg shadow-violet-200 hover:shadow-violet-300 transition-all">
                  Գրանցվել հիմա
                </Button>
              )}
            </div>

            <div className="text-center text-xs text-slate-500 font-medium">30-օրյա գումարի վերադարձի երաշխիք</div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h4 className="font-bold text-slate-900 text-sm">Այս դասընթացը ներառում է՝</h4>
              <ul className="space-y-3 text-sm text-slate-600">
                {includes.map((text, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="p-1 rounded bg-violet-50 text-violet-600">
                      {idx === 0 ? (
                        <Layers className="w-4 h-4" />
                      ) : idx === 1 ? (
                        <FileText className="w-4 h-4" />
                      ) : idx === 2 ? (
                        <Infinity className="w-4 h-4" />
                      ) : idx === 3 ? (
                        <Smartphone className="w-4 h-4" />
                      ) : (
                        <Award className="w-4 h-4" />
                      )}
                    </div>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="bg-slate-900 rounded-2xl p-6 text-white text-center space-y-3 shadow-xl">
          <h4 className="font-bold text-lg">Վերապատրաստում թիմերի համար</h4>
          <p className="text-slate-300 text-sm leading-relaxed">Ստացեք հատուկ առաջարկ ձեր թիմի համար՝ կորպորատիվ ուսուցման փաթեթներով։</p>
          <Button variant="outline" className="w-full border-white/20 hover:bg-white/10 text- hover:text-white mt-2 bg-slate-900">
            Կապ հաստատել
          </Button>
        </div>
      </div>
    </div>
  )
}

