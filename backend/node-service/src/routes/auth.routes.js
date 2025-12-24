// Auth routes
import express from 'express'
import authController, { signupValidation, loginValidation } from '../controllers/auth.controller.js'
import { validate } from '../middlewares/validation.middleware.js'
import { authenticate } from '../middlewares/auth.middleware.js'

const router = express.Router()

// Public routes
router.post('/signup', signupValidation, validate, authController.signup)
router.post('/login', loginValidation, validate, authController.login)

// Protected routes
router.get('/profile', authenticate, authController.getProfile)
router.patch('/profile', authenticate, authController.updateProfile)

export default router
