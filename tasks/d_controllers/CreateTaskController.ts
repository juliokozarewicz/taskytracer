import { NextFunction, Request, Response } from 'express'
import { escape } from 'lodash'
import { CreateTaskService } from '../c_services/CreateTaskService'
import { CreateTaskValidation } from '../b_validations/CreateTaskValidation'

export class CreateTaskController {

    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {

        try {
            
            // validation
            const validatedBody =  CreateTaskValidation.parse(req.body)

            // data object
            const validatedData = {
                taskName: escape(validatedBody.taskName),
                category: escape(validatedBody.category),
                description: escape(validatedBody.description),
                dueDate: new Date(validatedBody.dueDate),
                statusName: escape(validatedBody.statusName)
            }

            // call execute
            const createTaskService = new CreateTaskService()
            const response = await createTaskService.execute(validatedData)

            //response
            res.status(response.code).json(response)

        } catch (error) {
            next(error)
        }

    }

}