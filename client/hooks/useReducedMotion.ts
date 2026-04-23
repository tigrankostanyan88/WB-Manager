'use client'

import { useEffect, useState } from 'react'

interface ReducedMotionOptions {
  disableOnMobile?: boolean
  respectPrefersReducedMotion?: boolean
}

export function useReducedMotion(options: ReducedMotionOptions = {}): boolean {
  const { disableOnMobile = true, respectPrefersReducedMotion = true } = options
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false)

  useEffect(() => {
    const check = () => {
      let reduce = false

      // Check for reduced motion preference
      if (respectPrefersReducedMotion) {
        reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      }

      // Check for mobile device
      if (disableOnMobile && !reduce) {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) || window.innerWidth < 768
        
        const hasLowMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory !== undefined 
          ? ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4) < 4 
          : false
        
        reduce = isMobile || hasLowMemory
      }

      setShouldReduceMotion(reduce)
    }

    check()

    // Listen for changes in prefers-reduced-motion
    if (respectPrefersReducedMotion) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      mediaQuery.addEventListener('change', check)
      return () => mediaQuery.removeEventListener('change', check)
    }
  }, [disableOnMobile, respectPrefersReducedMotion])

  return shouldReduceMotion
}
