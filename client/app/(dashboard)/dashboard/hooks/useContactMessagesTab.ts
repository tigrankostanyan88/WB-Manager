'use client'

import { useContactMessages } from '@/hooks/admin/useContactMessages'

export function useContactMessagesTab({ activeTab, allowed }: { activeTab: string; allowed: boolean }) {
  return useContactMessages({ activeTab, allowed })
}
