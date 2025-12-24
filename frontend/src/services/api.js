import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle responses and errors
api.interceptors.response.use(
  response => response,
  error => {
    // Handle 401 unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('fooddash-user')
      window.location.href = '/signup'
    }
    return Promise.reject(error)
  }
)

// Auth endpoints
export const authAPI = {
  signup: async (email, name, password) => {
    const { data } = await api.post('/auth/signup', { email, name, password })
    return data
  },
  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    return data
  },
  getProfile: async () => {
    const { data } = await api.get('/auth/profile')
    return data
  },
  updateProfile: async (updates) => {
    const { data } = await api.patch('/auth/profile', updates)
    return data
  }
}

// Restaurant endpoints
export const restaurantAPI = {
  getRestaurants: async (filters = {}) => {
    const { data } = await api.get('/restaurants', { params: filters })
    return data
  },
  getRestaurant: async (restaurantId) => {
    const { data } = await api.get(`/restaurants/${restaurantId}`)
    return data
  },
  getMenu: async (restaurantId) => {
    const { data } = await api.get(`/restaurants/${restaurantId}/menu`)
    return data
  }
}

// Order endpoints
export const orderAPI = {
  create: async (orderData) => {
    const { data } = await api.post('/orders', orderData)
    return data
  },
  getOrders: async (filters = {}) => {
    const { data } = await api.get('/orders', { params: filters })
    return data
  },
  getOrder: async (orderId) => {
    const { data } = await api.get(`/orders/${orderId}`)
    return data
  },
  updateStatus: async (orderId, status) => {
    const { data } = await api.patch(`/orders/${orderId}/status`, { status })
    return data
  },
  cancel: async (orderId, reason) => {
    const { data } = await api.post(`/orders/${orderId}/cancel`, { reason })
    return data
  },
  getStats: async () => {
    const { data } = await api.get('/orders/stats')
    return data
  }
}

// User endpoints
export const userAPI = {
  addAddress: async (addressData) => {
    const { data } = await api.post('/users/addresses', addressData)
    return data
  },
  updateAddress: async (addressId, addressData) => {
    const { data } = await api.patch(`/users/addresses/${addressId}`, addressData)
    return data
  },
  deleteAddress: async (addressId) => {
    const { data } = await api.delete(`/users/addresses/${addressId}`)
    return data
  }
}

export default api
