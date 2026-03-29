// tabs/payments/PaymentStats.tsx - Payment stats cards

import type { PaymentStats as PaymentStatsType } from './utils'

interface PaymentStatsProps {
  stats: PaymentStatsType
  totalCount: number
}

export function PaymentStats({ stats, totalCount }: PaymentStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-gradient-to-r from-violet-500 to-violet-600 rounded-2xl p-5 text-white">
        <p className="text-violet-100 text-sm font-medium">Ընդհանուր գումար</p>
        <p className="text-2xl font-bold mt-1">
          {stats.totalAmount.toLocaleString()} դրամ
        </p>
        <p className="text-violet-200 text-xs mt-1">{totalCount} վճարում</p>
      </div>

      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white">
        <p className="text-emerald-100 text-sm font-medium">Վճարված</p>
        <p className="text-2xl font-bold mt-1">
          {stats.successAmount.toLocaleString()} դրամ
        </p>
        <p className="text-emerald-200 text-xs mt-1">
          {stats.successCount} վճարում
        </p>
      </div>

      <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-5 text-white">
        <p className="text-amber-100 text-sm font-medium">Սպասման մեջ</p>
        <p className="text-2xl font-bold mt-1">
          {stats.pendingAmount.toLocaleString()} դրամ
        </p>
        <p className="text-amber-200 text-xs mt-1">
          {stats.pendingCount} վճարում
        </p>
      </div>
    </div>
  )
}
