import { NextFunction, Request, Response } from 'express'
import { escape } from 'lodash'
import { DeleteAccountLinkService } from '../c_services/DeleteAccountLinkService'
import { DeleteAccountLinkValidation } from '../b_validations/DeleteAccountLinkValidation'
import { CustomRequest } from '../e_middlewares/AuthGuardian'


export class DeleteAccountLinkController {

  async handle(

    req: CustomRequest,
    res: Response,
    next: NextFunction

  ):

    Promise<void>

  {

    try {

      // validation
      const validatedAuthData = DeleteAccountLinkValidation(req).parse({
        ...req.authData,
        ...req.body
      })

      // data object
      const validatedData = {
        email: escape(validatedAuthData.email),
        id: escape(validatedAuthData.id),
        link: escape(validatedAuthData.link),
      }

      // call execute
      const deleteAccountLinkService = new DeleteAccountLinkService(req.t)
      const response = await deleteAccountLinkService.execute(validatedData)

      //response
      res.status(response.code).json(response)

    } catch (error) {

      next(error)

    }

  }

}