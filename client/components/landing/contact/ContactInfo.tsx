// landing/contact/ContactCard.tsx - Contact info card component

import { Globe, Users, Zap, CheckCircle } from 'lucide-react'
import type { Settings } from './types'
import { getWorkingHoursLabel } from '@/lib/workingHours'

interface ContactCardProps {
  icon: React.ReactNode
  iconBg: string
  iconHoverBg: string
  title: string
  content: string
  ringHoverColor: string
}

function ContactCard({
  icon,
  iconBg,
  iconHoverBg,
  title,
  content,
  ringHoverColor,
}: ContactCardProps) {
  return (
    <div
      className={`group flex items-start gap-2 sm:gap-4 rounded-xl sm:rounded-2xl bg-white p-3 sm:p-5 shadow-sm ring-1 ring-gray-900/5 hover:shadow-md hover:ring-${ringHoverColor}/10 transition-all duration-300`}
    >
      <div
        className={`flex h-9 w-9 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full ${iconBg} ${iconHoverBg} group-hover:scale-110 transition-all duration-300`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1 overflow-hidden">
        <h3 className="font-semibold text-gray-900 mb-0.5 sm:mb-1 text-xs sm:text-base">
          {title}
        </h3>
        <p className="text-muted-foreground text-[10px] sm:text-sm break-all leading-tight">
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
    <>
      <div className="mb-6">
        <h2 className="text-xl sm:text-3xl font-bold tracking-tighter mb-3 sm:mb-4">
          Մի հապաղեք կապ հաստատել մեզ հետ
        </h2>
        <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
          Եթե ունեք հարցեր, առաջարկներ կամ պարզապես ցանկանում եք ավելին իմանալ մեր դասընթացի մասին, մենք միշտ պատրաստ ենք օգնել։ Մեր թիմը սիրով կպատասխանի ձեր բոլոր հարցերին։
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
        <ContactCard
          icon={<Globe className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />}
          iconBg="bg-blue-50"
          iconHoverBg="group-hover:bg-blue-100"
          title="Գրասենյակ"
          content={settings.address || 'ք. Երևան'}
          ringHoverColor="primary"
        />
        <ContactCard
          icon={<Users className="h-4 w-4 sm:h-6 sm:w-6 text-orange-600" />}
          iconBg="bg-orange-50"
          iconHoverBg="group-hover:bg-orange-100"
          title="Հեռախոս"
          content={settings.phone || ''}
          ringHoverColor="orange-500"
        />
        <ContactCard
          icon={<Zap className="h-4 w-4 sm:h-6 sm:w-6 text-violet-600" />}
          iconBg="bg-violet-50"
          iconHoverBg="group-hover:bg-violet-100"
          title="Աշխ. ժամեր"
          content={getWorkingHoursLabel(settings.workingHours)}
          ringHoverColor="violet-500"
        />
        <ContactCard
          icon={<CheckCircle className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />}
          iconBg="bg-green-50"
          iconHoverBg="group-hover:bg-green-100"
          title="Էլ. փոստ"
          content={settings.email || ''}
          ringHoverColor="green-500"
        />
      </div>
    </>
  )
}
