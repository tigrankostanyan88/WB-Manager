'use client'

import { useEffect, useRef, ReactNode, useState } from 'react'
import Lenis from 'lenis'

interface LenisProviderProps {
  children: ReactNode
}

// Check if device is mobile
function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth < 768
}

export function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null)
  const rafIdRef = useRef<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mobile = isMobileDevice()
    setIsMobile(mobile)
    
    // Skip Lenis on mobile devices - use native scrolling instead
    if (mobile) {
      return
    }
    
    // Initialize Lenis smooth scrolling for desktop only
    const lenis = new Lenis({
      duration: 0.8,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,
    })

    lenisRef.current = lenis

    // Animation frame loop for Lenis
    function raf(time: number) {
      lenis.raf(time)
      rafIdRef.current = requestAnimationFrame(raf)
    }

    rafIdRef.current = requestAnimationFrame(raf)

    // Cleanup
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  // On mobile, just render children without Lenis
  if (isMobile) {
    return <>{children}</>
  }

  return <>{children}</>
}
