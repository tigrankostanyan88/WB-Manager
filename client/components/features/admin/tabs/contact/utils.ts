// Contact messages types and utilities

export interface ContactMessage {
  id: number
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  createdAt: string
}

export interface ContactMessagesTabProps {
  messages: ContactMessage[]
  isLoading: boolean
  isDeleting: number | null
  isMarkingRead: number | null
  onDelete: (id: number) => Promise<boolean>
  onMarkAsRead: (id: number) => Promise<boolean>
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('hy-AM', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
