import { useCallback, useState } from 'react'
import type { Area, Point } from 'react-easy-crop'
import type { SiteSettings } from '@/components/features/admin/types'
import type { Dispatch, SetStateAction } from 'react'
import { useSettings } from '@/context/SettingsContext'

const createImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })

const getRadianAngle = (degreeValue: number) => (degreeValue * Math.PI) / 180

const rotateSize = (width: number, height: number, rotation: number) => {
  const rotRad = getRadianAngle(rotation)
  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height)
  }
}

const getCroppedImg = async (imageSrc: string, pixelCrop: Area, rotation = 0) => {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('No canvas context')

  const rotRad = getRadianAngle(rotation)

  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(image.width, image.height, rotation)
  canvas.width = bBoxWidth
  canvas.height = bBoxHeight

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
  ctx.rotate(rotRad)
  ctx.translate(-image.width / 2, -image.height / 2)
  ctx.drawImage(image, 0, 0)

  const data = ctx.getImageData(pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height)

  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height
  ctx.putImageData(data, 0, 0)

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error('Canvas is empty'))
      resolve(blob)
    }, 'image/png')
  })
}

interface UseCropParams {
  setSiteSettings: Dispatch<SetStateAction<SiteSettings>>
  skipGlobalUpdate?: boolean
}

export default function useCrop({ setSiteSettings, skipGlobalUpdate }: UseCropParams) {
  const { updateSettings } = useSettings()
  const [cropImage, setCropImage] = useState<string | null>(null)
  const [cropModalOpen, setCropModalOpen] = useState(false)
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPx: Area) => {
    setCroppedAreaPixels(croppedAreaPx)
  }, [])

  const onLogoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    const url = URL.createObjectURL(f)
    setCropImage(url)
    setCropModalOpen(true)
  }

  const createCroppedImage = async () => {
    if (!cropImage || !croppedAreaPixels) return
    const blob = await getCroppedImg(cropImage, croppedAreaPixels, 0)
    const file = new File([blob], `logo_${Date.now()}.png`, { type: 'image/png' })
    const url = URL.createObjectURL(file)
    setSiteSettings((prev) => ({ ...prev, logo: url, logoFile: file }))
    if (!skipGlobalUpdate) {
      updateSettings({ logo: url }) // Update global context for footer/nav only for site logo
    }
    setCropModalOpen(false)
    setCropImage(null)
  }

  const closeCrop = () => {
    setCropModalOpen(false)
    setCropImage(null)
  }

  return {
    cropImage,
    cropModalOpen,
    crop,
    zoom,
    setCrop,
    setZoom,
    onCropComplete,
    onLogoFileSelect,
    createCroppedImage,
    closeCrop
  }
}
