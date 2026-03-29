// tabs/payments/PaymentTable.tsx - Payments table component

import { useState } from 'react'
import { User as UserIcon } from 'lucide-react'
import { getStatusIcon, getStatusText, getPaymentMethodText } from './utils'
import type { Payment, PaymentStatus } from './types'

interface PaymentTableProps {
  payments: Payment[]
  onUpdateStatus?: (id: number, status: PaymentStatus) => Promise<void>
}

export function PaymentTable({ payments, onUpdateStatus }: PaymentTableProps) {
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  const handleStatusUpdate = async (id: number, newStatus: PaymentStatus) => {
    if (!onUpdateStatus) return
    setUpdatingId(id)
    try {
      await onUpdateStatus(id, newStatus)
    } catch {
      // Error handled by parent
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 w-48">Օգտատեր</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 w-56">Դասընթաց</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 w-28">Գումար</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 w-28">Եղանակ</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 w-40">Կարգավիճակ</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 w-28">Ամսաթիվ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {payments.length > 0 ? (
            payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-violet-600" />
                    </div>
                    <span className="font-medium text-slate-900">
                      {payment.user?.firstName && payment.user?.lastName
                        ? `${payment.user.firstName} ${payment.user.lastName}`
                        : payment.user?.email || `Օգտատեր #${payment.user_id}`}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-700">
                  <span
                    className="block truncate max-w-56"
                    title={payment.course?.title || `Դասընթաց #${payment.course_id}`}
                  >
                    {payment.course?.title || `Դասընթաց #${payment.course_id}`}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium text-slate-900">
                    {parseFloat(payment.amount.toString()).toLocaleString()} դրամ
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {getPaymentMethodText(payment.payment_method)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1 min-w-36">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(payment.status)}
                      <span className={`text-sm font-medium ${
                        payment.status === 'success' ? 'text-emerald-600' :
                        payment.status === 'pending' ? 'text-amber-600' :
                        'text-red-600'
                      }`}>
                        {getStatusText(payment.status)}
                      </span>
                    </div>
                    {onUpdateStatus && (
                      <select
                        value={payment.status}
                        onChange={(e) => handleStatusUpdate(payment.id, e.target.value as PaymentStatus)}
                        disabled={updatingId === payment.id}
                        className={`mt-1 px-2 py-1 text-xs rounded-lg border focus:outline-none focus:ring-2 cursor-pointer ${
                          payment.status === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 focus:ring-emerald-500' :
                          payment.status === 'pending' ? 'bg-amber-50 border-amber-200 text-amber-700 focus:ring-amber-500' :
                          'bg-red-50 border-red-200 text-red-700 focus:ring-red-500'
                        } ${updatingId === payment.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <option value="pending">Սպասում</option>
                        <option value="success">Վճարված</option>
                        <option value="failed">Մերժված</option>
                      </select>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-500">
                  {new Date(payment.createdAt).toLocaleDateString('hy-AM')}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                Վճարումներ չկան
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
