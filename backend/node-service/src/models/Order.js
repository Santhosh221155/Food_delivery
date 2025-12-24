import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  userEmail: {
    type: String,
    required: true,
    index: true
  },
  restaurantId: {
    type: String,
    required: true
  },
  restaurantName: {
    type: String,
    required: true
  },
  items: [{
    id: String,
    name: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1 },
    restaurantId: String,
    restaurantName: String
  }],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  deliveryFee: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['PLACED', 'CONFIRMED', 'PREPARING', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'],
    default: 'PLACED',
    index: true
  },
  eta: {
    type: Number,
    default: 30
  },
  deliveryAddress: {
    line1: { type: String, required: true },
    line2: String,
    city: { type: String, required: true },
    state: String,
    pincode: { type: String, required: true }
  },
  payment: {
    method: {
      type: String,
      enum: ['COD', 'CARD', 'UPI', 'WALLET'],
      default: 'COD'
    },
    status: {
      type: String,
      enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
      default: 'PENDING'
    },
    transactionId: String
  },
  placedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  deliveredAt: Date,
  cancelledAt: Date,
  cancellationReason: String
}, {
  timestamps: true
})

// Indexes for better query performance
orderSchema.index({ userId: 1, placedAt: -1 })
orderSchema.index({ userEmail: 1, placedAt: -1 })
orderSchema.index({ status: 1, placedAt: -1 })
orderSchema.index({ restaurantId: 1, placedAt: -1 })

// Virtual for order duration
orderSchema.virtual('duration').get(function() {
  if (this.deliveredAt) {
    return Math.round((this.deliveredAt - this.placedAt) / (1000 * 60)) // minutes
  }
  return null
})

export default mongoose.model('Order', orderSchema)
