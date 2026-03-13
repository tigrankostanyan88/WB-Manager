'use client'

// client/components/landing/ContactSection.tsx

import { Button } from '@/components/ui/button'
import {
  CheckCircle,
  Globe,
  Users,
  Zap,
} from 'lucide-react'
import { getWorkingHoursLabel } from '@/lib/workingHours'

interface Settings {
  address?: string
  phone?: string
  email?: string
  workingHours?: unknown
  instagram?: string
  facebook?: string
  telegram?: string
  whatsapp?: string
}

interface ContactSectionProps {
  settings: Settings
}

const SOCIAL_LINKS = [
  {
    key: 'instagram',
    gradient: 'from-yellow-400 via-red-500 to-purple-500',
    shadow: 'shadow-pink-500',
    svg: (
      <>
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </>
    ),
  },
  {
    key: 'facebook',
    bg: 'bg-[#1877F2]',
    shadow: 'shadow-blue-500',
    svg: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  },
  {
    key: 'telegram',
    bg: 'bg-[#229ED9]',
    shadow: 'shadow-sky-500',
    svg: (
      <>
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="M22 2 11 13" />
      </>
    ),
  },
  {
    key: 'whatsapp',
    bg: 'bg-[#25D366]',
    shadow: 'shadow-green-500',
    svg: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M16.95 14.4c-.39-.2-2.3-1.14-2.66-1.27-.36-.13-.62-.2-.88.2s-1.01 1.27-1.24 1.53-.46.29-.85.1c-.39-.19-1.64-.6-3.13-1.93-1.15-1.03-1.92-2.3-2.15-2.69-.23-.39-.02-.6.17-.79.17-.17.39-.45.58-.68.19-.23.25-.39.38-.64.13-.25.07-.47-.03-.66-.11-.19-.97-2.34-1.33-3.2-.35-.85-.71-.74-.97-.75-.25-.01-.54-.01-.84-.01-.3 0-.79.11-1.2.56-.41.45-1.57 1.53-1.57 3.74 0 2.21 1.61 4.35 1.84 4.66.23.31 3.16 4.83 7.66 6.77 2.67 1.15 3.21.92 3.79.86.58-.06 1.84-.75 2.1-1.48.26-.73.26-1.35.18-1.48-.08-.13-.3-.21-.69-.41z" />
      </>
    ),
  },
] as const

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

export function ContactSection({ settings }: ContactSectionProps) {

  return (
    <section id="contact" className="w-full py-16 md:py-24 lg:py-32 bg-gray-50">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="p-6 sm:p-8 rounded-2xl bg-white shadow-xl ring-1 ring-gray-900/5">
            <h2 className="text-xl sm:text-3xl font-bold tracking-tight mb-2 break-words leading-tight">
              Թողեք ձեր հաղորդագրությունը
            </h2>
            <p className="text-gray-500 mb-6 sm:mb-8 text-sm sm:text-base break-words">
              Լրացրեք ստորև բերված ձևը և մենք կկապնվենք ձեզ հետ 24 ժամվա ընթացքում:
            </p>
            <form className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs sm:text-sm font-semibold text-gray-700">
                    Անուն
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="flex h-11 sm:h-12 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 sm:px-4 py-2 sm:py-3 text-sm ring-offset-white file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                    placeholder="Ձեր անունը"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs sm:text-sm font-semibold text-gray-700">
                    Էլ. փոստ
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="flex h-11 sm:h-12 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 sm:px-4 py-2 sm:py-3 text-sm ring-offset-white file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                    placeholder="Ձեր էլ. փոստը"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-xs sm:text-sm font-semibold text-gray-700">
                  Թեմա
                </label>
                <input
                  type="text"
                  id="subject"
                  className="flex h-11 sm:h-12 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 sm:px-4 py-2 sm:py-3 text-sm ring-offset-white file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                  placeholder="Հաղորդագրության թեման"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-xs sm:text-sm font-semibold text-gray-700">
                  Հաղորդագրություն
                </label>
                <textarea
                  id="message"
                  rows={3}
                  className="flex min-h-[100px] sm:min-h-[120px] w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 sm:px-4 py-2 sm:py-3 text-sm ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-y"
                  placeholder="Գրեք ձեր հաղորդագրությունը այստեղ..."
                />
              </div>
              <div className="flex items-start sm:items-center gap-2 sm:gap-3 pt-2">
                <input
                  id="privacy"
                  name="privacy"
                  type="checkbox"
                  className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary transition duration-150 ease-in-out cursor-pointer mt-0.5 sm:mt-0 shrink-0"
                />
                <label
                  htmlFor="privacy"
                  className="text-xs sm:text-sm text-gray-600 cursor-pointer select-none break-words leading-tight sm:leading-normal"
                >
                  Ես համաձայն եմ{' '}
                  <span className="text-primary hover:underline font-medium">
                    գաղտնիության քաղաքականությանը
                  </span>
                </label>
              </div>
              <div className="pt-2">
                <Button className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 text-white font-semibold text-sm sm:text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 px-2 sm:px-4 whitespace-normal break-words">
                  Ուղարկել հաղորդագրությունը
                </Button>
              </div>
            </form>
          </div>

          <div className="space-y-6 pt-4 lg:pt-8">
            <div>
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

            <div className="pt-4">
              <h3 className="font-semibold text-gray-900 mb-4">Սոցիալական մեդիա</h3>
              <div className="flex gap-4">
                {SOCIAL_LINKS.map((social) => {
                  const link = settings[social.key as keyof typeof settings] as string | undefined
                  if (!link) return null

                  const isInstagram = social.key === 'instagram'
                  const className = isInstagram
                    ? `flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr ${social.gradient} text-white shadow-lg ${social.shadow}/20 hover:${social.shadow}/30 hover:scale-110 transition-all duration-300`
                    : `flex h-11 w-11 items-center justify-center rounded-full ${social.bg} text-white shadow-lg ${social.shadow}/20 hover:${social.shadow}/30 hover:scale-110 transition-all duration-300`

                  return (
                    <a
                      key={social.key}
                      href={link}
                      target="_blank"
                      rel="noreferrer nofollow"
                      className={className}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {social.svg}
                      </svg>
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
