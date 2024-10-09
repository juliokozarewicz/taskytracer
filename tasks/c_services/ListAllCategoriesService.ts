import { StandardResponse } from '../f_utils/StandardResponse'
import { AppDataSource } from '../server'
import { CategoryEntity } from '../a_entities/CategoryEntity'

export class ListAllCategoriesService {

    async execute(): Promise<StandardResponse> {

        // database operations
        //-------------------------------------------------------------------------
        const categoryRepository = AppDataSource.getRepository(CategoryEntity)

        const existingCategory = await categoryRepository.find({
            where: {},
            select: ['id', 'category'],
        })
        //-------------------------------------------------------------------------

        return {
            "status": 'success',
            "code": 200,
            "message": "data received successfully",
            "data": existingCategory,
            "meta": {
                "total": existingCategory.length,
            },
            "links": {
                "self": '/tasks/category/list-all',
                "next": '/tasks/',
                "prev": '/tasks/category/create',
            }
        }

    }

}
