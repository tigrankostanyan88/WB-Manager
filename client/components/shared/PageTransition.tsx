'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode, useEffect, useState } from 'react'

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const [isFirstRender, setIsFirstRender] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [pathname, setPathname] = useState('')

  useEffect(() => {
    setMounted(true)
    setIsFirstRender(false)
    // Safe to access window.location on client
    setPathname(window.location.pathname)
  }, [])

  // Prevent SSR issues
  if (!mounted) {
    return <div className="w-full bg-white">{children}</div>
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={isFirstRender ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          duration: 0.4,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
