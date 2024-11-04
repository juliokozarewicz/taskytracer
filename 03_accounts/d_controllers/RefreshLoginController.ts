import { NextFunction, Request, Response } from 'express'
import { escape } from 'lodash'
import { RefreshLoginService } from '../c_services/RefreshLoginService'
import { RefreshLoginValidation } from '../b_validations/RefreshLoginValidation'

export class RefreshLoginController {

  async handle(

    req: Request,
    res: Response,
    next: NextFunction

  ):

    Promise<void>

  {

    try {

      // validation
      const validatedBody =  RefreshLoginValidation(req).parse(req.body)

      // data object
      const validatedData = {
        refresh: escape(validatedBody.refresh)
      }

      // call execute
      const refreshLoginService = new RefreshLoginService(req.t)
      const response = await refreshLoginService.execute(validatedData)

      //response
      res.status(response.code).json(response)

    } catch (error) {

      next(error)

    }

  }

}