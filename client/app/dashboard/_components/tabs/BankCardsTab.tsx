'use client'

import { useEffect, useState } from 'react'
import { CreditCard, Trash2, Plus, Building2, Check, X, Edit2, Eye, EyeOff, Copy, RefreshCw } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import api from '@/lib/api'
import { toast } from 'sonner'

interface BankCard {
  id: number
  bank_name: string
  card_number: string
  is_active: boolean
  created_at: string
}

export default function BankCardsTab() {
  const [cards, setCards] = useState<BankCard[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    bank_name: '',
    card_number: '',
    is_active: true
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({ bank_name: '', card_number: '', is_active: true })
  const [isEditing, setIsEditing] = useState(false)
  const [visibleNumbers, setVisibleNumbers] = useState<Set<number>>(new Set())
  const [copiedCards, setCopiedCards] = useState<Set<number>>(new Set())

  const fetchCards = async () => {
    setIsLoading(true)
    try {
      const res = await api.get('/api/v1/bank-cards/all')
      setCards(res.data?.data || [])
    } catch (error) {
      console.error('Error fetching cards:', error)
      toast.error('Քարտերը բեռնելիս սխալ է տեղի ունեցել')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCards()
  }, [])

  const handleDeleteCard = async (id: number) => {
    try {
      const res = await api.delete(`/api/v1/bank-cards/${id}`)
      if (res.data?.status === 'success') {
        setCards(cards.filter(c => c.id !== id))
        toast.success('Քարտը ջնջվել է')
      }
    } catch (error) {
      console.error('Error deleting card:', error)
      toast.error('Ջնջելիս սխալ է տեղի ունեցել')
    }
  }

  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.bank_name || !formData.card_number) {
      toast.error('Բոլոր դաշտերը պարտադիր են')
      return
    }
    
    setIsSubmitting(true)
    try {
      const res = await api.post('/api/v1/bank-cards', formData)
      if (res.data?.status === 'success') {
        await fetchCards()
        setFormData({ bank_name: '', card_number: '', is_active: true })
        setShowForm(false)
        toast.success('Քարտը ավելացվել է')
      }
    } catch (error) {
      console.error('Error creating card:', error)
      toast.error('Ավելացնելիս սխալ է տեղի ունեցել')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateCard = async (e: React.FormEvent) => {
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
    } catch (error) {
      console.error('Error updating card:', error)
      toast.error('Թարմացնելիս սխալ է տեղի ունեցել')
    } finally {
      setIsEditing(false)
    }
  }

  const startEditCard = (card: BankCard) => {
    setEditingId(card.id)
    setEditForm({
      bank_name: card.bank_name,
      card_number: card.card_number,
      is_active: card.is_active
    })
  }

  const cancelEditCard = () => {
    setEditingId(null)
    setEditForm({ bank_name: '', card_number: '', is_active: true })
  }

  const toggleCardNumberVisibility = (cardId: number) => {
    setVisibleNumbers(prev => {
      const newSet = new Set(prev)
      if (newSet.has(cardId)) {
        newSet.delete(cardId)
      } else {
        newSet.add(cardId)
      }
      return newSet
    })
  }

  const copyCardNumber = (number: string, cardId: number) => {
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
  }

  const formatCardNumber = (number: string) => {
    const clean = number.replace(/\s/g, '')
    return clean.match(/.{1,4}/g)?.join(' ') || clean
  }

  const getBankGradient = (bankName: string) => {
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

  const maskCardNumber = (number: string, showFull: boolean) => {
    const clean = number.replace(/\s/g, '')
    if (showFull || clean.length <= 4) return formatCardNumber(number)
    return '**** **** **** ' + clean.slice(-4)
  }

  const maskCardNumberInput = (value: string) => {
    const clean = value.replace(/\D/g, '').slice(0, 16)
    return clean.match(/.{1,4}/g)?.join(' ') || clean
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-slate-900">Բանկային քարտեր</h2>
          <button
            onClick={fetchCards}
            disabled={isLoading}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
            title="Թարմացնել"
          >
            <RefreshCw className={`w-5 h-5 text-slate-600 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-violet-600 hover:bg-violet-700"
        >
          {showForm ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          {showForm ? 'Փակել' : 'Ավելացնել քարտ'}
        </Button>
      </div>

      {showForm && (
        <div className="overflow-hidden animate-in slide-in-from-top-2 duration-300">
          <Card className="border-violet-200 shadow-lg">
            <CardContent className="p-6">
              <form onSubmit={handleCreateCard} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bank_name">Բանկի անվանում</Label>
                    <Input
                      id="bank_name"
                      placeholder="օր․՝ Ameria Bank"
                      value={formData.bank_name}
                      onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="card_number">Քարտի համար</Label>
                    <Input
                      id="card_number"
                      placeholder="օր․՝ 1234 5678 9012 3456"
                      value={formData.card_number}
                      onChange={(e) => setFormData({ ...formData, card_number: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
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
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Չեղարկել
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {cards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card) => (
            <div key={card.id}>
              {editingId === card.id ? (
                <Card className="border-violet-200 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Խմբագրել քարտը</h3>
                    <form onSubmit={handleUpdateCard} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit_bank_name">Բանկի անվանում</Label>
                          <Input
                            id="edit_bank_name"
                            placeholder="օր․՝ Ameria Bank"
                            value={editForm.bank_name}
                            onChange={(e) => setEditForm({ ...editForm, bank_name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit_card_number">Քարտի համար</Label>
                          <Input
                            id="edit_card_number"
                            placeholder="օր․՝ 1234 5678 9012 3456"
                            value={editForm.card_number}
                            onChange={(e) => setEditForm({ ...editForm, card_number: maskCardNumberInput(e.target.value) })}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => setEditForm({ ...editForm, is_active: !editForm.is_active })}
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
                        <Button type="button" variant="outline" onClick={cancelEditCard}>
                          Չեղարկել
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                <Card 
                  className={`bg-gradient-to-br ${getBankGradient(card.bank_name)} text-white rounded-3xl overflow-hidden relative group hover:scale-[1.02] transition-all duration-500 shadow-2xl shadow-slate-900/30`}
                >
                  {/* Background effects */}
                  <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 blur-[100px] -mr-40 -mt-40 rounded-full"></div>
                  <div className="absolute bottom-0 left-0 w-60 h-60 bg-black/10 blur-[80px] -ml-30 -mb-30 rounded-full"></div>
                  
                  {/* Subtle pattern overlay */}
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}></div>
                  
                  <CardContent className="p-6 relative z-10 flex flex-col justify-between h-[320px]">
                    {/* Top row: Bank info & Status */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Բանկ</p>
                          <p className="font-bold text-base">{card.bank_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {card.is_active && (
                          <div className="flex items-center gap-1.5 bg-emerald-500/20 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Ակտիվ</span>
                          </div>
                        )}
                        <button
                          onClick={() => startEditCard(card)}
                          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4 text-white/80 hover:text-white" />
                        </button>
                        <button
                          onClick={() => handleDeleteCard(card.id)}
                          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-white/80 hover:text-white" />
                        </button>
                      </div>
                    </div>

                    {/* Card number section */}
                    <div className="space-y-3">
                      {/* Chip icon */}
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-8 bg-gradient-to-br from-yellow-400/90 to-yellow-600/90 rounded-md flex items-center justify-center border border-yellow-300/50">
                          <div className="w-6 h-5 border border-yellow-700/30 rounded-sm flex items-center justify-center">
                            <div className="w-4 h-3 border border-yellow-700/20 rounded-sm"></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Card number with view/hide/copy */}
                      <div 
                        className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/10 cursor-pointer hover:bg-white/20 transition-colors"
                        onClick={() => copyCardNumber(card.card_number, card.id)}
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-mono tracking-[0.12em] font-medium">
                            {maskCardNumber(card.card_number, visibleNumbers.has(card.id))}
                          </p>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleCardNumberVisibility(card.id)
                              }}
                              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                            >
                              {visibleNumbers.has(card.id) ? (
                                <EyeOff className="w-4 h-4 text-white/80" />
                              ) : (
                                <Eye className="w-4 h-4 text-white/80" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                copyCardNumber(card.card_number, card.id)
                              }}
                              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                            >
                              {copiedCards.has(card.id) ? (
                                <Check className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <Copy className="w-4 h-4 text-white/80" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Bottom row: ID & Mastercard logo */}
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] text-white/50 font-medium tracking-wide">ID: {card.id}</p>
                        
                        {/* Mastercard logo */}
                        <div className="flex items-center">
                          <div className="w-7 h-7 rounded-full bg-[#EB001B]/90 -mr-3.5"></div>
                          <div className="w-7 h-7 rounded-full bg-[#F79E1B]/90"></div>
                          <span className="ml-2 text-[10px] font-bold text-white/70 tracking-wide">mastercard</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto">
              <CreditCard className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium">Քարտեր չկան</p>
            <Button onClick={() => setShowForm(true)} variant="outline">
              Ավելացնել առաջին քարտը
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
