// tabs/payments/PaymentForm.tsx - Create payment form

import { useState } from 'react'
import { CreditCard, User as UserIcon, BookOpen } from 'lucide-react'
import type { User, Course, PaymentMethod } from './types'

interface PaymentFormProps {
  users: User[]
  courses: Course[]
  isSubmitting: boolean
  onSubmit: (data: {
    userId: string
    courseId: string
    amount: number
    paymentMethod: PaymentMethod
  }) => void
  onCancel: () => void
}

export function PaymentForm({ users, courses, isSubmitting, onSubmit, onCancel }: PaymentFormProps) {
  const [selectedUser, setSelectedUser] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('idram')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser || !selectedCourse || !amount) return

    onSubmit({
      userId: selectedUser,
      courseId: selectedCourse,
      amount: parseFloat(amount),
      paymentMethod
    })
  }

  const handleCourseChange = (value: string) => {
    setSelectedCourse(value)
    const course = courses.find(c => c.id.toString() === value)
    if (course) {
      setAmount(course.price.toString())
    }
  }

  return (
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
            onChange={(e) => handleCourseChange(e.target.value)}
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
            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
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
          onClick={onCancel}
          className="px-6 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
        >
          Չեղարկել
        </button>
      </div>
    </form>
  )
}
