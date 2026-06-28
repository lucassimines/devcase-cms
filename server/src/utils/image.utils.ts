import path from 'path'
import sharp from 'sharp'

const WEBP_QUALITY = 80

const CONVERTIBLE_IMAGE_MIMES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/tiff',
  'image/bmp',
  'image/heic',
  'image/heif',
  'image/avif'
])

export function isConvertibleImage(mime: string) {
  return CONVERTIBLE_IMAGE_MIMES.has(mime.toLowerCase())
}

export function webpFilename(filename: string) {
  return `${path.parse(filename).name}.webp`
}

export async function convertImageToWebp(inputPath: string, outputPath: string) {
  const { size } = await sharp(inputPath).webp({ quality: WEBP_QUALITY }).toFile(outputPath)

  return size
}
