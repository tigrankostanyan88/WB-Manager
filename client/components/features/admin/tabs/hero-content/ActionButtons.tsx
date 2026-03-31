'use client'

import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'

interface ActionButtonsProps {
  isSubmitting: boolean
  onSubmit: () => void
}

export function ActionButtons({
  isSubmitting,
  onSubmit
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
    </div>
  )
}
