'use client'

import { useEffect, useState } from 'react'
import { userService } from '@/lib/api'
import type { DashboardTabId, User } from '../_types'

export interface Course {
  id: number
  title: string
  price: number
}

export interface Payment {
  id: number
  user_id: number
  course_id: number
  order_id: string
  amount: number
  status: 'pending' | 'success' | 'failed'
  payment_method: 'idram' | 'ameria' | 'acba'
  transaction_id?: string
  paid_at?: string
  createdAt: string
  user?: User
  course?: Course
}

interface PaymentFormData {
  userId: string | number
  courseId: string | number
  amount: number
  paymentMethod: 'idram' | 'ameria' | 'acba'
}

interface UsePaymentsParams {
  activeTab: DashboardTabId
  allowed: boolean
}

export default function usePayments({ activeTab, allowed }: UsePaymentsParams) {
  const [payments, setPayments] = useState<Payment[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch payments, users, and courses when tab is active
  useEffect(() => {
    if (!allowed) return
    if (activeTab !== 'payments') return
    
    let cancelled = false
    
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch all data in parallel
        const [paymentsRes, usersRes, coursesRes] = await Promise.all([
          fetch('/api/v1/payments').then(r => r.json()),
          userService.getAllUsers(),
          fetch('/api/v1/courses').then(r => r.json())
        ])
        
        if (!cancelled) {
          setPayments(paymentsRes?.payments || [])
          setUsers((usersRes.data?.users || []).filter((u: User) => u.role === 'user'))
          // Handle different response formats: coursesRes.courses or coursesRes.data.courses or just coursesRes
          let fetchedCourses = []
          if (Array.isArray(coursesRes)) {
            fetchedCourses = coursesRes
          } else if (coursesRes?.courses && Array.isArray(coursesRes.courses)) {
            fetchedCourses = coursesRes.courses
          } else if (coursesRes?.data?.courses && Array.isArray(coursesRes.data.courses)) {
            fetchedCourses = coursesRes.data.courses
          } else if (coursesRes?.data && Array.isArray(coursesRes.data)) {
            fetchedCourses = coursesRes.data
          }
          setCourses(fetchedCourses)
          console.log('DEBUG - Courses fetched:', fetchedCourses)
        }
      } catch (error) {
        console.error('Error fetching payments data:', error)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    
    fetchData()
    
    return () => {
      cancelled = true
    }
  }, [activeTab, allowed])

  const createPayment = async (data: PaymentFormData) => {
    setIsSubmitting(true)
    try {
      console.log('DEBUG - Creating payment with data:', data)
      
      const response = await fetch('/api/v1/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: data.userId,
          course_id: data.courseId,
          amount: data.amount,
          payment_method: data.paymentMethod
        })
      })
      
      console.log('DEBUG - Response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('DEBUG - Error response:', errorText)
        throw new Error(`Failed to create payment: ${response.status} - ${errorText}`)
      }
      
      const result = await response.json()
      console.log('DEBUG - Success result:', result)
      
      // Add the new payment to the list
      if (result.payment) {
        setPayments(prev => [result.payment, ...prev])
      }
      
      return result
    } catch (error) {
      console.error('Error creating payment:', error)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  const verifyPayment = async (orderId: string) => {
    try {
      const response = await fetch(`/api/v1/payments/${orderId}/verify`, {
        method: 'POST'
      })
      
      if (!response.ok) {
        throw new Error('Failed to verify payment')
      }
      
      const result = await response.json()
      
      // Update the payment in the list
      if (result.payment) {
        setPayments(prev => prev.map(p => 
          p.order_id === orderId ? result.payment : p
        ))
      }
      
      return result
    } catch (error) {
      console.error('Error verifying payment:', error)
      throw error
    }
  }

  return {
    payments,
    users,
    courses,
    isLoading,
    isSubmitting,
    createPayment,
    verifyPayment
  }
}
