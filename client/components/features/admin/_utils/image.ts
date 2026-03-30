'use client'

import type { Area } from 'react-easy-crop'

// Helper function to create image from URL
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

export const getCroppedImg = async (imageSrc: string, pixelCrop: Area, rotation = 0) => {
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

  const croppedCanvas = document.createElement('canvas')
  croppedCanvas.width = pixelCrop.width
  croppedCanvas.height = pixelCrop.height
  const croppedCtx = croppedCanvas.getContext('2d')
  if (!croppedCtx) throw new Error('No cropped canvas context')

  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  return new Promise<Blob>((resolve) => {
    croppedCanvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else resolve(new Blob())
    }, 'image/png')
  })
}

export const fixLarge = (p?: string) => {
  if (!p || typeof p !== 'string') return p
  if (p.includes('/insotrutors/') && !p.includes('/insotrutors/large/')) {
    return p.replace('/insotrutors/', '/insotrutors/large/')
  }
  if (p.includes('/instructors/') && !p.includes('/instructors/large/')) {
    return p.replace('/instructors/', '/instructors/large/')
  }
  return p
}

export const withOrigin = (p?: string) => {
  if (!p || typeof p !== 'string') return p
  if (p.startsWith('/images/')) {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || ''
    if (!apiBase) return p
    if (/^https?:\/\//i.test(apiBase)) {
      const origin = apiBase.replace(/\/api.*$/, '')
      return `${origin}${p}`
    }
    return p
  }
  return p
}

