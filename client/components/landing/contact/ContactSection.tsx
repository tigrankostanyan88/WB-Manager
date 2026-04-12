// landing/contact/ContactSection.tsx - Main contact section orchestrator

import { motion } from 'framer-motion'
import { ContactForm } from './ContactForm'
import { ContactInfo } from './ContactInfo'
import { SocialLinks } from './SocialLinks'
import type { ContactSectionProps } from './types'

export function ContactSection({ settings }: ContactSectionProps) {
  return (
    <section id="contact" className="w-full py-16 md:py-24 lg:py-32 bg-gray-50">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <ContactForm />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6 pt-4 lg:pt-8"
          >
            <ContactInfo settings={settings} />
            <SocialLinks settings={settings} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
