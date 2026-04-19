'use client'

import { useRef, useCallback } from 'react'

interface UseStartCourseResult {
  modulesSectionRef: React.RefObject<HTMLDivElement>
  handleStartCourse: (firstVideo: { id: string | number; videoUrl?: string } | null) => void
}

export function useStartCourse(): UseStartCourseResult {
  const modulesSectionRef = useRef<HTMLDivElement>(null)

  const handleStartCourse = useCallback((firstVideo: { id: string | number; videoUrl?: string } | null) => {
    if (!firstVideo || typeof window === 'undefined') return

    // Scroll to modules section using ref
    modulesSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
    // Store video id for CourseModulesList to read
    localStorage.setItem('playVideoId', String(firstVideo.id))
    // Dispatch custom event for same-tab communication
    window.dispatchEvent(new Event('startCourse'))
  }, [])

  return {
    modulesSectionRef,
    handleStartCourse
  }
}
