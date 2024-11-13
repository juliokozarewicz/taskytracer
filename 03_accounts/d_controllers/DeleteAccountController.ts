import { NextFunction, Response } from 'express'
import { CustomRequest } from '../e_middlewares/AuthGuardian'
import { escape } from 'lodash'
import { DeleteAccountValidation } from '../b_validations/DeleteAccountValidation'
import { DeleteAccountService } from '../c_services/DeleteAccountService'

export class DeleteAccountController {

  async handle(

    req: CustomRequest,
    res: Response,
    next: NextFunction

  ):

    Promise<void>

  {

    try {

      // validation    
      const validatedAuthData = DeleteAccountValidation(req).parse({
        ...req.body
      })

      // data object
      const validatedData = {
        email: escape(validatedAuthData.email),
        code: escape(validatedAuthData.code),
        password: escape(validatedAuthData.password),
      }

      // call execute
      const deleteAccountService = new DeleteAccountService(req.t)
      const response = await deleteAccountService.execute(validatedData)

      //response
      res.status(response.code).json(response)

    } catch (error) {

      next(error)

    }

  }

}