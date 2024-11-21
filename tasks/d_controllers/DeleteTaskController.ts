import { NextFunction, Request, Response } from 'express'
import { escape } from 'lodash'
import { DeleteTaskValidation } from '../b_validations/DeleteTaskValidation'
import { DeleteTaskService } from '../c_services/DeleteTaskService'
import { CustomRequest } from '../e_middlewares/AuthGuardian'

export class DeleteTaskController {

    async handle(
        req: CustomRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            // validation
            const validatedBody = DeleteTaskValidation(req).parse({
                deleteId: req.params.deleteId,
                ...req.authData
            })

            // data object
            const validatedData = {
                email: escape(validatedBody.email),
                id: escape(validatedBody.id),
                deleteId: escape(validatedBody.deleteId),
            }

            // call execute
            const deleteTaskService = new DeleteTaskService(req.t)
            const response = await deleteTaskService.execute(validatedData)

            //response
            res.status(response.code).json(response)

        } catch (error) {
            next(error)
        }

    }

}