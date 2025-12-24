# 🚀 Quick Deployment Reference

## One-Page Summary: Vercel + Railway Deployment

```
┌─────────────────────────────────────────────────────────────┐
│  FRONTEND (React/Vite)                                      │
│  Deployed to: VERCEL                                        │
│  URL: https://your-project.vercel.app                       │
│  Root Directory: ./frontend                                 │
│  Build Command: npm run build                               │
│                                                             │
│  Environment Variables:                                     │
│  • VITE_API_URL = https://node-service-xxxxx.railway.app/api
└─────────────────────────────────────────────────────────────┘
                           ↓ API Calls
┌─────────────────────────────────────────────────────────────┐
│  BACKEND (Node.js + Flask)                                  │
│  Deployed to: RAILWAY                                       │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Node.js API Gateway                                  │  │
│  │ URL: https://node-service-xxxxx.railway.app          │  │
│  │ Root: backend/node-service                           │  │
│  │ Port: 3000                                           │  │
│  │ Environment:                                         │  │
│  │  • MONGODB_URI = mongodb+srv://...                   │  │
│  │  • DOWNSTREAM_BASE_URL = https://flask-xxxxx.app    │  │
│  │  • CORS_ORIGIN = https://your-project.vercel.app    │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Flask Menu Service                                   │  │
│  │ URL: https://flask-service-xxxxx.railway.app         │  │
│  │ Root: backend/flask-service                          │  │
│  │ Port: 5000                                           │  │
│  │ Environment:                                         │  │
│  │  • MONGODB_URI = mongodb+srv://...                   │  │
│  │  • ALLOWED_ORIGIN = https://your-project.vercel.app │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  DATABASE (MongoDB Atlas Cloud)                             │
│  Connection: mongodb+srv://user:pass@cluster.mongodb.net    │
│  Database: fooddelivery_prod                                │
└─────────────────────────────────────────────────────────────┘
```

---

## Step-by-Step Checklist

### Phase 1: Preparation (Local)
- [ ] Code committed and pushed to GitHub
- [ ] All local tests pass
- [ ] No sensitive data in git (check `.env` not committed)

### Phase 2: Vercel Frontend
```
1. Go to https://vercel.com/new
2. Import GitHub repo
3. Root Directory: ./frontend
4. Add VITE_API_URL env (update later)
5. Deploy
6. Note your Vercel URL
```

### Phase 3: Railway Backend - Node.js
```
1. Go to https://railway.app/dashboard
2. New Project → Deploy from GitHub
3. Add Node.js service (backend/node-service)
4. Configure environment variables (see below)
5. Deploy
6. Note your Node.js service URL
```

### Phase 4: Railway Backend - Flask
```
1. In same Railway project, add Flask service
2. Root Directory: backend/flask-service
3. Configure environment variables
4. Deploy
5. Note your Flask service URL
```

### Phase 5: Connect Services
```
1. Update Vercel VITE_API_URL with Node.js service URL
2. Update Railway Node.js DOWNSTREAM_BASE_URL with Flask URL
3. Redeploy both services
4. Test endpoints
```

---

## Environment Variables at a Glance

### Vercel (Frontend)
| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://node-service-xxxxx.railway.app/api` |

### Railway - Node.js Service
| Variable | Value |
|----------|-------|
| `PORT` | `3000` |
| `NODE_ENV` | `production` |
| `MONGODB_URI` | `mongodb+srv://...` |
| `DOWNSTREAM_BASE_URL` | `https://flask-service-xxxxx.railway.app` |
| `JWT_SECRET` | Your random secret key |
| `CORS_ORIGIN` | `https://your-project.vercel.app` |

### Railway - Flask Service
| Variable | Value |
|----------|-------|
| `PORT` | `5000` |
| `MONGODB_URI` | `mongodb+srv://...` (same as Node.js) |
| `ALLOWED_ORIGIN` | `https://your-project.vercel.app` |

---

## Testing Commands

```bash
# Test frontend
curl https://your-project.vercel.app

# Test Node.js API health
curl https://node-service-xxxxx.railway.app/healthz

# Test Flask health
curl https://flask-service-xxxxx.railway.app/healthz

# Expected healthy response:
# {"status":"ok","service":"...","mongo":"connected"}
```

---

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Frontend shows blank page | Check Vercel build logs, run `npm run build` locally |
| "Cannot reach API" error | Verify `VITE_API_URL` is correct and service is running |
| "MongoDB connection error" | Check `MONGODB_URI` in Railway, whitelist your IP in Atlas |
| CORS error in browser | Ensure `CORS_ORIGIN` matches your Vercel URL exactly |
| Flask not connecting | Verify `DOWNSTREAM_BASE_URL` in Node.js config matches Flask URL |

---

## URLs You'll Need to Access

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Railway Dashboard:** https://railway.app/dashboard
- **MongoDB Atlas:** https://cloud.mongodb.com
- **Your Frontend:** https://your-project.vercel.app
- **Your Node API:** https://node-service-xxxxx.railway.app
- **Your Flask API:** https://flask-service-xxxxx.railway.app

---

## Important Reminders

⚠️ **Security:**
- Never commit `.env` files with real values
- Change `JWT_SECRET` before production
- Use strong MongoDB credentials
- Enable MongoDB backups

⚠️ **Testing:**
- Always test health endpoints first
- Try signup/login flow
- Check API calls in browser DevTools
- Monitor Railway/Vercel logs during testing

✅ **Production Checklist:**
- [ ] All health checks pass
- [ ] Full user flow tested (signup → order → view order)
- [ ] Error handling verified
- [ ] Performance acceptable
- [ ] Monitoring enabled
- [ ] Backups configured

---

For detailed steps, see **DEPLOYMENT_GUIDE.md**
