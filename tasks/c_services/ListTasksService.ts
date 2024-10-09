import { StandardResponse } from '../f_utils/StandardResponse'
import { TaskEntity } from '../a_entities/TaskEntity'
import { ListTaskValidationType } from '../b_validations/ListTaskValidation'
import { AppDataSource } from '../server'

export class ListAllTasksService {

    async execute(
        validatedData:ListTaskValidationType
    ): Promise<StandardResponse> {

        // database operations
        //-------------------------------------------------------------------------
        const TaskyRepository = AppDataSource.getRepository(TaskEntity)

        const queryBuilder = TaskyRepository.createQueryBuilder('task')

        if (validatedData.taskname) {
            queryBuilder.andWhere(
                'LOWER(task.taskName) = LOWER(:taskName)',
                { taskName: validatedData.taskname }
            )
        }
        if (validatedData.category) {
            queryBuilder.andWhere(
                'LOWER(task.category) = LOWER(:category)',
                { category: validatedData.category }
            )
        }
        if (validatedData.description) {
            queryBuilder.andWhere(
                'LOWER(task.description) = LOWER(:description)',
                { description: validatedData.description }
            )
        }
        if (validatedData.initduedate || validatedData.endduedate) {
            const conditions: string[] = [];
            const parameters: { [key: string]: any } = {};

            if (validatedData.initduedate) {
                conditions.push('task.dueDate >= :initDueDate');
                parameters.initDueDate = new Date(validatedData.initduedate);
            }

            if (validatedData.endduedate) {
                conditions.push('task.dueDate <= :endDueDate');
                parameters.endDueDate = new Date(validatedData.endduedate);
            }

            queryBuilder.andWhere(conditions.join(' AND '), parameters);
        }        
        if (validatedData.status) {
            queryBuilder.andWhere(
                'LOWER(task.statusName) = LOWER(:statusName)',
                { statusName: validatedData.status }
            )
        }

        queryBuilder.orderBy('task.dueDate', 'ASC');

        const existingTask = await queryBuilder
            .select([
                'task.id',
                'task.taskName',
                'task.category',
                'task.description',
                'task.dueDate',
                'task.statusName'
            ])
            .getMany()
        //-------------------------------------------------------------------------

        return {
            "status": 'success',
            "code": 200,
            "message": "data received successfully",
            "data": existingTask,
            "meta": {
                "total": existingTask.length,
            },
            "links": {
                "self": '/tasks/list',
                "next": '/tasks/',
                "prev": '/tasks/list',
            }
        }

    }

}
