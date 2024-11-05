import { Router } from 'express'
import { CreateAccountController } from './d_controllers/CreateAccountController'
import { ActiveEmailController } from './d_controllers/ActiveEmailController'
import { ActivateEmailLinkController } from './d_controllers/ActivateEmailLinkController'
import { ChangePasswordLinkController } from './d_controllers/ChangePasswordLinkController'
import { ChangePasswordController } from './d_controllers/ChangePasswordController'
import { LoginController } from './d_controllers/LoginController'
import { RefreshLoginController } from './d_controllers/RefreshLoginController'
import { ListProfileController } from './d_controllers/ListProfileController'
import { AuthGuardian } from './e_middlewares/AuthGuardian'


const router = Router()

// instances
const createAccountController = new CreateAccountController()
const activateEmailLinkController = new ActivateEmailLinkController()
const activeEmailController = new ActiveEmailController()
const changePasswordLinkController = new ChangePasswordLinkController()
const changePasswordController = new ChangePasswordController()
const loginController = new LoginController()
const refreshLoginController = new RefreshLoginController()
const listProfileController = new ListProfileController()

// routes
router.post('/signup', createAccountController.handle.bind(createAccountController))
router.post('/activate-email-link', activateEmailLinkController.handle.bind(activateEmailLinkController))
router.post('/activate-email', activeEmailController.handle.bind(activeEmailController))
router.post('/change-password-link', changePasswordLinkController.handle.bind(changePasswordLinkController))
router.patch('/change-password', changePasswordController.handle.bind(changePasswordController))
router.post('/login', loginController.handle.bind(loginController))
router.post('/refresh-login', refreshLoginController.handle.bind(refreshLoginController))
router.get('/profile', AuthGuardian, listProfileController.handle.bind(listProfileController))

export default router