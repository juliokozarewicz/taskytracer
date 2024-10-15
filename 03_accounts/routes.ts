import { Router } from 'express'
import { CreateAccountController } from './d_controllers/CreateAccountController'

const router = Router()

// instances
const createAccountController = new CreateAccountController()

// routes
router.post('/signup', createAccountController.handle.bind(createAccountController))

export default router