'use client'

import { motion } from 'framer-motion'
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
}

export function HeroContent({ content, onOpenModal, onPlayVideo }: HeroContentProps) {
  const { isLoggedIn } = useAuth()

  return (
    <motion.div 
      className="flex flex-col gap-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Animated Badge */}
      <motion.div variants={itemVariants}>
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
      </motion.div>

      {/* Title with animated gradient text */}
      <motion.div variants={itemVariants} className="space-y-6 overflow-hidden">
        <h1 className="text-3xl sm:text-5xl md:text-6xl xl:text-[4.5rem] font-black tracking-tight text-slate-900 break-words leading-[1.1]">
          <span className="block">Սովորեք</span>
          <span className="block mt-2 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
            Wildberries
          </span>
          <span className="block mt-2">Ակադեմիայում</span>
        </h1>
        <p className="max-w-[550px] text-slate-500 text-base sm:text-lg md:text-xl leading-relaxed font-medium">
          {content?.text || 'Սովորեք քայլ առ քայլ՝ սկսած հաշվարկներից մինչև վաճառքի մասշտաբավորում՝ իրական փորձի հիման վրա։'}
        </p>
      </motion.div>

      {/* CTA Buttons with enhanced styling */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 sm:gap-5">
        {isLoggedIn ? (
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Button
              className="relative overflow-hidden rounded-full h-14 sm:h-16 px-8 sm:px-10 text-base sm:text-lg font-bold bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 text-white hover:shadow-2xl hover:shadow-violet-400/40 transition-all w-full sm:w-auto group"
              onClick={onPlayVideo}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center">
                <Play className="mr-2 h-5 w-5 fill-white" /> Դիտել ներածություն
              </span>
            </Button>
          </motion.div>
        ) : (
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Button
              className="relative overflow-hidden rounded-full h-14 sm:h-16 px-8 sm:px-10 text-base sm:text-lg font-bold bg-slate-900 text-white hover:shadow-2xl hover:shadow-slate-400/40 transition-all w-full sm:w-auto group"
              onClick={onOpenModal}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center">
                Սկսել հիմա <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </motion.div>
        )}
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
          <Link href="/course" prefetch={true} className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="rounded-full h-14 sm:h-16 px-8 sm:px-10 text-base sm:text-lg font-bold border-2 border-slate-200 text-slate-600 hover:border-violet-300 hover:bg-violet-50/50 hover:text-violet-700 transition-all w-full"
            >
              Դիտել դասընթացները
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Animated Tags with enhanced styling */}
      <motion.div variants={itemVariants} className="flex flex-wrap gap-3 pt-2">
        {[
          { icon: Zap, text: 'Արագ արդյունք', color: 'violet' },
          { icon: Users, text: 'Փակ համայնք', color: 'fuchsia' },
          { icon: Globe, text: 'Տեսադասեր', color: 'blue' },
        ].map((tag, index) => (
          <motion.span
            key={tag.text}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.05, y: -2 }}
            className={`inline-flex items-center gap-2 rounded-full bg-${tag.color}-50/80 px-4 py-2.5 text-sm font-semibold text-${tag.color}-700 ring-1 ring-${tag.color}-200/50 shadow-sm hover:shadow-md transition-all cursor-default backdrop-blur-sm`}
          >
            <tag.icon className={`h-4 w-4 ${tag.color === 'violet' || tag.color === 'fuchsia' ? 'fill-current' : ''}`} />
            {tag.text}
          </motion.span>
        ))}
      </motion.div>

      {/* Trust indicators */}
      <motion.div variants={itemVariants} className="flex items-center gap-6 pt-4">
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
      </motion.div>
    </motion.div>
  )
}
