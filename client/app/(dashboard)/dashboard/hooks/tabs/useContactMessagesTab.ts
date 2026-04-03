'use client'

import { useContactMessages } from '@/hooks/admin/useContactMessages'

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
