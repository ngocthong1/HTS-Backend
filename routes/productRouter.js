import { Router } from 'express'
import productController from '../controllers/productController.js'
import CheckRole from '../middleware/CheckRole.js'

const router = new Router()

router.post('/', CheckRole('ADMIN'), productController.create)
router.get('/', productController.getAll)
router.get('/popular', productController.getThreeMostPopular)
router.get('/:id', productController.getOne)
router.delete('/', CheckRole('ADMIN'), productController.deleteVehicle)

export default router
