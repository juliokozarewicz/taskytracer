import { StandardResponse } from '../f_utils/StandardResponse'
import { TaskEntity } from '../a_entities/TaskEntity'
import { UpdateTaskValidationType } from '../b_validations/UpdateTaskValidation'
import { createCustomError } from '../e_middlewares/ErrorHandler'
import { AppDataSource } from '../server'

export class UpdateTaskService {

    private t: (key: string) => string
    constructor(t: (key: string) => string) {
        this.t = t
    }

    async execute(
        validatedData:UpdateTaskValidationType
    ): Promise<StandardResponse> {

        // database operations
        //-------------------------------------------------------------------------
        
        // repository
        const taskRepository = AppDataSource.getRepository(TaskEntity)

        // update
        const updateTask = await taskRepository.update(
            {
                id: validatedData.updateId,
                userId: validatedData.id
            },
            {
                taskName: validatedData.taskName,
                category: validatedData.category,
                description: validatedData.description,
                dueDate: validatedData.dueDate,
                statusName: validatedData.statusName,
            }
        )

        // not found
        if (updateTask.affected === 0) {
            throw createCustomError({
                message: this.t("task_not_found"),
                code: 404,
                next: "/tasks/list",
                prev: "/tasks/list",
            })
        }

        // get updated data
        const updatedTask = await taskRepository.findOneBy({
            id: validatedData.updateId
        })
        //-------------------------------------------------------------------------

        return {
            "status": 'success',
            "code": 200,
            "message": `'${updatedTask?.taskName}' ${this.t("successfully_updated")}`,
            "idUpdated": `${updatedTask?.id}`,
            "links": {
                "self": '/tasks/create',
                "next": '/tasks/list',
                "prev": '/tasks/list',
            }
        }

    }

}
