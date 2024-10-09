import { NextFunction, Request, Response } from 'express'
import { ListAllTasksService } from '../c_services/ListTasksService'
import { ListTaskValidation } from '../b_validations/ListTaskValidation'
import { escape } from 'lodash'
import { object } from 'zod'

export class ListTasksController {

    async handle(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            // clean query
            //----------------------------------------------------------------
            const queryAll = req.query

            const cleanedQuery = Object.fromEntries(
                Object.entries(queryAll).map(
                    ([key, value]) => [key, value || undefined]
                )
            )
            //----------------------------------------------------------------

            // validation (ZOD)
            //----------------------------------------------------------------
            const validatingData = ListTaskValidation.parse(cleanedQuery)
            //----------------------------------------------------------------

            // data object (escape)
            //----------------------------------------------------------------
            const validatedData = {
                taskname: escape(validatingData.taskname),
                category: validatingData.category,
                description: validatingData.description,
                initduedate: validatingData.initduedate,
                endduedate: validatingData.endduedate,
                status: validatingData.status
            }
            //----------------------------------------------------------------

            // call execute
            //----------------------------------------------------------------
            const listAllTasksService = new ListAllTasksService()
            const response = await listAllTasksService.execute(validatedData)
            //----------------------------------------------------------------

            //response
            //----------------------------------------------------------------
            res.status(response.code).json(response)
            //----------------------------------------------------------------

        } catch (error) {
            next(error)
        }

    }

}