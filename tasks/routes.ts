import { Router } from 'express'
import { CreateCategoryController } from './d_controllers/CreateCategoryController';
import { ListAllCategoriesController } from './d_controllers/ListAllCategoriesController';
import { DeleteCategoryController } from './d_controllers/DeleteCategoryController';
import { CreateTaskController } from './d_controllers/CreateTaskController';
import { ListTasksController } from './d_controllers/ListTasksController';
import { UpdateTaskController } from './d_controllers/UpdateTaskController';
import { DeleteTaskController } from './d_controllers/DeleteTaskController';

const router = Router();

// instances
const createCategoryController = new CreateCategoryController()
const listAllCategoriesController = new ListAllCategoriesController()
const deleteCategoryController = new DeleteCategoryController()
const createTaskController = new CreateTaskController()
const listTasksController = new ListTasksController()
const updateTaskController = new UpdateTaskController()
const deleteTaskController = new DeleteTaskController()

// routes
router.post('/category/create', createCategoryController.handle.bind(createCategoryController))
router.get('/category/list-all', listAllCategoriesController.handle.bind(listAllCategoriesController))
router.delete('/category/delete/:categoryId', deleteCategoryController.handle.bind(deleteCategoryController))
router.post('/create', createTaskController.handle.bind(createTaskController))
router.get('/list', listTasksController.handle.bind(listTasksController))
router.patch('/update/:updateId', updateTaskController.handle.bind(updateTaskController))
router.delete('/delete/:deleteId', deleteTaskController.handle.bind(deleteTaskController))

export default router;