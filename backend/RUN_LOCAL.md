# FoodDash Backend - Local Run (No Docker)

## Prerequisites
- Node.js 18+ installed
- Python 3.10+ installed
- Both must be in PATH

## Installation

### 1. Install Flask Dependencies
```powershell
cd backend/flask-service
pip install Flask requests pymongo python-dotenv
```

### 2. Install Node Dependencies
```powershell
cd backend/node-service
npm install
```

## Running Services

### Option 1: Manual (Two terminals)

**Terminal 1 - Flask Service:**
```powershell
cd backend
.\start-flask.ps1
```

**Terminal 2 - Node Service:**
```powershell
cd backend
.\start-node.ps1
```

### Option 2: Direct Commands

**Flask (Terminal 1):**
```powershell
cd "D:\System Design\Food_delivery_app\backend\flask-service"
$env:PORT="5000"
python app.py
```

**Node (Terminal 2):**
```powershell
cd "D:\System Design\Food_delivery_app\backend\node-service"
$env:PORT="3000"
$env:DOWNSTREAM_BASE_URL="http://127.0.0.1:5000"
npm start
```

## Test Endpoints

Once both services are running:

**Flask Service (Port 5000):**
- Health: http://127.0.0.1:5000/healthz
- Menu: http://127.0.0.1:5000/internal/menu/res-4

**Node Service (Port 3000):**
- Health: http://127.0.0.1:3000/healthz
- Restaurants: http://127.0.0.1:3000/api/restaurants
- Menu (proxied to Flask): http://127.0.0.1:3000/api/menu/res-4
- Orders: POST http://127.0.0.1:3000/api/orders

## Architecture
```
Frontend (Port 5173)
    ↓
Node Service (Port 3000) - Public API
    ↓
Flask Service (Port 5000) - Internal API
    ↓
MongoDB Atlas (optional)
```

## MongoDB Atlas Setup (Optional)

1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Get connection string
3. Set environment variable before starting services:

```powershell
$env:MONGODB_URI="mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/fooddash?retryWrites=true&w=majority"
```

## Troubleshooting

**"python not recognized":** Install Python from python.org or Microsoft Store
**"npm not recognized":** Install Node.js from nodejs.org
**"Port already in use":** Change PORT env variable or kill existing process
**Flask won't start:** Ensure pip packages installed: `pip list | Select-String Flask`
**Node won't start:** Ensure packages installed: check node_modules exists
