'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import api from '@/lib/api'

// Types
export interface BankCard {
  id: number
  bank_name: string
  card_number: string
  is_active: boolean
  created_at: string
}

export interface BankCardFormData {
  bank_name: string
  card_number: string
  is_active: boolean
}

// Helpers
function formatCardNumber(number: string): string {
  const clean = number.replace(/\s/g, '')
  return clean.match(/.{1,4}/g)?.join(' ') || clean
}

function getBankGradient(bankName: string): string {
  const name = bankName.toLowerCase()
  if (name.includes('ameria') || name.includes('америя'))
    return 'from-amber-600 to-orange-700'
  if (name.includes('ardshin') || name.includes('ардшин'))
    return 'from-red-600 to-red-800'
  if (name.includes('acba') || name.includes('акба'))
    return 'from-green-600 to-emerald-700'
  if (name.includes('converse') || name.includes('конверс'))
    return 'from-blue-600 to-blue-800'
  if (name.includes('ineco') || name.includes('инеко'))
    return 'from-purple-600 to-violet-700'
  if (name.includes('hsbc'))
    return 'from-slate-700 to-slate-900'
  return 'from-slate-900 to-slate-800'
}

function maskCardNumber(number: string, showFull: boolean): string {
  const clean = number.replace(/\s/g, '')
  if (showFull || clean.length <= 4) return formatCardNumber(number)
  return '**** **** **** ' + clean.slice(-4)
}

function maskCardNumberInput(value: string): string {
  const clean = value.replace(/\D/g, '').slice(0, 16)
  return clean.match(/.{1,4}/g)?.join(' ') || clean
}

// Hook
export function useBankCards() {
  const [cards, setCards] = useState<BankCard[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<BankCardFormData>({
    bank_name: '',
    card_number: '',
    is_active: true
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<BankCardFormData>({ bank_name: '', card_number: '', is_active: true })
  const [isEditing, setIsEditing] = useState(false)
  const [visibleNumbers, setVisibleNumbers] = useState<Set<number>>(new Set())
  const [copiedCards, setCopiedCards] = useState<Set<number>>(new Set())

  const fetchCards = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await api.get('/api/v1/bank-cards/all')
      setCards(res.data?.data || [])
    } catch {
      toast.error('Քարտերը բեռնելիս սխալ է տեղի ունեցել')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCards()
  }, [fetchCards])

  const handleDeleteCard = useCallback(async (id: number) => {
    try {
      const res = await api.delete(`/api/v1/bank-cards/${id}`)
      if (res.data?.status === 'success') {
        setCards(prev => prev.filter(c => c.id !== id))
        toast.success('Քարտը ջնջվել է')
      }
    } catch {
      toast.error('Ջնջելիս սխալ է տեղի ունեցել')
    }
  }, [])

  const handleCreateCard = useCallback(async (data: BankCardFormData) => {
    if (!data.bank_name || !data.card_number) {
      toast.error('Բոլոր դաշտերը պարտադիր են')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await api.post('/api/v1/bank-cards', data)
      if (res.data?.status === 'success') {
        await fetchCards()
        setFormData({ bank_name: '', card_number: '', is_active: true })
        setShowForm(false)
        toast.success('Քարտը ավելացվել է')
      }
    } catch {
      toast.error('Ավելացնելիս սխալ է տեղի ունեցել')
    } finally {
      setIsSubmitting(false)
    }
  }, [fetchCards])

  const handleUpdateCard = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editForm.bank_name || !editForm.card_number || !editingId) {
      toast.error('Բոլոր դաշտերը պարտադիր են')
      return
    }

    setIsEditing(true)
    try {
      const res = await api.put(`/api/v1/bank-cards/${editingId}`, editForm)
      if (res.data?.status === 'success') {
        await fetchCards()
        setEditingId(null)
        toast.success('Քարտը թարմացվել է')
      }
    } catch {
      toast.error('Թարմացնելիս սխալ է տեղի ունեցել')
    } finally {
      setIsEditing(false)
    }
  }, [editForm, editingId, fetchCards])

  const startEditCard = useCallback((card: BankCard) => {
    setEditingId(card.id)
    setEditForm({
      bank_name: card.bank_name,
      card_number: card.card_number,
      is_active: card.is_active
    })
  }, [])

  const cancelEditCard = useCallback(() => {
    setEditingId(null)
    setEditForm({ bank_name: '', card_number: '', is_active: true })
  }, [])

  const toggleCardNumberVisibility = useCallback((cardId: number) => {
    setVisibleNumbers(prev => {
      const newSet = new Set(prev)
      if (newSet.has(cardId)) {
        newSet.delete(cardId)
      } else {
        newSet.add(cardId)
      }
      return newSet
    })
  }, [])

  const copyCardNumber = useCallback((number: string, cardId: number) => {
    navigator.clipboard.writeText(number.replace(/\s/g, ''))
    toast.success('Քարտի համարը պատճենվել է')
    setCopiedCards(prev => new Set(prev).add(cardId))
    setTimeout(() => {
      setCopiedCards(prev => {
        const newSet = new Set(prev)
        newSet.delete(cardId)
        return newSet
      })
    }, 2000)
  }, [])

  return {
    // State
    cards,
    isLoading,
    showForm,
    setShowForm,
    formData,
    setFormData,
    isSubmitting,
    editingId,
    editForm,
    setEditForm,
    isEditing,
    visibleNumbers,
    copiedCards,

    // Actions
    fetchCards,
    handleDeleteCard,
    handleCreateCard,
    handleUpdateCard,
    startEditCard,
    cancelEditCard,
    toggleCardNumberVisibility,
    copyCardNumber,

    // Helpers
    formatCardNumber,
    maskCardNumber,
    maskCardNumberInput,
    getBankGradient
  }
}
