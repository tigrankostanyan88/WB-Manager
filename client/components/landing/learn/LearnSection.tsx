'use client'

import { Zap } from 'lucide-react'
import { PhoneMockup } from './PhoneMockup'
import { StepCard } from './StepCard'
import { STEPS } from './utils'

export function LearnSection() {
  return (
    <section id="learn" className="w-full py-20 md:py-32 relative overflow-hidden bg-[#F8F9FB]">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-violet-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[10%] right-[5%] w-80 h-80 bg-blue-200/20 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-slate-900 mb-6">
            Ինչ կսովորեք <span className="text-violet-600">իրականում</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Քայլ առ քայլ ուղեցույց՝ զրոյից մինչև կայուն եկամուտ Wildberries-ում
          </p>
        </div>

        <div className="relative w-full min-h-[600px] lg:min-h-[700px]">
          {/* Phone Mockup - Left Side */}
          <PhoneMockup />

          {/* Steps Grid */}
          <div className="lg:ml-[350px] relative grid gap-8 md:grid-cols-2 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-16 py-10">
            {/* SVG connectors */}
            <svg
              className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none z-0"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M 25 15 C 50 15, 50 25, 75 25" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
              <path d="M 75 25 L 75 60" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
              <path d="M 75 60 C 50 60, 50 50, 25 50" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
              <path d="M 25 50 C 25 75, 50 70, 50 90" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
            </svg>

            {/* Step Cards */}
            {STEPS.map((step, idx) => (
              <StepCard key={step.number} step={step} index={idx} isLast={idx < STEPS.length - 1} />
            ))}

            {/* Result Card */}
            <div className="relative group lg:col-span-2 lg:w-1/2 lg:mx-auto lg:mt-8">
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-[2rem] p-6 sm:p-8 shadow-2xl shadow-slate-500/20 border border-slate-700 relative z-10 text-center transform transition-all hover:scale-105 duration-300">
                <div className="absolute -top-6 sm:-top-8 left-1/2 -translate-x-1/2 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-lg shadow-green-500/30 border-2 sm:border-4 border-[#F8F9FB]">
                  <Zap className="w-6 h-6 sm:w-8 sm:h-8 fill-current" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-4 sm:mt-6 mb-2">Արդյունք և Մասշտաբավորում</h3>
                <p className="text-slate-300 text-base leading-relaxed">
                  Կայուն վաճառքներ, թիմի ձևավորում և բիզնեսի ավտոմատացում: Դուրս գալ նոր շուկաներ:
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
