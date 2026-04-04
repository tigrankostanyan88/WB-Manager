// tabs/bankcards/BankCardForm.tsx - Create bank card form with Zod validation

import { X, Check, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useZodForm } from '@/hooks/useZodForm'
import { BankCardFormSchema } from '@/lib/validation'

interface BankCardFormProps {
  initialData?: { bank_name: string; card_number: string; is_active: boolean }
  isSubmitting: boolean
  onSubmit: (data: { bank_name: string; card_number: string; is_active: boolean }) => void | Promise<void>
  onCancel: () => void
}

export function BankCardForm({ initialData, isSubmitting, onSubmit, onCancel }: BankCardFormProps) {
  const {
    values,
    errors,
    setValue,
    handleSubmit
  } = useZodForm({
    schema: BankCardFormSchema,
    initialValues: initialData || { bank_name: '', card_number: '', is_active: true },
    onSubmit
  })

  return (
    <div className="overflow-hidden animate-in slide-in-from-top-2 duration-300">
      <Card className="border-violet-200 shadow-lg">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bank_name">Բանկի անվանում</Label>
                <Input
                  id="bank_name"
                  placeholder="օր․՝ Ameria Bank"
                  value={values.bank_name}
                  onChange={(e) => setValue('bank_name', e.target.value)}
                  className={errors.bank_name ? 'border-red-500 focus:border-red-500' : ''}
                />
                {errors.bank_name && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.bank_name}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="card_number">Քարտի համար</Label>
                <Input
                  id="card_number"
                  placeholder="օր․՝ 1234 5678 9012 3456"
                  value={values.card_number}
                  onChange={(e) => setValue('card_number', e.target.value)}
                  className={errors.card_number ? 'border-red-500 focus:border-red-500' : ''}
                />
                {errors.card_number && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.card_number}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setValue('is_active', !values.is_active)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  values.is_active
                    ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-200'
                    : 'bg-slate-100 text-slate-500 border-2 border-slate-200'
                }`}
              >
                {values.is_active ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
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
