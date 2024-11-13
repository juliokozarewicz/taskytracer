import { NextFunction, Response } from 'express'
import { CustomRequest } from '../e_middlewares/AuthGuardian'
import { escape } from 'lodash'
import { UpdateEmailService } from '../c_services/UpdateEmailService'
import { UpdateEmailValidation } from '../b_validations/UpdateEmailValidation'

export class UpdateEmailController {

  async handle(

    req: CustomRequest,
    res: Response,
    next: NextFunction

  ):

    Promise<void>

  {

    try {

      // validation    
      const validatedAuthData = UpdateEmailValidation(req).parse({
        ...req.body
      })

      // data object
      const validatedData = {
        newemail: escape(validatedAuthData.newemail),
        code: escape(validatedAuthData.code),
        password: escape(validatedAuthData.password),
      }

      // call execute
      const updateEmailService = new UpdateEmailService(req.t)
      const response = await updateEmailService.execute(validatedData)

      //response
      res.status(response.code).json(response)

    } catch (error) {

      next(error)

    }

  }

}