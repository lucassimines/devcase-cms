import { prisma } from '@src/db.js'
import { webpFilename } from '@src/utils/image.utils.js'
import { storageDirectory } from '@src/utils/storage-path.utils.js'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import slugify from 'slugify'
import { COVER_HEIGHT, COVER_WIDTH } from './post-generate-image.prompt.js'
import type { GeneratedCoverImage } from './post-generate-image.types.js'

const WEBP_QUALITY = 80

function buildBaseFilename(slug: string) {
  const base = slugify.default(slug || 'post-cover', { lower: true, strict: true }) || 'post-cover'

  return `${base}-cover-${Date.now()}`
}

async function normalizeCoverToWebp(buffer: Buffer) {
  const { data, info } = await sharp(buffer)
    .resize(COVER_WIDTH, COVER_HEIGHT, { fit: 'cover', position: 'centre' })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer({ resolveWithObject: true })

  return { buffer: data, size: info.size }
}

export async function storeGeneratedCoverImage(buffer: Buffer, slug: string): Promise<GeneratedCoverImage> {
  await fs.promises.mkdir(storageDirectory, { recursive: true })

  const baseFilename = buildBaseFilename(slug)
  const webpName = webpFilename(`${baseFilename}.webp`)
  const webpPath = path.join(storageDirectory, webpName)

  const { buffer: webpBuffer, size } = await normalizeCoverToWebp(buffer)

  await fs.promises.writeFile(webpPath, webpBuffer)

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
