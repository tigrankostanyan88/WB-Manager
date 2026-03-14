'use client'

import { Search } from 'lucide-react'
import type { DashboardTabId } from '../_types'

interface DashboardHeaderProps {
  activeTab: DashboardTabId
  userSearch: string
  setUserSearch: (v: string) => void
}

export default function DashboardHeader({ activeTab, userSearch, setUserSearch }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Բարի գալուստ, Aram</h1>
        <p className="text-slate-500 font-medium mt-1">Ահա թե ինչ է կատարվում ձեր կայքում այսօր</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={activeTab === 'users' ? userSearch : ''}
            onChange={(e) => {
              const v = e.target.value
              if (activeTab === 'users') setUserSearch(v)
            }}
            placeholder="Փնտրել..."
            className="bg-slate-50 border-none rounded-2xl pl-11 pr-4 py-3 text-sm font-medium w-64 focus:ring-2 focus:ring-violet-500 outline-none transition-all"
          />
        </div>
      </div>
    </div>
  )
}

