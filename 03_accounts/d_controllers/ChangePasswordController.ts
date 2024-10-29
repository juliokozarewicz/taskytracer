import { NextFunction, Request, Response } from 'express'
import { escape } from 'lodash'
import { ChangePasswordService } from '../c_services/ChangePasswordService'
import { ChangePasswordValidation } from '../b_validations/ChangePasswordValidation'

export class ChangePasswordController {

  async handle(

    req: Request,
    res: Response,
    next: NextFunction

  ):

    Promise<void>

  {

    try {

      // validation
      const validatedBody =  ChangePasswordValidation(req).parse(req.body)

      // data object
      const validatedData = {
        email: escape(validatedBody.email),
        password: escape(validatedBody.password),
        code: escape(validatedBody.code),
      }

      // call execute
      const changePasswordService = new ChangePasswordService(req.t)
      const response = await changePasswordService.execute(validatedData)

      //response
      res.status(response.code).json(response)

    } catch (error) {

      next(error)

    }

  }

}