'use client'

import { Button } from '@/components/ui/button'
import { Save, Trash2 } from 'lucide-react'

interface ActionButtonsProps {
  isSubmitting: boolean
  onSubmit: () => void
  onDelete: () => void
}

export function ActionButtons({
  isSubmitting,
  onSubmit,
  onDelete
}: ActionButtonsProps) {
  return (
    <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between">
      <Button
        onClick={onSubmit}
        disabled={isSubmitting}
        className="bg-slate-900 text-white hover:bg-slate-800 rounded-2xl h-14 px-10 font-black text-sm shadow-xl flex items-center gap-3 transition-all active:scale-95"
      >
        <Save className="w-5 h-5" />
        {isSubmitting ? 'Պահպանվում է...' : 'Պահպանել փոփոխությունները'}
      </Button>

      <Button
        onClick={onDelete}
        disabled={isSubmitting}
        variant="outline"
        className="rounded-2xl h-14 px-6 font-black text-sm border-red-200 text-red-500 hover:text-red-600 hover:bg-red-50 flex items-center gap-3 transition-all active:scale-95"
      >
        <Trash2 className="w-5 h-5" />
        Ջնջել
      </Button>
    </div>
  )
}
