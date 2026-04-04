'use client'

import { useSuspendedUsers } from './useSuspendedUsers'

export function useSuspendedTab({ showToast }: { showToast: (message: string, type: 'success' | 'error') => void }) {
  return useSuspendedUsers(showToast)
}
