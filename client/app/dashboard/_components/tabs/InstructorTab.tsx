'use client'

import { Save, Camera, TrendingUp, Clock, HeadphonesIcon, Users, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

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

const statConfig = [
  { label: 'Հաջողակ ուսանողներ', icon: Users, color: 'text-violet-500', bg: 'bg-violet-50' },
  { label: 'Շրջանառություն', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { label: 'Փորձ', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
  { label: 'Աջակցություն', icon: HeadphonesIcon, color: 'text-blue-500', bg: 'bg-blue-50' }
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
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Մենթոր</h2>
        <Button 
          type="submit" 
          className="rounded-lg bg-violet-600 hover:bg-violet-700"
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
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-0">
            {/* Photo Section */}
            <div className="bg-slate-50 p-6 flex flex-col">
              <div className="relative flex-1 min-h-[380px] flex items-center justify-center">
                {instructorForm.avatarUrl ? (
                  <div className="relative w-full h-full rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={instructorForm.avatarUrl}
                      alt="Մենթոր"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white font-semibold text-lg">{instructorForm.name || 'Անուն'}</p>
                      <p className="text-white/80 text-sm">{instructorForm.profession || 'Մասնագիտություն'}</p>
                    </div>
                  </div>
                ) : (
                  <label className="w-full h-full rounded-xl border-2 border-dashed border-slate-300 bg-white flex flex-col items-center justify-center cursor-pointer hover:border-violet-400 hover:bg-violet-50/50 transition-all group">
                    <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-3 group-hover:bg-violet-100 transition-colors">
                      <User className="w-10 h-10 text-slate-400 group-hover:text-violet-500 transition-colors" />
                    </div>
                    <span className="text-sm text-slate-600 font-medium">Ավելացնել նկար</span>
                    <span className="text-xs text-slate-400 mt-1">3:4 հարաբերակցություն</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onAvatarFileSelect}
                      className="hidden"
                    />
                  </label>
                )}
                
                {instructorForm.avatarUrl && (
                  <label className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur rounded-full shadow-md flex items-center justify-center cursor-pointer hover:bg-white transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onAvatarFileSelect}
                      className="hidden"
                    />
                    <Camera className="w-5 h-5 text-slate-600" />
                  </label>
                )}
              </div>
            </div>

            {/* Form Section */}
            <div className="p-6 space-y-5">
              {/* Badge */}
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-violet-500" />
                <Input
                  type="text"
                  value={instructorForm.badgeText}
                  onChange={(e) => onBadgeTextChange(e.target.value)}
                  placeholder="Վերադարձված մենթորություն"
                  className="w-auto flex-1 max-w-[200px] border-0 bg-transparent p-0 text-sm font-medium text-violet-700 placeholder:text-violet-400 focus-visible:ring-0"
                />
              </div>

              {/* Title */}
              <div>
                <Input
                  type="text"
                  value={instructorForm.title}
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
                    value={instructorForm.name}
                    onChange={(e) => onNameChange(e.target.value)}
                    placeholder="Անուն"
                    className={instructorErrors.name ? 'border-red-300' : ''}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500">Մասնագիտություն</Label>
                  <Input
                    type="text"
                    value={instructorForm.profession}
                    onChange={(e) => onProfessionChange(e.target.value)}
                    placeholder="Մասնագիտություն"
                    className={instructorErrors.profession ? 'border-red-300' : ''}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-500">Նկարագրություն</Label>
                <textarea
                  value={instructorForm.description}
                  onChange={(e) => onDescriptionChange(e.target.value)}
                  placeholder="Մենթորի մասին..."
                  rows={3}
                  className={`w-full px-3 py-2 bg-white border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/20 ${
                    instructorErrors.description ? 'border-red-300' : 'border-slate-200'
                  }`}
                />
              </div>

              {/* Stats */}
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-500">Վիճակագրություն</Label>
                <div className="grid grid-cols-4 gap-3">
                  {statConfig.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                      <div 
                        key={index}
                        className={`p-3 rounded-xl border ${
                          instructorErrors.stats[index] ? 'border-red-300 bg-red-50' : 'border-slate-100 bg-slate-50'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-2`}>
                          <Icon className={`w-4 h-4 ${stat.color}`} />
                        </div>
                        <Input
                          type="text"
                          value={instructorForm.stats?.[index]?.value || ''}
                          onChange={(e) => onStatValueChange(index, e.target.value)}
                          placeholder={index === 0 ? '500+' : index === 1 ? '120M+' : index === 2 ? '5տ' : '24/7'}
                          className="border-0 p-0 h-auto text-lg font-bold text-slate-900 placeholder:text-slate-300 focus-visible:ring-0"
                        />
                        <p className="text-[10px] text-slate-500 leading-tight mt-1">{stat.label}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  )
}

