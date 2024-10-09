import { NextFunction, Request, Response } from 'express'
import { escape } from 'lodash'
import { UpdateTaskValidation } from '../b_validations/UpdateTaskValidation'
import { UpdateTaskService } from '../c_services/UpdateTaskService'

export class UpdateTaskController {

    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {

        try {

            // validation
            const validatedBody = UpdateTaskValidation.parse({
                updateId: req.params.updateId,
                ...req.body,
            });

            // data object
            const validatedData = {
                updateId: escape(validatedBody.updateId),
                taskName: validatedBody.taskName ? escape(validatedBody.taskName) : undefined,
                category: validatedBody.category ? escape(validatedBody.category) : undefined,
                description: validatedBody.description ? escape(validatedBody.description) : undefined,
                dueDate: validatedBody.dueDate ? new Date(validatedBody.dueDate) : undefined,
                statusName: validatedBody.statusName ? escape(validatedBody.statusName) : undefined
            }

            // call execute
            const updateTaskService = new UpdateTaskService()
            const response = await updateTaskService.execute(validatedData)

            //response
            res.status(response.code).json(response)

        } catch (error) {
            next(error)
        }

    }

}