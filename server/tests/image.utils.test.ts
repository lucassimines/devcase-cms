import { mkdtemp, readFile, rm } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import sharp from 'sharp'
import { describe, expect, it } from 'vitest'

import { convertImageToWebp, isConvertibleImage, webpFilename } from '@src/utils/image.utils.js'

describe('image.utils', () => {
  it('detects convertible image mime types', () => {
    expect(isConvertibleImage('image/jpeg')).toBe(true)
    expect(isConvertibleImage('image/png')).toBe(true)
    expect(isConvertibleImage('image/webp')).toBe(false)
    expect(isConvertibleImage('image/svg+xml')).toBe(false)
    expect(isConvertibleImage('application/pdf')).toBe(false)
  })

  it('builds a webp filename from the uploaded filename', () => {
    expect(webpFilename('photo-1234567890.jpg')).toBe('photo-1234567890.webp')
  })

  it('converts jpeg uploads to webp', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'webp-test-'))
    const inputPath = join(dir, 'test.jpg')
    const outputPath = join(dir, 'test.webp')

    await sharp({
      create: {
        width: 10,
        height: 10,
        channels: 3,
        background: { r: 255, g: 0, b: 0 }
      }
    })
      .jpeg()
      .toFile(inputPath)

    const size = await convertImageToWebp(inputPath, outputPath)

    expect(size).toBeGreaterThan(0)

    const output = await readFile(outputPath)
    expect(output.subarray(0, 4).toString()).toBe('RIFF')
    expect(output.subarray(8, 12).toString()).toBe('WEBP')

    await rm(dir, { recursive: true })
  })
})
