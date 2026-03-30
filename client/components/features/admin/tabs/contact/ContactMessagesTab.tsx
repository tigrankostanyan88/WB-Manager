'use client'

import { useState } from 'react'
import { MessagesTable } from './MessagesTable'
import { MessageDetailModal } from './MessageDetailModal'
import type { ContactMessagesTabProps, ContactMessage } from './utils'

export function ContactMessagesTab({
  messages,
  isLoading,
  isDeleting,
  isMarkingRead,
  onDelete,
  onMarkAsRead
}: ContactMessagesTabProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)

  const unreadCount = messages.filter(m => !m.read).length

  const handleViewMessage = (msg: ContactMessage) => {
    setSelectedMessage(msg)
    if (!msg.read) {
      onMarkAsRead(msg.id)
    }
  }

  const handleMarkAsRead = (id: number) => {
    onMarkAsRead(id)
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage({ ...selectedMessage, read: true })
    }
  }

  const handleDelete = (id: number) => {
    onDelete(id)
  }

  return (
    <>
      <MessagesTable
        messages={messages}
        searchTerm={searchTerm}
        isLoading={isLoading}
        isMarkingRead={isMarkingRead}
        isDeleting={isDeleting}
        unreadCount={unreadCount}
        onSearchChange={setSearchTerm}
        onViewMessage={handleViewMessage}
        onMarkAsRead={handleMarkAsRead}
        onDelete={handleDelete}
      />

      <MessageDetailModal
        message={selectedMessage}
        isMarkingRead={isMarkingRead}
        isDeleting={isDeleting}
        onClose={() => setSelectedMessage(null)}
        onMarkAsRead={handleMarkAsRead}
        onDelete={handleDelete}
      />
    </>
  )
}
