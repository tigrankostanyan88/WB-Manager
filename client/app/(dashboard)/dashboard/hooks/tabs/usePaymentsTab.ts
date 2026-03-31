'use client'

import { usePayments } from '@/components/features/admin/hooks/usePayments'

interface UsePaymentsTabProps {
  activeTab: string
  allowed: boolean
}

export function usePaymentsTab({ activeTab, allowed }: UsePaymentsTabProps) {
  const {
    payments,
    users,
    courses,
    isLoading,
    isSubmitting,
    createPayment,
    updatePaymentStatus
  } = usePayments({ activeTab, allowed })

  return {
    payments,
    users,
    courses,
    isLoading,
    isSubmitting,
    createPayment,
    updatePaymentStatus
  }
}
