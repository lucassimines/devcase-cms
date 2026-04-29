import { prisma } from '@src/db.js'
import type { Prisma } from '@src/generated/prisma/client.js'
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
   * Create many files
   */
  static async createMany(formFiles: Express.Multer.File[]) {
    return await prisma.file.createManyAndReturn({
      data: this.mapFormFilesToModel(formFiles)
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
