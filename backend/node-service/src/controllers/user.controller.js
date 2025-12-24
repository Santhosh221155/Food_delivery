// User controller - handles user-related requests
import { body } from 'express-validator'
import userService from '../services/user.service.js'

export const addressValidation = [
  body('line1').notEmpty().withMessage('Address line 1 is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('pincode').notEmpty().withMessage('Pincode is required')
]

class UserController {
  async addAddress(req, res, next) {
    try {
      const user = await userService.addAddress(req.user.id, req.body)

      res.status(201).json({
        success: true,
        message: 'Address added successfully',
        data: user
      })
    } catch (error) {
      next(error)
    }
  }

  async updateAddress(req, res, next) {
    try {
      const { addressId } = req.params
      const user = await userService.updateAddress(req.user.id, addressId, req.body)

      res.json({
        success: true,
        message: 'Address updated successfully',
        data: user
      })
    } catch (error) {
      next(error)
    }
  }

  async deleteAddress(req, res, next) {
    try {
      const { addressId } = req.params
      const user = await userService.deleteAddress(req.user.id, addressId)

      res.json({
        success: true,
        message: 'Address deleted successfully',
        data: user
      })
    } catch (error) {
      next(error)
    }
  }
}

export default new UserController()
