import { StandardResponse } from '../f_utils/StandardResponse'
import { AppDataSource } from '../server'
import { CategoryEntity } from '../a_entities/CategoryEntity'
import { ListAllCategoriesValidationType } from '../b_validations/ListAllCategoriesValidation'

export class ListAllCategoriesService {

    private t: (key: string) => string
    constructor(t: (key: string) => string) {
        this.t = t
    }

    async execute(
        validatedAuthData: ListAllCategoriesValidationType
    ): Promise<StandardResponse> {

        // database operations
        //-------------------------------------------------------------------------
        const categoryRepository = AppDataSource.getRepository(CategoryEntity)

        const existingCategory = await categoryRepository.find({
            where: {
                userId: validatedAuthData.id
            },
            select: ['id', 'category'],
        })
        //-------------------------------------------------------------------------

        return {
            "status": 'success',
            "code": 200,
            "message": this.t("data_received_successfully"),
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
