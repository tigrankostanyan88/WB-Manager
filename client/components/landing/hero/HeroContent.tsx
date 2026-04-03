'use client'

import { Button } from '@/components/ui/button'
import { ChevronRight, Globe, Play, Users, Zap } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import type { HeroSectionProps } from './types'

interface HeroContentProps {
  content: HeroSectionProps['content']
  onOpenModal: HeroSectionProps['onOpenModal']
  onPlayVideo: () => void
}

export function HeroContent({ content, onOpenModal, onPlayVideo }: HeroContentProps) {
  const { isLoggedIn } = useAuth()
  return (
    <div className="flex flex-col gap-8">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 self-start rounded-full bg-slate-50 border border-slate-100 px-4 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition-all hover:bg-slate-100 hover:border-slate-200">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-3 bg-violet-400 opacity-75" />
          <span className="relative inline-flex rounded-3 h-2 w-2 bg-violet-500" />
        </span>
        {content?.name || 'WB Mastery · Wildberries Academy'}
      </div>

      {/* Title & Description */}
      <div className="space-y-6 overflow-hidden">
        <h1 className="text-2xl sm:text-5xl md:text-6xl xl:text-7xl/none font-black tracking-tight text-slate-900 break-words">
          {content?.title || 'Սովորեք Ուայլդբերիի Մասնագետից'}
        </h1>
        <p className="max-w-[600px] text-slate-500 text-sm sm:text-lg md:text-xl leading-relaxed">
          {content?.text || 'Սովորեք քայլ առ քայլ՝ սկսած հաշվարկներից մինչև վաճառքի մասշտաբավորում՝ իրական փորձի հիման վրա։'}
        </p>
      </div>

      {/* CTA Buttons - Change based on login status */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {isLoggedIn ? (
          // Logged in users - show video play button
          <Button
            className="rounded-full h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-bold bg-violet-600 text-white hover:bg-violet-700 transition-all shadow-xl shadow-violet-200 hover:shadow-violet-300 hover:scale-105 active:scale-95 w-full sm:w-auto"
            onClick={onPlayVideo}
          >
            <Play className="mr-2 h-5 w-5 fill-white" /> Դիտել ներածություն
          </Button>
        ) : (
          // Not logged in - show registration button
          <Button
            className="rounded-full h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-bold bg-slate-900 text-white hover:bg-violet-600 transition-all shadow-xl shadow-slate-200 hover:shadow-violet-200 hover:scale-105 active:scale-95 w-full sm:w-auto"
            onClick={onOpenModal}
          >
            Սկսել հիմա <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        )}
        <Link href="/course" prefetch={true} className="w-full sm:w-auto">
          <Button
            variant="outline"
            className="rounded-full h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-bold border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all w-full"
          >
            Դիտել դասընթացները
          </Button>
        </Link>
      </div>

      {/* Tags */}
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
  )
}
