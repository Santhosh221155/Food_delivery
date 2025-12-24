# Food Delivery Application - Production-Ready Architecture

A complete refactoring of the food delivery application with company-level architecture, scalability, and professional UI/UX.

## 🏗️ Architecture Overview

### Three-Layer Architecture

```
Frontend (React + Vite)
    ↓
Node.js API Gateway (Express.js) - Port 3000
    ↓
    ├─→ MongoDB Atlas (Database)
    ├─→ Python FastAPI (Internal Service) - Port 5000
```

### Services

#### 1️⃣ **Frontend** (React + Vite)
- **Port**: 5173
- **Purpose**: User-facing application
- **Technology**: React, Zustand (State Management), Tailwind CSS
- **Features**:
  - Authentication (Signup/Login)
  - Restaurant browsing
  - Menu selection
  - Cart management
  - Order placement & tracking
  - User profile & addresses

#### 2️⃣ **Node.js Backend** (API Gateway)
- **Port**: 3000
- **Purpose**: Central API gateway handling all client requests
- **Technology**: Express.js, MongoDB, JWT, Passport
- **Responsibilities**:
  - Authentication & Authorization
  - User Management
  - Order Management
  - Request Validation
  - Error Handling
  - Python backend orchestration

**Structure**:
```
backend/node-service/
├── src/
│   ├── controllers/        # Request handlers
│   │   ├── auth.controller.js
│   │   ├── order.controller.js
│   │   ├── restaurant.controller.js
│   │   └── user.controller.js
│   ├── services/           # Business logic
│   │   ├── user.service.js
│   │   ├── order.service.js
│   │   └── python.service.js  (Python backend client)
│   ├── models/             # MongoDB schemas
│   │   ├── User.js
│   │   ├── Order.js
│   │   ├── Restaurant.js
│   │   └── MenuItem.js
│   ├── routes/             # API routes
│   │   ├── auth.routes.js
│   │   ├── order.routes.js
│   │   ├── restaurant.routes.js
│   │   ├── user.routes.js
│   │   └── index.js
│   ├── middlewares/        # Express middleware
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── validation.middleware.js
│   ├── config/             # Configuration
│   │   ├── database.js
│   │   └── jwt.js
│   ├── app.js              # Express app setup
│   └── server.js           # Server entry point with cluster support
├── scripts/
│   └── clear-data.js       # Database cleanup
└── package.json
```

#### 3️⃣ **Python Backend** (FastAPI)
- **Port**: 5000
- **Purpose**: Internal service for restaurant & delivery logic
- **Technology**: FastAPI, Uvicorn
- **Responsibilities**:
  - Restaurant listing
  - Menu management
  - ETA calculation
  - Delivery assignment
  - Delivery tracking

**Structure**:
```
backend/flask-service/
├── app/
│   ├── config/
│   │   └── database.py     # MongoDB connection
│   ├── models/
│   │   └── schemas.py      # Pydantic models
│   ├── routes/
│   │   ├── restaurants.py
│   │   ├── menu.py
│   │   └── delivery.py
│   ├── services/
│   │   ├── restaurant_service.py
│   │   ├── menu_service.py
│   │   └── delivery_service.py
│   └── __init__.py
├── main.py                 # FastAPI app entry point
├── requirements.txt
└── .env
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v16+ 
- **Python** 3.8+
- **MongoDB Atlas** account
- **npm** or **yarn**
- **pip**

### Installation

1. **Clone/Navigate to project**:
   ```bash
   cd "d:\System Design\Food_delivery_app"
   ```

2. **Install Node.js dependencies**:
   ```bash
   cd backend/node-service
   npm install
   cd ../../
   ```

3. **Install Python dependencies**:
   ```bash
   cd backend/flask-service
   pip install -r requirements.txt
   cd ../../
   ```

4. **Install Frontend dependencies**:
   ```bash
   cd frontend
   npm install
   cd ../
   ```

### Configuration

#### Node.js Backend (`.env`)
```dotenv
PORT=3000
DOWNSTREAM_BASE_URL=http://localhost:5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/fooddelivery_prod?retryWrites=true&w=majority
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
USE_CLUSTER=false
NUM_WORKERS=4
```

#### Python Backend (`.env`)
```dotenv
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/fooddelivery_prod?retryWrites=true&w=majority
ALLOWED_ORIGIN=http://localhost:3000
```

#### Frontend (`.env`)
```dotenv
VITE_API_URL=http://localhost:3000/api
```

---

## 🎯 Running the Application

### Option 1: One Command (Windows)
```bash
.\start-all.bat
```

### Option 2: One Command (Linux/Mac)
```bash
bash start-all.sh
```

### Option 3: Manual (All Terminals)

**Terminal 1 - Python Backend**:
```bash
cd backend/flask-service
python -m uvicorn main:app --host 0.0.0.0 --port 5000
```

**Terminal 2 - Node.js Backend**:
```bash
cd backend/node-service
npm start
```

**Terminal 3 - Frontend**:
```bash
cd frontend
npm run dev
```

### Access the Application
- **Frontend**: http://localhost:5173
- **Node.js API**: http://localhost:3000
- **Python API**: http://localhost:5000
- **API Docs**: http://localhost:5000/docs

---

## 🔌 API Endpoints

### Authentication
```
POST /api/auth/signup       # Register new user
POST /api/auth/login        # User login
GET  /api/auth/profile      # Get user profile (requires auth)
PATCH /api/auth/profile     # Update profile (requires auth)
```

### Restaurants
```
GET /api/restaurants              # List all restaurants
GET /api/restaurants/:id          # Get restaurant details
GET /api/restaurants/:id/menu     # Get restaurant menu
```

### Orders
```
POST /api/orders                  # Create order (requires auth)
GET  /api/orders                  # Get user's orders (requires auth)
GET  /api/orders/:id              # Get order details (requires auth)
PATCH /api/orders/:id/status      # Update order status
POST /api/orders/:id/cancel       # Cancel order
GET  /api/orders/stats            # Get order statistics
```

### Users
```
POST /api/users/addresses         # Add address
PATCH /api/users/addresses/:id    # Update address
DELETE /api/users/addresses/:id   # Delete address
```

---

## 🗄️ Database (MongoDB Atlas)

### Collections
1. **users**
   - Email, Name, Password (hashed)
   - Addresses
   - Role (customer, admin, delivery)
   - Timestamps

2. **restaurants**
   - Name, Description, Cuisine
   - Rating, ETA
   - Address, Contact
   - Status

3. **menu_items**
   - Restaurant ID
   - Name, Category, Price
   - Vegetarian flag
   - Customizations

4. **orders**
   - User ID
   - Items, Totals
   - Status (PLACED, CONFIRMED, PREPARING, PICKED_UP, OUT_FOR_DELIVERY, DELIVERED, CANCELLED)
   - Delivery Address
   - Payment Info
   - Timestamps

5. **deliveries**
   - Order ID
   - Status
   - Delivery Partner
   - ETA

### Indexing
All collections are optimized with proper indexes on frequently queried fields:
- `users`: email (unique)
- `orders`: userId, userEmail, status, createdAt
- `menu_items`: restaurantId, category
- `restaurants`: name, rating, isActive

---

## 🔐 Security Features

1. **JWT Authentication**
   - Token-based authentication
   - 7-day expiration
   - Refresh token support (future)

2. **Password Security**
   - Bcrypt hashing (10 salt rounds)
   - Minimum 6 characters
   - Never stored in plain text

3. **API Validation**
   - Express-validator for input validation
   - Schema validation in MongoDB (Mongoose)
   - Pydantic models in FastAPI

4. **Error Handling**
   - Centralized error handler
   - Proper HTTP status codes
   - Safe error messages

5. **CORS**
   - Configured for frontend origin
   - Credentials enabled for token passing

---

## 🔄 Inter-Service Communication

### Node.js → Python Backend
- **Method**: REST API via Axios
- **Retry Logic**: Exponential backoff (3 retries)
- **Timeout**: 10 seconds
- **Health Check**: `/healthz` endpoint

**Example Flow**:
```
Frontend Request
    ↓
Node.js Receives (validates, authenticates)
    ↓
Node.js calls Python Service (with retries)
    ↓
Python returns data
    ↓
Node.js aggregates response
    ↓
Response to Frontend
```

---

## 📊 Workflow Examples

### 1. Signup Flow
```
User enters email, name, password
    ↓
Frontend validates
    ↓
POST /api/auth/signup
    ↓
Node.js validates & hashes password
    ↓
Saves to MongoDB
    ↓
Generates JWT token
    ↓
Returns user + token
    ↓
Frontend stores token & redirects to home
```

### 2. Order Placement Flow
```
User adds items to cart
    ↓
Clicks "Place Order"
    ↓
Frontend checks auth (has token?)
    ↓
POST /api/orders (with auth header)
    ↓
Node.js verifies JWT
    ↓
Validates order data
    ↓
Calls Python service for ETA
    ↓
Saves order to MongoDB
    ↓
Calls Python service for delivery assignment
    ↓
Returns order confirmation
    ↓
Frontend redirects to order tracking
```

---

## 🛠️ Development

### Adding a New API Endpoint

**1. Create Controller** (`src/controllers/example.controller.js`):
```javascript
class ExampleController {
  async getExample(req, res, next) {
    try {
      // Business logic
      res.json({ success: true, data: {} })
    } catch (error) {
      next(error)
    }
  }
}
export default new ExampleController()
```

**2. Create Service** (`src/services/example.service.js`):
```javascript
class ExampleService {
  async doSomething(data) {
    // Business logic
    return result
  }
}
export default new ExampleService()
```

**3. Create Route** (`src/routes/example.routes.js`):
```javascript
import express from 'express'
import controller from '../controllers/example.controller.js'
const router = express.Router()
router.get('/', controller.getExample)
export default router
```

**4. Add to Router** (`src/routes/index.js`):
```javascript
router.use('/example', exampleRoutes)
```

---

## 📈 Scaling

### Horizontal Scaling
- **Node.js**: Use cluster mode or PM2 with multiple workers
- **Python**: Use Gunicorn/Uvicorn with multiple workers
- **Load Balancer**: Configure Nginx (optional setup provided)

### Vertical Scaling
- Increase MongoDB Atlas tier
- Upgrade server resources
- Optimize queries with proper indexing

### Enable Node.js Cluster Mode
In `.env`:
```
USE_CLUSTER=true
NUM_WORKERS=4
```

---

## 🧹 Maintenance

### Clear Database
```bash
cd backend/node-service
npm run clear-data
```

### View Database
- MongoDB Atlas Dashboard: https://cloud.mongodb.com
- Browse Collections → fooddelivery_prod

### Logs
- Node.js: Console output
- Python: Console output
- Frontend: Browser DevTools

---

## 📦 Deployment

### For Production:
1. Use environment-specific `.env` files
2. Set `NODE_ENV=production`
3. Use proper load balancer (Nginx)
4. Enable HTTPS
5. Use PM2 or systemd for process management
6. Configure proper CORS origins
7. Use strong JWT_SECRET
8. Enable MongoDB IP whitelist
9. Set up CI/CD pipeline

---

## ✅ Checklist for Production

- [ ] Update JWT_SECRET
- [ ] Update CORS_ORIGIN
- [ ] Enable HTTPS
- [ ] Configure MongoDB IP whitelist
- [ ] Set up error logging (Sentry, LogRocket)
- [ ] Enable API rate limiting
- [ ] Set up monitoring (New Relic, Datadog)
- [ ] Configure backup strategy
- [ ] Test all API endpoints
- [ ] Load test with expected traffic
- [ ] Security audit
- [ ] Performance optimization

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

### MongoDB Connection Failed
- Check MongoDB Atlas IP whitelist
- Verify connection string
- Check credentials
- Ensure network connectivity

### CORS Errors
- Check CORS_ORIGIN env variable
- Verify frontend URL matches
- Check browser console for full error

### JWT Errors
- Clear localStorage in browser
- Check JWT_SECRET matches
- Verify token hasn't expired
- Check Authorization header format: `Bearer <token>`

---

## 📚 Technologies Used

**Frontend**:
- React 18
- Vite
- Zustand
- React Router
- Tailwind CSS
- Axios
- React Hot Toast

**Backend (Node.js)**:
- Express.js
- MongoDB + Mongoose
- JWT + Passport
- Bcryptjs
- Express Validator
- Axios with retry
- Helmet
- Compression

**Backend (Python)**:
- FastAPI
- Uvicorn
- Pydantic
- Motor (async MongoDB)
- Python-dotenv

**Database**:
- MongoDB Atlas

---

## 🤝 Contributing

When making changes:
1. Follow existing code structure
2. Add proper error handling
3. Validate all inputs
4. Write clear commit messages
5. Update API docs

---

## 📝 License

This project is part of a System Design assignment.

---

## 📞 Support

For issues or questions:
1. Check existing error logs
2. Review API documentation
3. Test with Postman
4. Check MongoDB Atlas dashboard

---

**Last Updated**: December 23, 2025
**Version**: 1.0.0 - Production Ready
