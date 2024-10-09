import { StandardResponse } from '../f_utils/StandardResponse'
import { createCustomError } from '../e_middlewares/errorHandler'
import { AppDataSource } from '../server'
import { CategoryEntity } from '../a_entities/CategoryEntity'
import { CreateCategoryValidationType } from '../b_validations/CreateCategoryValidation'

export class CreateCategoryService {

    async execute(
        validatedData:CreateCategoryValidationType
    ): Promise<StandardResponse> {

        // database operations
        //-------------------------------------------------------------------------
        const categoryRepository = AppDataSource.getRepository(CategoryEntity)

        const existingCategory = await categoryRepository.findOne({
            where: { category: validatedData.categoryName }
        })

        if (existingCategory) {
            throw createCustomError({
                "message": `'${existingCategory.category}' already exists`,
                "code": 409,
                "next": "/tasks/category/create",
                "prev": "/tasks/category/create",
            })
        }

        const newCategory = categoryRepository.create({ category: validatedData.categoryName })
        await categoryRepository.save(newCategory)
        //-------------------------------------------------------------------------

        return {
            "status": 'success',
            "code": 201,
            "message": `'${validatedData.categoryName}' created successfully`,
            "idCreated": `${newCategory.id}`,
            "links": {
                "self": '/tasks/category/create',
            }
        }

    }

}
