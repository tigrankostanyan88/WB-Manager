'use client'

import { Shield } from 'lucide-react'
import { Header, Footer } from '@/components/layout'

interface UnauthorizedStateProps {
  forceWhiteBackground?: boolean
}

export function UnauthorizedState({ forceWhiteBackground }: UnauthorizedStateProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header forceWhiteBackground={forceWhiteBackground} />
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-xl bg-white rounded-[2.5rem] p-10 shadow-lg border border-slate-100 text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-red-600">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="mt-6 text-3xl font-black text-slate-900">Մուտքը սահմանափակված է</h1>
          <p className="mt-2 text-slate-500 font-medium">Այս էջը հասանելի է միայն ադմիններին</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
