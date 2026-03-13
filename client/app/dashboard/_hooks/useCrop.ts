'use client'

import { useState, useCallback } from 'react'

interface UseCropProps {
  setSiteSettings: React.Dispatch<React.SetStateAction<any>>
}

export function useCrop({ setSiteSettings }: UseCropProps) {
  const [cropImage, setCropImage] = useState<string | null>(null)
  const [cropModalOpen, setCropModalOpen] = useState(false)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    console.log(croppedArea, croppedAreaPixels)
  }, [])

  const onLogoFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setCropImage(reader.result as string)
        setCropModalOpen(true)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const createCroppedImage = useCallback(async () => {
    if (!cropImage) return
    setSiteSettings((prev: any) => ({ ...prev, logo: cropImage }))
    setCropModalOpen(false)
    setCropImage(null)
  }, [cropImage, setSiteSettings])

  const closeCrop = useCallback(() => {
    setCropModalOpen(false)
    setCropImage(null)
  }, [])

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
