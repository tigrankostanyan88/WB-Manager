'use client'

import { useState, useMemo } from 'react'
import { CreditCard, CheckCircle, Clock, XCircle, User as UserIcon, BookOpen } from 'lucide-react'
import type { Payment, Course } from '../hooks/usePayments'
import type { User, FAQ } from '../types'

interface PaymentsTabProps {
  payments: Payment[]
  users: User[]
  courses: Course[]
  isLoading: boolean
  isSubmitting: boolean
  onCreatePayment: (data: {
    userId: string | number
    courseId: string | number
    amount: number
    paymentMethod: 'idram' | 'ameria' | 'acba'
  }) => Promise<void>
  onUpdateStatus?: (id: number, status: 'pending' | 'success' | 'failed') => Promise<void>
}

export default function PaymentsTab({
  payments,
  users,
  courses,
  isLoading,
  isSubmitting,
  onCreatePayment,
  onUpdateStatus
}: PaymentsTabProps) {
  const [selectedUser, setSelectedUser] = useState<string>('')
  const [selectedCourse, setSelectedCourse] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<'idram' | 'ameria' | 'acba'>('idram')
  const [showForm, setShowForm] = useState(false)
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  const handleStatusUpdate = async (id: number, newStatus: 'pending' | 'success' | 'failed') => {
    if (!onUpdateStatus) return
    setUpdatingId(id)
    try {
      await onUpdateStatus(id, newStatus)
    } catch (error) {
      console.error('Failed to update status:', error)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser || !selectedCourse || !amount) return

    await onCreatePayment({
      userId: selectedUser,
      courseId: selectedCourse,
      amount: parseFloat(amount),
      paymentMethod
    })

    // Reset form
    setSelectedUser('')
    setSelectedCourse('')
    setAmount('')
    setShowForm(false)
  }

  const getStatusIcon = (status: string) => {
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

  const getStatusText = (status: string) => {
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

  const getPaymentMethodText = (method: string) => {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
      </div>
    )
  }

  // Memoized payment calculations for performance
  const { totalAmount, successAmount, successCount, pendingAmount, pendingCount } = useMemo(() => {
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
  }, [payments])

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

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-violet-500 to-violet-600 rounded-2xl p-5 text-white">
          <p className="text-violet-100 text-sm font-medium">Ընդհանուր գումար</p>
          <p className="text-2xl font-bold mt-1">
            {totalAmount.toLocaleString()} դրամ
          </p>
          <p className="text-violet-200 text-xs mt-1">{payments.length} վճարում</p>
        </div>
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white">
          <p className="text-emerald-100 text-sm font-medium">Վճարված</p>
          <p className="text-2xl font-bold mt-1">
            {successAmount.toLocaleString()} դրամ
          </p>
          <p className="text-emerald-200 text-xs mt-1">
            {successCount} վճարում
          </p>
        </div>
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-5 text-white">
          <p className="text-amber-100 text-sm font-medium">Սպասման մեջ</p>
          <p className="text-2xl font-bold mt-1">
            {pendingAmount.toLocaleString()} դրամ
          </p>
          <p className="text-amber-200 text-xs mt-1">
            {pendingCount} վճարում
          </p>
        </div>
      </div>

      {/* Create Payment Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Նոր վճարում ավելացնել</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* User Select */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <UserIcon className="w-4 h-4 inline mr-1" />
                Օգտատեր
              </label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              >
                <option value="">Ընտրեք օգտատեր</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name || user.email}
                  </option>
                ))}
              </select>
            </div>

            {/* Course Select */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <BookOpen className="w-4 h-4 inline mr-1" />
                Դասընթաց
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => {
                  setSelectedCourse(e.target.value)
                  // Auto-fill amount from course price
                  const course = courses.find(c => c.id.toString() === e.target.value)
                  if (course) {
                    setAmount(course.price.toString())
                  }
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              >
                <option value="">Ընտրեք դասընթաց</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title?.trim() || `Դասընթաց #${course.id}`} ({course.price?.toLocaleString?.() || course.price || 0} դրամ)
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <CreditCard className="w-4 h-4 inline mr-1" />
                Գումար (դրամ)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="0"
                required
                min="0"
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Վճարման եղանակ
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as 'idram' | 'ameria' | 'acba')}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="idram">Idram</option>
                <option value="ameria">Ameria Bank</option>
                <option value="acba">ACBA Bank</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !selectedUser || !selectedCourse || !amount}
              className="px-6 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Պահպանվում է...' : 'Պահպանել և տալ դոստուպ'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
            >
              Չեղարկել
            </button>
          </div>
        </form>
      )}

      {/* Payments Table */}
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
                          onChange={(e) => handleStatusUpdate(payment.id, e.target.value as 'pending' | 'success' | 'failed')}
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
    </div>
  )
}
