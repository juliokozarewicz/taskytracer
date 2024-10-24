import { NextFunction, Request, Response } from 'express'
import { escape } from 'lodash'
import { ResendEmailCodeValidation } from '../b_validations/ResendEmailCodeValidation'
import { ResendEmailCodeService } from '../c_services/ResendEmailCodeService'

export class ResendEmailController {

  async handle(

    req: Request,
    res: Response,
    next: NextFunction

  ):

    Promise<void>

  {

    try {

      // validation
      const validatedBody =  ResendEmailCodeValidation(req).parse(req.body)

      // data object
      const validatedData = {
        email: escape(validatedBody.email),
        link: escape(validatedBody.link),
      }

      // call execute
      const resendEmailCodeService = new ResendEmailCodeService(req.t)
      const response = await resendEmailCodeService.execute(validatedData)

      //response
      res.status(response.code).json(response)

    } catch (error) {

      next(error)

    }

  }

}