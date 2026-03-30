'use client'

import { AlertTriangle, UserX } from 'lucide-react'

type Variant = 'danger' | 'warning'

interface ConfirmationModalProps {
  isOpen: boolean
  title: string
  message: string
  warningText?: string
  count?: number
  variant?: Variant
  icon?: 'alert' | 'user'
  onCancel: () => void
  onConfirm: () => void
  confirmText?: string
  cancelText?: string
}

const variantStyles: Record<Variant, { bg: string; border: string; text: string; iconBg: string; iconColor: string; button: string }> = {
  danger: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    button: 'bg-red-600 hover:bg-red-700'
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    button: 'bg-red-600 hover:bg-red-700'
  }
}

export function ConfirmationModal({
  isOpen,
  title,
  message,
  warningText = 'Այս գործողությունը անվերադարձ է։',
  count,
  variant = 'danger',
  icon = 'alert',
  onCancel,
  onConfirm,
  confirmText = 'Ջնջել ընդմիշտ',
  cancelText = 'Չեղարկել'
}: ConfirmationModalProps) {
  if (!isOpen) return null

  const styles = variantStyles[variant]
  const IconComponent = icon === 'user' ? UserX : AlertTriangle

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] overflow-y-auto py-8">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl my-auto">
        <div className="flex flex-col items-center text-center">
          <div className={`w-12 h-12 rounded-full ${styles.iconBg} flex items-center justify-center mb-4`}>
            <IconComponent className={`w-6 h-6 ${styles.iconColor}`} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
          <div className={`${styles.bg} border ${styles.border} rounded-lg p-4 mb-4 text-left w-full`}>
            <p className={`${styles.text} text-sm font-medium mb-2`}>⚠️ Ուշադրություն</p>
            <p className="text-slate-600 text-sm">
              {count !== undefined ? (
                <>
                  Վստա՞հ եք, որ ցանկանում եք ընդմիշտ ջնջել <span className="font-medium text-slate-800">{count} օգտատիրոջը</span>։
                </>
              ) : (
                message
              )}
            </p>
            <p className="text-slate-600 text-sm mt-2">
              <span className="text-red-600 font-medium">{warningText}</span>
            </p>
          </div>
          <div className="flex gap-3 w-full">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors font-medium"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2.5 ${styles.button} text-white rounded-xl transition-colors font-medium`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
