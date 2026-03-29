// tabs/payments/types.ts - Payment types

export type PaymentStatus = 'pending' | 'success' | 'failed'
export type PaymentMethod = 'idram' | 'ameria' | 'acba'

export interface Payment {
  id: number
  user_id: number
  course_id: number
  amount: number | string
  payment_method: PaymentMethod
  status: PaymentStatus
  createdAt: string
  user?: {
    firstName?: string
    lastName?: string
    email?: string
  }
  course?: {
    title?: string
  }
}

export interface Course {
  id: number | string
  title?: string
  price: number
}

export interface User {
  id: number | string
  name?: string
  email: string
}

export interface PaymentsTabProps {
  payments: Payment[]
  users: User[]
  courses: Course[]
  isLoading: boolean
  isSubmitting: boolean
  onCreatePayment: (data: {
    userId: string | number
    courseId: string | number
    amount: number
    paymentMethod: PaymentMethod
  }) => Promise<void>
  onUpdateStatus?: (id: number, status: PaymentStatus) => Promise<void>
}
