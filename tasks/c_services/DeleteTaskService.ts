import { StandardResponse } from '../f_utils/StandardResponse'
import { AppDataSource } from '../server'
import { createCustomError } from '../e_middlewares/ErrorHandler'
import { DeleteTaskValidationType } from '../b_validations/DeleteTaskValidation'
import { TaskEntity } from '../a_entities/TaskEntity'


export class DeleteTaskService {

    private t: (key: string) => string
    constructor(t: (key: string) => string) {
        this.t = t
    }

    async execute(
        validatedData:DeleteTaskValidationType
    ): Promise<StandardResponse> {

        // database operations
        //-------------------------------------------------------------------------
        const taskRepository = AppDataSource.getRepository(TaskEntity)

        const deleteTaskResult = await taskRepository.delete({
            id: validatedData.deleteId,
            userId: validatedData.id
        })

        if (deleteTaskResult.affected === 0) {
            throw createCustomError({
                message: this.t("task_not_found"),
                code: 404,
                next: "/tasks/list",
                prev: "/tasks/list",
            })
        }
        //-------------------------------------------------------------------------

        return {
            "status": 'success',
            "code": 200,
            "message": this.t("successfully_deleted"),
            "links": {
                "next": '/tasks/list',
                "prev": '/tasks/list',
            }
        }

    }

}
