'use client'

import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { DashboardTabId } from '../_types'
import api from '@/lib/api'

export interface CourseFile {
  id: string
  name: string
  ext: string
  name_used?: string
  table_name?: string
}

export interface CourseModuleWithVideos {
  id: string
  title: string
  duration?: string
  files?: CourseFile[]
}

export interface Course {
  id: string | number
  _id?: string
  title: string
  description: string
  category?: string
  prerequisites?: string
  duration?: string
  language?: string
  price: number | string
  discount?: number | string
  whatToLearn?: string[]
  modules?: CourseModuleWithVideos[]
  image?: string
}

export interface CourseModule {
  id: string
  title: string
  duration: string
}

export interface CourseVideo {
  id: string
  file: File | null
  preview: string
  name: string
  moduleId: string
}

export interface CourseForm {
  title: string
  description: string
  language: string
  category: string
  prerequisites: string[]
  duration: string
  modulesCount: string
  price: string
  discount: string
  author: string
  whatToLearn: string[]
  image: string | null
  imageFile: File | null
  modules: CourseModule[]
  videos: CourseVideo[]
}

interface UseCoursesParams {
  activeTab: DashboardTabId
  showToast: (message: string, type?: 'success' | 'error') => void
}

const emptyCourseForm: CourseForm = {
  title: '',
  description: '',
  language: '',
  category: '',
  prerequisites: [],
  duration: '',
  modulesCount: '',
  price: '',
  discount: '',
  author: '',
  whatToLearn: [''],
  image: null,
  imageFile: null,
  modules: [],
  videos: []
}

export default function useCourses({ activeTab, showToast }: UseCoursesParams) {
  const [showCourseForm, setShowCourseForm] = useState(false)
  const [courseForm, setCourseForm] = useState<CourseForm>(emptyCourseForm)
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)

  const fetchCourses = async () => {
    try {
      setIsLoading(true)
      const res = await api.get('/api/v1/courses')
      // Try different response structures
      // Based on Postman screenshot: res.data.data (which is an array)
      const coursesData = Array.isArray(res.data?.data) ? res.data.data : (res.data?.data?.courses || res.data?.courses || [])
      console.log('Fetched courses:', coursesData, 'Response:', res.data)
      setCourses(Array.isArray(coursesData) ? coursesData : [])
    } catch (error) {
      console.error('Error fetching courses:', error)
      showToast('Սխալ դասընթացները բեռնելիս', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'courses') {
      fetchCourses()
    } else {
      setShowCourseForm(false)
    }
  }, [activeTab])

  const startNewCourse = () => {
    setCourseForm(emptyCourseForm)
    setEditingCourseId(null)
    setShowCourseForm(true)
  }

  const cancelNewCourse = () => {
    setShowCourseForm(false)
    setEditingCourseId(null)
    setEditingCourse(null)
    setCourseForm(emptyCourseForm)
  }

  const editCourse = (course: Course) => {
    setEditingCourseId(String(course.id))
    setEditingCourse(course)
    const rawPrice = (course as unknown as { price?: unknown }).price
    const rawDiscount = (course as unknown as { discount?: unknown }).discount
    const rawWhatToLearn = (course as unknown as { whatToLearn?: unknown }).whatToLearn
    const rawModules = (course as unknown as { modules?: unknown }).modules
    setCourseForm({
      ...emptyCourseForm,
      title: course.title || '',
      description: course.description || '',
      language: (course as unknown as { language?: string }).language || 'ARM',
      category: (course as unknown as { category?: string }).category || '',
      prerequisites: (course as unknown as { prerequisites?: string[] }).prerequisites || [],
      duration: (course as unknown as { duration?: string }).duration || '',
      modulesCount: Array.isArray(rawModules) ? String(rawModules.length) : '',
      price: rawPrice === 0 ? '0' : rawPrice ? String(rawPrice) : '',
      discount: rawDiscount === 0 ? '0' : rawDiscount ? String(rawDiscount) : '',
      author: (course as unknown as { author?: string }).author || '',
      whatToLearn: Array.isArray(rawWhatToLearn) && rawWhatToLearn.length ? (rawWhatToLearn as string[]) : [''],
      image: (course as unknown as { image?: string | null }).image ?? null,
      imageFile: null,
      modules: Array.isArray(course.modules)
        ? course.modules.map((m: unknown) => {
            const mm = m as { id?: unknown; title?: unknown; name?: unknown; duration?: unknown }
            return {
              id: String(mm?.id ?? ''),
              title: String((typeof mm?.title === 'string' && mm.title) || (typeof mm?.name === 'string' && mm.name) || ''),
              duration: String(mm?.duration ?? '')
            }
          })
        : [],
      videos: []
    })
    setShowCourseForm(true)
  }

  const addLearningPoint = () => {
    setCourseForm((prev) => ({ ...prev, whatToLearn: [...prev.whatToLearn, ''] }))
  }

  const changeLearningPoint = (index: number, value: string) => {
    setCourseForm((prev) => {
      const next = [...prev.whatToLearn]
      next[index] = value
      return { ...prev, whatToLearn: next }
    })
  }

  const removeLearningPoint = (index: number) => {
    setCourseForm((prev) => ({ ...prev, whatToLearn: prev.whatToLearn.filter((_, i) => i !== index) }))
  }

  const submitCourse = async (e: FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const payload = {
        ...courseForm,
        price: parseFloat(courseForm.price) || 0,
        discount: parseFloat(courseForm.discount) || 0
      }

      if (editingCourseId) {
        await api.patch(`/api/v1/courses/${editingCourseId}`, payload)
        showToast('Դասընթացը թարմացվեց', 'success')
      } else {
        await api.post('/api/v1/courses', payload)
        showToast('Դասընթացը ստեղծվեց', 'success')
      }
      
      await fetchCourses()
      setShowCourseForm(false)
      setEditingCourseId(null)
      setEditingCourse(null)
      setCourseForm(emptyCourseForm)
    } catch (error) {
      console.error('Error saving course:', error)
      showToast(editingCourseId ? 'Սխալ դասընթացը թարմացնելիս' : 'Սխալ դասընթացը ստեղծելիս', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const deleteCourse = async (id: string) => {
    try {
      setIsLoading(true)
      await api.delete(`/api/v1/courses/${id}`)
      showToast('Դասընթացը ջնջվեց', 'success')
      await fetchCourses()
    } catch (error) {
      console.error('Error deleting course:', error)
      showToast('Սխալ դասընթացը ջնջելիս', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to get first video thumbnail from course
  const getCourseFirstVideoUrl = (course: Course): string | null => {
    if (!course.modules || course.modules.length === 0) return null
    
    // Get first module
    const firstModule = course.modules[0]
    if (!firstModule.files || firstModule.files.length === 0) return null
    
    // Get first video file from module
    const videoFile = firstModule.files.find(f => f.name_used === 'module_video')
    if (!videoFile) return null
    
    // Build video URL
    const apiBase = process.env.NEXT_PUBLIC_API_URL || ''
    const origin = /^https?:\/\//i.test(apiBase) ? apiBase.replace(/\/api.*$/, '') : ''
    return `${origin}/files/modules/${videoFile.name}${videoFile.ext}`
  }

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
    getCourseFirstVideoUrl,
    editingCourseId,
    editingCourse
  }
}
