'use client'

import {
  BarChart,
  CheckCircle,
  ChevronRight,
  Quote,
  Star,
  Users,
  Video,
} from 'lucide-react'

export function ImpactSection() {
  return (
    <section id="impact" className="w-full py-20 md:py-32 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            Իրական արդյունքներ
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-[800px]">
            Թվեր, որոնք խոսում են մեր մասին ավելի բարձր, քան բառերը:
          </p>
        </div>

        <div className="grid gap-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-violet-50 to-purple-100 rounded-3xl p-4 sm:p-8 text-violet-900 shadow-xl shadow-violet-100/50 border border-violet-100 transition-transform hover:-translate-y-1">
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-white rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-sm ring-1 ring-violet-100">
                <BarChart className="h-6 w-6 text-violet-600" />
              </div>
              <h3 className="text-2xl sm:text-4xl font-bold mb-2">2,500+</h3>
              <p className="font-medium text-violet-700 mb-4 sm:mb-6 text-sm sm:text-base">
                Ակտիվ ուսանողներ կայուն վաճառքներով
              </p>
              <div className="h-px w-full bg-violet-200 mb-4" />
              <p className="text-xs text-violet-600/80">
                Միջին աճ՝ 340% առաջին 3 ամսում
              </p>
            </div>

            <div className="bg-gradient-to-br from-fuchsia-50 to-pink-100 rounded-3xl p-4 sm:p-8 text-fuchsia-900 shadow-xl shadow-fuchsia-100/50 border border-fuchsia-100 transition-transform hover:-translate-y-1">
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-white rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-sm ring-1 ring-fuchsia-100">
                <Users className="h-6 w-6 text-fuchsia-600" />
              </div>
              <h3 className="text-2xl sm:text-4xl font-bold mb-2">1,200+</h3>
              <p className="font-medium text-fuchsia-700 mb-4 sm:mb-6 text-sm sm:text-base">
                Վաճառողներ MessMonthly &gt;1.5M₽
              </p>
              <div className="h-px w-full bg-fuchsia-200 mb-4" />
              <p className="text-xs text-fuchsia-600/80">
                Բազմաթիվ դեպքեր հասել են 5M+ ամսական
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-3xl p-4 sm:p-8 text-purple-900 shadow-xl shadow-purple-100/50 border border-purple-100 transition-transform hover:-translate-y-1">
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-white rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-sm ring-1 ring-purple-100">
                <Star className="h-6 w-6 text-purple-600 fill-current" />
              </div>
              <h3 className="text-2xl sm:text-4xl font-bold mb-2">4.9/5</h3>
              <p className="font-medium text-purple-700 mb-4 sm:mb-6 text-sm sm:text-base">
                Միջին գնահատական 2800+ հետադարձ կապեր
              </p>
              <div className="h-px w-full bg-purple-200 mb-4" />
              <p className="text-xs text-purple-600/80">
                Բոլորը կարծում են դա շատ արժեք
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 h-full">
            <div className="lg:col-span-1 bg-white rounded-3xl p-4 sm:p-8 shadow-xl shadow-gray-100 border border-gray-100 flex flex-col justify-between h-full">
              <div>
                <div className="inline-flex items-center gap-2 bg-violet-50 text-violet-700 px-3 py-1 rounded-full text-xs font-bold mb-6">
                  <span className="h-2 w-2 rounded-full bg-violet-600" />
                  Real Success Story
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 leading-tight">
                  Ինչպես 200k-ից մինչև 4.2M ամսվա տակ
                </h3>
                <div className="relative pl-4 border-l-4 border-violet-100 py-2 mb-8">
                  <Quote className="absolute -top-2 -left-2 h-4 w-4 text-violet-300 fill-current transform -scale-x-100" />
                  <p className="text-gray-600 italic text-sm leading-relaxed">
                    «Մոտ 6 ամիս պայքարում էի 200k-ից բարձր չանցնել։ Դասընթացի
                    առաջին 4 մոդուլից հետո վերամշակեցի իմ մատակարար ցանցը և
                    լիստինգի ռազմավարությունը։ Երկրորդ ամսում արդեն 2.1M,
                    երրորդ ամսում՝ 4.2M։ Պարզապես անհավատալի»
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-12 w-12 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-lg">
                    ՀՄ
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Հաղարդ Ման</h4>
                    <p className="text-xs text-violet-600 font-medium">
                      Home Decor Seller
                    </p>
                    <p className="text-[10px] text-gray-400">
                      Join in 2024 - 2100% Growth
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-gray-50 rounded-xl p-3">
                  <div className="text-center">
                    <p className="text-[10px] text-gray-400 mb-1">From</p>
                    <p className="text-violet-600 font-bold">200k₽</p>
                  </div>
                  <div className="flex items-center justify-center">
                    <ChevronRight className="h-4 w-4 text-gray-300" />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-gray-400 mb-1">To</p>
                    <p className="text-violet-600 font-bold">4.2M₽</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 grid grid-rows-2 gap-6">
              <div className="bg-gradient-to-br from-fuchsia-50 to-purple-50 rounded-3xl p-4 sm:p-8 text-fuchsia-900 shadow-xl shadow-fuchsia-100/50 border border-fuchsia-100 flex flex-col justify-center flex-1">
                <div className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full text-xs font-medium w-fit mb-2 sm:mb-4 shadow-sm ring-1 ring-fuchsia-100 text-fuchsia-700">
                  <CheckCircle className="h-3 w-3" /> Ստուգված
                </div>
                <h3 className="text-base sm:text-lg font-bold text-fuchsia-900 mb-2 sm:mb-4">
                  Տեղեկատվական աջակցություն
                </h3>
                <div className="flex items-end gap-2">
                  <span className="text-2xl sm:text-4xl font-bold">48hrs</span>
                </div>
                <p className="text-sm text-fuchsia-700 mt-1">
                  Միջին պատասխանի ժամանակ
                </p>
              </div>

              <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-3xl p-4 sm:p-8 text-violet-900 shadow-xl shadow-violet-100/50 border border-violet-100 flex flex-col justify-center flex-1">
                <div className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full text-xs font-medium w-fit mb-4 shadow-sm ring-1 ring-violet-100 text-violet-700">
                  <Video className="h-3 w-3" /> Live Updates
                </div>
                <h3 className="text-base sm:text-lg font-bold text-violet-900 mb-2 sm:mb-4">
                  Համայնքի գործունեություն
                </h3>
                <div className="flex items-end gap-2">
                  <span className="text-2xl sm:text-4xl font-bold">200+</span>
                </div>
                <p className="text-sm text-violet-700 mt-1">
                  Օրական ակտիվ հաղորդակցություններ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
