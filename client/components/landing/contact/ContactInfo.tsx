// landing/contact/ContactCard.tsx - Contact info card component

import { MapPin, Phone, Clock, Mail } from 'lucide-react'
import type { Settings } from './types'
import { getWorkingHoursLabel } from '@/lib/workingHours'

interface ContactCardProps {
  icon: React.ReactNode
  gradient: string
  shadow: string
  title: string
  content: string
}

function ContactCard({
  icon,
  gradient,
  shadow,
  title,
  content,
}: ContactCardProps) {
  return (
    <div className="group relative flex items-start gap-3 sm:gap-4 rounded-2xl bg-white sm:bg-white/80 sm:backdrop-blur-sm p-3 sm:p-5 shadow-lg shadow-slate-200/50 ring-1 ring-slate-100 sm:ring-white/50 hover:shadow-xl hover:shadow-violet-200/30 hover:ring-violet-200/50 transition-all duration-300 overflow-hidden">
      {/* Hover gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

      <div className={`relative flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} ${shadow} shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
        {icon}
      </div>
      <div className="relative min-w-0 flex-1 overflow-hidden">
        <h3 className="font-semibold text-slate-900 mb-0.5 sm:mb-1 text-sm sm:text-base">
          {title}
        </h3>
        <p className="text-slate-500 text-xs sm:text-sm break-words leading-relaxed">
          {content}
        </p>
      </div>
    </div>
  )
}

interface ContactInfoProps {
  settings: Settings
}

export function ContactInfo({ settings }: ContactInfoProps) {
  return (
    <div className="relative w-full min-w-0 p-4 sm:p-8 rounded-[1.25rem] sm:rounded-[1.5rem] lg:rounded-[2rem] bg-gradient-to-br from-white to-slate-50 sm:from-white/60 sm:to-white/30 sm:backdrop-blur-xl shadow-xl shadow-violet-100/50 ring-1 ring-white/80">
      {/* Decorative element */}
      <div className="absolute -top-3 -right-3 w-20 h-20 bg-gradient-to-br from-violet-400/20 to-fuchsia-400/20 rounded-full blur-2xl" />

      <div className="mb-4 sm:mb-8 relative">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">
          Մի հապաղեք կապ հաստատել
        </h3>
        <p className="text-slate-500 leading-relaxed text-sm sm:text-base">
          Եթե ունեք հարցեր, առաջարկներ կամ պարզապես ցանկանում եք ավելին իմանալ մեր դասընթացի մասին, մենք միշտ պատրաստ ենք օգնել։
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <ContactCard
          icon={<MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-white" />}
          gradient="from-blue-500 to-cyan-500"
          shadow="shadow-blue-500/30"
          title="Գրասենյակ"
          content={settings.address || 'ք. Երևան'}
        />
        <ContactCard
          icon={<Phone className="h-4 w-4 sm:h-5 sm:w-5 text-white" />}
          gradient="from-orange-500 to-amber-500"
          shadow="shadow-orange-500/30"
          title="Հեռախոս"
          content={settings.phone || 'Հեռախոսային համար'}
        />
        <ContactCard
          icon={<Clock className="h-4 w-4 sm:h-5 sm:w-5 text-white" />}
          gradient="from-violet-500 to-fuchsia-500"
          shadow="shadow-violet-500/30"
          title="Աշխ. ժամեր"
          content={getWorkingHoursLabel(settings.workingHours)}
        />
        <ContactCard
          icon={<Mail className="h-4 w-4 sm:h-5 sm:w-5 text-white" />}
          gradient="from-emerald-500 to-teal-500"
          shadow="shadow-emerald-500/30"
          title="Էլ. փոստ"
          content={settings.email || 'Էլ. փոստի հասցե'}
        />
      </div>
    </div>
  )
}
