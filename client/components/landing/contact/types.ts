// landing/contact/types.ts - Contact section types

export interface Settings {
  address?: string
  phone?: string
  email?: string
  workingHours?: unknown
  instagram?: string
  facebook?: string
  telegram?: string
  whatsapp?: string
}

export interface ContactSectionProps {
  settings: Settings
}

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export interface SocialLinkConfig {
  key: 'instagram' | 'facebook' | 'telegram' | 'whatsapp'
  gradient?: string
  bg?: string
  shadow: string
  svg: React.ReactNode
}
