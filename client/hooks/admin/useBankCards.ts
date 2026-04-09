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

// Bank color definitions with inline styles for guaranteed rendering
const BANK_COLORS: Record<string, { from: string; to: string }> = {
  ameria: { from: '#f59e0b', to: '#ea580c' },      // amber-500 to orange-600
  ardshin: { from: '#ef4444', to: '#b91c1c' },      // red-500 to red-700
  acba: { from: '#22c55e', to: '#059669' },         // green-500 to emerald-600
  converse: { from: '#3b82f6', to: '#1d4ed8' },    // blue-500 to blue-700
  ineco: { from: '#a855f7', to: '#7c3aed' },        // purple-500 to violet-600
  hsbc: { from: '#475569', to: '#1e293b' },         // slate-600 to slate-800
  default: { from: '#8b5cf6', to: '#9333ea' },     // violet-500 to purple-600
}

function getBankGradientStyle(bankName: string): { background: string } {
  const name = bankName.toLowerCase()
  let colors = BANK_COLORS.default
  
  for (const [key, value] of Object.entries(BANK_COLORS)) {
    if (name.includes(key)) {
      colors = value
      break
    }
  }
  
  return {
    background: `linear-gradient(135deg, ${colors.from} 0%, ${colors.to} 100%)`
  }
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
    getBankGradientStyle
  }
}
