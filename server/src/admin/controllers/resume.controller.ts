import { ResumeRepository } from '@src/admin/repositories/resume.repository.js'
import { Request, Response } from 'express'

export class ResumeController {
  static async show(_req: Request, res: Response) {
    const resume = await ResumeRepository.getOrCreate()
    res.json(resume)
  }

  static async upsert(req: Request, res: Response) {
    const resume = await ResumeRepository.upsert(req.body?.content)
    res.json(resume)
  }
}
