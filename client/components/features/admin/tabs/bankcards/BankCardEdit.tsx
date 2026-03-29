// tabs/bankcards/BankCardEdit.tsx - Edit bank card form

import { Check, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface BankCardEditProps {
  editForm: { bank_name: string; card_number: string; is_active: boolean }
  isEditing: boolean
  onEditFormChange: (data: { bank_name: string; card_number: string; is_active: boolean }) => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
  maskCardNumberInput: (value: string) => string
}

export function BankCardEdit({
  editForm,
  isEditing,
  onEditFormChange,
  onSubmit,
  onCancel,
  maskCardNumberInput
}: BankCardEditProps) {
  return (
    <Card className="border-violet-200 shadow-lg">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Խմբագրել քարտը</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit_bank_name">Բանկի անվանում</Label>
              <Input
                id="edit_bank_name"
                placeholder="օր․՝ Ameria Bank"
                value={editForm.bank_name}
                onChange={(e) => onEditFormChange({ ...editForm, bank_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_card_number">Քարտի համար</Label>
              <Input
                id="edit_card_number"
                placeholder="օր․՝ 1234 5678 9012 3456"
                value={editForm.card_number}
                onChange={(e) => onEditFormChange({ ...editForm, card_number: maskCardNumberInput(e.target.value) })}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onEditFormChange({ ...editForm, is_active: !editForm.is_active })}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                editForm.is_active
                  ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-200'
                  : 'bg-slate-100 text-slate-500 border-2 border-slate-200'
              }`}
            >
              {editForm.is_active ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              Ակտիվ
            </button>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isEditing} className="bg-violet-600 hover:bg-violet-700">
              {isEditing ? 'Պահպանում է...' : 'Պահպանել'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Չեղարկել
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
