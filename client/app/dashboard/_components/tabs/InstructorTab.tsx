'use client'

import { Save, Camera, TrendingUp, Clock, HeadphonesIcon, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface InstructorStat {
  value: string
  label: string
  icon?: 'users' | 'revenue' | 'experience' | 'support'
}

interface InstructorTabProps {
  instructorForm: {
    title: string
    name: string
    profession: string
    description: string
    badgeText: string
    avatarUrl: string
    stats: InstructorStat[]
  }
  instructorErrors: {
    name: boolean
    profession: boolean
    description: boolean
    stats: boolean[]
  }
  isInstructorLoading: boolean
  onAvatarFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  onTitleChange: (value: string) => void
  onNameChange: (value: string) => void
  onProfessionChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onBadgeTextChange: (value: string) => void
  onStatValueChange: (index: number, value: string) => void
  onSubmit: (e: React.FormEvent) => void
}

const statLabels = [
  { label: 'Հաջողակ ուսանողներ', icon: 'users' },
  { label: 'Ուսանողների ընդհանուր շրջանառություն', icon: 'revenue' },
  { label: 'Փորձ e-commerce ոլորտում', icon: 'experience' },
  { label: 'Անհատական աջակցություն', icon: 'support' }
]

const getIcon = (iconType: string) => {
  switch (iconType) {
    case 'users':
      return <Users className="w-5 h-5 text-violet-500" />
    case 'revenue':
      return <TrendingUp className="w-5 h-5 text-emerald-500" />
    case 'experience':
      return <Clock className="w-5 h-5 text-orange-500" />
    case 'support':
      return <HeadphonesIcon className="w-5 h-5 text-blue-500" />
    default:
      return <TrendingUp className="w-5 h-5 text-violet-500" />
  }
}

export default function InstructorTab({
  instructorForm,
  instructorErrors,
  isInstructorLoading,
  onAvatarFileSelect,
  onTitleChange,
  onNameChange,
  onProfessionChange,
  onDescriptionChange,
  onBadgeTextChange,
  onStatValueChange,
  onSubmit
}: InstructorTabProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">Մենթոր</h2>
        <Button 
          type="submit" 
          className="rounded-xl bg-violet-600 hover:bg-violet-700"
          disabled={isInstructorLoading}
        >
          <Save className="w-4 h-4 mr-2" />
          Պահպանել
        </Button>
      </div>

      {isInstructorLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left side - Photo */}
            <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 p-8 flex items-center justify-center min-h-[500px]">
              <div className="relative w-full max-w-sm">
                {instructorForm.avatarUrl ? (
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                    <img
                      src={instructorForm.avatarUrl}
                      alt="Մենթոր"
                      className="w-full aspect-[3/4] object-cover"
                    />
                    {/* Name overlay at bottom - simplified since we have separate fields */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6 pt-20">
                      <p className="text-white text-xl font-bold">
                        {instructorForm.name || 'Անուն Ազգանուն'}
                      </p>
                      <p className="text-white/80 text-sm">
                        {instructorForm.profession || 'Մասնագիտություն'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full aspect-[3/4] rounded-3xl bg-slate-200 flex flex-col items-center justify-center border-2 border-dashed border-slate-300">
                    <Camera className="w-12 h-12 text-slate-400 mb-4" />
                    <p className="text-slate-500 text-sm">Բեռնել նկար</p>
                    <p className="text-slate-400 text-xs mt-1">400x500px կամ 3:4 հարաբերակցություն</p>
                  </div>
                )}
                
                {/* Upload button */}
                <label className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onAvatarFileSelect}
                    className="hidden"
                  />
                  <Camera className="w-5 h-5 text-slate-600" />
                </label>
              </div>
            </div>

            {/* Right side - Stats */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-medium w-fit mb-6">
                <span className="w-2 h-2 bg-violet-500 rounded-full"></span>
                <input
                  type="text"
                  value={instructorForm.badgeText}
                  onChange={(e) => onBadgeTextChange(e.target.value)}
                  placeholder="Վերադարձված մենթորություն"
                  className="bg-transparent border-none outline-none focus:ring-0 text-violet-700 placeholder-violet-400 w-full"
                />
              </div>

              {/* Title */}
              <input
                type="text"
                value={instructorForm.title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="Սովորեք Ուայլդբերիի Մասնագետից"
                className="w-full text-3xl lg:text-4xl font-black text-slate-900 placeholder-slate-300 border-none outline-none focus:ring-0 p-0 mb-2"
              />

              {/* Name and Profession fields below title */}
              <div className="mb-4 space-y-2">
                <input
                  type="text"
                  value={instructorForm.name}
                  onChange={(e) => onNameChange(e.target.value)}
                  placeholder="Անուն Ազգանուն"
                  className={`w-full text-lg font-semibold text-slate-700 placeholder-slate-400 border-b border-slate-200 focus:border-violet-500 outline-none focus:ring-0 py-1 transition-colors ${
                    instructorErrors.name ? 'border-red-300' : ''
                  }`}
                />
                <input
                  type="text"
                  value={instructorForm.profession}
                  onChange={(e) => onProfessionChange(e.target.value)}
                  placeholder="Մասնագիտություն"
                  className={`w-full text-sm text-slate-500 placeholder-slate-400 border-b border-slate-200 focus:border-violet-500 outline-none focus:ring-0 py-1 transition-colors ${
                    instructorErrors.profession ? 'border-red-300' : ''
                  }`}
                />
              </div>

              {/* Description */}
              <div className="mb-8">
                <textarea
                  value={instructorForm.description}
                  onChange={(e) => onDescriptionChange(e.target.value)}
                  placeholder="Ես մեխ սովորեցնել մարդկանց, ես խնդրում եմ իմական գործական...&#10;Որպես Wildberries-ի..."
                  rows={3}
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-slate-600 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-violet-500/20 resize-none ${
                    instructorErrors.description ? 'border-red-300' : 'border-slate-200'
                  }`}
                />
                {instructorErrors.description && (
                  <p className="text-red-500 text-xs mt-1">Լրացրեք նկարագրությունը</p>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {statLabels.map((stat, index) => (
                  <div 
                    key={index}
                    className={`bg-slate-50 rounded-2xl p-4 border transition-colors ${
                      instructorErrors.stats[index] ? 'border-red-300' : 'border-slate-100 hover:border-violet-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {getIcon(stat.icon)}
                    </div>
                    <input
                      type="text"
                      value={instructorForm.stats?.[index]?.value || ''}
                      onChange={(e) => onStatValueChange(index, e.target.value)}
                      placeholder={index === 0 ? '500+' : index === 1 ? '120M+' : index === 2 ? '5 տարի' : '24/7'}
                      className="w-full bg-transparent text-2xl font-bold text-slate-900 placeholder-slate-300 border-none outline-none focus:ring-0 p-0"
                    />
                    <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  )
}
