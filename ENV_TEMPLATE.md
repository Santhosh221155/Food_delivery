# Environment Variables Template

Use this file as a reference for all environment variables needed in Vercel and Railway.

## 1. Vercel - Frontend Environment Variables

Create these in: **Vercel Dashboard** → **Your Project** → **Settings** → **Environment Variables**

```
VITE_API_URL=https://node-service-xxxxx.railway.app/api
```

---

## 2. Railway - Node.js Service Environment Variables

Create these in: **Railway Dashboard** → **Node.js Service** → **Variables**

```
PORT=3000
NODE_ENV=production
MONGODB_URI=mongodb+srv://santhosh_db_user:san221155@cluster0.kqlcsos.mongodb.net/fooddelivery_prod?authSource=admin
DOWNSTREAM_BASE_URL=https://flask-service-xxxxx.railway.app
JWT_SECRET=your-super-secret-jwt-key-change-in-production-2024
JWT_EXPIRE=7d
CORS_ORIGIN=https://your-project.vercel.app
USE_CLUSTER=false
NUM_WORKERS=2
```

---

## 3. Railway - Flask Service Environment Variables

Create these in: **Railway Dashboard** → **Flask Service** → **Variables**

```
PORT=5000
MONGODB_URI=mongodb+srv://santhosh_db_user:san221155@cluster0.kqlcsos.mongodb.net/fooddelivery_prod?authSource=admin
ALLOWED_ORIGIN=https://your-project.vercel.app
```

---

## How to Fill In the Values

### VITE_API_URL (Vercel)
- Get this AFTER deploying Node.js to Railway
- Copy the public URL of your Node.js service
- Add `/api` at the end
- Example: `https://node-service-abc123xyz.railway.app/api`

### MONGODB_URI (Railway)
- You already have this: `mongodb+srv://santhosh_db_user:san221155@cluster0.kqlcsos.mongodb.net/fooddelivery_prod?authSource=admin`
- Use the same URI in both Node.js and Flask services

### DOWNSTREAM_BASE_URL (Node.js Service)
- Get this AFTER deploying Flask to Railway
- Copy the public URL of your Flask service
- Example: `https://flask-service-abc123xyz.railway.app`

### CORS_ORIGIN (Both services)
- Set to your Vercel frontend URL
- Example: `https://food-delivery-abc123.vercel.app`

### JWT_SECRET & JWT_EXPIRE
- You can keep the existing values or generate new ones
- Recommendation: Generate a strong random string for JWT_SECRET

---

## Testing Checklist

- [ ] Frontend URL loads without errors
- [ ] Can sign up and create account
- [ ] Can view restaurants
- [ ] Can view menu items
- [ ] Can place an order
- [ ] Can view order history
- [ ] API health checks return "connected" status

---

## Important Notes

⚠️ **Before deploying to production:**
1. Change `JWT_SECRET` to a strong random value
2. Ensure MongoDB Atlas has backups enabled
3. Test all workflows on deployed version
4. Set up error logging/monitoring
5. Use environment-specific secrets (never commit .env files with real values)

