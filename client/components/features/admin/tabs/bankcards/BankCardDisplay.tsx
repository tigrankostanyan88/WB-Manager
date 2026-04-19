// tabs/bankcards/BankCardDisplay.tsx - Credit card visual component

import { Building2, Edit2, Trash2, Eye, EyeOff, Copy, Check } from 'lucide-react'
import type { BankCard } from '@/hooks/admin/useBankCards'

interface BankCardDisplayProps {
  card: BankCard
  isVisible: boolean
  isCopied: boolean
  maskCardNumber: (number: string, visible: boolean) => string
  onToggleVisibility: () => void
  onCopy: () => void
  onEdit: () => void
  onDelete: () => void
}

export function BankCardDisplay({
  card,
  isVisible,
  isCopied,
  maskCardNumber,
  onToggleVisibility,
  onCopy,
  onEdit,
  onDelete
}: BankCardDisplayProps) {
  // Hardcoded gradient classes for each bank
  const getGradientClass = (bankName: string): string => {
    const name = bankName.toLowerCase()
    if (name.includes('ameria') || name.includes('ամերիա')) return 'bg-gradient-to-br from-amber-400 to-orange-500'
    if (name.includes('ardshin') || name.includes('արդշին')) return 'bg-gradient-to-br from-red-500 to-red-700'
    if (name.includes('acba') || name.includes('ակբա')) return 'bg-gradient-to-br from-emerald-500 to-green-700'
    if (name.includes('converse') || name.includes('կոնվերս')) return 'bg-gradient-to-br from-blue-500 to-blue-700'
    if (name.includes('ineco') || name.includes('ինեկո')) return 'bg-gradient-to-br from-violet-500 to-purple-700'
    if (name.includes('hsbc')) return 'bg-gradient-to-br from-slate-600 to-slate-800'
    return 'bg-gradient-to-br from-indigo-500 to-purple-600'
  }

  return (
    <div
      className={`${getGradientClass(card.bank_name)} text-white rounded-3xl overflow-hidden relative group hover:scale-[1.02] transition-all duration-500 shadow-2xl shadow-slate-900/20`}
    >
      <div className="p-6 relative z-10 flex flex-col justify-between h-[320px]">
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
              onClick={onEdit}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Փոփոխել քարտը"
            >
              <Edit2 className="w-4 h-4 text-white/80 hover:text-white" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Ջնջել քարտը"
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
            onClick={onCopy}
          >
            <div className="flex items-center justify-between">
              <p className="text-lg font-mono tracking-[0.12em] font-medium">
                {maskCardNumber(card.card_number, isVisible)}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleVisibility()
                  }}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label={isVisible ? 'Թաքցնել համարը' : 'Ցույց տալ համարը'}
                >
                  {isVisible ? (
                    <EyeOff className="w-4 h-4 text-white/80" />
                  ) : (
                    <Eye className="w-4 h-4 text-white/80" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onCopy()
                  }}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Պատճենել համարը"
                >
                  {isCopied ? (
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
      </div>
    </div>
  )
}
