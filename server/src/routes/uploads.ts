import { Hono } from 'hono'
import { fileController } from '../controllers/fileController.js'
import { authMiddleware } from '../middleware/auth.js'

const uploads = new Hono()

// Apply auth middleware to all routes
uploads.use('/*', authMiddleware)

uploads.post('/', fileController.upload)
uploads.get('/', fileController.list)
uploads.delete('/:id', fileController.delete)
export default uploads
