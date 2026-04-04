'use client'

import { PaymentsTab } from '@/components/features/admin/tabs/payments/PaymentsTab'
import { PaymentsTabSkeleton } from '@/components/features/admin/tabs/payments/PaymentsTabSkeleton'
import { usePaymentsTab } from '@/app/(dashboard)/dashboard/hooks'

interface PaymentsTabWrapperProps {
  allowed: boolean
}

export function PaymentsTabWrapper({ allowed }: PaymentsTabWrapperProps) {
  const payments = usePaymentsTab({ activeTab: 'payments', allowed })
  
  if (payments.isLoading) {
    return <PaymentsTabSkeleton />
  }
  
  return (
    <PaymentsTab
      payments={payments.payments}
      users={payments.users}
      courses={payments.courses}
      isLoading={payments.isLoading}
      isSubmitting={payments.isSubmitting}
      onCreatePayment={payments.createPayment}
      onUpdateStatus={payments.updatePaymentStatus}
    />
  )
}
