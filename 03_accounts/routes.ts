import { Router } from 'express'
import { HelloWorldController } from './d_controllers/HelloWorldController'

const router = Router()

// instances
const helloWorldController = new HelloWorldController()

// routes
router.get('/helloworld', helloWorldController.handle.bind(helloWorldController))

export default router