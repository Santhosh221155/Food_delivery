// Order routes
import express from 'express'
import orderController, { createOrderValidation } from '../controllers/order.controller.js'
import { validate } from '../middlewares/validation.middleware.js'
import { authenticate } from '../middlewares/auth.middleware.js'

const router = express.Router()

// All order routes require authentication
router.use(authenticate)

router.post('/', createOrderValidation, validate, orderController.createOrder)
router.get('/', orderController.getUserOrders)
router.get('/stats', orderController.getOrderStats)
router.get('/:orderId', orderController.getOrder)
router.patch('/:orderId/status', orderController.updateOrderStatus)
router.post('/:orderId/cancel', orderController.cancelOrder)

export default router
