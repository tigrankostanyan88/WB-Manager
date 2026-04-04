'use client'

import { ContactMessagesTab } from '@/components/features/admin/tabs/contact/ContactMessagesTab'
import { ContactMessagesTabSkeleton } from '@/components/features/admin/tabs/contact/ContactMessagesTabSkeleton'
import { useContactMessagesTab } from '@/app/(dashboard)/dashboard/hooks'

interface ContactMessagesTabWrapperProps {
  allowed: boolean
}

export function ContactMessagesTabWrapper({ allowed }: ContactMessagesTabWrapperProps) {
  const contact = useContactMessagesTab({ activeTab: 'contact-messages', allowed })
  
  if (contact.isLoading) {
    return <ContactMessagesTabSkeleton />
  }
  
  return (
    <ContactMessagesTab
      messages={contact.messages}
      isLoading={contact.isLoading}
      isDeleting={contact.isDeleting}
      isMarkingRead={contact.isMarkingRead}
      onDelete={contact.deleteMessage}
      onMarkAsRead={contact.markAsRead}
    />
  )
}
