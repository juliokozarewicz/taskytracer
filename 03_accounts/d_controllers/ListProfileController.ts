import { NextFunction, Request, Response } from 'express'
import { escape } from 'lodash'
import { ListProfileService } from '../c_services/ListProfileService'

export class ListProfileController {

  async handle(

    req: Request,
    res: Response,
    next: NextFunction

  ):

    Promise<void>

  {

    try {

      // call execute
      const listProfileService = new ListProfileService(req.t)
      const response = await listProfileService.execute()

      //response
      res.status(response.code).json(response)

    } catch (error) {

      next(error)

    }

  }

}