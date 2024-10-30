import { NextFunction, Request, Response } from 'express'
import { escape } from 'lodash'
import { LoginValidation } from '../b_validations/LoginValidation'
import { LoginService } from '../c_services/LoginService'

export class LoginController {

  async handle(

    req: Request,
    res: Response,
    next: NextFunction

  ):

    Promise<void>

  {

    try {

      // validation
      const validatedBody =  LoginValidation(req).parse(req.body)

      // data object
      const validatedData = {
        email: escape(validatedBody.email),
        password: escape(validatedBody.password)
      }

      // call execute
      const loginService = new LoginService(req.t)
      const response = await loginService.execute(validatedData)

      //response
      res.status(response.code).json(response)

    } catch (error) {

      next(error)

    }

  }

}