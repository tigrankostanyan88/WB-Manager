'use client'

import { useState, useEffect, useCallback } from 'react'
import { ArrowUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  const toggleVisibility = useCallback(() => {
    // Show button after scrolling 300px
    const scrolled = window.scrollY
    setIsVisible(scrolled > 300)
    
    // Calculate scroll progress (0 to 1)
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const progress = docHeight > 0 ? scrolled / docHeight : 0
    setScrollProgress(Math.min(progress, 1))
  }, [])

  const scrollToTop = useCallback(() => {
    // Use native smooth scroll (Lenis will handle the smooth animation)
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility, { passive: true })
    toggleVisibility() // Check initial position

    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [toggleVisibility])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-violet-600 text-white shadow-lg shadow-violet-600/30 backdrop-blur-sm border border-violet-500/20 cursor-pointer group"
          aria-label="Վերև սքրոլ անել"
          title="Վերև սքրոլ անել"
        >
          {/* Progress ring */}
          <svg 
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 56 56"
          >
            {/* Background circle */}
            <circle
              cx="28"
              cy="28"
              r="26"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-violet-400/30"
            />
            {/* Progress circle */}
            <circle
              cx="28"
              cy="28"
              r="26"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 26}`}
              strokeDashoffset={`${2 * Math.PI * 26 * (1 - scrollProgress)}`}
              className="text-white/80 transition-all duration-150"
            />
          </svg>
          
          {/* Arrow icon */}
          <ArrowUp className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:-translate-y-0.5" />
          
          {/* Glow effect on hover */}
          <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
