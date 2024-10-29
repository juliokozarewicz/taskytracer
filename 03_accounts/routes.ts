import { Router } from 'express'
import { CreateAccountController } from './d_controllers/CreateAccountController'
import { ActiveEmailController } from './d_controllers/ActiveEmailController'
import { ActivateEmailLinkController } from './d_controllers/ActivateEmailLinkController'
import { ChangePasswordLinkController } from './d_controllers/ChangePasswordLinkController'

const router = Router()

// instances
const createAccountController = new CreateAccountController()
const activateEmailLinkController = new ActivateEmailLinkController()
const activeEmailController = new ActiveEmailController()
const changePasswordLinkController = new ChangePasswordLinkController()


// routes
router.post('/signup', createAccountController.handle.bind(createAccountController))
router.post('/activate-email-link', activateEmailLinkController.handle.bind(activateEmailLinkController))
router.post('/activate-email', activeEmailController.handle.bind(activeEmailController))
router.post('/change-password-link', changePasswordLinkController.handle.bind(changePasswordLinkController))

export default router