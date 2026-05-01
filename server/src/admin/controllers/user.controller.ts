import { UserRepository } from '@src/admin/repositories/user.repository.js'
import { Request, Response } from 'express'

export class UserController {
  static async update(req: Request, res: Response) {
    await UserRepository.update(req.user, req.body)

    res.json(200)
  }
}
