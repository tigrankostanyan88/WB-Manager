'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function CtaSection() {
  return (
    <section id="cta" className="w-full py-12 sm:py-16 md:py-24 lg:py-32 bg-secondary/40">
      <div className="container px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-primary text-primary-foreground shadow-2xl ring-1 ring-primary/30 px-4 sm:px-6 py-8 sm:py-12 md:px-10 md:py-16 text-center">
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-fuchsia-300/25 blur-3xl" />

          <h2 className="relative text-sm sm:text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight break-words whitespace-normal px-1 sm:px-0 leading-snug sm:leading-normal max-w-full w-full">
            Պատրա՞ստ եք կառուցել ձեր կայսրությունը Wildberries-ում:
          </h2>
          <p className="relative mx-auto max-w-[700px] text-sm sm:text-lg md:text-xl mt-3 sm:mt-4 text-primary-foreground/90 px-2 sm:px-0">
            Միացեք հազարավոր հաջողակ վաճառողների և սկսեք ձեր ճանապարհը դեպի ֆինանսական ազատություն։
          </p>
          <div className="relative mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-3 px-4 sm:px-0">
            <Link href="/course" prefetch={true} className="w-full sm:w-auto">
              <Button
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-full h-12 sm:h-11 px-4 sm:px-6 text-sm sm:text-base w-full"
                size="lg"
              >
                Սկսել հիմա
              </Button>
            </Link>
            <Link href="/#learn" prefetch={true} className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="text-black border-primary-foreground/30 hover:bg-primary-foreground hover:text-primary rounded-full h-12 sm:h-11 px-4 sm:px-6 text-sm sm:text-base w-full"
                size="lg"
              >
                Իմանալ ավելին
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
