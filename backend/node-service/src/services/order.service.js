// Order service layer - business logic for order operations
import Order from '../models/Order.js'
import User from '../models/User.js'
import pythonService from './python.service.js'

class OrderService {
  async createOrder(userId, orderData) {
    // Validate user exists
    const user = await User.findById(userId)
    if (!user) {
      const error = new Error('User not found')
      error.statusCode = 404
      throw error
    }

    // Calculate ETA from Python backend
    let eta = orderData.eta || 30
    try {
      const etaResponse = await pythonService.calculateETA(
        orderData.restaurantId,
        orderData.deliveryAddress
      )
      eta = etaResponse.eta || eta
    } catch (error) {
      console.warn('ETA calculation failed, using default:', error.message)
    }

    // Create order
    const order = await Order.create({
      userId: user._id,
      userEmail: user.email,
      restaurantId: orderData.restaurantId,
      restaurantName: orderData.restaurantName,
      items: orderData.items,
      subtotal: orderData.subtotal || this.calculateSubtotal(orderData.items),
      discount: orderData.discount || 0,
      deliveryFee: orderData.deliveryFee || 0,
      total: orderData.total,
      eta,
      deliveryAddress: orderData.deliveryAddress,
      payment: {
        method: orderData.paymentMethod || 'COD',
        status: 'PENDING'
      },
      status: 'PLACED'
    })

    // Assign delivery via Python backend (async, no need to wait)
    pythonService.assignDelivery({
      orderId: order._id,
      restaurantId: order.restaurantId,
      deliveryAddress: order.deliveryAddress
    }).catch(err => {
      console.error('Delivery assignment failed:', err.message)
    })

    return order
  }

  async getOrderById(orderId, userId) {
    const order = await Order.findById(orderId).populate('userId', 'name email phone')
    
    if (!order) {
      const error = new Error('Order not found')
      error.statusCode = 404
      throw error
    }

    // Verify order belongs to user (unless admin)
    if (order.userId._id.toString() !== userId.toString()) {
      const error = new Error('Unauthorized access to order')
      error.statusCode = 403
      throw error
    }

    return order
  }

  async getUserOrders(userId, options = {}) {
    const { status, limit = 50, skip = 0 } = options

    const filter = { userId }
    if (status) {
      filter.status = status
    }

    const orders = await Order.find(filter)
      .sort({ placedAt: -1 })
      .limit(limit)
      .skip(skip)

    const total = await Order.countDocuments(filter)

    return {
      orders,
      pagination: {
        total,
        limit,
        skip,
        hasMore: skip + orders.length < total
      }
    }
  }

  async updateOrderStatus(orderId, status, userId) {
    const order = await Order.findById(orderId)
    
    if (!order) {
      const error = new Error('Order not found')
      error.statusCode = 404
      throw error
    }

    // Update status
    order.status = status

    // Set delivered/cancelled timestamps
    if (status === 'DELIVERED') {
      order.deliveredAt = new Date()
      order.payment.status = 'COMPLETED'
    } else if (status === 'CANCELLED') {
      order.cancelledAt = new Date()
    }

    await order.save()

    // Notify Python backend of status change
    pythonService.updateDeliveryStatus(orderId, status).catch(err => {
      console.error('Failed to update delivery status in Python backend:', err.message)
    })

    return order
  }

  async cancelOrder(orderId, userId, reason) {
    const order = await Order.findById(orderId)
    
    if (!order) {
      const error = new Error('Order not found')
      error.statusCode = 404
      throw error
    }

    // Verify order belongs to user
    if (order.userId.toString() !== userId.toString()) {
      const error = new Error('Unauthorized access to order')
      error.statusCode = 403
      throw error
    }

    // Check if order can be cancelled
    if (['DELIVERED', 'CANCELLED'].includes(order.status)) {
      const error = new Error('Order cannot be cancelled')
      error.statusCode = 400
      throw error
    }

    order.status = 'CANCELLED'
    order.cancelledAt = new Date()
    order.cancellationReason = reason

    await order.save()

    return order
  }

  // Helper method to calculate subtotal
  calculateSubtotal(items) {
    return items.reduce((sum, item) => sum + (item.price * item.qty), 0)
  }

  // Get order statistics
  async getOrderStats(userId) {
    const stats = await Order.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$total' }
        }
      }
    ])

    const totalOrders = await Order.countDocuments({ userId })
    const totalSpent = await Order.aggregate([
      { $match: { userId, status: 'DELIVERED' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ])

    return {
      totalOrders,
      totalSpent: totalSpent[0]?.total || 0,
      byStatus: stats
    }
  }
}

export default new OrderService()
