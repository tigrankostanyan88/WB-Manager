'use client'

import { motion } from 'framer-motion'
import { Copy, CreditCard, Plus, QrCode } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface PaymentsUser {
  name: string
}

interface PaymentsTabProps {
  user: PaymentsUser
}

export default function PaymentsTab({ user }: PaymentsTabProps) {
  return (
    <motion.div
      key="payments"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between px-2">
        <h3 className="text-4xl font-black text-slate-900 tracking-tight">Վճարումներ</h3>
        <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-2xl px-6 h-12 font-black flex items-center gap-2 shadow-lg shadow-violet-200 transition-all active:scale-95">
          <Plus className="w-5 h-5" />
          Ավելացնել քարտ
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl overflow-hidden relative group hover:scale-[1.02] transition-all duration-500 shadow-2xl shadow-slate-900/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/20 blur-[80px] -mr-32 -mt-32 rounded-full"></div>
          <CardContent className="p-10 relative z-10 flex flex-col justify-between h-[320px]">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Ընդհանուր հաշվեկշիռ</p>
                <h4 className="text-4xl font-black tracking-tight">120,500 ֏</h4>
                <div className="flex items-center gap-2 mt-2 bg-emerald-500/20 w-fit px-3 py-1 rounded-lg border border-emerald-500/30">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Վճարված է</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
                <CreditCard className="w-7 h-7" />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Քարտապան</p>
                  <p className="font-bold tracking-wide uppercase">{user.name}</p>
                </div>
                <div className="ml-auto space-y-1 text-right">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Վերջնաժամկետ</p>
                  <p className="font-bold tracking-wide">12 / 28</p>
                </div>
              </div>
              <div className="flex items-center justify-between bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/5">
                <p className="text-lg font-mono tracking-[0.3em]">**** **** **** 4242</p>
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-red-500/80"></div>
                  <div className="w-8 h-8 rounded-full bg-yellow-500/80"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl shadow-slate-200/50 rounded-2xl bg-white overflow-hidden border border-slate-100/50 flex flex-col group hover:shadow-2xl transition-all duration-500">
          <CardContent className="p-10 flex-1 flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-violet-600/10 blur-2xl rounded-full scale-150 animate-pulse"></div>
              <div className="relative w-40 h-40 bg-slate-50 rounded-2xl p-6 border-2 border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <QrCode className="w-full h-full text-slate-900" />
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-black text-slate-900">Արագ վճարում</h4>
              <p className="text-sm font-medium text-slate-500">Սկանավորեք QR կոդը արագ վճարման համար</p>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
              <span className="text-xs font-bold text-slate-600">ID: WB-992341</span>
              <button className="text-slate-400 hover:text-violet-600 transition-colors">
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
