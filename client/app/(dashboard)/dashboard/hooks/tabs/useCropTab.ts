'use client'

import useCrop from '@/hooks/admin/useCrop'

interface UseCropTabProps {
  setSiteSettings: React.Dispatch<React.SetStateAction<any>>
}

export function useCropTab({ setSiteSettings }: UseCropTabProps) {
  const {
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
  } = useCrop({ setSiteSettings })

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
