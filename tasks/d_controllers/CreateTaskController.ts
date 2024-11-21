import { NextFunction, Request, Response } from 'express'
import { escape } from 'lodash'
import { CreateTaskService } from '../c_services/CreateTaskService'
import { CreateTaskValidation } from '../b_validations/CreateTaskValidation'
import { CustomRequest } from '../e_middlewares/AuthGuardian'

export class CreateTaskController {

    async handle(
        req: CustomRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            // validation
            const validatedBody =  CreateTaskValidation(req).parse({
                ...req.body,
                ...req.authData
            })

            // data object
            const validatedData = {
                email: escape(validatedBody.email),
                id: escape(validatedBody.id),
                taskName: escape(validatedBody.taskName),
                category: escape(validatedBody.category),
                description: escape(validatedBody.description),
                dueDate: new Date(validatedBody.dueDate),
                statusName: escape(validatedBody.statusName)
            }

            // call execute
            const createTaskService = new CreateTaskService(req.t)
            const response = await createTaskService.execute(validatedData)

            //response
            res.status(response.code).json(response)

        } catch (error) {
            next(error)
        }

    }

}