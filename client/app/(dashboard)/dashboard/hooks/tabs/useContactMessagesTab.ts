'use client'

import { useContactMessages } from '@/components/features/admin/hooks/useContactMessages'

interface UseContactMessagesTabProps {
  activeTab: string
  allowed: boolean
}

export function useContactMessagesTab({ activeTab, allowed }: UseContactMessagesTabProps) {
  const {
    messages,
    isLoading,
    isDeleting,
    isMarkingRead,
    unreadCount,
    deleteMessage,
    markAsRead
  } = useContactMessages({ activeTab, allowed })

  return {
    messages,
    isLoading,
    isDeleting,
    isMarkingRead,
    unreadCount,
    deleteMessage,
    markAsRead
  }
}
