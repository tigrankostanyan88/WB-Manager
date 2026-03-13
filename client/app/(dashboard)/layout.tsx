'use client'

import { ReactNode } from 'react'
import { ConfirmProvider } from '@/components/providers/ConfirmProvider'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ConfirmProvider>
      <div className="min-h-screen">
        {children}
      </div>
    </ConfirmProvider>
  )
}
