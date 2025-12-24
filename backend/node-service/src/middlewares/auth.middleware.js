// Authentication middleware for protected routes
import { verifyToken } from '../config/jwt.js'

export const authenticate = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided. Access denied.'
      })
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    // Verify token
    const decoded = verifyToken(token)
    
    // Attach user info to request
    req.user = decoded
    
    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid token. Access denied.',
      message: error.message
    })
  }
}

// Optional: Role-based middleware
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      })
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      })
    }

    next()
  }
}
