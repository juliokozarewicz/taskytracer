import { NextFunction, Request, Response } from 'express'
import { DeleteCategoryService } from '../c_services/DeleteCategoryService'
import { DeleteCategoryValidation } from '../b_validations/DeleteCategoryValidation'
import { escape } from 'lodash'
import { CustomRequest } from '../e_middlewares/AuthGuardian'

export class DeleteCategoryController {

    async handle(
        req: CustomRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            // validation
            const validatedAuthData = DeleteCategoryValidation(req).parse({
                ...req.params,
                ...req.authData
            })

            // data init
            const validatedData = {
                email: escape(validatedAuthData.email),
                id: escape(validatedAuthData.id),
                categoryId: escape(validatedAuthData.categoryId),
            }

            // call execute
            const deleteCategoryService = new DeleteCategoryService(req.t)
            const response = await deleteCategoryService.execute(validatedData)

            //response
            res.status(response.code).json(response)

        } catch (error) {
            next(error)
        }

    }

}