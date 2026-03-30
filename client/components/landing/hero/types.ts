// Hero section types
export interface HeroContentData {
  id: number
  title: string
  name: string
  text: string
  video_url?: string
  thumbnail_time?: number
}

export interface Review {
  id: number | string
  name?: string
  rating?: number
  comment?: string
  createdAt?: string
}

export interface HeroSectionProps {
  isPlaying: boolean
  videoError: string | null
  onPlayVideo: () => void
  onVideoError: () => void
  onOpenModal: () => void
  content: HeroContentData | null
}
