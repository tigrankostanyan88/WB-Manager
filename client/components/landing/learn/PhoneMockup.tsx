'use client'

import { CheckCircle, ShoppingBag, Star } from 'lucide-react'
import { PHONE_CHART_BARS } from './utils'

export function PhoneMockup() {
  return (
    <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-[350px] z-20">
      <div className="relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
        <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute" />
        <div className="h-[32px] w-[3px] bg-gray-800 absolute -left-[17px] top-[72px] rounded-l-lg" />
        <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg" />
        <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg" />
        <div className="rounded-[2rem] overflow-hidden w-full h-full bg-white relative">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-violet-50 to-white">
            <div className="p-6 pt-12 space-y-4">
              <div className="h-8 w-3/4 bg-slate-100 rounded-lg animate-pulse" />
              <div className="grid grid-cols-2 gap-3">
                {PHONE_CHART_BARS.map((bar, idx) => (
                  <div key={idx} className={`h-24 ${bar.bg} rounded-2xl`} />
                ))}
              </div>
              <div className="h-32 bg-slate-100 rounded-2xl mt-4" />
              <div className="absolute top-1/3 -right-12 bg-white p-3 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce [animation-duration:3s]">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Վաճառք</div>
                  <div className="text-sm font-bold text-slate-900">+125,000֏</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-gradient-to-br from-violet-400 to-indigo-600 rounded-2xl transform rotate-12 shadow-2xl flex items-center justify-center text-white z-30">
        <ShoppingBag className="w-10 h-10" />
      </div>
      <div className="absolute top-20 -left-12 w-16 h-16 bg-white rounded-2xl transform -rotate-6 shadow-lg flex items-center justify-center border border-slate-100 z-10">
        <Star className="w-8 h-8 text-yellow-400 fill-current" />
      </div>
    </div>
  )
}
