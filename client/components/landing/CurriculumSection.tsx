'use client'

// client/components/landing/CurriculumSection.tsx

import { Button } from '@/components/ui/button'
import {
  FileSpreadsheet,
  ShoppingBag,
  TrendingUp,
} from 'lucide-react'

const CURRICULUM_STEPS = [
  {
    number: '01',
    title: 'Սկիզբ և ռեգիստրացիա',
    duration: '1-2 օր',
    description: 'Խանութի գրագետ բացում, իրավաբանական հարցերի կարգավորում և բրենդավորում առանց սթրեսի:',
    icon: ShoppingBag,
    color: 'violet',
  },
  {
    number: '02',
    title: 'Ապրանք և մատակարար',
    duration: '3-5 օր',
    description: 'Ինչպես ընտրել ապրանք, որը կվաճառվի: Մատակարարների հետ բանակցություններ և մարժայի հաշվարկ:',
    icon: FileSpreadsheet,
    color: 'blue',
  },
  {
    number: '03',
    title: 'Մարքեթինգ և մասշտաբավորում',
    duration: 'Շարունակական',
    description: 'Լիստինգների թոփ դուրս բերում, գովազդային ռազմավարություն և վաճառքների կտրուկ աճ:',
    icon: TrendingUp,
    color: 'pink',
  },
] as const

const FEATURES = [
  { label: 'Case study-ners WB-ից', color: 'emerald' },
  { label: '100% Գործնական', color: 'amber' },
] as const

export function CurriculumSection() {
  return (
    <section id="curriculum" className="w-full py-24 bg-slate-950 text-slate-50 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] opacity-40" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] opacity-30" />
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-24">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">
            Դասընթացի <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">Ծրագիր</span>
          </h2>
          <p className="text-slate-400 text-lg md:text-xl leading-relaxed">
            Մենք կոտրում ենք կարծրատիպերը: Սա ուղղակի դասընթաց չէ, սա ձեր բիզնեսի մեկնարկն է:
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {CURRICULUM_STEPS.map((step) => {
            const IconComponent = step.icon
            return (
              <div
                key={step.number}
                className="group relative bg-slate-900/50 border border-white/10 rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-8 hover:bg-slate-900 transition-colors duration-300"
              >
                <div className="absolute top-1 right-1 sm:top-4 sm:right-4 font-mono text-2xl sm:text-6xl font-bold text-white/5 group-hover:text-white/10 transition-colors select-none">
                  {step.number}
                </div>
                <div className={`h-10 w-10 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl bg-${step.color}-500/10 text-${step.color}-400 flex items-center justify-center mb-3 sm:mb-6 ring-1 ring-white/5 shadow-[0_0_30px_-5px_rgba(139,92,246,0.3)]`}>
                  <IconComponent className="h-5 w-5 sm:h-7 sm:w-7" />
                </div>
                <h3 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-3 text-white">
                  {step.title}
                </h3>
                <div className={`inline-flex items-center rounded-md bg-${step.color}-500/10 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-medium text-${step.color}-300 ring-1 ring-inset ring-${step.color}-500/20 mb-3 sm:mb-4`}>
                  {step.duration}
                </div>
                <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>

        <div className="relative rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-r from-violet-900/20 to-indigo-900/20 border border-white/10 p-6 sm:p-8 md:p-12 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Պատրաստ ե՞ք սկսել
              </h3>
              <p className="text-slate-300 mb-6 max-w-md">
                Դասընթացը ներառում է 6+ շաբաթ խորը ծրագիր, տեսադասեր, PDF նյութեր և 100% գործնական կենտրոնացում:
              </p>
              <div className="flex flex-wrap gap-3">
                {FEATURES.map((feature) => (
                  <div
                    key={feature.label}
                    className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10"
                  >
                    <div className={`h-2 w-2 rounded-full bg-${feature.color}-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]`} />
                    <span className="text-sm font-medium text-slate-200">
                      {feature.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center md:justify-end">
              <Button
                size="lg"
                className="bg-white text-slate-950 hover:bg-slate-200 rounded-full px-8 h-14 text-base font-bold shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] transition-all hover:scale-105"
              >
                Գրանցվել հիմա
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
