import { Router } from 'express'
import { CreateCategoryController } from './d_controllers/CreateCategoryController';
import { ListAllCategoriesController } from './d_controllers/ListAllCategoriesController';
import { DeleteCategoryController } from './d_controllers/DeleteCategoryController';
import { CreateTaskController } from './d_controllers/CreateTaskController';
import { ListTasksController } from './d_controllers/ListTasksController';
import { UpdateTaskController } from './d_controllers/UpdateTaskController';
import { DeleteTaskController } from './d_controllers/DeleteTaskController';
import { AuthGuardian } from './e_middlewares/AuthGuardian'

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
router.post('/category/create', AuthGuardian, createCategoryController.handle.bind(createCategoryController))
router.get('/category/list-all', AuthGuardian, listAllCategoriesController.handle.bind(listAllCategoriesController))
router.delete('/category/delete/:categoryId', AuthGuardian, deleteCategoryController.handle.bind(deleteCategoryController))
router.post('/create', AuthGuardian, createTaskController.handle.bind(createTaskController))
router.get('/list', AuthGuardian, listTasksController.handle.bind(listTasksController))
router.put('/update/:updateId', AuthGuardian, updateTaskController.handle.bind(updateTaskController))
router.delete('/delete/:deleteId', AuthGuardian, deleteTaskController.handle.bind(deleteTaskController))

export default router;