'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { queryKeys } from '@/lib/queryKeys'
import type { User, Payment, Course } from '@/components/features/admin/types'

export interface PaymentFormData {
  userId: string | number
  courseId: string | number
  amount: number
  paymentMethod: 'idram' | 'ameria' | 'acba'
}

interface UsePaymentsParams {
  activeTab: string
  allowed: boolean
}

// React Query Hooks
export function usePaymentsQuery() {
  return useQuery({
    queryKey: queryKeys.payments,
    queryFn: async () => {
      const res = await api.get('/api/v1/payments')
      return (res.data?.payments || []) as Payment[]
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function usePaymentUsersQuery() {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: async () => {
      const res = await api.get('/api/v1/users')
      return (res.data?.users || []).filter((u: User) => u.role === 'user') as User[]
    },
    staleTime: 1000 * 60 * 10,
  })
}

export function usePaymentCoursesQuery() {
  return useQuery({
    queryKey: queryKeys.courses,
    queryFn: async () => {
      const res = await api.get('/api/v1/courses')
      const coursesData = res.data?.data || res.data?.courses || []
      return Array.isArray(coursesData) ? coursesData : []
    },
    staleTime: 1000 * 60 * 10,
  })
}

export function useCreatePayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: PaymentFormData) => {
      const response = await api.post('/api/v1/payments', {
        user_id: data.userId,
        course_id: data.courseId,
        amount: data.amount,
        payment_method: data.paymentMethod,
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments })
    },
  })
}

export function useVerifyPayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (orderId: string) => {
      const response = await api.post(`/api/v1/payments/${orderId}/verify`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments })
    },
  })
}

export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: 'pending' | 'success' | 'failed' }) => {
      const response = await api.patch(`/api/v1/payments/${id}/status`, { status })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments })
    },
  })
}

// Main Hook
export function usePayments({ activeTab, allowed }: UsePaymentsParams) {
  const { data: payments = [], isLoading: isPaymentsLoading } = usePaymentsQuery()
  const { data: users = [], isLoading: isUsersLoading } = usePaymentUsersQuery()
  const { data: courses = [], isLoading: isCoursesLoading } = usePaymentCoursesQuery()
  const createPayment = useCreatePayment()
  const verifyPayment = useVerifyPayment()
  const updatePaymentStatus = useUpdatePaymentStatus()

  const isLoading = isPaymentsLoading || isUsersLoading || isCoursesLoading
  const isSubmitting = createPayment.isPending || verifyPayment.isPending || updatePaymentStatus.isPending

  const createPaymentHandler = async (data: PaymentFormData) => {
    return createPayment.mutateAsync(data)
  }

  const verifyPaymentHandler = async (orderId: string) => {
    return verifyPayment.mutateAsync(orderId)
  }

  const updatePaymentStatusHandler = async (id: number, status: 'pending' | 'success' | 'failed') => {
    return updatePaymentStatus.mutateAsync({ id, status })
  }

  return {
    payments,
    users,
    courses,
    isLoading,
    isSubmitting,
    createPayment: createPaymentHandler,
    verifyPayment: verifyPaymentHandler,
    updatePaymentStatus: updatePaymentStatusHandler,
  }
}
