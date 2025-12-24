import mongoose from 'mongoose'

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  cuisine: [{
    type: String,
    trim: true
  }],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  eta: {
    type: Number,
    default: 30,
    min: 10,
    max: 120
  },
  address: {
    line1: String,
    line2: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  contact: {
    phone: String,
    email: String
  },
  timings: {
    open: String,
    close: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  image: String,
  tags: [String],
  priceRange: {
    type: String,
    enum: ['$', '$$', '$$$'],
    default: '$$'
  }
}, {
  timestamps: true
})

// Indexes
restaurantSchema.index({ name: 1 })
restaurantSchema.index({ rating: -1 })
restaurantSchema.index({ cuisine: 1 })
restaurantSchema.index({ isActive: 1 })

export default mongoose.model('Restaurant', restaurantSchema)
