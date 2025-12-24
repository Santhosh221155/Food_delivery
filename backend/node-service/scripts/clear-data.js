import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../src/models/User.js'
import Order from '../src/models/Order.js'

dotenv.config()

const clearData = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI
    
    if (!MONGODB_URI) {
      console.error('❌ MONGODB_URI not set in .env file')
      process.exit(1)
    }

    console.log('🔗 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log(`✓ Connected to database: ${mongoose.connection.name}`)

    console.log('🗑️  Clearing all data from collections...')
    
    // Delete all documents from both collections
    await User.deleteMany({})
    console.log('✓ Cleared users collection')
    
    await Order.deleteMany({})
    console.log('✓ Cleared orders collection')

    console.log('✓ All data cleared successfully from fooddelivery_prod database')
    
    await mongoose.connection.close()
    console.log('✓ Database connection closed')
    process.exit(0)
  } catch (err) {
    console.error('❌ Error clearing data:', err.message)
    process.exit(1)
  }
}

clearData()
