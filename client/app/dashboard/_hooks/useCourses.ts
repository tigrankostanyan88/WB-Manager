'use client'

import { useState, useCallback, useEffect } from 'react'
import type { Course } from '../_types'

interface UseCoursesProps {
  activeTab: string
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
}

export function useCourses({ activeTab, showToast }: UseCoursesProps) {
  const [showCourseForm, setShowCourseForm] = useState(false)
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    price: '',
    image: '',
    learningPoints: [] as string[]
  })
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [cropImage, setCropImage] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  const fetchCourses = useCallback(async () => {
    if (activeTab !== 'courses') return
    setIsLoading(true)
    try {
      const res = await fetch('/api/courses')
      const data = await res.json()
      setCourses(data.courses || [])
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setIsLoading(false)
    }
  }, [activeTab])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  const startNewCourse = useCallback(() => {
    setCourseForm({ title: '', description: '', price: '', image: '', learningPoints: [] })
    setShowCourseForm(true)
  }, [])

  const editCourse = useCallback((course: Course) => {
    setCourseForm({
      title: course.title,
      description: course.description,
      price: String(course.price),
      image: course.image || '',
      learningPoints: course.learningPoints || []
    })
    setShowCourseForm(true)
  }, [])

  const cancelNewCourse = useCallback(() => {
    setShowCourseForm(false)
  }, [])

  const addLearningPoint = useCallback(() => {
    setCourseForm(prev => ({ ...prev, learningPoints: [...prev.learningPoints, ''] }))
  }, [])

  const changeLearningPoint = useCallback((index: number, value: string) => {
    setCourseForm(prev => {
      const newPoints = [...prev.learningPoints]
      newPoints[index] = value
      return { ...prev, learningPoints: newPoints }
    })
  }, [])

  const removeLearningPoint = useCallback((index: number) => {
    setCourseForm(prev => {
      const newPoints = [...prev.learningPoints]
      newPoints.splice(index, 1)
      return { ...prev, learningPoints: newPoints }
    })
  }, [])

  const submitCourse = useCallback(async () => {
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseForm)
      })
      if (res.ok) {
        showToast('Դասընթացը ստեղծված է')
        setShowCourseForm(false)
        fetchCourses()
      } else {
        showToast('Սխալ է տեղի ունեցել', 'error')
      }
    } catch {
      showToast('Սխալ է տեղի ունեցել', 'error')
    }
  }, [courseForm, showToast, fetchCourses])

  const deleteCourse = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' })
      if (res.ok) {
        showToast('Դասընթացը ջնջված է')
        fetchCourses()
      } else {
        showToast('Սխալ է տեղի ունեցել', 'error')
      }
    } catch {
      showToast('Սխալ է տեղի ունեցել', 'error')
    }
  }, [showToast, fetchCourses])

  const onImageFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setCropImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const onCropComplete = useCallback(() => {
    if (cropImage) {
      setCourseForm(prev => ({ ...prev, image: cropImage }))
    }
  }, [cropImage])

  const onCropConfirm = useCallback(() => {
    if (cropImage) {
      setCourseForm(prev => ({ ...prev, image: cropImage }))
    }
    setCropImage(null)
  }, [cropImage])

  const onCropClose = useCallback(() => {
    setCropImage(null)
  }, [])

  return {
    showCourseForm,
    courseForm,
    setCourseForm,
    startNewCourse,
    editCourse,
    cancelNewCourse,
    addLearningPoint,
    changeLearningPoint,
    removeLearningPoint,
    submitCourse,
    deleteCourse,
    courses,
    isLoading,
    cropImage,
    crop,
    zoom,
    setCrop,
    setZoom,
    onImageFileSelect,
    onCropComplete,
    onCropConfirm,
    onCropClose
  }
}
