'use client'

import { useEffect, useState } from 'react'
import { CreditCard, Trash2 } from 'lucide-react'

export default function BankCardsTab() {
  const [cards, setCards] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function fetchCards() {
      setIsLoading(true)
      try {
        const res = await fetch('/api/bank-cards')
        const data = await res.json()
        setCards(data.cards || [])
      } catch (error) {
        console.error('Error fetching cards:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCards()
  }, [])

  const handleDeleteCard = async (id: string) => {
    try {
      const res = await fetch(`/api/bank-cards/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setCards(cards.filter(c => c._id !== id))
      }
    } catch (error) {
      console.error('Error deleting card:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">Բանկային քարտեր</h2>

      {cards.length > 0 ? (
        <div className="grid gap-4">
          {cards.map((card) => (
            <div key={card._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-violet-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">**** **** **** {card.cardNumber.slice(-4)}</p>
                    <p className="text-sm text-slate-500">{card.cardHolder}</p>
                    <p className="text-sm text-slate-400">Կավանցման ամսաթիվ՝ {card.expiryDate}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteCard(card._id)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-500 text-center py-12">Քարտեր չկան</p>
      )}
    </div>
  )
}
