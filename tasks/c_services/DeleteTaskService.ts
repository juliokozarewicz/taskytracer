import { StandardResponse } from '../f_utils/StandardResponse'
import { AppDataSource } from '../server'
import { createCustomError } from '../e_middlewares/errorHandler'
import { DeleteTaskValidationType } from '../b_validations/DeleteTaskValidation'
import { TaskEntity } from '../a_entities/TaskEntity'


export class DeleteTaskService {

    async execute(
        validatedData:DeleteTaskValidationType
    ): Promise<StandardResponse> {

        // database operations
        //-------------------------------------------------------------------------
        const taskRepository = AppDataSource.getRepository(TaskEntity)

        const deleteTaskResult = await taskRepository.delete({
            id: validatedData.deleteId,
        })

        if (deleteTaskResult.affected === 0) {
            throw createCustomError({
                message: "task not found",
                code: 404,
                next: "/tasks/list",
                prev: "/tasks/list",
            })
        }
        //-------------------------------------------------------------------------

        return {
            "status": 'success',
            "code": 200,
            "message": "successfully deleted",
            "links": {
                "next": '/tasks/list',
                "prev": '/tasks/list',
            }
        }

    }

}
