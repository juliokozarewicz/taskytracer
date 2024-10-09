import { StandardResponse } from '../f_utils/StandardResponse'
import { AppDataSource } from '../server'
import { CategoryEntity } from '../a_entities/CategoryEntity'
import { DeleteCategoryValidationType } from '../b_validations/DeleteCategoryValidation'
import { createCustomError } from '../e_middlewares/errorHandler'

export class DeleteCategoryService {

    async execute(
        validatedData:DeleteCategoryValidationType
    ): Promise<StandardResponse> {

        // database operations
        //-------------------------------------------------------------------------
        const categoryRepository = AppDataSource.getRepository(CategoryEntity)

        const deleteCategoryResult = await categoryRepository.delete({
            id: validatedData.categoryId,
        })

        if (deleteCategoryResult.affected === 0) {
            throw createCustomError({
                message: "category not found",
                code: 404,
                next: "/tasks/category/list-all",
                prev: "/tasks/category/list-all",
            })
        }
        //-------------------------------------------------------------------------

        return {
            "status": 'success',
            "code": 200,
            "message": "successfully deleted",
            "links": {
                "next": '/tasks/category/list-all',
                "prev": '/tasks/category/list-all',
            }
        }

    }

}
