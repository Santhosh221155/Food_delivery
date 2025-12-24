// Auth controller - handles authentication requests
import { body } from 'express-validator'
import userService from '../services/user.service.js'

export const signupValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
]

export const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
]

class AuthController {
  async signup(req, res, next) {
    try {
      const { email, name, password } = req.body

      const result = await userService.signup({ email, name, password })

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result
      })
    } catch (error) {
      next(error)
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body

      const result = await userService.login(email, password)

      res.json({
        success: true,
        message: 'Login successful',
        data: result
      })
    } catch (error) {
      next(error)
    }
  }

  async getProfile(req, res, next) {
    try {
      const user = await userService.getProfile(req.user.id)

      res.json({
        success: true,
        data: user
      })
    } catch (error) {
      next(error)
    }
  }

  async updateProfile(req, res, next) {
    try {
      const user = await userService.updateProfile(req.user.id, req.body)

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: user
      })
    } catch (error) {
      next(error)
    }
  }
}

export default new AuthController()
