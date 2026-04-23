'use client'

import { motion } from 'framer-motion'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useFaqQuery } from '@/hooks/queries/useFaqQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function FaqSection() {
  const { data: faqs, isLoading } = useFaqQuery()
  const reduceMotion = useReducedMotion()

  // Don't render if no FAQ data or still loading
  if (isLoading || !faqs || faqs.length === 0) {
    return null
  }

  // Animation props - disabled on mobile
  const fadeInUp = reduceMotion ? {} : {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  }

  const fadeInUpDelayed = reduceMotion ? {} : {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, delay: 0.2 }
  }

  return (
    <section id="faq" className="w-full py-24 md:py-32 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-violet-200/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[300px] h-[300px] bg-pink-200/40 rounded-full blur-[100px]" />
      </div>

      <div className="container relative z-10 max-w-4xl">
        <motion.div 
          {...fadeInUp}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-slate-900">
            Հաճախ տրվող <span className="text-violet-600">հարցեր</span>
          </h2>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto">
            Մենք հավաքել ենք ամենակարևոր հարցերը, որոնք կօգնեն ձեզ կայացնել ճիշտ որոշում:
          </p>
        </motion.div>

        <motion.div 
          {...fadeInUpDelayed}
          className="space-y-4"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((item, index) => (
              <AccordionItem
                key={item.id || `faq-${index}`}
                value={`item-${index}`}
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
        </motion.div>
      </div>
    </section>
  )
}
