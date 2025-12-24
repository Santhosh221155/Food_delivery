// MongoDB connection utility with environment-based configuration
import mongoose from 'mongoose'

let isConnected = false

export const connectDB = async () => {
  if (isConnected) {
    console.log('✓ Using existing MongoDB connection')
    return
  }

  const MONGODB_URI = process.env.MONGODB_URI

  if (!MONGODB_URI) {
    console.warn('⚠ MONGODB_URI not configured - running without database')
    return
  }

  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
      minPoolSize: 2,
    })

    isConnected = true
    console.log(`✓ MongoDB connected: ${conn.connection.name} (${conn.connection.host})`)

    // Handle connection events
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠ MongoDB disconnected')
      isConnected = false
    })

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB error:', err.message)
    })

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message)
    throw error
  }
}

export const getConnectionStatus = () => {
  return {
    isConnected,
    readyState: mongoose.connection.readyState,
    status: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState]
  }
}
