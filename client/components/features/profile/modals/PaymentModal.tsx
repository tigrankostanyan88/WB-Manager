'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, CreditCard, Shield, X } from 'lucide-react'

interface PaymentModalProps {
  open: boolean
  onClose: () => void
}

export function PaymentModal({ open, onClose }: PaymentModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Ընտրեք վճարման ձևը</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">Ակտիվացրեք PRO հաշիվը հիմա</p>
                </div>
                <button 
                  onClick={onClose} 
                  className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                  aria-label="Փակել"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-4">
                <button className="w-full group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl blur opacity-0 group-hover:opacity-10 transition duration-500"></div>
                  <div className="relative flex items-center justify-between p-5 bg-slate-50 hover:bg-white border-2 border-transparent hover:border-violet-600/20 rounded-2xl transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#635BFF] flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <p className="font-black text-slate-900">Stripe</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Վճարել քարտով</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-violet-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>

                <button className="w-full group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl blur opacity-0 group-hover:opacity-10 transition duration-500"></div>
                  <div className="relative flex items-center justify-between p-5 bg-slate-50 hover:bg-white border-2 border-transparent hover:border-orange-500/20 rounded-2xl transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#F7931E] flex items-center justify-center text-white shadow-lg shadow-orange-100 font-black italic">ID</div>
                      <div className="text-left">
                        <p className="font-black text-slate-900">Idram</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Էլեկտրոնային դրամապանակ</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-50">
                <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] justify-center">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  Ապահով և պաշտպանված վճարում
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
