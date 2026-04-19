import { BookOpen, HelpCircle, Layers, LayoutDashboard, Mail, MessageSquare, Settings, Shield, UserCheck, Users, CreditCard, Building2, UserX, Sparkles, LucideIcon } from 'lucide-react'
import type { DashboardMenuItem } from '@/components/features/admin/DashboardSidebar'

export const menuItems: DashboardMenuItem[] = [
  { id: 'overview', label: 'Վահանակ', icon: LayoutDashboard },
  { id: 'users', label: 'Օգտվողներ', icon: Users },
  { id: 'suspended-users', label: 'Կասեցվածներ', icon: UserX },
  { id: 'enrollments', label: 'Գրանցումներ', icon: BookOpen },
  { id: 'contact-messages', label: 'Կոնտակտային հաղորդագրություններ', icon: Mail },
  { id: 'payments', label: 'Վճարումներ', icon: CreditCard },
  { id: 'bank-cards', label: 'Բանկային քարտեր', icon: Building2 },
  { id: 'courses', label: 'Դասընթացներ', icon: BookOpen },
  { id: 'modules', label: 'Մոդուլներ', icon: Layers },
  { id: 'comments', label: 'Մեկնաբանություններ', icon: MessageSquare },
  { id: 'instructor', label: 'Մենթոր', icon: Shield },
  { id: 'faq', label: 'Հաճախ Տրվող Հարցեր', icon: HelpCircle },
  { id: 'hero-content', label: 'Հերո բովանդակություն', icon: Sparkles },
  { id: 'settings', label: 'Կարգավորումներ', icon: Settings }
]

export interface StatItem {
  label: string
  value: string
  icon: LucideIcon
  trend: string
  color: string
  bg: string
}

export function createStats(statCounts: {
  students: number
  courses: number
  reviews: number
  activeUsers: number
}): StatItem[] {
  return [
    { 
      label: 'Դասընթացի մասնակիցներ', 
      value: `${statCounts.students}`, 
      icon: UserCheck, 
      trend: '+0%', 
      color: 'text-violet-600', 
      bg: 'bg-violet-50' 
    },
    { 
      label: 'Դասընթացներ', 
      value: `${statCounts.courses}`, 
      icon: BookOpen, 
      trend: '+0%', 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50' 
    },
    { 
      label: 'Մեկնաբանություններ', 
      value: `${statCounts.reviews}`, 
      icon: MessageSquare, 
      trend: '+0%', 
      color: 'text-orange-600', 
      bg: 'bg-orange-50' 
    },
    { 
      label: 'Օգտվողներ', 
      value: `${statCounts.activeUsers}`, 
      icon: Users, 
      trend: '+0%', 
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    }
  ]
}
