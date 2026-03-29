'use client'

import { ConfirmProvider } from '@/components/providers/ConfirmProvider'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ConfirmProvider>
      {children}
    </ConfirmProvider>
  )
}
