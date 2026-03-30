// Reviews feature types
export interface Review {
  id: number | string
  name?: string
  rating?: number
  comment?: string
  createdAt?: string
}

export interface RatingCount {
  star: number
  count: number
  percentage: number
  heightPercentage: number
}

export interface CategoryRating {
  name: string
  rating: number
}
