import { NextFunction, Response } from 'express'
import { ListProfileService } from '../c_services/ListProfileService'
import { CustomRequest } from '../e_middlewares/AuthGuardian'
import { ListProfileValidation } from '../b_validations/ListProfileValidation'
import { escape } from 'lodash'

export class ListProfileController {

  async handle(

    req: CustomRequest,
    res: Response,
    next: NextFunction

  ):

    Promise<void>

  {

    try {

      // validation    
      const validatedAuthData = ListProfileValidation(req).parse(
        req.authData
      )

      // data object
      const validatedData = {
        email: escape(validatedAuthData.email),
        id: escape(validatedAuthData.id)
      }

      // call execute
      const listProfileService = new ListProfileService(req.t)
      const response = await listProfileService.execute(validatedData)

      //response
      res.status(response.code).json(response)

    } catch (error) {

      next(error)

    }

  }

}