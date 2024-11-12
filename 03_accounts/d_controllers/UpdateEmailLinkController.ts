import { NextFunction, Request, Response } from 'express'
import { escape } from 'lodash'
import { CustomRequest } from '../e_middlewares/AuthGuardian'
import { UpdateEmailLinkService } from '../c_services/UpdateEmailLinkService'
import { UpdateEmailLinkValidation } from '../b_validations/UpdateEmailLinkValidation'

export class UpdateEmailLinkController {

  async handle(

    req: CustomRequest,
    res: Response,
    next: NextFunction

  ):

    Promise<void>

  {

    try {

      // validation
      const validatedAuthData = UpdateEmailLinkValidation(req).parse({
        ...req.authData,
        ...req.body
      })

      // data object
      const validatedData = {
        email: escape(validatedAuthData.email),
        newemail: escape(validatedAuthData.newemail),
        id: escape(validatedAuthData.id),
        link: escape(validatedAuthData.link),
      }

      // call execute
      const updateEmailLinkService = new UpdateEmailLinkService(req.t)
      const response = await updateEmailLinkService.execute(validatedData)

      // response
      res.status(response.code).json(response)

    } catch (error) {

      next(error)

    }

  }

}