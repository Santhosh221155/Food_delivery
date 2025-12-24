// Restaurant routes
import express from 'express'
import restaurantController from '../controllers/restaurant.controller.js'

const router = express.Router()

// Public routes - no authentication required for browsing
router.get('/', restaurantController.getRestaurants)
router.get('/:restaurantId', restaurantController.getRestaurant)
router.get('/:restaurantId/menu', restaurantController.getMenu)

export default router
