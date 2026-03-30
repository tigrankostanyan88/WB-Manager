'use client'

// tabs/payments/index.ts - Payments tab barrel exports

export { PaymentsTab } from './PaymentsTab'
export { PaymentStats } from './PaymentStats'
export { PaymentForm } from './PaymentForm'
export { PaymentTable } from './PaymentTable'
export { calculatePaymentStats, getStatusIcon, getStatusText, getPaymentMethodText } from './utils'
export type { Payment, Course, User, PaymentStatus, PaymentMethod, PaymentsTabProps } from './types'
