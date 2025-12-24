// Order controller - handles order-related requests
import { body } from 'express-validator'
import orderService from '../services/order.service.js'

export const createOrderValidation = [
  body('restaurantId').notEmpty().withMessage('Restaurant ID is required'),
  body('restaurantName').notEmpty().withMessage('Restaurant name is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.name').notEmpty().withMessage('Item name is required'),
  body('items.*.price').isNumeric().withMessage('Item price must be a number'),
  body('items.*.qty').isInt({ min: 1 }).withMessage('Item quantity must be at least 1'),
  body('total').isNumeric().withMessage('Total must be a number'),
  body('deliveryAddress.line1').notEmpty().withMessage('Address line is required'),
  body('deliveryAddress.city').notEmpty().withMessage('City is required'),
  body('deliveryAddress.pincode').notEmpty().withMessage('Pincode is required')
]

class OrderController {
  async createOrder(req, res, next) {
    try {
      const order = await orderService.createOrder(req.user.id, req.body)

      res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        data: order
      })
    } catch (error) {
      next(error)
    }
  }

  async getOrder(req, res, next) {
    try {
      const order = await orderService.getOrderById(req.params.orderId, req.user.id)

      res.json({
        success: true,
        data: order
      })
    } catch (error) {
      next(error)
    }
  }

  async getUserOrders(req, res, next) {
    try {
      const { status, limit, skip } = req.query
      
      const result = await orderService.getUserOrders(req.user.id, {
        status,
        limit: parseInt(limit) || 50,
        skip: parseInt(skip) || 0
      })

      res.json({
        success: true,
        data: result.orders,
        pagination: result.pagination
      })
    } catch (error) {
      next(error)
    }
  }

  async updateOrderStatus(req, res, next) {
    try {
      const { orderId } = req.params
      const { status } = req.body

      const order = await orderService.updateOrderStatus(orderId, status, req.user.id)

      res.json({
        success: true,
        message: 'Order status updated',
        data: order
      })
    } catch (error) {
      next(error)
    }
  }

  async cancelOrder(req, res, next) {
    try {
      const { orderId } = req.params
      const { reason } = req.body

      const order = await orderService.cancelOrder(orderId, req.user.id, reason)

      res.json({
        success: true,
        message: 'Order cancelled successfully',
        data: order
      })
    } catch (error) {
      next(error)
    }
  }

  async getOrderStats(req, res, next) {
    try {
      const stats = await orderService.getOrderStats(req.user.id)

      res.json({
        success: true,
        data: stats
      })
    } catch (error) {
      next(error)
    }
  }
}

export default new OrderController()
