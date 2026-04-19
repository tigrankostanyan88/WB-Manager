'use client'

import { Button } from '@/components/ui/button'
import { ChevronRight, Globe, Play, Sparkles, Users, Zap } from 'lucide-react'
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
      <div>
        <div className="inline-flex items-center gap-3 self-start rounded-full bg-gradient-to-r from-violet-50 via-fuchsia-50 to-violet-50 border border-violet-200/50 px-5 py-2 text-sm font-semibold text-violet-700 shadow-lg shadow-violet-200/30 transition-all hover:shadow-violet-300/40 hover:scale-[1.02] cursor-default group">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-br from-violet-500 to-fuchsia-500" />
          </span>
          <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
            {content?.name || 'WB Mastery · Wildberries Academy'}
          </span>
          <Sparkles className="h-4 w-4 text-violet-500 group-hover:rotate-12 transition-transform" />
        </div>
      </div>

      {/* Title */}
      <div className="space-y-6 overflow-hidden">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-4 sm:mb-6 break-words leading-[1.1]">
          <span className="block">Սովորեք</span>
          <span className="block mt-2 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent">
            Wildberries
          </span>
          <span className="block mt-2">Ակադեմիայում</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-6 sm:mb-8 max-w-2xl leading-relaxed font-medium">
          {content?.text || 'Սովորեք քայլ առ քայլ՝ սկսած հաշվարկներից մինչև վաճառքի մասշտաբավորում՝ իրական փորձի հիման վրա։'}
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {isLoggedIn ? (
          <Button
            className="rounded-full h-14 sm:h-16 px-8 sm:px-10 text-base sm:text-lg font-bold bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 text-white hover:shadow-2xl hover:shadow-violet-400/40 transition-all w-full sm:w-auto group"
            onClick={onPlayVideo}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative flex items-center">
              <Play className="mr-2 h-5 w-5 fill-white" /> Դիտել ներածություն
            </span>
          </Button>
        ) : (
          <Button
            className="rounded-full h-14 sm:h-16 px-8 sm:px-10 text-base sm:text-lg font-bold bg-slate-900 text-white hover:shadow-2xl hover:shadow-slate-400/40 transition-all w-full sm:w-auto group"
            onClick={onOpenModal}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative flex items-center">
              Սկսել հիմա <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>
        )}
        <Link href="/course" prefetch={true} className="w-full sm:w-auto">
          <Button
            variant="outline"
            className="rounded-full h-14 sm:h-16 px-8 sm:px-10 text-base sm:text-lg font-bold border-2 border-slate-200 text-slate-600 hover:border-violet-300 hover:bg-violet-50/50 hover:text-violet-700 transition-all w-full"
          >
            Դիտել դասընթացները
          </Button>
        </Link>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-3 pt-2">
        {[
          { icon: Zap, text: 'Արագ արդյունք', color: 'violet' },
          { icon: Users, text: 'Փակ համայնք', color: 'fuchsia' },
          { icon: Globe, text: 'Տեսադասեր', color: 'blue' },
        ].map((tag) => (
          <span
            key={tag.text}
            className={`inline-flex items-center gap-2 rounded-full bg-${tag.color}-50/80 px-4 py-2.5 text-sm font-semibold text-${tag.color}-700 ring-1 ring-${tag.color}-200/50 shadow-sm hover:shadow-md transition-all cursor-default backdrop-blur-sm`}
          >
            <tag.icon className={`h-4 w-4 ${tag.color === 'violet' || tag.color === 'fuchsia' ? 'fill-current' : ''}`} />
            {tag.text}
          </span>
        ))}
      </div>

      {/* Trust indicators */}
      <div className="flex items-center gap-6 pt-4">
        <div className="flex -space-x-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white shadow-md"
            >
              {String.fromCharCode(65 + i)}
            </div>
          ))}
        </div>
        <div className="text-sm">
          <span className="font-bold text-slate-900">500+</span>
          <span className="text-slate-500"> ուսանողներ</span>
        </div>
      </div>
    </div>
  )
}
