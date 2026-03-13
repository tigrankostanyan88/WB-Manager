'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { LayoutDashboard, Zap } from 'lucide-react'

interface ProBannerUser {
  role?: string
}

interface ProBannerProps {
  user: ProBannerUser
  onShowPaymentModal: () => void
}

export default function ProBanner({ user, onShowPaymentModal }: ProBannerProps) {
  return (
    <Card className="border-0 shadow-2xl shadow-violet-200/40 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 text-white overflow-hidden relative group cursor-pointer hover:scale-[1.01] transition-all duration-500">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[40px] -mr-16 -mt-16 rounded-full group-hover:bg-white/20 transition-all"></div>
      <CardContent className="p-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 flex-shrink-0">
            <Zap className="w-6 h-6 text-white fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black tracking-[0.2em] uppercase opacity-80">PRO MEMBER</span>
              <span className="px-2 py-0.5 rounded-md bg-white/20 text-[8px] font-black uppercase">Active</span>
            </div>
            <h3 className="text-xl font-black tracking-tight leading-tight">Թարմացրեք ձեր հաշիվը</h3>
            <p className="text-white/60 text-[11px] font-medium leading-relaxed">Ստացեք անսահմանափակ մուտք բոլոր դասընթացներին և MPStats գործիքներին։</p>
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
          <Button onClick={onShowPaymentModal} className="flex-1 md:flex-none bg-white text-slate-900 hover:bg-slate-50 font-black rounded-xl h-12 px-8 text-xs shadow-xl transition-all active:scale-95">
            Ակտիվացնել հիմա
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
