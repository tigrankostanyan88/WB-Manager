// tabs/bankcards/BankCardForm.tsx - Create bank card form

import { X, Check } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface BankCardFormProps {
  formData: { bank_name: string; card_number: string; is_active: boolean }
  isSubmitting: boolean
  onFormChange: (data: { bank_name: string; card_number: string; is_active: boolean }) => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
}

export function BankCardForm({ formData, isSubmitting, onFormChange, onSubmit, onCancel }: BankCardFormProps) {
  return (
    <div className="overflow-hidden animate-in slide-in-from-top-2 duration-300">
      <Card className="border-violet-200 shadow-lg">
        <CardContent className="p-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bank_name">Բանկի անվանում</Label>
                <Input
                  id="bank_name"
                  placeholder="օր․՝ Ameria Bank"
                  value={formData.bank_name}
                  onChange={(e) => onFormChange({ ...formData, bank_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="card_number">Քարտի համար</Label>
                <Input
                  id="card_number"
                  placeholder="օր․՝ 1234 5678 9012 3456"
                  value={formData.card_number}
                  onChange={(e) => onFormChange({ ...formData, card_number: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => onFormChange({ ...formData, is_active: !formData.is_active })}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  formData.is_active
                    ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-200'
                    : 'bg-slate-100 text-slate-500 border-2 border-slate-200'
                }`}
              >
                {formData.is_active ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                Ակտիվ
              </button>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting} className="bg-violet-600 hover:bg-violet-700">
                {isSubmitting ? 'Ավելացնում է...' : 'Ավելացնել'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Չեղարկել
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
