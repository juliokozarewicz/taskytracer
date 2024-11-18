import { NextFunction, Request, Response } from 'express'
import { CreateCategoryService } from '../c_services/CreateCategoryService'
import { CreateCategoryValidation } from '../b_validations/CreateCategoryValidation'
import { escape } from 'lodash'
import { CustomRequest } from '../e_middlewares/AuthGuardian'

export class CreateCategoryController {

    async handle(
        req: CustomRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            // validation
            const validatedAuthData = CreateCategoryValidation(req).parse({
                ...req.body,
                ...req.authData
            })

            // data init
            const validatedData = {
                email: escape(validatedAuthData.email),
                id: escape(validatedAuthData.id),
                categoryName: escape(validatedAuthData.categoryName),
            }

            // call execute
            const createCategoryService = new CreateCategoryService(req.t)
            const response = await createCategoryService.execute(validatedData)

            //response
            res.status(response.code).json(response)

        } catch (error) {
            next(error)
        }

    }

}