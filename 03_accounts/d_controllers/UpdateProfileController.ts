import { NextFunction, Response } from 'express'
import { CustomRequest } from '../e_middlewares/AuthGuardian'
import { escape } from 'lodash'
import { UpdateProfileService } from '../c_services/UpdateProfileService'
import { UpdateProfileValidation } from '../b_validations/UpdateProfileValidation'

export class UpdateProfileController {

  async handle(

    req: CustomRequest,
    res: Response,
    next: NextFunction

  ):

    Promise<void>

  {

    try {

      // validation    
      const validatedAuthData = UpdateProfileValidation(req).parse({
        ...req.authData,
        ...req.body
      })

      // data object
      const validatedData = {
        email: escape(validatedAuthData.email),
        id: escape(validatedAuthData.id),
        biography: validatedAuthData.biography ? escape(validatedAuthData.biography) : undefined,
        phone: validatedAuthData.phone ? escape(validatedAuthData.phone) : undefined,
        cpf: validatedAuthData.cpf ? escape(validatedAuthData.cpf) : undefined,
      }

      // call execute
      const updateProfileService = new UpdateProfileService(req.t)
      const response = await updateProfileService.execute(validatedData)

      //response
      res.status(response.code).json(response)

    } catch (error) {

      next(error)

    }

  }

}