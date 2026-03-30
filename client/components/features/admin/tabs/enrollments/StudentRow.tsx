'use client'

import { CheckCircle, AlertCircle, X } from 'lucide-react'
import { formatDate } from './utils'
import type { Enrollment } from './utils'

interface StudentRowProps {
  enrollment: Enrollment
  isRevoking: boolean
  onRevoke: (userId: number, courseId: number) => void
}

export function StudentRow({ enrollment, isRevoking, onRevoke }: StudentRowProps) {
  return (
    <tr className="hover:bg-slate-50">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-600">
            {enrollment.student?.name?.charAt(0).toUpperCase() || '?'}
          </div>
          <span className="font-medium text-slate-900">{enrollment.student?.name || 'Անհայտ'}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-slate-600">{enrollment.student?.email || '-'}</td>
      <td className="px-4 py-3 text-sm text-slate-600">{enrollment.student?.phone || '-'}</td>
      <td className="px-4 py-3">
        {enrollment.status === 'active' ? (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
            <CheckCircle className="w-3 h-3" />
            Ակտիվ
          </span>
        ) : enrollment.status === 'expired' ? (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
            <AlertCircle className="w-3 h-3" />
            Ավարտված
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
            <AlertCircle className="w-3 h-3" />
            Սպասող
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-sm text-slate-500">{formatDate(enrollment.createdAt)}</td>
      <td className="px-4 py-3 text-right">
        {enrollment.status === 'active' && (
          <button
            onClick={() => onRevoke(enrollment.user_id, enrollment.course_id)}
            disabled={isRevoking}
            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-slate-400 hover:text-red-500 disabled:opacity-50"
            title="Հետ կանչել մուտքը"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </td>
    </tr>
  )
}
