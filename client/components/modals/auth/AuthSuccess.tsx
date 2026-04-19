// modals/auth/AuthSuccess.tsx - Auth success animation component

import { CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export function AuthSuccess() {
  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="mx-auto w-24 h-24 bg-white rounded-2xl shadow-2xl flex items-center justify-center mb-6 relative z-10 border-4 border-slate-50"
      >
        <CheckCircle className="w-12 h-12 text-emerald-500" />
      </motion.div>

      <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
        Գրանցումը հաջողվեց
      </h2>
      <p className="text-slate-500 text-base max-w-[340px] mx-auto leading-relaxed">
        Մուտքը կատարվում է, խնդրում ենք սպասել...
      </p>
    </div>
  )
}
