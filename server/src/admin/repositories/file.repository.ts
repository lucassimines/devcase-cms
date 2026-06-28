import { prisma } from '@src/db.js'
import type { Prisma } from '@src/generated/prisma/client.js'
import {
  convertImageToWebp,
  isConvertibleImage,
  webpFilename
} from '@src/utils/image.utils.js'
import { storageDirectory } from '@src/utils/storage-path.utils.js'
import fs from 'fs'
import path from 'path'

export class FileRepository {
  /**
   * Get file storage url
   */
  static getFileUrl(filename: string) {
    return path.join(storageDirectory, filename)
  }

  /**
   * Map form files to database Model
   */
  static mapFormFilesToModel(files: Express.Multer.File[]): Prisma.FileCreateInput[] {
    return files.reduce((acc: Prisma.FileCreateInput[], f) => {
      acc.push({
        extension: path.extname(f.filename).slice(1),
        filename: f.filename,
        mime: f.mimetype,
        size: f.size
      })

      return acc
    }, [])
  }

  /**
   * Convert uploaded raster images to WebP and update file metadata.
   */
  static async processUploadedFile(file: Express.Multer.File) {
    if (!isConvertibleImage(file.mimetype)) {
      return file
    }

    const originalPath = this.getFileUrl(file.filename)
    const filename = webpFilename(file.filename)
    const webpPath = this.getFileUrl(filename)

    const size = await convertImageToWebp(originalPath, webpPath)

    await fs.promises.unlink(originalPath)

    return {
      ...file,
      filename,
      mimetype: 'image/webp',
      size,
      path: webpPath
    }
  }

  /**
   * Create many files
   */
  static async createMany(formFiles: Express.Multer.File[]) {
    const processedFiles = await Promise.all(formFiles.map((file) => this.processUploadedFile(file)))

    return await prisma.file.createManyAndReturn({
      data: this.mapFormFilesToModel(processedFiles)
    })
  }

  /**
   * Delete file from storage and destroy file from database
   */
  static async delete(filename: string) {
    // Delete the file from filesystem storage
    fs.unlink(this.getFileUrl(filename), () => {})

    return await prisma.file.delete({
      where: { filename }
    })
  }
}
