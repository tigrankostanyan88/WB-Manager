'use client'

import { useState, type FormEvent } from 'react'
import type { CourseForm, ExtendedCourse, emptyCourseForm } from './courseTypes'
import { useCreateCourse, useUpdateCourse } from './useCourseQueries'

interface UseCourseFormParams {
  showToast: (message: string, type?: 'success' | 'error') => void
}

export function useCourseForm({ showToast }: UseCourseFormParams) {
  const [showCourseForm, setShowCourseForm] = useState(false)
  const [courseForm, setCourseForm] = useState<CourseForm>({
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
    thumbnail_time: null,
    modules: [],
    videos: []
  })
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null)
  const [editingCourse, setEditingCourse] = useState<ExtendedCourse | null>(null)

  const createCourse = useCreateCourse()
  const updateCourse = useUpdateCourse()

  const startNewCourse = () => {
    setCourseForm({
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
      thumbnail_time: null,
      modules: [],
      videos: []
    })
    setEditingCourseId(null)
    setShowCourseForm(true)
  }

  const cancelNewCourse = () => {
    setShowCourseForm(false)
    setEditingCourseId(null)
    setEditingCourse(null)
    setCourseForm({
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
      thumbnail_time: null,
      modules: [],
      videos: []
    })
  }

  const editCourse = (course: ExtendedCourse) => {
    setEditingCourseId(String(course.id))
    setEditingCourse(course)
    const rawPrice = course.price
    const rawDiscount = course.discount
    const rawWhatToLearn = course.whatToLearn
    const rawModules = course.modules
    const rawThumbnailTime = course.thumbnail_time
    setCourseForm({
      title: course.title || '',
      description: course.description || '',
      language: course.language || 'ARM',
      category: course.category || '',
      prerequisites: course.prerequisites || [],
      duration: course.duration || '',
      modulesCount: Array.isArray(rawModules) ? String(rawModules.length) : '',
      price: rawPrice === 0 ? '0' : rawPrice ? String(rawPrice) : '',
      discount: rawDiscount === 0 ? '0' : rawDiscount ? String(rawDiscount) : '',
      author: course.author || '',
      whatToLearn: Array.isArray(rawWhatToLearn) && rawWhatToLearn.length ? rawWhatToLearn : [''],
      image: course.image ?? null,
      imageFile: null,
      thumbnail_time: rawThumbnailTime ? String(rawThumbnailTime) : null,
      modules: Array.isArray(course.modules)
        ? course.modules.map((m) => ({
            id: String(m?.id ?? ''),
            title: String(m?.title ?? ''),
            duration: String(m?.duration ?? '')
          }))
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
      const formData = new FormData()
      formData.append('title', courseForm.title)
      formData.append('description', courseForm.description)
      formData.append('price', String(parseFloat(courseForm.price) || 0))
      formData.append('discount', String(parseFloat(courseForm.discount) || 0))
      formData.append('category', courseForm.category)
      formData.append('language', courseForm.language || 'ARM')

      const whatToLearn = courseForm.whatToLearn.filter(Boolean)
      formData.append('whatToLearn', JSON.stringify(whatToLearn))

      const prerequisites = courseForm.prerequisites.filter(Boolean)
      formData.append('prerequisites', JSON.stringify(prerequisites))

      if (courseForm.imageFile) {
        formData.append('course_img', courseForm.imageFile)
      }

      if (courseForm.thumbnail_time !== null && courseForm.thumbnail_time !== '') {
        formData.append('thumbnail_time', courseForm.thumbnail_time)
      }

      if (editingCourseId) {
        await updateCourse.mutateAsync({ id: editingCourseId, data: formData })
        showToast('Դասընթացը թարմացվեց', 'success')
      } else {
        await createCourse.mutateAsync(formData)
        showToast('Դասընթացը ստեղծվեց', 'success')
      }

      setShowCourseForm(false)
      setEditingCourseId(null)
      setEditingCourse(null)
      setCourseForm({
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
        thumbnail_time: null,
        modules: [],
        videos: []
      })
    } catch {
      showToast(editingCourseId ? 'Սխալ դասընթացը թարմացնելիս' : 'Սխալ դասընթացը ստեղծելիս', 'error')
    }
  }

  const isSubmitting = createCourse.isPending || updateCourse.isPending

  return {
    showCourseForm,
    setShowCourseForm,
    courseForm,
    setCourseForm,
    editingCourseId,
    editingCourse,
    startNewCourse,
    cancelNewCourse,
    editCourse,
    addLearningPoint,
    changeLearningPoint,
    removeLearningPoint,
    submitCourse,
    isSubmitting
  }
}
