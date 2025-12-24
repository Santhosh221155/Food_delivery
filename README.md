# 🍕 Food Delivery App

A full-stack food delivery application with React frontend and Node.js + Flask backend.

---

## 🚀 Quick Start (Local Development - No Docker)

### 1. Install Dependencies
```powershell
.\setup-local.ps1
```

### 2. Start All Services
```powershell
.\start-local.ps1
```

### 3. Open App
```
http://localhost:5173
```

**That's it!** The script will open 3 terminal windows for each service.

---

## 📋 Requirements

- **Node.js 18+** → https://nodejs.org
- **Python 3.10+** → https://python.org  
- **MongoDB Atlas** → Already configured (free tier)

---

## 🏗️ Architecture

```
┌─────────────────────┐
│  React Frontend     │  Port 5173
│  (Vite + React)     │  http://localhost:5173
└──────────┬──────────┘
           │ API calls
           ↓
┌─────────────────────┐
│  Node.js API        │  Port 3000
│  (Express + Auth)   │  http://localhost:3000
└──────────┬──────────┘
           │ Menu calls
           ↓
┌─────────────────────┐
│  Flask Service      │  Port 5000
│  (Menu API)         │  http://localhost:5000
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│  MongoDB Atlas      │  Cloud Database
│  (fooddelivery_prod)│
└─────────────────────┘
```

---

## 📁 Project Structure

```
Food_delivery_app/
├── frontend/              # React + Vite frontend
│   ├── src/
│   ├── package.json
│   └── .env              # Frontend config
├── backend/
│   ├── node-service/     # Node.js API Gateway
│   │   ├── src/
│   │   ├── package.json
│   │   └── .env         # Node.js config
│   └── flask-service/    # Flask Menu Service
│       ├── app/
│       ├── main.py
│       ├── requirements.txt
│       └── .env         # Flask config
├── start-local.ps1       # Start all services
├── setup-local.ps1       # Install dependencies
└── LOCAL_SETUP.md        # Detailed local setup guide
```

---

## 🔧 Manual Start (Alternative)

If you prefer running services separately:

**Terminal 1 - Flask Backend:**
```powershell
cd backend\flask-service
.\.venv\Scripts\Activate.ps1
python main.py
```

**Terminal 2 - Node.js Backend:**
```powershell
cd backend\node-service
npm start
```

**Terminal 3 - React Frontend:**
```powershell
cd frontend
npm run dev
```

---

## ⚙️ Configuration

All configuration is in `.env` files:

### `frontend/.env`
```env
VITE_API_URL=http://localhost:3000/api
```

### `backend/node-service/.env`
```env
PORT=3000
MONGODB_URI=mongodb+srv://...
DOWNSTREAM_BASE_URL=http://localhost:5000
JWT_SECRET=your-secret
CORS_ORIGIN=http://localhost:5173
```

### `backend/flask-service/.env`
```env
PORT=5000
MONGODB_URI=mongodb+srv://...
ALLOWED_ORIGIN=http://localhost:5173
```

---

## ✅ Testing

### Health Checks
```powershell
# Node.js API
curl http://localhost:3000/healthz

# Flask API
curl http://localhost:5000/healthz
```

### Full Workflow
1. Open http://localhost:5173
2. Sign up for an account
3. Browse restaurants
4. View menu items
5. Add to cart and place order
6. View order history

---

## 🐛 Troubleshooting

### Port Already in Use
```powershell
# Find and kill process
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### MongoDB Connection Error
1. Check MongoDB Atlas connection string in `.env` files
2. Ensure IP whitelist allows your IP (0.0.0.0/0 for testing)
3. Verify database name is `fooddelivery_prod`

### CORS Errors
- Ensure `CORS_ORIGIN=http://localhost:5173` in Node.js `.env`
- Ensure `ALLOWED_ORIGIN=http://localhost:5173` in Flask `.env`

### Dependencies Not Found
```powershell
.\setup-local.ps1
```

---

## 🚀 Deployment

Want to deploy to production? See:
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Deploy to Vercel + Railway
- **[LOCAL_SETUP.md](LOCAL_SETUP.md)** - Detailed local development guide

---

## 📚 Documentation

- **[LOCAL_SETUP.md](LOCAL_SETUP.md)** - Complete local setup guide
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Vercel + Railway deployment
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Quick deployment reference
- **[ENV_TEMPLATE.md](ENV_TEMPLATE.md)** - Environment variables reference

---

## 🎯 Features

- 🔐 User authentication (signup/login)
- 🍽️ Restaurant browsing
- 📋 Menu viewing
- 🛒 Shopping cart
- 📦 Order placement
- 📜 Order history
- 💳 Checkout flow

---

## 🛠️ Tech Stack

**Frontend:**
- React 19
- Vite
- Zustand (state management)
- TailwindCSS
- Axios

**Backend:**
- Node.js + Express
- Python Flask
- MongoDB Atlas
- JWT authentication

---

## 📝 Notes

- **No Docker needed** for local development
- Uses **MongoDB Atlas** (cloud) instead of local MongoDB
- All services run independently on different ports
- Hot reload enabled for all services
- Environment variables configured for local development

---

## 🤝 Contributing

1. Make changes to your code
2. Test locally with `.\start-local.ps1`
3. Commit and push changes
4. Deploy to production (see DEPLOYMENT_GUIDE.md)

---

## 📞 Need Help?

Check the documentation:
- Having setup issues? → [LOCAL_SETUP.md](LOCAL_SETUP.md)
- Want to deploy? → [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- Need quick reference? → [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

---

**Happy coding! 🎉**
