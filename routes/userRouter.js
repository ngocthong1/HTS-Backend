import { Router } from 'express'
import userController from '../controllers/userController.js'
import Auth from '../middleware/Auth.js'
import { check } from 'express-validator'

const router = new Router()

router.post(
	'/register',
	[check('email', 'Incorrect email').isEmail()],
	userController.registration
)
router.post('/login', userController.login)
router.get('/auth', Auth, userController.checkAuth)

export default router
