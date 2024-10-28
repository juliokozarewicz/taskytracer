import { NextFunction, Request, Response } from 'express'
import { escape } from 'lodash'
import { ActivateEmailLinkService } from '../c_services/ActivateEmailLinkService'
import { ActivateEmailLinkValidation } from '../b_validations/ActivateEmailLinkValidation'

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
      const validatedBody =  ActivateEmailLinkValidation(req).parse(req.body)

      // data object
      const validatedData = {
        email: escape(validatedBody.email),
        link: escape(validatedBody.link),
      }

      // call execute
      const resendEmailCodeService = new ActivateEmailLinkService(req.t)
      const response = await resendEmailCodeService.execute(validatedData)

      //response
      res.status(response.code).json(response)

    } catch (error) {

      next(error)

    }

  }

}