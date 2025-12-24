import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import axios from 'axios'
import mongoose from 'mongoose'
import User from './models/User.js'
import Order from './models/Order.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3000
const DOWNSTREAM = process.env.DOWNSTREAM_BASE_URL || 'http://flask-service:5000'
const MONGODB_URI = process.env.MONGODB_URI

let mongoStatus = 'disconnected'
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
    .then(async () => { 
      mongoStatus = 'connected'
      console.log('✓ MongoDB Atlas connected to fooddelivery_prod database')
      console.log(`✓ Using database: ${mongoose.connection.name}`)
    })
    .catch((err) => { mongoStatus = 'error'; console.error('✗ MongoDB connect error:', err.message) })
} else {
  console.warn('⚠ MONGODB_URI not set - using mock data')
}

app.get('/healthz', (req, res) => {
  res.json({
    status: 'ok',
    service: 'node-service',
    mongo: mongoStatus,
    downstream: DOWNSTREAM
  })
})

app.get('/api/restaurants', (req, res) => {
  res.json([
    { id: 'res-1', name: 'Spice Garden', eta: 30, rating: 4.3 },
    { id: 'res-4', name: 'Saravana Bhavan', eta: 25, rating: 4.6 }
  ])
})

app.get('/api/menu/:restaurantId', async (req, res) => {
  try {
    const { restaurantId } = req.params
    const { data } = await axios.get(`${DOWNSTREAM}/internal/menu/${restaurantId}`)
    res.json(data)
  } catch (err) {
    const status = err.response?.status || 502
    res.status(status).json({ error: 'downstream_error', detail: err.message })
  }
})

app.post('/api/orders', async (req, res) => {
  try {
    const orderData = req.body
    
    if (!orderData.userEmail) {
      return res.status(400).json({ error: 'userEmail is required' })
    }

    if (mongoStatus === 'connected') {
      // Find or create user
      let user = await User.findOne({ email: orderData.userEmail })
      if (!user) {
        user = await User.create({
          email: orderData.userEmail,
          name: orderData.userEmail.split('@')[0],
          password: 'temp123' // In production, use proper hashing
        })
      }

      // Create order in MongoDB
      const order = await Order.create({
        userId: user._id,
        userEmail: user.email,
        restaurantId: orderData.restaurantId,
        restaurantName: orderData.restaurantName,
        items: orderData.items,
        subtotal: orderData.subtotal || 0,
        discount: orderData.discount || 0,
        deliveryFee: orderData.deliveryFee || 0,
        total: orderData.total,
        eta: orderData.eta || 30,
        deliveryAddress: orderData.deliveryAddress,
        status: 'PLACED'
      })

      res.status(201).json({
        id: order._id,
        orderId: order._id,
        status: order.status,
        total: order.total,
        placedAt: order.placedAt
      })
    } else {
      // Fallback if no MongoDB
      res.status(201).json({ 
        id: `ord-${Date.now()}`, 
        ...orderData,
        status: 'PLACED',
        placedAt: new Date().toISOString()
      })
    }
  } catch (err) {
    console.error('Order creation error:', err)
    res.status(500).json({ error: 'order_creation_failed', detail: err.message })
  }
})

app.get('/api/orders', async (req, res) => {
  try {
    const { email } = req.query
    
    if (!email) {
      return res.status(400).json({ error: 'email query parameter required' })
    }

    if (mongoStatus === 'connected') {
      const orders = await Order.find({ userEmail: email })
        .sort({ placedAt: -1 })
        .limit(50)
      res.json(orders)
    } else {
      // Mock fallback
      res.json([])
    }
  } catch (err) {
    console.error('Orders fetch error:', err)
    res.status(500).json({ error: 'orders_fetch_failed', detail: err.message })
  }
})

app.get('/api/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params
    
    if (mongoStatus === 'connected') {
      const order = await Order.findById(orderId)
      if (!order) {
        return res.status(404).json({ error: 'order_not_found' })
      }
      res.json(order)
    } else {
      res.status(503).json({ error: 'database_unavailable' })
    }
  } catch (err) {
    console.error('Order fetch error:', err)
    res.status(500).json({ error: 'order_fetch_failed', detail: err.message })
  }
})

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, name, password } = req.body
    
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password required' })
    }

    if (mongoStatus === 'connected') {
      // Check if user exists
      const existing = await User.findOne({ email })
      if (existing) {
        return res.status(409).json({ error: 'user_already_exists' })
      }

      // Create user (in production, hash password with bcrypt)
      const user = await User.create({
        email,
        name: name || email.split('@')[0],
        password // TODO: hash in production
      })

      res.status(201).json({
        id: user._id,
        email: user.email,
        name: user.name
      })
    } else {
      res.status(503).json({ error: 'database_unavailable' })
    }
  } catch (err) {
    console.error('Signup error:', err)
    res.status(500).json({ error: 'signup_failed', detail: err.message })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password required' })
    }

    if (mongoStatus === 'connected') {
      const user = await User.findOne({ email })
      if (!user || user.password !== password) {
        return res.status(401).json({ error: 'invalid_credentials' })
      }

      res.json({
        id: user._id,
        email: user.email,
        name: user.name
      })
    } else {
      // Mock fallback
      res.json({ 
        id: 'mock-user-id',
        email,
        name: email.split('@')[0]
      })
    }
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'login_failed', detail: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`node-service listening on ${PORT}`)
})
