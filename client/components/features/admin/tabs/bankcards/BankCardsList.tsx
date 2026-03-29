// tabs/bankcards/BankCardsList.tsx - Bank cards grid + empty state

import { CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { BankCardDisplay } from './BankCardDisplay'
import { BankCardEdit } from './BankCardEdit'
import type { BankCard } from '@/components/features/admin/hooks/useBankCards'

interface BankCardsListProps {
  cards: BankCard[]
  editingId: number | null
  editForm: { bank_name: string; card_number: string; is_active: boolean }
  isEditing: boolean
  visibleNumbers: Set<number>
  copiedCards: Set<number>
  getBankGradient: (bankName: string) => string
  maskCardNumber: (number: string, visible: boolean) => string
  maskCardNumberInput: (value: string) => string
  onEditFormChange: (data: { bank_name: string; card_number: string; is_active: boolean }) => void
  onUpdateCard: (e: React.FormEvent) => void
  onCancelEdit: () => void
  onStartEdit: (card: BankCard) => void
  onDelete: (id: number) => void
  onToggleVisibility: (id: number) => void
  onCopy: (number: string, id: number) => void
  onAddClick: () => void
}

export function BankCardsList({
  cards,
  editingId,
  editForm,
  isEditing,
  visibleNumbers,
  copiedCards,
  getBankGradient,
  maskCardNumber,
  maskCardNumberInput,
  onEditFormChange,
  onUpdateCard,
  onCancelEdit,
  onStartEdit,
  onDelete,
  onToggleVisibility,
  onCopy,
  onAddClick
}: BankCardsListProps) {
  if (cards.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto">
            <CreditCard className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-500 font-medium">Քարտեր չկան</p>
          <Button onClick={onAddClick} variant="outline">
            Ավելացնել առաջին քարտը
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {cards.map((card) => (
        <div key={card.id}>
          {editingId === card.id ? (
            <BankCardEdit
              editForm={editForm}
              isEditing={isEditing}
              onEditFormChange={onEditFormChange}
              onSubmit={onUpdateCard}
              onCancel={onCancelEdit}
              maskCardNumberInput={maskCardNumberInput}
            />
          ) : (
            <BankCardDisplay
              card={card}
              isVisible={visibleNumbers.has(card.id)}
              isCopied={copiedCards.has(card.id)}
              getBankGradient={getBankGradient}
              maskCardNumber={maskCardNumber}
              onToggleVisibility={() => onToggleVisibility(card.id)}
              onCopy={() => onCopy(card.card_number, card.id)}
              onEdit={() => onStartEdit(card)}
              onDelete={() => onDelete(card.id)}
            />
          )}
        </div>
      ))}
    </div>
  )
}
