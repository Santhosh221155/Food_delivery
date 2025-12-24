// User routes
import express from 'express'
import userController, { addressValidation } from '../controllers/user.controller.js'
import { validate } from '../middlewares/validation.middleware.js'
import { authenticate } from '../middlewares/auth.middleware.js'

const router = express.Router()

// All user routes require authentication
router.use(authenticate)

router.post('/addresses', addressValidation, validate, userController.addAddress)
router.patch('/addresses/:addressId', userController.updateAddress)
router.delete('/addresses/:addressId', userController.deleteAddress)

export default router
