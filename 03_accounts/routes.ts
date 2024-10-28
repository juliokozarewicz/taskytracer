import { Router } from 'express'
import { CreateAccountController } from './d_controllers/CreateAccountController'
import { ResendEmailController } from './d_controllers/ResendEmailController'
import { ActiveEmailController } from './d_controllers/ActiveEmailController'

const router = Router()

// instances
const createAccountController = new CreateAccountController()
const resendEmailController = new ResendEmailController()
const activeEmailController = new ActiveEmailController()

// routes
router.post('/signup', createAccountController.handle.bind(createAccountController))
router.post('/activate-email-link', resendEmailController.handle.bind(resendEmailController))
router.post('/activate-email', activeEmailController.handle.bind(activeEmailController))

export default router