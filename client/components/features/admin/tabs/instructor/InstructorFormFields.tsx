// tabs/instructor/InstructorFormFields.tsx - Instructor form fields component

'use client'

import { Users, TrendingUp, Clock, HeadphonesIcon } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import type { InstructorForm, InstructorErrors } from './types'

const statIcons = [Users, TrendingUp, Clock, HeadphonesIcon]
const statColors = [
  { color: 'text-violet-500', bg: 'bg-violet-50' },
  { color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { color: 'text-orange-500', bg: 'bg-orange-50' },
  { color: 'text-blue-500', bg: 'bg-blue-50' }
]
const statLabels = ['Հաջողակ ուսանողներ', 'Շրջանառություն', 'Փորձ', 'Աջակցություն']

interface InstructorFormFieldsProps {
  form: InstructorForm
  errors: InstructorErrors
  onTitleChange: (value: string) => void
  onBadgeTextChange: (value: string) => void
  onNameChange: (value: string) => void
  onProfessionChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onStatValueChange: (index: number, value: string) => void
}

export function InstructorFormFields({
  form,
  errors,
  onTitleChange,
  onBadgeTextChange,
  onNameChange,
  onProfessionChange,
  onDescriptionChange,
  onStatValueChange
}: InstructorFormFieldsProps) {
  return (
    <div className="p-6 space-y-5">
      {/* Badge */}
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-violet-500" />
        <Input
          type="text"
          value={form.badgeText}
          onChange={(e) => onBadgeTextChange(e.target.value)}
          placeholder="Վերադարձված մենթորություն"
          className="w-auto flex-1 max-w-[200px] border-0 bg-transparent p-0 text-sm font-medium text-violet-700 placeholder:text-violet-400 focus-visible:ring-0"
        />
      </div>

      {/* Title */}
      <div>
        <Input
          type="text"
          value={form.title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Սովորեք Ուայլդբերիի Մասնագետից"
          className="text-2xl font-bold text-slate-900 placeholder:text-slate-300 border-0 p-0 h-auto focus-visible:ring-0"
        />
      </div>

      {/* Name & Profession */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs text-slate-500">Անուն Ազգանուն</Label>
          <Input
            type="text"
            value={form.name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Անուն"
            className={errors.name ? 'border-red-300' : ''}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-slate-500">Մասնագիտություն</Label>
          <Input
            type="text"
            value={form.profession}
            onChange={(e) => onProfessionChange(e.target.value)}
            placeholder="Մասնագիտություն"
            className={errors.profession ? 'border-red-300' : ''}
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label className="text-xs text-slate-500">Նկարագրություն</Label>
        <RichTextEditor
          value={form.description}
          onChange={onDescriptionChange}
          placeholder="Մենթորի մասին..."
          className={errors.description ? 'border-red-300' : ''}
          minHeight={150}
        />
      </div>

      {/* Stats */}
      <div className="space-y-1.5">
        <Label className="text-xs text-slate-500">Վիճակագրություն</Label>
        <div className="grid grid-cols-4 gap-3">
          {statIcons.map((Icon, index) => {
            const colors = statColors[index]
            return (
              <div
                key={index}
                className={`p-3 rounded-xl border ${
                  errors.stats[index] ? 'border-red-300 bg-red-50' : 'border-slate-100 bg-slate-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center mb-2`}>
                  <Icon className={`w-4 h-4 ${colors.color}`} />
                </div>
                <Input
                  type="text"
                  value={form.stats?.[index]?.value || ''}
                  onChange={(e) => onStatValueChange(index, e.target.value)}
                  placeholder={index === 0 ? '500+' : index === 1 ? '120M+' : index === 2 ? '5տ' : '24/7'}
                  className="border-0 p-0 h-auto text-lg font-bold text-slate-900 placeholder:text-slate-300 focus-visible:ring-0"
                />
                <p className="text-[10px] text-slate-500 leading-tight mt-1">{statLabels[index]}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
