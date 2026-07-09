import { prisma } from '@src/db.js'
import { convertImageToWebp, webpFilename } from '@src/utils/image.utils.js'
import { storageDirectory } from '@src/utils/storage-path.utils.js'
import fs from 'fs'
import path from 'path'
import slugify from 'slugify'
import type { GeneratedCoverImage } from './post-generate-image.types.js'

function buildBaseFilename(slug: string) {
  const base = slugify.default(slug || 'post-cover', { lower: true, strict: true }) || 'post-cover'

  return `${base}-cover-${Date.now()}`
}

export async function storeGeneratedCoverImage(buffer: Buffer, slug: string): Promise<GeneratedCoverImage> {
  await fs.promises.mkdir(storageDirectory, { recursive: true })

  const baseFilename = buildBaseFilename(slug)
  const pngPath = path.join(storageDirectory, `${baseFilename}.png`)
  const webpName = webpFilename(`${baseFilename}.png`)
  const webpPath = path.join(storageDirectory, webpName)

  await fs.promises.writeFile(pngPath, buffer)

  const size = await convertImageToWebp(pngPath, webpPath)

  await fs.promises.unlink(pngPath)

  await prisma.file.create({
    data: {
      filename: webpName,
      extension: 'webp',
      mime: 'image/webp',
      size
    }
  })

  const image = {
    'en-US': webpName,
    'pt-BR': webpName
  }

  return {
    filename: webpName,
    image
  }
}
