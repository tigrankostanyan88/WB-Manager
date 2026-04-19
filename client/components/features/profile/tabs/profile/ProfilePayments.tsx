'use client'

import { CreditCard } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { Payment } from '@/components/features/profile/hooks/useProfileData'

interface ProfilePaymentsProps {
  payments: Payment[]
  isLoading: boolean
}

const STATUS_CONFIG = {
  success: { bg: 'bg-gradient-to-br from-emerald-500 to-emerald-600', text: 'text-white', dot: 'bg-emerald-400', label: 'Հաստատված' },
  pending: { bg: 'bg-gradient-to-br from-amber-500 to-orange-500', text: 'text-white', dot: 'bg-amber-300', label: 'Սպասում' },
  failed: { bg: 'bg-gradient-to-br from-red-500 to-rose-600', text: 'text-white', dot: 'bg-red-300', label: 'Մերժված' },
}

export function ProfilePayments({ payments, isLoading }: ProfilePaymentsProps) {
  return (
    <div className="space-y-3 sm:space-y-4 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0 px-1">
        <h4 className="text-lg sm:text-xl font-black text-slate-900">Իմ վճարումները</h4>
        <span className="text-[10px] sm:text-xs font-bold text-slate-400">Վճարման ID | Կուրսի ID</span>
      </div>
      <Card className="shadow-sm rounded-xl sm:rounded-2xl bg-white overflow-hidden border border-slate-50">
        <CardContent className="p-0">
          {isLoading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 sm:p-6 border-b border-slate-50 last:border-0 animate-pulse">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-100" />
                  <div className="space-y-2">
                    <div className="h-4 w-24 sm:w-32 bg-slate-100 rounded" />
                    <div className="h-3 w-16 sm:w-24 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <div className="h-4 w-16 sm:w-20 bg-slate-100 rounded" />
                  <div className="h-3 w-12 sm:w-16 bg-slate-100 rounded" />
                </div>
              </div>
            ))
          ) : payments.length > 0 ? (
            payments.map((payment) => {
              const status = STATUS_CONFIG[payment.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.failed
              return (
                <div key={payment.id} className="flex items-center justify-between p-3 sm:p-6 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 group">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                    <div className={cn('w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 flex-shrink-0', status.bg, status.text)}>
                      <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-900 text-sm sm:text-base line-clamp-2 leading-snug">{payment.course?.title || 'Դասընթաց'}</p>
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-[9px] sm:text-[10px] font-medium text-slate-400">
                        <span className="font-mono">Վճ.ID: {payment.id}</span>
                        <span className="text-slate-300 hidden sm:inline">|</span>
                        <span className="font-mono">Կուրս.ID: {payment.course_id || '—'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2 sm:ml-4">
                    <p className="font-black text-slate-900 text-sm sm:text-base">{payment.amount?.toLocaleString()} ֏</p>
                    <div className="flex items-center gap-1 sm:gap-1.5 justify-end">
                      <div className={cn('w-1.5 h-1.5 rounded-full animate-pulse', status.dot)} />
                      <span className={cn('text-[9px] sm:text-[10px] font-black uppercase tracking-widest', status.text)}>
                        {status.label}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="py-12 sm:py-16 text-center bg-gradient-to-br from-slate-50/80 via-slate-100/60 to-slate-50/80 flex flex-col items-center justify-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center text-white shadow-lg shadow-slate-200">
                <CreditCard className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] sm:text-xs">Վճարումներ չկան</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
