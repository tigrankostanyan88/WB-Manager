'use client'

// client/components/landing/FeaturesSection.tsx

export function FeaturesSection() {
  return (
    <section id="features" className="w-full py-16 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-slate-900">
            Ինչու՞ ստեղծել բիզնես <span className="text-violet-600">Wildberries</span>-ում
          </h2>
          <p className="max-w-[900px] text-slate-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Հարթակ, որը տալիս է անսահմանափակ հնարավորություններ ձեր բիզնեսի աճի համար
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-[2.5rem] p-6 sm:p-8 min-h-[300px] sm:min-h-[420px] flex flex-col relative overflow-hidden group transition-all hover:shadow-xl hover:shadow-blue-100/50">
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-slate-900 mb-3">Բրենդի ճանաչելիություն</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Wildberries-ի միլիոնավոր լսարանի շնորհիվ դուք կարող եք բարձրացնել ձեր բիզնեսի և ապրանքանիշի ճանաչելիությունը ամբողջ ԱՊՀ-ում:
                </p>
              </div>
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-100 rounded-full blur-3xl opacity-50 translate-x-10 translate-y-10" />
              <div className="mt-auto self-center relative overflow-visible">
                <div className="w-24 h-32 bg-white rounded-2xl shadow-xl border-4 border-blue-200 flex flex-col items-center p-2 transform rotate-[-5deg] group-hover:rotate-0 transition-transform duration-500">
                  <div className="w-full h-2 bg-blue-100 rounded-full mb-2" />
                  <div className="w-full flex-1 bg-blue-50 rounded mb-2" />
                  <div className="w-8 h-3 bg-blue-500 rounded-full" />
                </div>
                <div className="absolute -right-3 sm:-right-6 bottom-6 bg-orange-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-lg transform rotate-[10deg]">SHOP</div>
              </div>
            </div>

            <div className="bg-orange-50 rounded-[2.5rem] p-6 sm:p-8 min-h-[200px] sm:min-h-[260px] flex flex-col justify-between relative overflow-hidden group transition-all hover:shadow-xl hover:shadow-orange-100/50">
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Խթանման գործիքներ</h3>
                <p className="text-slate-600 text-sm">
                  Հզոր գովազդային գործիքներ և ակցիաներ՝ վաճառքը խթանելու համար:
                </p>
              </div>
              <div className="absolute bottom-4 right-4">
                <div className="w-full max-w-[200px] bg-white rounded-full h-10 flex items-center px-4 shadow-sm border border-orange-100">
                  <div className="w-4 h-4 rounded-full border-2 border-orange-300 mr-2" />
                  <div className="h-2 w-20 bg-orange-100 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-orange-50 rounded-[2.5rem] p-6 sm:p-8 min-h-[200px] sm:min-h-[260px] flex flex-col relative overflow-hidden group transition-all hover:shadow-xl hover:shadow-orange-100/50">
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Անվտանգ գործարքներ</h3>
                <p className="text-slate-600 text-sm">
                  Երաշխավորված վճարումներ և ապահով գործարքներ հարթակի միջոցով:
                </p>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-20 bg-orange-200 rounded-xl transform rotate-[-15deg] shadow-lg flex items-center justify-center overflow-hidden">
                <div className="w-20 h-3 bg-white/30 rounded-full" />
              </div>
            </div>

            <div className="bg-blue-50 rounded-[2.5rem] p-6 sm:p-8 min-h-[300px] sm:min-h-[420px] flex flex-col relative overflow-hidden group transition-all hover:shadow-xl hover:shadow-blue-100/50">
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-slate-900 mb-3">Ֆինանսական արդյունավետություն</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Մենք առաջարկում ենք ցածր միջնորդավճարներ, ճկուն պայմաններ և արագ աճի հնարավորություն փոքր բիզնեսի համար:
                </p>
              </div>
              <div className="mt-auto self-center relative">
                <div className="relative w-28 sm:w-32 h-24">
                  <div className="absolute bottom-0 left-0 w-full h-20 bg-blue-200 rounded-b-full rounded-t-lg shadow-inner flex items-center justify-center">
                    <span className="text-3xl font-bold text-blue-500 opacity-50">%</span>
                  </div>
                  <div className="absolute top-0 left-0 w-12 h-20 bg-white rounded-lg shadow-md transform rotate-[-10deg] border border-blue-100" />
                  <div className="absolute top-1 right-2 w-12 h-20 bg-white rounded-lg shadow-md transform rotate-[5deg] border border-blue-100" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 rounded-[2.5rem] p-6 sm:p-8 min-h-[200px] sm:min-h-[260px] flex flex-col relative overflow-hidden group transition-all hover:shadow-xl hover:shadow-blue-100/50">
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Վաճառքների աճ</h3>
                <p className="text-slate-600 text-sm">
                  Պոտենցիալ գնորդների մշտական հոսքի շնորհիվ վաճառքի աճն երաշխավորված է:
                </p>
              </div>
              <div className="absolute bottom-6 right-6 flex items-end gap-1">
                <div className="w-4 h-8 bg-blue-200 rounded-t-sm" />
                <div className="w-4 h-12 bg-blue-300 rounded-t-sm" />
                <div className="w-4 h-16 bg-blue-400 rounded-t-sm" />
                <div className="w-4 h-10 bg-blue-200 rounded-t-sm" />
              </div>
            </div>

            <div className="bg-orange-50 rounded-[2.5rem] p-6 sm:p-8 min-h-[300px] sm:min-h-[420px] flex flex-col relative overflow-hidden group transition-all hover:shadow-xl hover:shadow-orange-100/50">
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-slate-900 mb-3">Կառավարման գործիքներ</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Ստացեք մանրամասն վիճակագրություն պատվերների, վաճառքների և մնացորդի վերաբերյալ: Օպտիմալացրեք ձեր բիզնեսը:
                </p>
              </div>
              <div className="mt-auto self-center relative w-full h-32 bg-white rounded-xl shadow-lg border border-orange-100 p-4 flex flex-col gap-2 transform rotate-[2deg] group-hover:rotate-0 transition-transform">
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-orange-100" />
                  <div className="flex-1 h-6 bg-orange-50 rounded-lg" />
                </div>
                <div className="flex-1 bg-orange-50/50 rounded-lg flex items-end p-2 gap-2">
                  <div className="w-1/4 h-1/2 bg-orange-300 rounded-t" />
                  <div className="w-1/4 h-3/4 bg-orange-400 rounded-t" />
                  <div className="w-1/4 h-2/3 bg-orange-300 rounded-t" />
                  <div className="w-1/4 h-full bg-orange-500 rounded-t" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
