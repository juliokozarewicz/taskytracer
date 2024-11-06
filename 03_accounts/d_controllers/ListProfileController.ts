import { NextFunction, Response } from 'express'
import { ListProfileService } from '../c_services/ListProfileService'
import { CustomRequest } from '../e_middlewares/AuthGuardian'

export class ListProfileController {

  async handle(

    req: CustomRequest,
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