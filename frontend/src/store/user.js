import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAPI, userAPI } from '../services/api.js'
import toast from 'react-hot-toast'

export const useUserStore = create(persist((set, get) => ({
  user: null,
  token: null,
  addressBook: [],
  
  // Local signup (frontend only for now)
  signup: async (userData) => {
    try {
      const { name, email, password } = userData
      
      if (!name || !email || !password) {
        throw new Error('All fields are required')
      }
      
      // Call backend
      const result = await authAPI.signup(email, name, password)
      
      if (result.success && result.data) {
        set({
          user: result.data.user,
          token: result.data.token
        })
        localStorage.setItem('token', result.data.token)
        return result.data.user
      }
      
      throw new Error(result.error || 'Signup failed')
    } catch (error) {
      toast.error(error.response?.data?.error || error.message || 'Signup failed')
      throw error
    }
  },
  
  // Login
  login: async (userData) => {
    try {
      const { email, password } = userData
      
      if (!email || !password) {
        throw new Error('Email and password are required')
      }
      
      const result = await authAPI.login(email, password)
      
      if (result.success && result.data) {
        set({
          user: result.data.user,
          token: result.data.token
        })
        localStorage.setItem('token', result.data.token)
        return result.data.user
      }
      
      throw new Error(result.error || 'Login failed')
    } catch (error) {
      toast.error(error.response?.data?.error || error.message || 'Login failed')
      throw error
    }
  },
  
  // Logout
  logout: () => {
    set({ user: null, token: null, addressBook: [] })
    localStorage.removeItem('token')
  },
  
  // Get profile
  getProfile: async () => {
    try {
      const result = await authAPI.getProfile()
      if (result.success) {
        set({ user: result.data })
        return result.data
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    }
  },
  
  // Update profile
  updateProfile: async (updates) => {
    try {
      const result = await authAPI.updateProfile(updates)
      if (result.success) {
        set({ user: result.data })
        toast.success('Profile updated')
        return result.data
      }
    } catch (error) {
      toast.error('Failed to update profile')
      throw error
    }
  },
  
  // Add address
  addAddress: async (addr) => {
    try {
      const result = await userAPI.addAddress(addr)
      if (result.success) {
        set({ user: result.data })
        toast.success('Address added')
        return result.data
      }
    } catch (error) {
      toast.error('Failed to add address')
      throw error
    }
  },
  
  // Update address
  updateAddress: async (addressId, addr) => {
    try {
      const result = await userAPI.updateAddress(addressId, addr)
      if (result.success) {
        set({ user: result.data })
        toast.success('Address updated')
        return result.data
      }
    } catch (error) {
      toast.error('Failed to update address')
      throw error
    }
  },
  
  // Delete address
  deleteAddress: async (addressId) => {
    try {
      const result = await userAPI.deleteAddress(addressId)
      if (result.success) {
        set({ user: result.data })
        toast.success('Address deleted')
        return result.data
      }
    } catch (error) {
      toast.error('Failed to delete address')
      throw error
    }
  }
}), {
  name: 'fooddash-user',
  partialize: (state) => ({
    user: state.user,
    token: state.token,
    addressBook: state.addressBook
  })
}))

