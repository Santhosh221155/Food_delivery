// Central route registration
import express from 'express'
import authRoutes from './auth.routes.js'
import orderRoutes from './order.routes.js'
import restaurantRoutes from './restaurant.routes.js'
import userRoutes from './user.routes.js'

const router = express.Router()

// API routes
router.use('/auth', authRoutes)
router.use('/orders', orderRoutes)
router.use('/restaurants', restaurantRoutes)
router.use('/users', userRoutes)

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  })
})

export default router
