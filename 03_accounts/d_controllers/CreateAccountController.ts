import { NextFunction, Request, Response } from 'express';
import { CreateAccountService } from '../c_services/CreateAccountService';
import { CreateAccountValidation } from '../b_validations/CreateAccountValidation';
import { escape } from 'lodash'

export class CreateAccountController {

  async handle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {

    try {
      
      // validation
      const validatedBody =  CreateAccountValidation.parse(req.body)

      // data object
      const validatedData = {
        name: escape(validatedBody.name),
        email: escape(validatedBody.email),
        password: escape(validatedBody.password),
      }

      // call execute
      const createAccountService = new CreateAccountService()
      const response = await createAccountService.execute(validatedData)

      //response
      res.status(response.code).json(response)

    } catch (error) {
      next(error)
    }

  }

}