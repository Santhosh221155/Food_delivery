// Python backend service client with retry logic
import axios from 'axios'
import axiosRetry from 'axios-retry'

const PYTHON_BASE_URL = process.env.DOWNSTREAM_BASE_URL || 'http://localhost:5000'

// Create axios instance for Python backend
const pythonClient = axios.create({
  baseURL: PYTHON_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Configure retry logic
axiosRetry(pythonClient, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    // Retry on network errors or 5xx server errors
    return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
           (error.response && error.response.status >= 500)
  },
  onRetry: (retryCount, error, requestConfig) => {
    console.log(`Retry attempt ${retryCount} for ${requestConfig.url}:`, error.message)
  }
})

class PythonBackendService {
  // Health check
  async healthCheck() {
    try {
      const { data } = await pythonClient.get('/healthz')
      return data
    } catch (error) {
      console.error('Python backend health check failed:', error.message)
      throw this.handleError(error)
    }
  }

  // Get restaurant list
  async getRestaurants(filters = {}) {
    try {
      const { data } = await pythonClient.get('/internal/restaurants', { params: filters })
      return data
    } catch (error) {
      console.error('Get restaurants failed:', error.message)
      throw this.handleError(error)
    }
  }

  // Get restaurant by ID
  async getRestaurant(restaurantId) {
    try {
      const { data } = await pythonClient.get(`/internal/restaurants/${restaurantId}`)
      return data
    } catch (error) {
      console.error(`Get restaurant ${restaurantId} failed:`, error.message)
      throw this.handleError(error)
    }
  }

  // Get menu for restaurant
  async getMenu(restaurantId) {
    try {
      const { data } = await pythonClient.get(`/internal/menu/${restaurantId}`)
      return data
    } catch (error) {
      console.error(`Get menu for ${restaurantId} failed:`, error.message)
      throw this.handleError(error)
    }
  }

  // Calculate delivery ETA
  async calculateETA(restaurantId, deliveryAddress) {
    try {
      const { data } = await pythonClient.post('/internal/eta', {
        restaurantId,
        deliveryAddress
      })
      return data
    } catch (error) {
      console.error('Calculate ETA failed:', error.message)
      throw this.handleError(error)
    }
  }

  // Assign delivery
  async assignDelivery(orderData) {
    try {
      const { data } = await pythonClient.post('/internal/delivery/assign', orderData)
      return data
    } catch (error) {
      console.error('Assign delivery failed:', error.message)
      throw this.handleError(error)
    }
  }

  // Update delivery status
  async updateDeliveryStatus(orderId, status) {
    try {
      const { data } = await pythonClient.patch(`/internal/delivery/${orderId}`, { status })
      return data
    } catch (error) {
      console.error(`Update delivery status for ${orderId} failed:`, error.message)
      throw this.handleError(error)
    }
  }

  // Error handler
  handleError(error) {
    if (error.response) {
      // Python backend returned an error response
      const err = new Error(error.response.data.message || 'Python backend error')
      err.statusCode = error.response.status
      err.details = error.response.data
      return err
    } else if (error.request) {
      // Request made but no response received
      const err = new Error('Python backend is unavailable')
      err.statusCode = 503
      return err
    } else {
      // Something else happened
      const err = new Error('Internal error communicating with Python backend')
      err.statusCode = 500
      return err
    }
  }
}

export default new PythonBackendService()
