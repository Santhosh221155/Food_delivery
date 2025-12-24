import mongoose from 'mongoose'

const menuItemSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  image: String,
  isVeg: {
    type: Boolean,
    default: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  tags: [String],
  customizations: [{
    name: String,
    options: [{
      name: String,
      price: Number
    }]
  }]
}, {
  timestamps: true
})

// Indexes
menuItemSchema.index({ restaurantId: 1, category: 1 })
menuItemSchema.index({ restaurantId: 1, isAvailable: 1 })

export default mongoose.model('MenuItem', menuItemSchema)
