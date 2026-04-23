'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function CtaSection() {
  const reduceMotion = useReducedMotion()

  // Animation props - disabled on mobile
  const fadeInUp = reduceMotion ? {} : {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] as const }
  }

  return (
    <section id="cta" className="w-full py-12 sm:py-16 md:py-24 lg:py-32 bg-slate-50">
      <div className="container px-4 sm:px-6">
        <motion.div 
          {...fadeInUp}
          className="relative overflow-hidden rounded-3xl sm:rounded-[2.5rem] bg-slate-950 text-white shadow-2xl shadow-slate-950/30 ring-1 ring-slate-800 px-4 sm:px-6 py-10 sm:py-14 md:px-12 md:py-20 text-center"
        >
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-violet-950/40 to-slate-950" />

          {/* Top gradient line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

          {/* Bottom gradient line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

          {/* Glow effects */}
          <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-violet-600/20 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-fuchsia-600/15 blur-[100px]" />
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-[120px]" />

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />

          <h2 className="relative z-10 text-xl sm:text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight break-words whitespace-normal px-1 sm:px-0 leading-snug sm:leading-normal max-w-full w-full bg-gradient-to-r from-white via-violet-200 to-white bg-clip-text text-transparent">
            Պատրա՞ստ եք կառուցել ձեր կայսրությունը Wildberries-ում:
          </h2>
          <p className="relative z-10 mx-auto max-w-[700px] text-sm sm:text-lg md:text-xl mt-4 sm:mt-6 text-slate-300 px-2 sm:px-0">
            Միացեք հազարավոր հաջողակ վաճառողների և սկսեք ձեր ճանապարհը դեպի ֆինանսական ազատություն։
          </p>
          <div className="relative z-10 mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center gap-3 px-4 sm:px-0">
            <Link href="/course" prefetch={true} className="w-full sm:w-auto">
              <Button
                className="bg-white text-slate-950 hover:bg-violet-100 rounded-full h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-bold w-full shadow-lg shadow-white/20 hover:shadow-xl hover:shadow-white/30 transition-all duration-300"
                size="lg"
              >
                Սկսել հիմա
              </Button>
            </Link>
            <Link href="/#learn" prefetch={true} className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="bg-white/10 text-white border-white/30 hover:bg-white hover:text-slate-950 rounded-full h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base w-full transition-all duration-300 backdrop-blur-sm"
                size="lg"
              >
                Իմանալ ավելին
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
