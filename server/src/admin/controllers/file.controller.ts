import { FileRepository } from '@src/admin/repositories/file.repository.js'
import { prisma } from '@src/db.js'
import { paginate } from '@src/utils/paginate.utils.js'
import { Request, Response } from 'express'

export class FileController {
  static async index(req: Request, res: Response) {
    res.json(await paginate(prisma.file, req.query))
  }

  static async createMany(req: Request, res: Response) {
    const { files: formFiles } = req

    const files = await FileRepository.createMany(formFiles as Express.Multer.File[])

    res.json(files)
  }

  static async delete(req: Request, res: Response) {
    res.json(await FileRepository.delete(req.body.filename))
  }
}
