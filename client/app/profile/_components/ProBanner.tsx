'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { LayoutDashboard, Zap, Clock, AlertCircle, CheckCircle2 } from 'lucide-react'

interface ProBannerUser {
  role?: string
  name?: string
}

interface Payment {
  id: string
  amount: number
  status: 'pending' | 'success' | 'failed'
  course?: {
    title: string
  }
}

interface ProBannerProps {
  user: ProBannerUser
  myPayments?: Payment[]
  onShowPaymentModal: () => void
}

export default function ProBanner({ user, myPayments = [], onShowPaymentModal }: ProBannerProps) {
  // Calculate payment status
  const successfulPayments = myPayments.filter(p => p.status === 'success')
  const pendingPayments = myPayments.filter(p => p.status === 'pending')
  const failedPayments = myPayments.filter(p => p.status === 'failed')

  const hasSuccessfulPayments = successfulPayments.length > 0
  const hasPendingPayments = pendingPayments.length > 0
  const hasFailedPayments = failedPayments.length > 0

  // Determine status to display
  let statusLabel = 'Ակտիվ'
  let statusColor = 'bg-white/20'
  let headerTitle = 'Թարմացրեք ձեր հաշիվը'
  let description = 'Ստացեք անսահմանափակ մուտք բոլոր դասընթացներին և MPStats գործիքներին։'
  let bgGradient = 'bg-gradient-to-br from-violet-600 to-indigo-700'
  let iconColor = 'fill-white'

  if (hasSuccessfulPayments) {
    statusLabel = 'Վճարված'
    statusColor = 'bg-emerald-300/30 text-emerald-100'
    headerTitle = 'Շնորհավորում ենք, վճարումը հաստատված է'
    const courseNames = successfulPayments.map(p => p.course?.title || 'Դասընթաց').join(', ')
    description = `Վճարված դասընթացներ՝ ${courseNames}`
    bgGradient = 'bg-gradient-to-br from-emerald-500 to-emerald-600'
    iconColor = 'fill-white'
  } else if (hasPendingPayments) {
    statusLabel = 'Սպասվում է'
    statusColor = 'bg-yellow-300/30 text-yellow-100'
    headerTitle = 'Վճարումը սպասվում է հաստատման'
    const courseNames = pendingPayments.map(p => p.course?.title || 'Դասընթաց').join(', ')
    description = `Սպասվող վճարումներ՝ ${courseNames}`
    bgGradient = 'bg-gradient-to-br from-yellow-500 to-orange-500'
    iconColor = 'fill-white'
  } else if (hasFailedPayments) {
    statusLabel = 'Չհաստատվեց'
    statusColor = 'bg-red-300/30 text-red-100'
    headerTitle = 'Վճարումը չհաստատվեց'
    description = 'Վճարման ընթացքում սխալ է տեղի ունեցել: Խնդրում ենք փորձել կրկին:'
    bgGradient = 'bg-gradient-to-br from-red-500 to-red-600'
    iconColor = 'fill-white'
  }

  const showActivateButton = !hasSuccessfulPayments && !hasPendingPayments

  return (
    <Card className={`border-0 shadow-2xl shadow-violet-200/40 rounded-2xl text-white overflow-hidden relative group cursor-pointer hover:scale-[1.01] transition-all duration-500 ${bgGradient}`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[40px] -mr-16 -mt-16 rounded-full group-hover:bg-white/20 transition-all"></div>
      <CardContent className="p-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl backdrop-blur-md flex items-center justify-center border border-white/20 flex-shrink-0 bg-white/20">
            {hasSuccessfulPayments ? (
              <CheckCircle2 className="w-6 h-6 text-white" />
            ) : hasPendingPayments ? (
              <Clock className="w-6 h-6 text-white" />
            ) : hasFailedPayments ? (
              <AlertCircle className="w-6 h-6 text-white" />
            ) : (
              <Zap className={`w-6 h-6 text-white ${iconColor}`} />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black tracking-[0.2em] uppercase opacity-80">
                {hasSuccessfulPayments ? 'PREMIUM MEMBER' : 'PRO MEMBER'}
              </span>
              <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase ${statusColor}`}>
                {statusLabel}
              </span>
            </div>
            <h3 className="text-xl font-black tracking-tight leading-tight">
              {headerTitle}
            </h3>
            <p className="text-white/60 text-[11px] font-medium leading-relaxed">
              {description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto flex-shrink-0">
          {user?.role === 'admin' && (
            <Link href="/dashboard" title="Վահանակ">
              <Button className="w-12 h-12 bg-slate-900 text-white hover:bg-slate-800 font-black rounded-xl p-0 shadow-xl transition-all active:scale-95 flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5" />
              </Button>
            </Link>
          )}
          {showActivateButton && (
            <Button onClick={onShowPaymentModal} className="flex-1 md:flex-none bg-white text-slate-900 hover:bg-slate-50 font-black rounded-xl h-12 px-8 text-xs shadow-xl transition-all active:scale-95">
              Ակտիվացնել հիմա
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
