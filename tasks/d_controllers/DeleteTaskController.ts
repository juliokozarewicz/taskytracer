import { NextFunction, Request, Response } from 'express'
import { escape } from 'lodash'
import { DeleteTaskValidation } from '../b_validations/DeleteTaskValidation'
import { DeleteTaskService } from '../c_services/DeleteTaskService'

export class DeleteTaskController {

    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {

        try {

            // validation
            const validatedBody = DeleteTaskValidation.parse({
                deleteId: req.params.deleteId,
            });

            // data object
            const validatedData = {
                deleteId: escape(validatedBody.deleteId),
            }

            // call execute
            const deleteTaskService = new DeleteTaskService()
            const response = await deleteTaskService.execute(validatedData)

            //response
            res.status(response.code).json(response)

        } catch (error) {
            next(error)
        }

    }

}