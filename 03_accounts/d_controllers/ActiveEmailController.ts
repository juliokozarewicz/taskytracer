import { NextFunction, Request, Response } from 'express'
import { escape } from 'lodash'
import { ActivateEmailService } from '../c_services/ActivateEmailService'
import { ActivateEmailValidation } from '../b_validations/ActivateEmailValidation'

export class ActiveEmailController {

  async handle(

    req: Request,
    res: Response,
    next: NextFunction

  ):

    Promise<void>

  {

    try {

      // validation
      const validatedBody =  ActivateEmailValidation(req).parse(req.body)

      // data object
      const validatedData = {
        email: escape(validatedBody.email),
        code: escape(validatedBody.code)
      }

      // call execute
      const activateEmailService = new ActivateEmailService(req.t)
      const response = await activateEmailService.execute(validatedData)

      //response
      res.status(response.code).json(response)

    } catch (error) {

      next(error)

    }

  }

}