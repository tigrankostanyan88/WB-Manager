'use client'

import { TrendingUp, Shield, Zap, BarChart3, Package, CreditCard } from 'lucide-react'

export function FeaturesSection() {
  return (
    <section id="features" className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-white via-slate-50/50 to-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
            <Zap className="w-4 h-4" />
            Հնարավորություններ
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-slate-900">
            Ինչու՞ ստեղծել բիզնես <span className="text-violet-600">Wildberries</span>-ում
          </h2>
          <p className="max-w-[900px] text-slate-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Հարթակ, որը տալիս է անսահմանափակ հնարավորություններ ձեր բիզնեսի աճի համար
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1 */}
          <div className="space-y-6">
            {/* Card 1 - Brand Recognition */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 min-h-[320px] sm:min-h-[440px] flex flex-col relative overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:shadow-violet-200/50 hover:-translate-y-2 border border-slate-100">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-blue-500 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-violet-200 group-hover:scale-110 transition-transform duration-300">
                  <Package className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Բրենդի ճանաչելիություն</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Wildberries-ի 50+ միլիոն օգտատերերի շնորհիվ ձեր ապրանքները կտեսնեն ամբողջ ԱՊՀ-ում
                </p>
              </div>
              <div className="mt-auto self-center relative">
                <div className="w-28 h-36 bg-white rounded-2xl shadow-xl border-2 border-violet-100 flex flex-col items-center p-3 transform group-hover:rotate-0 transition-all duration-500">
                  <div className="w-full h-3 bg-violet-100 rounded-full mb-3" />
                  <div className="w-full flex-1 bg-gradient-to-b from-violet-50 to-blue-50 rounded-lg mb-3" />
                  <div className="w-12 h-4 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full" />
                </div>
                <div className="absolute -right-4 bottom-8 bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform">HOT</div>
              </div>
            </div>

            {/* Card 2 - Marketing Tools */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 sm:p-8 min-h-[220px] sm:min-h-[280px] flex flex-col justify-between relative overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:shadow-orange-200/50 hover:-translate-y-2 border border-orange-100">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-200 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-orange-200">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Խթանման գործիքներ</h3>
                <p className="text-slate-600 text-sm">
                  Ակցիաներ, փլեշսեյլեր և flash-տեղադրումներ վաճառքներն արագացնելու համար
                </p>
              </div>
              <div className="flex gap-2 mt-4">
                <span className="bg-white/80 text-orange-600 text-xs font-bold px-3 py-1.5 rounded-full">-30%</span>
                <span className="bg-white/80 text-pink-600 text-xs font-bold px-3 py-1.5 rounded-full">1+1</span>
                <span className="bg-white/80 text-purple-600 text-xs font-bold px-3 py-1.5 rounded-full">Gift</span>
              </div>
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-6">
            {/* Card 3 - Secure Transactions */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-6 sm:p-8 min-h-[220px] sm:min-h-[280px] flex flex-col relative overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-200/50 hover:-translate-y-2 border border-emerald-100">
              <div className="absolute -bottom-8 -right-8 w-28 h-28 bg-emerald-200 rounded-full blur-2xl opacity-50 group-hover:opacity-80 transition-opacity" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-200">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Անվտանգ գործարքներ</h3>
                <p className="text-slate-600 text-sm">
                  Wildberries-ը երաշխավորում է վճարումները և պաշտպանում է վաճառողներին
                </p>
              </div>
              <div className="mt-auto flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-xs shadow-md">🔒</div>
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-xs shadow-md">✓</div>
                </div>
                <span className="text-xs text-emerald-600 font-bold">100% պաշտպանված</span>
              </div>
            </div>

            {/* Card 4 - Financial Efficiency */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 min-h-[320px] sm:min-h-[440px] flex flex-col relative overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:shadow-blue-200/50 hover:-translate-y-2 border border-slate-100">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform duration-300">
                  <CreditCard className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Ֆինանսական արդյունավետություն</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Մինիմալ միջնորդավճարներ, շաբաթական վճարումներ և արագ եկամուտ փոքր բիզնեսի համար
                </p>
              </div>
              <div className="mt-auto self-center">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <span className="text-2xl font-bold">5-15%</span>
                  <span className="text-sm ml-2 opacity-90">միջնորդավճար</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3 */}
          <div className="space-y-6">
            {/* Card 5 - Sales Growth */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 sm:p-8 min-h-[220px] sm:min-h-[280px] flex flex-col relative overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:shadow-blue-200/50 hover:-translate-y-2 border border-blue-100">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Վաճառքների աճ</h3>
                <p className="text-slate-600 text-sm">
                  Անընդհատ հոսք գնորդների՝ շնորհիվ ալգորիթմի և առաջխաղացման
                </p>
              </div>
              <div className="mt-auto flex items-end gap-1 h-16">
                <div className="w-5 bg-blue-200 rounded-t-lg h-6 group-hover:h-8 transition-all duration-300" />
                <div className="w-5 bg-blue-300 rounded-t-lg h-10 group-hover:h-12 transition-all duration-300 delay-75" />
                <div className="w-5 bg-blue-400 rounded-t-lg h-14 group-hover:h-16 transition-all duration-300 delay-150" />
                <div className="w-5 bg-gradient-to-t from-blue-500 to-indigo-500 rounded-t-lg h-8 group-hover:h-full transition-all duration-300 delay-200" />
              </div>
            </div>

            {/* Card 6 - Management Tools */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 min-h-[320px] sm:min-h-[440px] flex flex-col relative overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:shadow-violet-200/50 hover:-translate-y-2 border border-slate-100">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-fuchsia-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-violet-200 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Կառավարման գործիքներ</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Անալիտիկա, մնացորդի հաշվառում և AI-հիմնված խորհուրդներ բիզնեսը օպտիմալացնելու համար
                </p>
              </div>
              <div className="mt-auto">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 group-hover:bg-white transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
                    <span className="text-sm text-slate-600">AI վերլուծություն</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-2 w-1/4 bg-violet-200 rounded-full" />
                    <div className="h-2 w-1/2 bg-violet-400 rounded-full" />
                    <div className="h-2 w-1/3 bg-violet-300 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
