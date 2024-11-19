import { NextFunction, Request, Response } from 'express'
import { ListAllCategoriesService } from '../c_services/ListAllCategoriesService'
import { CustomRequest } from '../e_middlewares/AuthGuardian'
import { ListAllCategoriesValidation } from '../b_validations/ListAllCategoriesValidation'
import { escape } from 'lodash'

export class ListAllCategoriesController {

    async handle(

        req: CustomRequest,
        res: Response,
        next: NextFunction

    ): Promise<void> {

        try {

            // validation
            const validatedAuthData = ListAllCategoriesValidation(req).parse({
                ...req.authData
            })

            // data init
            const validatedData = {
                email: escape(validatedAuthData.email),
                id: escape(validatedAuthData.id),
            }

            // call execute
            const listAllCategoriesService = new ListAllCategoriesService(req.t)
            const response = await listAllCategoriesService.execute(validatedAuthData)

            //response
            res.status(response.code).json(response)

        } catch (error) {

            next(error)

        }

    }

}