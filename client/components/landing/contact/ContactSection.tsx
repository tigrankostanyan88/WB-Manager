// landing/contact/ContactSection.tsx - Main contact section orchestrator

import { ContactForm } from './ContactForm'
import { ContactInfo } from './ContactInfo'
import { SocialLinks } from './SocialLinks'
import type { ContactSectionProps } from './types'

export function ContactSection({ settings }: ContactSectionProps) {
  return (
    <section id="contact" className="relative w-full py-12 sm:py-20 md:py-28 lg:py-36 overflow-hidden">
      {/* Beautiful gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-violet-50/30 to-blue-50/20" />
      
      {/* Decorative gradient orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-violet-200/30 to-fuchsia-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-200/20 to-violet-200/30 rounded-full blur-3xl" />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="container relative z-10 px-4 sm:px-6 mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 border border-violet-200 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold text-violet-700 mb-4 sm:mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
            </span>
            Կապվեք մեզ հետ
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-3 sm:mb-4 tracking-tight px-2 sm:px-0">
            Մենք <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">պատրաստ ենք</span> օգնել
          </h2>
          <p className="text-slate-500 text-base sm:text-lg px-4 sm:px-0">
            Մենք պատրաստ ենք օգնել ձեզ Wildberries-ում հաջողություն գտնել
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start w-full max-w-6xl mx-auto">
          <div className="w-full">
            <ContactForm />
          </div>

          <div className="space-y-4 sm:space-y-8 lg:pt-4 w-full">
            <ContactInfo settings={settings} />
            <SocialLinks settings={settings} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
