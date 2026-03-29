// tabs/payments/utils.ts - Payment helper functions

import { CheckCircle, Clock, XCircle } from 'lucide-react'
import type { PaymentStatus, PaymentMethod } from './types'

export function getStatusIcon(status: PaymentStatus) {
  switch (status) {
    case 'success':
      return <CheckCircle className="w-5 h-5 text-emerald-500" />
    case 'pending':
      return <Clock className="w-5 h-5 text-amber-500" />
    case 'failed':
      return <XCircle className="w-5 h-5 text-red-500" />
    default:
      return null
  }
}

export function getStatusText(status: PaymentStatus): string {
  switch (status) {
    case 'success':
      return 'Հաջող'
    case 'pending':
      return 'Սպասման մեջ'
    case 'failed':
      return 'Չհաջողվեց'
    default:
      return status
  }
}

export function getPaymentMethodText(method: PaymentMethod): string {
  switch (method) {
    case 'idram':
      return 'Idram'
    case 'ameria':
      return 'Ameria Bank'
    case 'acba':
      return 'ACBA Bank'
    default:
      return method
  }
}

export interface PaymentStats {
  totalAmount: number
  successAmount: number
  successCount: number
  pendingAmount: number
  pendingCount: number
}

export function calculatePaymentStats(payments: { amount: number | string; status: PaymentStatus }[]): PaymentStats {
  const total = payments.reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0)
  const successPayments = payments.filter(p => p.status === 'success')
  const successAmt = successPayments.reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0)
  const pendingPayments = payments.filter(p => p.status === 'pending')
  const pendingAmt = pendingPayments.reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0)

  return {
    totalAmount: total,
    successAmount: successAmt,
    successCount: successPayments.length,
    pendingAmount: pendingAmt,
    pendingCount: pendingPayments.length
  }
}
