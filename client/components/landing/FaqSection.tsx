'use client'

// client/components/landing/FaqSection.tsx

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface FaqItem {
  value: string
  question: string
  answer: string
}

const FAQ_ITEMS: FaqItem[] = [
  {
    value: 'item-1',
    question: 'Ի՞նչ է Wildberries-ը և ինչու՞ ընտրել այն։',
    answer:
      'Wildberries-ը Ռուսաստանի խոշորագույն առցանց մանրածախ առևտրի հարթակն է, որը թույլ է տալիս անհատներին և ընկերություններին վաճառել իրենց ապրանքները լայն լսարանին։ Մեր դասընթացը կսովորեցնի ձեզ, թե ինչպես ստեղծել խանութ, ցուցակագրել ապրանքներ, կառավարել պատվերները և օպտիմալացնել վաճառքները։',
  },
  {
    value: 'item-2',
    question: 'Ովքե՞ր կարող են մասնակցել դասընթացին։',
    answer:
      'Դասընթացը նախատեսված է բոլոր նրանց համար, ովքեր ցանկանում են սկսել կամ զարգացնել իրենց բիզնեսը Wildberries հարթակում՝ անկախ նախնական փորձից։',
  },
  {
    value: 'item-3',
    question: 'Ի՞նչ գիտելիքներ կստանամ դասընթացից հետո։',
    answer:
      'Դուք կսովորեք ապրանքների ընտրություն, մատակարարների հետ աշխատանք, լիստինգի օպտիմալացում, մարքեթինգային ռազմավարություններ և բիզնեսի մասշտաբավորում Wildberries-ում։',
  },
  {
    value: 'item-4',
    question: 'Արդյո՞ք դասընթացն ունի աջակցություն։',
    answer:
      'Այո, մենք ունենք փակ համայնք և մենթորների աջակցություն, որտեղ դուք կարող եք ստանալ պատասխաններ ձեր բոլոր հարցերին։',
  },
] as const

export function FaqSection() {
  return (
    <section id="faq" className="w-full py-24 md:py-32 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-violet-200/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[300px] h-[300px] bg-pink-200/40 rounded-full blur-[100px]" />
      </div>

      <div className="container relative z-10 max-w-4xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-slate-900">
            Հաճախ տրվող <span className="text-violet-600">հարցեր</span>
          </h2>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto">
            Մենք հավաքել ենք ամենակարևոր հարցերը, որոնք կօգնեն ձեզ կայացնել ճիշտ որոշում:
          </p>
        </div>

        <div className="space-y-4">
          <Accordion type="single" collapsible className="space-y-4">
            {FAQ_ITEMS.map((item) => (
              <AccordionItem
                key={item.value}
                value={item.value}
                className="bg-white rounded-2xl border border-slate-100 px-4 sm:px-6 py-2 shadow-sm hover:shadow-md transition-all duration-200 data-[state=open]:ring-2 data-[state=open]:ring-violet-100"
              >
                <AccordionTrigger className="text-base sm:text-lg font-semibold text-slate-800 hover:text-violet-700 hover:no-underline py-3 sm:py-4">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 text-base leading-relaxed pb-4">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
