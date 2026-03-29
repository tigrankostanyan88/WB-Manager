// Course details page types

export interface CourseData {
  id: string | number
  title: string
  description: string
  category?: string
  prerequisites?: string
  duration?: string
  language?: string
  price: number | string
  discount?: number | string
  whatToLearn?: string[]
  modules?: unknown[]
  author?: string
  rating?: number
  reviewsCount?: number
  studentsCount?: number
  updatedAt?: string
  image?: string
  thumbnail_time?: number
}

export interface UserWithCourses {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  role?: string
  avatar?: string
  course_ids?: (string | number)[]
  isPaid?: boolean
}

export interface CourseModuleFile {
  id?: string | number
  name?: string
  ext?: string
  name_used?: string
  title?: string
  duration?: string
}

export interface CourseModuleData {
  id?: unknown
  title?: unknown
  name?: unknown
  duration?: unknown
  files?: unknown[]
}
