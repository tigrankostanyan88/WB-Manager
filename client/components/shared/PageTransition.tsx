'use client'

import { motion, AnimatePresence, Variants } from 'framer-motion'
import { ReactNode, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

interface PageTransitionProps {
  children: ReactNode
}

// Elegant layered transition variants
const pageVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.98,
    y: 20,
    filter: 'blur(4px)',
  },
  enter: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1] as const,
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: -10,
    filter: 'blur(4px)',
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
}

// Background wipe effect
const wipeVariants: Variants = {
  initial: {
    scaleX: 0,
    originX: 0,
  },
  animate: {
    scaleX: [0, 1, 1, 0],
    originX: [0, 0, 1, 1],
    transition: {
      duration: 0.8,
      times: [0, 0.4, 0.6, 1],
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
}

// Floating particles during transition
function TransitionParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-violet-400/60"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 2) * 40}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            opacity: [0, 1, 0],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: 0.8,
            delay: i * 0.05,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

export function PageTransition({ children }: PageTransitionProps) {
  const [mounted, setMounted] = useState(false)
  const [isFirstRender, setIsFirstRender] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => setIsFirstRender(false), 100)
    return () => clearTimeout(timer)
  }, [])

  // Prevent SSR issues
  if (!mounted) {
    return (
      <div className="w-full min-h-screen bg-white">
        {children}
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={pageVariants}
        initial={isFirstRender ? false : "initial"}
        animate="enter"
        exit="exit"
        className="w-full min-h-screen bg-white"
      >
        {/* Transition overlay effect */}
        {!isFirstRender && (
          <motion.div
            className="fixed inset-0 z-40 bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-blue-500/10 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        )}
        
        {/* Wipe effect */}
        {!isFirstRender && (
          <motion.div
            className="fixed inset-y-0 left-0 right-0 z-40 bg-gradient-to-r from-violet-600 to-fuchsia-600 pointer-events-none"
            variants={wipeVariants}
            initial="initial"
            animate="animate"
          />
        )}

        {/* Particles */}
        {!isFirstRender && <TransitionParticles />}

        {/* Content */}
        <motion.div 
          className="relative z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.4, 
            delay: isFirstRender ? 0 : 0.3,
            ease: [0.25, 0.1, 0.25, 1] as const 
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
