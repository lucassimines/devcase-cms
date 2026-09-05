import 'dotenv/config'

import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

import { prisma } from '../src/db.js'
import { storageDirectory } from '../src/utils/storage-path.utils.js'
import { WEBP_QUALITY } from '../src/utils/image.utils.js'

const SOURCE_ROOT = '/Users/lucassimines/LBS/Projects/PriceFlip/priceflip/store/screenshots'

const SCREENSHOTS = [
  { locale: 'en-US', filename: 'priceflip-scan-en-us.webp', source: path.join(SOURCE_ROOT, 'en-US/01.PNG') },
  { locale: 'pt-BR', filename: 'priceflip-scan-pt-br.webp', source: path.join(SOURCE_ROOT, 'pt-BR/01.PNG') }
] as const

async function importScreenshot(filename: string, source: string) {
  const dest = path.join(storageDirectory, filename)

  await fs.promises.mkdir(storageDirectory, { recursive: true })
  const { size } = await sharp(source).webp({ quality: WEBP_QUALITY }).toFile(dest)

  await prisma.file.upsert({
    where: { filename },
    create: {
      filename,
      extension: 'webp',
      mime: 'image/webp',
      size
    },
    update: {
      extension: 'webp',
      mime: 'image/webp',
      size
    }
  })

  console.log(`Stored ${filename} (${size} bytes)`)
}

async function main() {
  for (const shot of SCREENSHOTS) {
    await importScreenshot(shot.filename, shot.source)
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
