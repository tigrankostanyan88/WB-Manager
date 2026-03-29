// tabs/payments/PaymentsTab.tsx - Main payments tab orchestrator

'use client'

import { useState, useMemo } from 'react'
import { PaymentStats } from './PaymentStats'
import { PaymentForm } from './PaymentForm'
import { PaymentTable } from './PaymentTable'
import { calculatePaymentStats } from './utils'
import type { PaymentsTabProps } from './types'

export function PaymentsTab({
  payments,
  users,
  courses,
  isLoading,
  isSubmitting,
  onCreatePayment,
  onUpdateStatus
}: PaymentsTabProps) {
  const [showForm, setShowForm] = useState(false)

  const stats = useMemo(() => calculatePaymentStats(payments), [payments])

  const handleSubmit = (data: {
    userId: string
    courseId: string
    amount: number
    paymentMethod: 'idram' | 'ameria' | 'acba'
  }) => {
    onCreatePayment({
      userId: data.userId,
      courseId: data.courseId,
      amount: data.amount,
      paymentMethod: data.paymentMethod
    })
    setShowForm(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Վճարումներ</h2>
          <p className="text-slate-500">Օգտատերերի կուրսերի վճարումներ</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors"
        >
          {showForm ? 'Փակել' : '+ Նոր վճարում'}
        </button>
      </div>

      {/* Stats */}
      <PaymentStats stats={stats} totalCount={payments.length} />

      {/* Create Payment Form */}
      {showForm && (
        <PaymentForm
          users={users}
          courses={courses}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Payments Table */}
      <PaymentTable payments={payments} onUpdateStatus={onUpdateStatus} />
    </div>
  )
}

export default PaymentsTab
