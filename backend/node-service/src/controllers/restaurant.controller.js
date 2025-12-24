// Restaurant controller - proxies requests to Python backend
import pythonService from '../services/python.service.js'

class RestaurantController {
  async getRestaurants(req, res, next) {
    try {
      const { cuisine, rating, search } = req.query
      
      const restaurants = await pythonService.getRestaurants({
        cuisine,
        rating,
        search
      })

      res.json({
        success: true,
        data: restaurants
      })
    } catch (error) {
      next(error)
    }
  }

  async getRestaurant(req, res, next) {
    try {
      const { restaurantId } = req.params
      
      const restaurant = await pythonService.getRestaurant(restaurantId)

      res.json({
        success: true,
        data: restaurant
      })
    } catch (error) {
      next(error)
    }
  }

  async getMenu(req, res, next) {
    try {
      const { restaurantId } = req.params
      
      const menu = await pythonService.getMenu(restaurantId)

      res.json({
        success: true,
        data: menu
      })
    } catch (error) {
      next(error)
    }
  }
}

export default new RestaurantController()
