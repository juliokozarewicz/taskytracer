import { StandardResponse } from '../f_utils/StandardResponse'
import { TaskEntity } from '../a_entities/TaskEntity'
import { CreateTaskValidationType } from '../b_validations/CreateTaskValidation'
import { createCustomError } from '../e_middlewares/errorHandler'
import { AppDataSource } from '../server'


export class CreateTaskService {

    async execute(
        validatedData:CreateTaskValidationType
    ): Promise<StandardResponse> {

        // database operations
        //-------------------------------------------------------------------------
        const taskRepository = AppDataSource.getRepository(TaskEntity)

        const existingTask = await taskRepository.findOne({
            where: {
                taskName: validatedData.taskName,
                dueDate: validatedData.dueDate
            }
        })

        if (existingTask) {
            throw createCustomError({
                "message": `'${existingTask.taskName}' already exists`,
                "code": 409,
                "next": "/tasks/list",
                "prev": "/tasks/list",
            })
        }

        const newTask = taskRepository.create({
            taskName: validatedData.taskName,
            category: validatedData.category,
            description: validatedData.description,
            dueDate: validatedData.dueDate,
            statusName: validatedData.statusName
        })
        await taskRepository.save(newTask)
        //-------------------------------------------------------------------------

        return {
            "status": 'success',
            "code": 201,
            "message": `'${newTask.taskName}' created successfully`,
            "idCreated": `${newTask.id}`,
            "links": {
                "self": '/tasks/create',
                "next": '/tasks/list',
                "prev": '/tasks/list',
            }
        }

    }

}
