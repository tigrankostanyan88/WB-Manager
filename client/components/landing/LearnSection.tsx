'use client'

import {
  CheckCircle,
  ShoppingBag,
  Star,
  Zap,
} from 'lucide-react'

const STEPS = [
  {
    number: '01',
    title: 'Մեկնարկ և Գրանցում',
    description:
      'Անհատ ձեռնարկատիրոջ գրանցում, Wildberries կաբինետի բացում և իրավաբանական հարցերի կարգավորում:',
    color: 'violet',
  },
  {
    number: '02',
    title: 'Ապրանքի Ընտրություն',
    description:
      'Շուկայի վերլուծություն, շահավետ նիշայի ընտրություն և մատակարարների հետ բանակցություններ:',
    color: 'blue',
  },
  {
    number: '04',
    title: 'Մարքեթինգ և Գովազդ',
    description:
      'Ներքին և արտաքին գովազդի կարգավորում, SEO օպտիմիզացիա և վաճառքների խթանում:',
    color: 'orange',
  },
  {
    number: '03',
    title: 'Լիստինգ և Կոնտենտ',
    description:
      'Պրոֆեսիոնալ լուսանկարներ, ինֆոգրաֆիկա և վաճառող տեքստերի ստեղծում:',
    color: 'pink',
  },
] as const

const PHONE_CHART_BARS = [
  { bg: 'bg-violet-100' },
  { bg: 'bg-blue-100' },
  { bg: 'bg-pink-100' },
  { bg: 'bg-orange-100' },
] as const

export function LearnSection() {
  return (
    <section id="learn" className="w-full py-20 md:py-32 relative overflow-hidden bg-[#F8F9FB]">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-violet-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[10%] right-[5%] w-80 h-80 bg-blue-200/20 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-slate-900 mb-6">
            Ինչ կսովորեք <span className="text-violet-600">իրականում</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Քայլ առ քայլ ուղեցույց՝ զրոյից մինչև կայուն եկամուտ Wildberries-ում
          </p>
        </div>

        <div className="relative w-full min-h-[600px] lg:min-h-[700px]">
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
                        <div
                          key={idx}
                          className={`h-24 ${bar.bg} rounded-2xl`}
                        />
                      ))}
                    </div>
                    <div className="h-32 bg-slate-100 rounded-2xl mt-4" />
                    <div className="absolute top-1/3 -right-12 bg-white p-3 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce [animation-duration:3s]">
                      <div className="bg-green-100 p-2 rounded-full">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Վաճառք</div>
                        <div className="text-sm font-bold text-slate-900">
                          +125,000֏
                        </div>
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

          <div className="lg:ml-[350px] relative grid gap-8 md:grid-cols-2 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-16 py-10">
            <svg
              className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none z-0"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 25 15 C 50 15, 50 25, 75 25"
                stroke="#CBD5E1"
                strokeWidth="2"
                strokeDasharray="4 4"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d="M 75 25 L 75 60"
                stroke="#CBD5E1"
                strokeWidth="2"
                strokeDasharray="4 4"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d="M 75 60 C 50 60, 50 50, 25 50"
                stroke="#CBD5E1"
                strokeWidth="2"
                strokeDasharray="4 4"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d="M 25 50 C 25 75, 50 70, 50 90"
                stroke="#CBD5E1"
                strokeWidth="2"
                strokeDasharray="4 4"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            {STEPS.map((step, idx) => (
              <div
                key={step.number}
                className={`relative group ${
                  idx === 1
                    ? 'lg:mt-12'
                    : idx === 2
                    ? 'lg:col-start-1 lg:row-start-2 lg:-mt-12'
                    : idx === 3
                    ? 'lg:col-start-2 lg:row-start-2'
                    : ''
                }`}
              >
                <div className="bg-white rounded-[2rem] p-5 sm:p-6 shadow-xl shadow-slate-200/40 border border-slate-100 relative z-10 transition-transform hover:-translate-y-1 duration-300">
                  <div
                    className={`absolute -top-4 -left-4 sm:-top-6 sm:-left-6 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg rotate-[-6deg] group-hover:rotate-0 transition-transform ring-2 ring-white z-30 ${
                      step.color === 'violet' ? 'bg-violet-500 shadow-violet-300/50' :
                      step.color === 'blue' ? 'bg-blue-500 shadow-blue-300/50' :
                      step.color === 'orange' ? 'bg-orange-500 shadow-orange-300/50' :
                      'bg-slate-500 shadow-slate-300/50'
                    }`}
                  >
                    {step.number}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-4 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className="lg:hidden flex justify-center py-4">
                    <div className="w-0.5 h-8 bg-slate-200" />
                  </div>
                )}
              </div>
            ))}

            <div className="relative group lg:col-span-2 lg:w-1/2 lg:mx-auto lg:mt-8">
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-[2rem] p-6 sm:p-8 shadow-2xl shadow-slate-500/20 border border-slate-700 relative z-10 text-center transform transition-all hover:scale-105 duration-300">
                <div className="absolute -top-6 sm:-top-8 left-1/2 -translate-x-1/2 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-lg shadow-green-500/30 border-2 sm:border-4 border-[#F8F9FB]">
                  <Zap className="w-6 h-6 sm:w-8 sm:h-8 fill-current" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-4 sm:mt-6 mb-2">
                  Արդյունք և Մասշտաբավորում
                </h3>
                <p className="text-slate-300 text-base leading-relaxed">
                  Կայուն վաճառքներ, թիմի ձևավորում և բիզնեսի ավտոմատացում: Դուրս
                  գալ նոր շուկաներ:
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
