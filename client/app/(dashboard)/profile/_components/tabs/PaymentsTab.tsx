'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, CreditCard, Plus, QrCode, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import api from '@/lib/api'

interface BankCard {
  id: number
  bank_name: string
  card_number: string
  is_active: boolean
  created_at: string
}

interface PaymentsUser {
  name: string
}

interface PaymentsTabProps {
  user: PaymentsUser
}

export default function PaymentsTab({ user }: PaymentsTabProps) {
  const [bankCards, setBankCards] = useState<BankCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBankCards = async () => {
      try {
        const res = await api.get('/api/v1/bank-cards/all')
        setBankCards(res.data?.data || [])
      } catch {
        setBankCards([])
      } finally {
        setLoading(false)
      }
    }
    fetchBankCards()
  }, [])

  const maskCardNumber = (number: string) => {
    const clean = number.replace(/\s/g, '')
    if (clean.length <= 4) return clean
    return '**** **** **** ' + clean.slice(-4)
  }

  const getBankGradient = (bankName: string) => {
    const name = bankName.toLowerCase()
    if (name.includes('ameria') || name.includes('америя')) 
      return 'from-amber-600 to-orange-700'
    if (name.includes('ardshin') || name.includes('ардшин')) 
      return 'from-red-600 to-red-800'
    if (name.includes('acba') || name.includes('акба')) 
      return 'from-green-600 to-emerald-700'
    if (name.includes('converse') || name.includes('конверс')) 
      return 'from-blue-600 to-blue-800'
    if (name.includes('ineco') || name.includes('инеко')) 
      return 'from-purple-600 to-violet-700'
    if (name.includes('hsbc')) 
      return 'from-slate-700 to-slate-900'
    return 'from-slate-900 to-slate-800'
  }

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
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="h-[200px] bg-slate-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : bankCards.length === 0 ? (
        <Card className="shadow-xl shadow-slate-200/50 rounded-2xl bg-white overflow-hidden border border-slate-100/50 p-12 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto">
              <CreditCard className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium">Բանկային քարտեր չկան</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bankCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`bg-gradient-to-br ${getBankGradient(card.bank_name)} text-white rounded-3xl overflow-hidden relative group hover:scale-[1.02] transition-all duration-500 shadow-2xl shadow-slate-900/30`}
              >
                {/* Background effects */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 blur-[100px] -mr-40 -mt-40 rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-60 h-60 bg-black/10 blur-[80px] -ml-30 -mb-30 rounded-full"></div>
                
                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
                
                <div className="p-6 relative z-10 flex flex-col justify-between h-[240px]">
                  {/* Top row: Bank info & Status */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Բանկ</p>
                        <p className="font-bold text-base">{card.bank_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-emerald-500/20 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Ակտիվ</span>
                    </div>
                  </div>

                  {/* Card number section */}
                  <div className="space-y-3">
                    {/* Chip icon */}
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-8 bg-gradient-to-br from-yellow-400/90 to-yellow-600/90 rounded-md flex items-center justify-center border border-yellow-300/50">
                        <div className="w-6 h-5 border border-yellow-700/30 rounded-sm flex items-center justify-center">
                          <div className="w-4 h-3 border border-yellow-700/20 rounded-sm"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Card number */}
                    <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/10">
                      <p className="text-lg font-mono tracking-[0.12em] font-medium">{maskCardNumber(card.card_number)}</p>
                    </div>
                    
                    {/* Bottom row: ID & Mastercard logo */}
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] text-white/50 font-medium tracking-wide">ID: {card.id}</p>
                      
                      {/* Mastercard logo */}
                      <div className="flex items-center">
                        <div className="w-7 h-7 rounded-full bg-[#EB001B]/90 -mr-3.5"></div>
                        <div className="w-7 h-7 rounded-full bg-[#F79E1B]/90"></div>
                        <span className="ml-2 text-[10px] font-bold text-white/70 tracking-wide">mastercard</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

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
    </motion.div>
  )
}
