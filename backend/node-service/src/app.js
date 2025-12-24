// Main application setup
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import routes from './routes/index.js'
import { errorHandler, notFound } from './middlewares/error.middleware.js'
import { connectDB } from './config/database.js'

const app = express()

// Security middleware
app.use(helmet())

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}))

// Compression middleware
app.use(compression())

// Body parser middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Request logging in development
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`)
    next()
  })
}

// Connect to MongoDB
connectDB().catch(err => {
  console.error('Failed to connect to MongoDB:', err.message)
})

// API routes
app.use('/api', routes)

// Health check
app.get('/healthz', (req, res) => {
  res.json({
    status: 'ok',
    service: 'node-service',
    timestamp: new Date().toISOString()
  })
})

// 404 handler
app.use(notFound)

// Error handler
app.use(errorHandler)

export default app
