import { NextFunction, Request, Response } from 'express'
import { DeleteCategoryService } from '../c_services/DeleteCategoryService'
import { DeleteCategoryValidation } from '../b_validations/DeleteCategoryValidation'
import { escape } from 'lodash'

export class DeleteCategoryController {

    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {

        try {

            // data init
            const validatedData = {
                categoryId: ''
            }

            // validation
            const validatedCategoryId =  DeleteCategoryValidation.parse(req.params)

            // assembled data
            validatedData.categoryId = escape(validatedCategoryId.categoryId)

            // call execute
            const deleteCategoryService = new DeleteCategoryService()
            const response = await deleteCategoryService.execute(validatedData)

            //response
            res.status(response.code).json(response)

        } catch (error) {
            next(error)
        }

    }

}