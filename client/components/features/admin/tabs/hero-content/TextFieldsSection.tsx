'use client'

import { Type, FileText } from 'lucide-react'

interface TextFieldsSectionProps {
  name: string
  title: string
  text: string
  onNameChange: (value: string) => void
  onTitleChange: (value: string) => void
  onTextChange: (value: string) => void
}

export function TextFieldsSection({
  name,
  title,
  text,
  onNameChange,
  onTitleChange,
  onTextChange
}: TextFieldsSectionProps) {
  return (
    <div className="grid grid-cols-1 gap-8">
      {/* Name Field */}
      <div className="space-y-2">
        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
          <Type className="w-4 h-4" /> Անվանում (Name)
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full h-14 bg-slate-50 border-none rounded-2xl px-4 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-violet-500 outline-none transition-all"
          placeholder="WB Mastery · Wildberries Academy"
        />
      </div>

      {/* Title Field */}
      <div className="space-y-2">
        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
          <Type className="w-4 h-4" /> Վերնագիր (Title)
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full h-14 bg-slate-50 border-none rounded-2xl px-4 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-violet-500 outline-none transition-all"
          placeholder="Սկսեք ձեր բիզնեսը"
        />
      </div>

      {/* Text Field */}
      <div className="space-y-2">
        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
          <FileText className="w-4 h-4" /> Տեքստ (Text)
        </label>
        <textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          className="w-full min-h-[120px] bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-violet-500 outline-none transition-all resize-none"
          placeholder="Սովորեք քայլ առ քայլ՝ սկսած հաշվարկներից մինչև վաճառքի մասշտաբավորում..."
        />
      </div>
    </div>
  )
}
