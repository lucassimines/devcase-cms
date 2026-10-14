import { ResumeService } from '@src/web/services/resume.service.js'
import { Request, Response } from 'express'

export class ResumeController {
  static async show(_req: Request, res: Response) {
    res.json(await ResumeService.content())
  }
}
