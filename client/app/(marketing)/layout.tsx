'use client'

import { cn } from '@/lib/utils'
import { Footer } from '@/components/layout'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={cn('min-h-screen flex flex-col font-sans')}>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
