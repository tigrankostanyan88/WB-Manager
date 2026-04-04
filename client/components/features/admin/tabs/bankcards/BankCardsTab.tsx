// tabs/bankcards/BankCardsTab.tsx - Main bank cards tab orchestrator

'use client'

import { Plus, X, RefreshCw, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BankCardForm } from './BankCardForm'
import { BankCardsList } from './BankCardsList'
import { useBankCards } from '@/hooks/admin/useBankCards'

export function BankCardsTab() {
  const {
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
    fetchCards,
    handleDeleteCard,
    handleCreateCard,
    handleUpdateCard,
    startEditCard,
    cancelEditCard,
    toggleCardNumberVisibility,
    copyCardNumber,
    maskCardNumber,
    maskCardNumberInput,
    getBankGradient
  } = useBankCards()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Create Form */}
      {showForm && (
        <BankCardForm
          initialData={formData}
          isSubmitting={isSubmitting}
          onSubmit={handleCreateCard}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Cards List */}
      <BankCardsList
        cards={cards}
        editingId={editingId}
        editForm={editForm}
        isEditing={isEditing}
        visibleNumbers={visibleNumbers}
        copiedCards={copiedCards}
        getBankGradient={getBankGradient}
        maskCardNumber={maskCardNumber}
        maskCardNumberInput={maskCardNumberInput}
        onEditFormChange={setEditForm}
        onUpdateCard={handleUpdateCard}
        onCancelEdit={cancelEditCard}
        onStartEdit={startEditCard}
        onDelete={handleDeleteCard}
        onToggleVisibility={toggleCardNumberVisibility}
        onCopy={copyCardNumber}
        onAddClick={() => setShowForm(true)}
      />
    </div>
  )
}

export default BankCardsTab
