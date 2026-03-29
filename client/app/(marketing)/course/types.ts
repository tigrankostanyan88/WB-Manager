export interface CourseFile {
  name?: string
  ext?: string
  name_used?: string
}

export interface CourseModule {
  id?: number | string
  title?: string
  name?: string
  files?: CourseFile[]
}

export interface Course {
  id: number | string
  title: string
  description: string
  category?: string
  language?: string
  price: number | string
  discount?: number | string
  rating?: number
  reviewsCount?: number
  studentsCount?: number
  duration?: string
  imageUrl?: string
  thumbnail_time?: number
  whatToLearn?: string[]
  modules?: CourseModule[]
}

export interface PriceInfo {
  price: number
  discount: number
  discountedPrice: number
  displayPrice: string
  originalPrice: string | null
}

export function calculatePriceInfo(price: number | string, discount?: number | string): PriceInfo {
  const priceNum = typeof price === 'number' ? price : Number(price)
  const discountNum = discount ? Number(discount) : 0
  const discountedPrice = discountNum > 0 ? priceNum * (1 - discountNum / 100) : priceNum

  const displayPrice = discountedPrice > 0
    ? `${Math.round(discountedPrice).toLocaleString()} դրամ`
    : 'Անվճար'
  const originalPrice = discountNum > 0 ? `${priceNum.toLocaleString()} դրամ` : null

  return {
    price: priceNum,
    discount: discountNum,
    discountedPrice,
    displayPrice,
    originalPrice
  }
}

export function getFirstVideoFile(modules?: CourseModule[]) {
  const firstModule = modules?.[0]
  const videoFiles = firstModule?.files?.filter((f) => f.name_used === 'module_video') || []
  return videoFiles[0]
}
