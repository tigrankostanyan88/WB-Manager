'use client'

import { Plus, Edit, Trash2, X, Check } from 'lucide-react'
import type { FAQ } from '@/components/features/admin/types'

interface FaqTabProps {
  faqs: FAQ[]
  faqForm: { title: string; text: string }
  setFaqForm: React.Dispatch<React.SetStateAction<{ title: string; text: string }>>
  isFaqLoading: boolean
  isFaqSubmitting: boolean
  editingId: number | null
  editForm: { title: string; text: string }
  setEditForm: React.Dispatch<React.SetStateAction<{ title: string; text: string }>>
  isFaqUpdating: boolean
  submitFaq: (e: React.FormEvent) => Promise<void>
  startEdit: (faq: FAQ) => void
  cancelEdit: () => void
  updateFaq: (e: React.FormEvent) => Promise<void>
  deleteFaq: (id: number) => void
}

export function FaqTab({
  faqs,
  faqForm,
  setFaqForm,
  isFaqLoading,
  isFaqSubmitting,
  editingId,
  editForm,
  setEditForm,
  isFaqUpdating,
  submitFaq,
  startEdit,
  cancelEdit,
  updateFaq,
  deleteFaq
}: FaqTabProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">ՀՏՀ</h2>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="text-sm font-medium text-slate-700 mb-4">Ավելացնել նոր հարց</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Հարց"
            value={faqForm.title}
            onChange={(e) => setFaqForm(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <textarea
            placeholder="Պատասխան"
            value={faqForm.text}
            onChange={(e) => setFaqForm(prev => ({ ...prev, text: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <button
            onClick={submitFaq}
            disabled={isFaqSubmitting}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
            {isFaqSubmitting ? 'Ավելացվում է...' : 'Ավելացնել'}
          </button>
        </div>
      </div>

      {isFaqLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
        </div>
      ) : faqs.length > 0 ? (
        <div className="grid gap-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              {editingId === faq.id ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <textarea
                    value={editForm.text}
                    onChange={(e) => setEditForm(prev => ({ ...prev, text: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={updateFaq}
                      disabled={isFaqUpdating}
                      className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      {isFaqUpdating ? 'Պահպանվում է...' : 'Պահպանել'}
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex items-center gap-2 px-4 py-2 text-slate-700 font-medium hover:bg-slate-50 rounded-xl transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Չեղարկել
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">{faq.question}</h3>
                    <p className="text-slate-600 mt-2">{faq.answer}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(faq)}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4 text-slate-500" />
                    </button>
                    <button
                      onClick={() => deleteFaq(faq.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-500 text-center py-12">Հարցեր չկան</p>
      )}
    </div>
  )
}
