import { NextFunction, Request, Response } from 'express'
import { ListAllCategoriesService } from '../c_services/ListAllCategoriesService'

export class ListAllCategoriesController {

    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {

        try {

            // call execute
            const listAllCategoriesService = new ListAllCategoriesService()
            const response = await listAllCategoriesService.execute()

            //response
            res.status(response.code).json(response)

        } catch (error) {
            next(error)
        }

    }

}