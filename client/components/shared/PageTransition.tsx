'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

interface PageTransitionProps {
  children: ReactNode
}

// Check if device is mobile/low-power
function isMobileOrReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  
  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return true
  }
  
  // Check for mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth < 768
  
  // Check for low memory (if available)
  const hasLowMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory !== undefined 
    ? ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4) < 4 
    : false
  
  return isMobile || hasLowMemory
}

export function PageTransition({ children }: PageTransitionProps) {
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
    setIsMobile(isMobileOrReducedMotion())
  }, [])

  // Prevent SSR issues
  if (!mounted) {
    return (
      <div className="w-full min-h-screen bg-white">
        {children}
      </div>
    )
  }

  // On mobile/reduced motion - disable page transition animation entirely
  if (isMobile) {
    return (
      <div className="w-full min-h-screen bg-white">
        {children}
      </div>
    )
  }

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.25,
          ease: [0.4, 0, 0.2, 1] as const,
        }}
        className="w-full min-h-screen bg-white"
        style={{ willChange: 'opacity' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
