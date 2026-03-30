'use client'

import { cn } from '@/lib/utils'
import { Header, Footer } from '@/components/layout'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={cn('min-h-screen flex flex-col font-sans')}>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
