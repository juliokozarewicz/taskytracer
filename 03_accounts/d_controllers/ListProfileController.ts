import { NextFunction, Request, Response } from 'express'
import { escape } from 'lodash'
import { ListProfileService } from '../c_services/ListProfileService'

// interface
interface CustomRequest extends Request {
  validatedAuthData?: {
    email: string;
    id: string;
  };
}

export class ListProfileController {

  async handle(

    req: CustomRequest,
    res: Response,
    next: NextFunction

  ):

    Promise<void>

  {

    try {

      console.log(req.validatedAuthData)

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