import { NextFunction, Request, Response } from 'express'
import { escape } from 'lodash'
import { ChangePasswordLinkValidation } from '../b_validations/ChangePasswordLinkValidation'
import { ChangePasswordLinkService } from '../c_services/ChangePasswordLinkService'

export class ChangePasswordLinkController {

  async handle(

    req: Request,
    res: Response,
    next: NextFunction

  ):

    Promise<void>

  {

    try {

      // validation
      const validatedBody =  ChangePasswordLinkValidation(req).parse(req.body)

      // data object
      const validatedData = {
        email: escape(validatedBody.email),
        link: escape(validatedBody.link),
      }

      // call execute
      const changePasswordLinkService = new ChangePasswordLinkService(req.t)
      const response = await changePasswordLinkService.execute(validatedData)

      //response
      res.status(response.code).json(response)

    } catch (error) {

      next(error)

    }

  }

}