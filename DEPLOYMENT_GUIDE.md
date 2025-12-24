# 🚀 Deployment Guide: Vercel + Railway

Deploy Frontend to **Vercel** and Backend (Node.js + Flask) to **Railway**.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Part 1: Frontend Deployment (Vercel)](#part-1-frontend-deployment-vercel)
3. [Part 2: Backend Deployment (Railway)](#part-2-backend-deployment-railway)
4. [Part 3: Connect Services](#part-3-connect-services)
5. [Verification & Testing](#verification--testing)

---

## Prerequisites

Before starting, ensure you have:
- GitHub account with this repo pushed
- Vercel account (free at vercel.com)
- Railway account (free at railway.app)
- MongoDB Atlas account with a cluster (free tier available)
- Git installed locally

---

## Part 1: Frontend Deployment (Vercel)

### Step 1.1: Push code to GitHub
```powershell
cd d:\System Design\Food_delivery_app
git add .
git commit -m "Prepare for Vercel + Railway deployment"
git push
```

### Step 1.2: Connect to Vercel
1. Go to **https://vercel.com/new**
2. Click **"Import Git Repository"**
3. Paste your GitHub repo URL
4. Click **"Import"**

### Step 1.3: Configure Vercel Project Settings
1. **Project Name:** `food-delivery-frontend` (or your choice)
2. **Framework Preset:** Select **"Other"** (Vite will auto-detect)
3. **Root Directory:** Set to `./frontend`
4. **Build Command:** Keep as default or set to `npm run build`
5. **Output Directory:** Keep as default or set to `dist`

### Step 1.4: Add Environment Variables
In Vercel dashboard, go to **Settings → Environment Variables** and add:

```
VITE_API_URL = https://your-railway-backend-url.railway.app/api
```

**Note:** Replace `your-railway-backend-url` after you deploy the backend (Step 2).
For now, use a placeholder like `https://backend-placeholder.railway.app/api`

### Step 1.5: Deploy
Click **"Deploy"** and wait for the build to complete (~3-5 mins).

✅ **Your frontend will be live at:** `https://your-project.vercel.app`

---

## Part 2: Backend Deployment (Railway)

### Step 2.1: Prepare MongoDB Atlas
1. Go to **https://www.mongodb.com/cloud/atlas**
2. Create a free cluster (if not already done)
3. Get your connection string:
   - Click **"Connect"** → **"Drivers"**
   - Copy the MongoDB URI (looks like: `mongodb+srv://user:password@cluster.mongodb.net/dbname`)
4. Keep this safe; you'll need it for Railway environment variables

### Step 2.2: Create Railway Project
1. Go to **https://railway.app**
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Connect your GitHub account and select your repo

### Step 2.3: Add Services to Railway

Railway will auto-detect. If not, manually add:

#### **Option A: Single Container (Recommended for simplicity)**
If you want Node.js + Flask in one Railway project:

1. Create a new service for the **Node.js backend**:
   - Click **"New"** → **"GitHub Repo"**
   - Select your repo
   - Railway should auto-detect the backend
   - Set **Root Directory** to `backend/node-service`

2. Create another service for the **Flask backend**:
   - Click **"New"** → **"GitHub Repo"**
   - Set **Root Directory** to `backend/flask-service`

#### **Option B: Docker Container (If Railway supports)**
Alternatively, use the root `docker-compose.yml`:
1. Click **"New"** → **"Database"** → **"MongoDB"**
2. Click **"New"** → **"Docker"**
3. Point to `backend/docker-compose.yml`

### Step 2.4: Configure Node.js Service Environment Variables

Go to the **Node.js service** → **Variables** and add:

```
PORT=3000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/fooddelivery_prod?authSource=admin
DOWNSTREAM_BASE_URL=https://flask-service-url.railway.app
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
CORS_ORIGIN=https://your-project.vercel.app
USE_CLUSTER=false
NUM_WORKERS=2
```

**Replace:**
- `user:password` → Your MongoDB credentials
- `flask-service-url` → Your Flask service Railway URL (get after deploying Flask)
- `your-project.vercel.app` → Your Vercel frontend URL

### Step 2.5: Configure Flask Service Environment Variables

Go to the **Flask service** → **Variables** and add:

```
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/fooddelivery_prod?authSource=admin
ALLOWED_ORIGIN=https://your-project.vercel.app
```

### Step 2.6: Deploy Backend

1. Click **"Deploy"** on each service
2. Wait for builds to complete (~5-10 mins per service)

✅ **Your backend services will be live at:**
- Node.js API: `https://node-service-xxxxx.railway.app`
- Flask service: `https://flask-service-xxxxx.railway.app`

---

## Part 3: Connect Services

### Step 3.1: Update Vercel Environment Variable

Now that your Railway backend is live:

1. Go to **Vercel Dashboard** → Your frontend project → **Settings** → **Environment Variables**
2. Update `VITE_API_URL`:
   ```
   VITE_API_URL=https://node-service-xxxxx.railway.app/api
   ```
3. **Redeploy** the frontend: Click **Deployments** → **Click latest** → **"Redeploy"**

### Step 3.2: Update Node.js Backend Variables (if not already set)

Go to **Railway Dashboard** → **Node service** → **Variables**

Update `DOWNSTREAM_BASE_URL`:
```
DOWNSTREAM_BASE_URL=https://flask-service-xxxxx.railway.app
```

Re-trigger deployment or restart the service.

---

## Verification & Testing

### Test 1: Frontend loads
```
https://your-project.vercel.app
```
Should see the React app UI ✅

### Test 2: Health checks
```bash
# Frontend health
curl https://your-project.vercel.app

# Node.js API health
curl https://node-service-xxxxx.railway.app/healthz

# Flask health
curl https://flask-service-xxxxx.railway.app/healthz
```

Expected response:
```json
{
  "status": "ok",
  "service": "node-service",
  "mongo": "connected"
}
```

### Test 3: API call from frontend
1. Open your frontend: `https://your-project.vercel.app`
2. Try signing up or placing an order
3. Check browser DevTools (F12) → **Network** tab to see API calls
4. Should see requests to your Node.js backend ✅

### Test 4: Check logs
- **Vercel:** Dashboard → **Deployments** → **Logs**
- **Railway:** Dashboard → **Service** → **Logs**

Look for any connection errors or failed health checks.

---

## Troubleshooting

### ❌ Frontend shows "Cannot connect to API"
- **Check:** Is `VITE_API_URL` correct in Vercel environment variables?
- **Fix:** Update and redeploy frontend

### ❌ "MongoDB connection error"
- **Check:** Is `MONGODB_URI` correct?
- **Fix:** Verify in MongoDB Atlas → Get connection string again
- Ensure your IP is whitelisted in MongoDB Atlas (allow all `0.0.0.0/0` for testing)

### ❌ CORS errors in browser console
- **Check:** Is `CORS_ORIGIN` in Node.js matching your frontend URL?
- **Fix:** Update `CORS_ORIGIN=https://your-project.vercel.app` in Railway

### ❌ Blank page on frontend
- **Check:** Is the build successful in Vercel?
- **Fix:** Check Vercel build logs, ensure `frontend/dist` exists
- Try locally: `cd frontend && npm run build`

### ❌ Flask service not connecting to Node.js
- **Check:** Is `DOWNSTREAM_BASE_URL` correct?
- **Fix:** Use the exact Railway URL for Flask service

---

## Environment Variables Summary

### Vercel (Frontend)
```
VITE_API_URL=https://node-service-xxxxx.railway.app/api
```

### Railway - Node.js Service
```
PORT=3000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/fooddelivery_prod?authSource=admin
DOWNSTREAM_BASE_URL=https://flask-service-xxxxx.railway.app
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
CORS_ORIGIN=https://your-project.vercel.app
USE_CLUSTER=false
NUM_WORKERS=2
```

### Railway - Flask Service
```
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/fooddelivery_prod?authSource=admin
ALLOWED_ORIGIN=https://your-project.vercel.app
```

---

## Next Steps (Optional)

- [ ] Set up custom domain in Vercel
- [ ] Enable HTTPS (automatic in Vercel)
- [ ] Configure monitoring/alerts in Railway
- [ ] Add database backups in MongoDB Atlas
- [ ] Set up CI/CD auto-deployments on git push

---

## Quick Reference Links

- **Vercel:** https://vercel.com/dashboard
- **Railway:** https://railway.app/dashboard
- **MongoDB Atlas:** https://cloud.mongodb.com
- **GitHub:** Push changes, auto-triggers deployments

Happy deploying! 🚀
