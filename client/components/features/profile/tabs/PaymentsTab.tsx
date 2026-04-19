'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, CreditCard, Plus, Building2, Check, Eye, EyeOff } from 'lucide-react'
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

export function PaymentsTab({ user }: PaymentsTabProps) {
  const [bankCards, setBankCards] = useState<BankCard[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedCards, setCopiedCards] = useState<Set<number>>(new Set())
  const [visibleNumbers, setVisibleNumbers] = useState<Set<number>>(new Set())

  const copyCardNumber = (number: string, cardId: number) => {
    navigator.clipboard.writeText(number.replace(/\s/g, ''))
    setCopiedCards(prev => new Set(prev).add(cardId))
    setTimeout(() => {
      setCopiedCards(prev => {
        const newSet = new Set(prev)
        newSet.delete(cardId)
        return newSet
      })
    }, 2000)
  }

  const toggleCardNumberVisibility = (cardId: number) => {
    setVisibleNumbers(prev => {
      const newSet = new Set(prev)
      if (newSet.has(cardId)) {
        newSet.delete(cardId)
      } else {
        newSet.add(cardId)
      }
      return newSet
    })
  }

  const formatCardNumber = (number: string) => {
    return number.replace(/\s/g, '').match(/.{1,4}/g)?.join(' ') || number
  }

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

  const getBankStyle = (bankName: string) => {
    const name = bankName.toLowerCase()
    if (name.includes('ameria') || name.includes('ամերիա')) return 'bg-gradient-to-br from-amber-400 to-orange-500 text-white'
    if (name.includes('ardshin') || name.includes('արդշին')) return 'bg-gradient-to-br from-red-500 to-red-700 text-white'
    if (name.includes('acba') || name.includes('ակբա')) return 'bg-gradient-to-br from-emerald-500 to-green-700 text-white'
    if (name.includes('converse') || name.includes('կոնվերս')) return 'bg-gradient-to-br from-blue-500 to-blue-700 text-white'
    if (name.includes('ineco') || name.includes('ինեկո')) return 'bg-gradient-to-br from-violet-500 to-purple-700 text-white'
    if (name.includes('hsbc')) return 'bg-gradient-to-br from-slate-600 to-slate-800 text-white'
    return 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
  }

  return (
    <motion.div
      key="payments"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="space-y-4 sm:space-y-8 min-w-0 w-full"
    >
      <div className="flex items-center justify-between px-1 sm:px-2">
        <h3 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">Վճարումներ</h3>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="h-[140px] sm:h-[200px] bg-slate-200 rounded-xl sm:rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : bankCards.length === 0 ? (
        <Card className="shadow-lg sm:shadow-xl shadow-slate-200/50 rounded-xl sm:rounded-2xl bg-white overflow-hidden border border-slate-100/50 p-6 sm:p-12 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto">
              <CreditCard className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium">Բանկային քարտեր չկան</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
          {bankCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                className={`${getBankStyle(card.bank_name)} rounded-2xl sm:rounded-3xl overflow-hidden relative group hover:scale-[1.02] transition-all duration-500 shadow-xl sm:shadow-2xl shadow-slate-900/20`}
              >
                <div className="p-4 sm:p-6 relative z-10 flex flex-col justify-between h-[260px] sm:h-[320px]">
                  {/* Top row: Bank info & Status */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div className="w-9 h-9 sm:w-11 sm:h-11 bg-white/20 backdrop-blur-md rounded-lg sm:rounded-xl flex items-center justify-center border border-white/20 flex-shrink-0">
                        <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white/60">Բանկ</p>
                        <p className="font-bold text-sm sm:text-base truncate">{card.bank_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {card.is_active && (
                        <div className="flex items-center gap-1 sm:gap-1.5 bg-emerald-500/20 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border border-emerald-500/30">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                          <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-emerald-400">Ակտիվ</span>
                        </div>
                      )}
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
                    
                    {/* Card number with view/hide and copy */}
                    <div
                      className="bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-white/10 hover:bg-white/20 transition-colors group/card"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm sm:text-lg font-mono tracking-[0.08em] sm:tracking-[0.12em] font-medium text-white truncate">
                          {visibleNumbers.has(card.id) ? formatCardNumber(card.card_number) : maskCardNumber(card.card_number)}
                        </p>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => toggleCardNumberVisibility(card.id)}
                            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                            aria-label={visibleNumbers.has(card.id) ? 'Թաքցնել համարը' : 'Ցույց տալ համարը'}
                          >
                            {visibleNumbers.has(card.id) ? (
                              <EyeOff className="w-4 h-4 text-white/80" />
                            ) : (
                              <Eye className="w-4 h-4 text-white/80" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => copyCardNumber(card.card_number, card.id)}
                            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                            aria-label="Պատճենել համարը"
                          >
                            {copiedCards.has(card.id) ? (
                              <Check className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Copy className="w-4 h-4 text-white/80" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Bottom row: ID & Mastercard logo */}
                    <div className="flex items-center justify-between">
                      <p className="text-[9px] sm:text-[10px] text-white/50 font-medium tracking-wide">ID: {card.id}</p>

                      {/* Mastercard logo */}
                      <div className="flex items-center">
                        <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-[#EB001B]/90 -mr-2.5 sm:-mr-3.5"></div>
                        <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-[#F79E1B]/90"></div>
                        <span className="ml-1.5 sm:ml-2 text-[9px] sm:text-[10px] font-bold text-white/70 tracking-wide">mastercard</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

    </motion.div>
  )
}
