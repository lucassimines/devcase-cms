import { UserService } from '@src/admin/repositories/user.service.js'
import { Request, Response } from 'express'

export class UserController {
  static async update(req: Request, res: Response) {
    await UserService.update(req.body.email, req.body)

    res.json(200)
  }
}
