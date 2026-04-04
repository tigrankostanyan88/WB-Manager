'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Trap focus within a modal/dialog container
 * Ensures keyboard navigation stays within the modal when it's open
 */
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isActive) return

    // Store the previously focused element
    previousFocusRef.current = document.activeElement as HTMLElement

    const container = containerRef.current
    if (!container) return

    // Find all focusable elements
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    // Focus first element
    firstElement?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        // Shift+Tab
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      // Restore previous focus
      previousFocusRef.current?.focus()
    }
  }, [isActive])

  return containerRef
}

/**
 * Announce messages to screen readers
 * Uses aria-live regions to notify users of dynamic content changes
 */
export function useAnnounce() {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div')
    announcement.setAttribute('role', 'status')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message
    
    document.body.appendChild(announcement)
    
    // Remove after announcement is read
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }

  return announce
}

/**
 * Skip link component for keyboard navigation
 * Allows users to skip to main content
 */
export function SkipLink({ targetId }: { targetId: string }) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-slate-900 focus:text-white focus:px-4 focus:py-2 focus:rounded-xl"
    >
      Անցնել հիմնական բովանդակությանը
    </a>
  )
}

/**
 * Visually hidden component for screen readers
 * Hides content visually but keeps it accessible to assistive technology
 */
export function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0">
      {children}
    </span>
  )
}

/**
 * ARIA landmarks configuration
 * Proper semantic structure for screen reader navigation
 */
export const ARIA_LANDMARKS = {
  banner: 'role="banner"',
  navigation: 'role="navigation"',
  main: 'role="main"',
  complementary: 'role="complementary"',
  contentinfo: 'role="contentinfo"',
  search: 'role="search"',
  form: 'role="form"',
  region: 'role="region"'
} as const

/**
 * Common ARIA patterns
 */
export const ARIA_PATTERNS = {
  // Button with icon only
  iconButton: (label: string) => ({
    'aria-label': label,
    title: label
  }),
  
  // Expandable section
  expandable: (isExpanded: boolean, label: string) => ({
    'aria-expanded': isExpanded,
    'aria-controls': `${label}-content`
  }),
  
  // Loading state
  loading: (label?: string) => ({
    'aria-busy': true,
    'aria-label': label || 'Բեռնվում է...'
  }),
  
  // Error state
  error: (message: string) => ({
    'aria-invalid': true,
    'aria-errormessage': message,
    role: 'alert'
  }),
  
  // Current page/navigation
  current: (isCurrent: boolean) => ({
    'aria-current': isCurrent ? 'page' : undefined
  })
} as const

/**
 * Keyboard navigation helpers
 */
export const KEYBOARD = {
  keys: {
    ENTER: 'Enter',
    SPACE: ' ',
    ESCAPE: 'Escape',
    TAB: 'Tab',
    ARROW_UP: 'ArrowUp',
    ARROW_DOWN: 'ArrowDown',
    ARROW_LEFT: 'ArrowLeft',
    ARROW_RIGHT: 'ArrowRight',
    HOME: 'Home',
    END: 'End'
  },
  
  // Check if key is actionable
  isActionKey: (key: string) => key === 'Enter' || key === ' ',
  
  // Check if key is arrow key
  isArrowKey: (key: string) => 
    ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)
} as const

/**
 * Color contrast checker (WCAG AA)
 * Returns whether contrast ratio meets standards
 */
export function meetsContrastRatio(foreground: string, background: string): boolean {
  // Calculate relative luminance
  const getLuminance = (color: string): number => {
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16) / 255
    const g = parseInt(hex.substr(2, 2), 16) / 255
    const b = parseInt(hex.substr(4, 2), 16) / 255
    
    const adjust = (c: number) => 
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    
    return 0.2126 * adjust(r) + 0.7152 * adjust(g) + 0.0722 * adjust(b)
  }
  
  const lum1 = getLuminance(foreground)
  const lum2 = getLuminance(background)
  
  const ratio = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05)
  
  return ratio >= 4.5 // WCAG AA for normal text
}

/**
 * Reduced motion preference hook
 * Respects user's motion preferences
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }
    
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])
  
  return prefersReducedMotion
}
