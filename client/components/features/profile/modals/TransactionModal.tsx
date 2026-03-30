'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { CreditCard, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Transaction {
  id: string
  title: string
  date: string
  status: 'completed' | 'pending'
  price: string
  type: 'deposit' | 'withdraw'
}

interface TransactionModalProps {
  transaction: Transaction | null
  onClose: () => void
}

export function TransactionModal({ transaction, onClose }: TransactionModalProps) {
  return (
    <AnimatePresence>
      {transaction && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-8">
              <div className="flex flex-col items-center text-center space-y-4 mb-8">
                <div className={cn('w-20 h-20 rounded-2xl flex items-center justify-center', transaction.type === 'deposit' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600')}>
                  {transaction.type === 'deposit' ? <TrendingUp className="w-10 h-10" /> : <CreditCard className="w-10 h-10" />}
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-900">{transaction.title}</h4>
                  <p className="text-sm font-bold text-slate-400">{transaction.date}</p>
                </div>
              </div>

              <div className="space-y-4 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Կարգավիճակ</span>
                  <span
                    className={cn(
                      'px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider',
                      transaction.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                    )}
                  >
                    {transaction.status === 'completed' ? 'Վճարված է' : 'Սպասման մեջ'}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Գումար</span>
                  <span className={cn('text-xl font-black', transaction.type === 'deposit' ? 'text-emerald-600' : 'text-slate-900')}>{transaction.price}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">ID</span>
                  <span className="text-[11px] font-bold text-slate-600">{transaction.id}</span>
                </div>
              </div>

              <Button onClick={onClose} className="w-full mt-8 bg-slate-900 text-white hover:bg-slate-800 rounded-xl h-14 font-black shadow-xl">
                Փակել
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
