'use client'

import { useState, useEffect, useCallback } from 'react'

// SSR-safe localStorage hook with hydration handling

function getStorageValue<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue

  try {
    const saved = localStorage.getItem(key)
    if (saved === null) return defaultValue
    return JSON.parse(saved) as T
  } catch {
    return defaultValue
  }
}

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [storedValue, setStoredValue] = useState<T>(defaultValue)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load from storage on mount (hydration-safe)
  useEffect(() => {
    setStoredValue(getStorageValue(key, defaultValue))
    setIsHydrated(true)
  }, [key, defaultValue])

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch {
      // Silently fail - localStorage not available or quota exceeded
    }
  }, [key, storedValue])

  const removeValue = useCallback(() => {
    try {
      setStoredValue(defaultValue)
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key)
      }
    } catch {
      // Silently fail - localStorage not available
    }
  }, [key, defaultValue])

  return { value: storedValue, setValue, removeValue, isHydrated }
}

// Hook for reading localStorage (no state management)
export function useReadLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setValue(getStorageValue(key, defaultValue))
    setIsHydrated(true)
  }, [key, defaultValue])

  return { value, isHydrated }
}
