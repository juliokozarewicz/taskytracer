import { Router } from 'express'
import { CreateAccountController } from './d_controllers/CreateAccountController'
import { ActiveEmailController } from './d_controllers/ActiveEmailController'
import { ChangePasswordLinkController } from './d_controllers/ChangePasswordLinkController'
import { ChangePasswordController } from './d_controllers/ChangePasswordController'
import { LoginController } from './d_controllers/LoginController'
import { RefreshLoginController } from './d_controllers/RefreshLoginController'
import { ListProfileController } from './d_controllers/ListProfileController'
import { AuthGuardian } from './e_middlewares/AuthGuardian'
import { UpdateProfileController } from './d_controllers/UpdateProfileController'
import { DeleteAccountLinkController } from './d_controllers/DeleteAccountLinkController'
import { DeleteAccountController } from './d_controllers/DeleteAccountController'
import { UpdateEmailLinkController } from './d_controllers/UpdateEmailLinkController'
import { UpdateEmailController } from './d_controllers/UpdateEmailController'

const router = Router()

// instances
const createAccountController = new CreateAccountController()
const activeEmailController = new ActiveEmailController()
const changePasswordLinkController = new ChangePasswordLinkController()
const changePasswordController = new ChangePasswordController()
const loginController = new LoginController()
const refreshLoginController = new RefreshLoginController()
const listProfileController = new ListProfileController()
const updateProfileController = new UpdateProfileController()
const updateEmailLinkController = new UpdateEmailLinkController()
const deleteAccountLinkController = new DeleteAccountLinkController()
const deleteAccountController = new DeleteAccountController()
const updateEmailController = new UpdateEmailController()

// routes
router.post('/signup', createAccountController.handle.bind(createAccountController))
router.post('/activate-email', activeEmailController.handle.bind(activeEmailController))
router.post('/change-password-link', changePasswordLinkController.handle.bind(changePasswordLinkController))
router.patch('/change-password', changePasswordController.handle.bind(changePasswordController))
router.post('/login', loginController.handle.bind(loginController))
router.post('/refresh-login', refreshLoginController.handle.bind(refreshLoginController))
router.get('/profile', AuthGuardian, listProfileController.handle.bind(updateProfileController))
router.put('/profile-update', AuthGuardian, updateProfileController.handle.bind(listProfileController))
router.post('/update-email-link', AuthGuardian, updateEmailLinkController.handle.bind(updateEmailLinkController))
router.patch('/update-email', updateEmailController.handle.bind(updateEmailController))
router.post('/delete-account-link', AuthGuardian, deleteAccountLinkController.handle.bind(deleteAccountLinkController))
router.delete('/delete-account', deleteAccountController.handle.bind(deleteAccountController))

export default router