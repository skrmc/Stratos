import { Hono } from 'hono'
import { authController } from '../controllers/authController.js'
import { authMiddleware } from '../middleware/auth.js'
const auth = new Hono()

auth.post('/register', authController.register)
auth.post('/login', authController.login)
auth.get('/me', authMiddleware, authController.getMe)

export default auth
