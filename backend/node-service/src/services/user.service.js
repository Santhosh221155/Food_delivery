// User service layer - business logic for user operations
import User from '../models/User.js'
import { generateToken } from '../config/jwt.js'
import { getConnectionStatus } from '../config/database.js'

class UserService {
  async signup(userData) {
    const { email, name, password } = userData

    // Fallback: if database is not connected, return a mock user for local dev
    const { isConnected } = getConnectionStatus()
    if (!isConnected) {
      const token = generateToken({ id: 'mock-user-id', email, role: 'customer' })
      return {
        user: { id: 'mock-user-id', email, name, role: 'customer' },
        token
      }
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      const error = new Error('User already exists with this email')
      error.statusCode = 409
      throw error
    }

    // Create new user (password will be hashed by pre-save middleware)
    const user = await User.create({ email, name, password })

    // Generate JWT token
    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role
    })

    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    }
  }

  async login(email, password) {
    // Fallback for local dev without DB
    const { isConnected } = getConnectionStatus()
    if (!isConnected) {
      const token = generateToken({ id: 'mock-user-id', email, role: 'customer' })
      return {
        user: { id: 'mock-user-id', email, name: email.split('@')[0], role: 'customer' },
        token
      }
    }

    // Find user with password field
    const user = await User.findOne({ email }).select('+password')
    
    if (!user) {
      const error = new Error('Invalid email or password')
      error.statusCode = 401
      throw error
    }

    // Check if user is active
    if (!user.isActive) {
      const error = new Error('Account is deactivated')
      error.statusCode = 403
      throw error
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      const error = new Error('Invalid email or password')
      error.statusCode = 401
      throw error
    }

    // Generate JWT token
    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role
    })

    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    }
  }

  async getProfile(userId) {
    const { isConnected } = getConnectionStatus()
    if (!isConnected) {
      return { id: 'mock-user-id', email: 'mock@example.com', name: 'Mock User', role: 'customer' }
    }
    const user = await User.findById(userId)
    
    if (!user) {
      const error = new Error('User not found')
      error.statusCode = 404
      throw error
    }

    return user
  }

  async updateProfile(userId, updateData) {
    const { isConnected } = getConnectionStatus()
    if (!isConnected) {
      return { id: 'mock-user-id', email: 'mock@example.com', name: updateData.name || 'Mock User', role: 'customer' }
    }
    const allowedFields = ['name', 'phone']
    const filteredData = {}
    
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field]
      }
    })

    const user = await User.findByIdAndUpdate(
      userId,
      filteredData,
      { new: true, runValidators: true }
    )

    if (!user) {
      const error = new Error('User not found')
      error.statusCode = 404
      throw error
    }

    return user
  }

  async addAddress(userId, addressData) {
    const { isConnected } = getConnectionStatus()
    if (!isConnected) {
      const addr = { ...addressData, _id: 'mock-address-id', isDefault: !!addressData.isDefault }
      return {
        id: userId || 'mock-user-id',
        email: 'mock@example.com',
        name: 'Mock User',
        role: 'customer',
        addresses: [addr]
      }
    }

    const user = await User.findById(userId)
    if (!user) {
      const error = new Error('User not found')
      error.statusCode = 404
      throw error
    }

    if (user.addresses.length === 0 || addressData.isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false)
      addressData.isDefault = true
    }

    user.addresses.push(addressData)
    await user.save()
    return user
  }

  async updateAddress(userId, addressId, addressData) {
    const { isConnected } = getConnectionStatus()
    if (!isConnected) {
      const addr = { _id: addressId || 'mock-address-id', ...addressData }
      return {
        id: userId || 'mock-user-id',
        email: 'mock@example.com',
        name: 'Mock User',
        role: 'customer',
        addresses: [addr]
      }
    }

    const user = await User.findById(userId)
    if (!user) {
      const error = new Error('User not found')
      error.statusCode = 404
      throw error
    }

    const address = user.addresses.id(addressId)
    if (!address) {
      const error = new Error('Address not found')
      error.statusCode = 404
      throw error
    }

    Object.assign(address, addressData)
    if (addressData.isDefault) {
      user.addresses.forEach(addr => {
        if (addr._id.toString() !== addressId) {
          addr.isDefault = false
        }
      })
    }

    await user.save()
    return user
  }

  async deleteAddress(userId, addressId) {
    const { isConnected } = getConnectionStatus()
    if (!isConnected) {
      return {
        id: userId || 'mock-user-id',
        email: 'mock@example.com',
        name: 'Mock User',
        role: 'customer',
        addresses: []
      }
    }

    const user = await User.findById(userId)
    if (!user) {
      const error = new Error('User not found')
      error.statusCode = 404
      throw error
    }

    user.addresses.id(addressId).remove()
    await user.save()
    return user
  }
}

export default new UserService()
