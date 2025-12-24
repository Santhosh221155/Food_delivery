# 🚀 Local Development Guide (No Docker)

Run the Food Delivery App on your local machine without Docker.

---

## Prerequisites

Install these on your machine:
- **Node.js 18+** (https://nodejs.org)
- **Python 3.10+** (https://python.org)
- **MongoDB Atlas Account** (free at https://mongodb.com/cloud/atlas)

---

## Quick Start

### 1. Install Dependencies (One-time setup)

```powershell
.\setup-local.ps1
```

This will:
- Install Node.js dependencies for backend and frontend
- Create Python virtual environment
- Install Flask dependencies

### 2. Start All Services

```powershell
.\start-local.ps1
```

This will open 3 terminal windows:
- **Flask Service** (Port 5000) - Menu service
- **Node.js API** (Port 3000) - Main API gateway
- **React Frontend** (Port 5173) - User interface

### 3. Access the App

Open your browser and go to:
```
http://localhost:5173
```

---

## Manual Setup (Alternative)

If you prefer to run services manually:

### Terminal 1: Flask Backend
```powershell
cd backend\flask-service
.\.venv\Scripts\Activate.ps1
python main.py
```

### Terminal 2: Node.js Backend
```powershell
cd backend\node-service
npm start
```

### Terminal 3: React Frontend
```powershell
cd frontend
npm run dev
```

---

## Configuration Files

All services use `.env` files for configuration:

### Backend Node.js (backend/node-service/.env)
```env
PORT=3000
DOWNSTREAM_BASE_URL=http://localhost:5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/fooddelivery_prod
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:5173
```

### Backend Flask (backend/flask-service/.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/fooddelivery_prod
ALLOWED_ORIGIN=http://localhost:5173
```

### Frontend (frontend/.env)
```env
VITE_API_URL=http://localhost:3000/api
```

---

## Verify Services

### Check Health Endpoints

```powershell
# Node.js API
curl http://localhost:3000/healthz

# Flask API
curl http://localhost:5000/healthz
```

Expected response:
```json
{
  "status": "ok",
  "service": "node-service",
  "mongo": "connected"
}
```

---

## Development Workflow

### Make changes to backend
1. Edit files in `backend/node-service/src/` or `backend/flask-service/app/`
2. Services will auto-reload (Node.js uses `--watch`, Flask uses auto-reload)

### Make changes to frontend
1. Edit files in `frontend/src/`
2. Vite will hot-reload automatically
3. See changes instantly in browser

---

## Troubleshooting

### ❌ "EADDRINUSE: Port already in use"
**Solution:** Kill the process using that port
```powershell
# Find process on port 3000
netstat -ano | findstr :3000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### ❌ "MongoDB connection failed"
**Solution:** Check your MongoDB Atlas connection:
1. Go to MongoDB Atlas dashboard
2. Click "Connect" → "Drivers"
3. Copy connection string
4. Update `MONGODB_URI` in `.env` files
5. Ensure IP whitelist allows your IP (or use `0.0.0.0/0` for testing)

### ❌ "Cannot GET /api/restaurants"
**Solution:** Make sure Node.js backend is running on port 3000
```powershell
curl http://localhost:3000/healthz
```

### ❌ Frontend shows blank page
**Solution:** Check browser console (F12) for errors
- Ensure `VITE_API_URL` in `frontend/.env` is correct
- Verify Node.js API is running

### ❌ CORS errors in browser
**Solution:** Check CORS configuration
- Node.js: `CORS_ORIGIN=http://localhost:5173` in `.env`
- Flask: `ALLOWED_ORIGIN=http://localhost:5173` in `.env`

---

## Stop Services

To stop all services:
- Close each terminal window, or
- Press `Ctrl+C` in each terminal

---

## Database

This setup uses **MongoDB Atlas** (cloud database):
- Connection string already configured in `.env` files
- Database: `fooddelivery_prod`
- Free tier available (no credit card needed for testing)

---

## Port Summary

| Service | Port | URL |
|---------|------|-----|
| React Frontend | 5173 | http://localhost:5173 |
| Node.js API | 3000 | http://localhost:3000 |
| Flask API | 5000 | http://localhost:5000 |
| MongoDB | Cloud | MongoDB Atlas |

---

## Testing the App

1. **Open Frontend:** http://localhost:5173
2. **Sign Up:** Create a new account
3. **Browse Restaurants:** View restaurant list
4. **View Menu:** Click on a restaurant
5. **Place Order:** Add items to cart and checkout
6. **View Orders:** Check your order history

---

## For Deployment (Vercel + Railway)

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for deploying to production.

---

## Need Help?

- Check service logs in each terminal window
- Verify all `.env` files have correct values
- Ensure MongoDB Atlas connection is working
- Test health endpoints first before debugging features

Happy coding! 🎉
