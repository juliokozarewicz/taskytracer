import { Router } from 'express'
import { CreateAccountController } from './d_controllers/CreateAccountController'
import { ResendEmailController } from './d_controllers/ResendEmailController'

const router = Router()

// instances
const createAccountController = new CreateAccountController()
const resendEmailController = new ResendEmailController()

// routes
router.post('/signup', createAccountController.handle.bind(createAccountController))
router.post('/resend-code', resendEmailController.handle.bind(resendEmailController))

export default router