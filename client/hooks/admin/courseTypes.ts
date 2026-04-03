// Course types

import type { Course } from '@/components/features/admin/types'

export interface CourseModuleWithVideos {
  id: string
  title: string
  duration?: string
  files?: CourseFile[]
}

export interface CourseFile {
  id: string
  name: string
  ext: string
  name_used?: string
  table_name?: string
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
  thumbnail_time: string | null
  modules: CourseModule[]
  videos: CourseVideo[]
}

// ExtendedCourse type for form editing (includes API + form fields)
export interface ExtendedCourse {
  id: string | number
  _id?: string
  title: string
  description: string
  category?: string
  prerequisites?: string[]
  duration?: string
  language?: string
  price: number | string
  discount?: number | string
  whatToLearn?: string[]
  modules?: CourseModuleWithVideos[]
  image?: string | null
  thumbnail_time?: number
  author?: string
}

export const emptyCourseForm: CourseForm = {
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
}
