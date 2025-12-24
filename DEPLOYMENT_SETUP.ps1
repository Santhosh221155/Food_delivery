#!/usr/bin/env powershell
<#
.SYNOPSIS
Quick deployment setup script for Vercel + Railway

.DESCRIPTION
This script helps you prepare your project for deployment to Vercel (frontend) and Railway (backend).
It creates all necessary configuration files and provides a checklist.
#>

param(
    [string]$GitHubRepo = "",
    [switch]$Help
)

if ($Help) {
    Get-Help $MyInvocation.MyCommand.Path -Full
    exit
}

Write-Host "🚀 Food Delivery App - Deployment Setup" -ForegroundColor Cyan
Write-Host "=========================================`n" -ForegroundColor Cyan

# Step 1: Git
Write-Host "📦 Step 1: Prepare Git Repository" -ForegroundColor Yellow
Write-Host "Run the following commands:" -ForegroundColor Gray
Write-Host @"
git add .
git commit -m "Prepare for Vercel + Railway deployment"
git push
"@ -ForegroundColor Green

Write-Host "`n✅ Files already created:" -ForegroundColor Cyan
Write-Host "  ✓ vercel.json - Vercel configuration"
Write-Host "  ✓ DEPLOYMENT_GUIDE.md - Complete step-by-step guide"
Write-Host "  ✓ ENV_TEMPLATE.md - Environment variables reference"
Write-Host "  ✓ railway.json - Railway configuration`n"

# Step 2: Vercel
Write-Host "🔵 Step 2: Deploy Frontend to Vercel" -ForegroundColor Yellow
Write-Host @"
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Enter your GitHub repo URL
4. Set Root Directory to: ./frontend
5. Add Environment Variables:
   VITE_API_URL = (leave blank for now, update after Railway deployment)
6. Click "Deploy"

Vercel will provide you with a URL like:
https://your-project.vercel.app
"@ -ForegroundColor Green

# Step 3: MongoDB
Write-Host "`n🍃 Step 3: Setup MongoDB Atlas" -ForegroundColor Yellow
Write-Host @"
1. Go to https://www.mongodb.com/cloud/atlas
2. Create/login to your cluster
3. Get connection string:
   - Click "Connect" → "Drivers"
   - Copy MongoDB URI
4. Whitelist IP: Set to 0.0.0.0/0 (for testing) or specific IPs (production)

Connection String Format:
mongodb+srv://username:password@cluster.mongodb.net/fooddelivery_prod?authSource=admin
"@ -ForegroundColor Green

# Step 4: Railway
Write-Host "`n🚂 Step 4: Deploy Backend to Railway" -ForegroundColor Yellow
Write-Host @"
1. Go to https://railway.app/dashboard
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect GitHub account and select your repo
5. Railway should auto-detect services

For each service, add Environment Variables from ENV_TEMPLATE.md:
  - Node.js Service (backend/node-service)
  - Flask Service (backend/flask-service)

Railway will provide URLs like:
- Node.js: https://node-service-xxxxx.railway.app
- Flask: https://flask-service-xxxxx.railway.app
"@ -ForegroundColor Green

# Step 5: Connect Services
Write-Host "`n🔗 Step 5: Connect All Services" -ForegroundColor Yellow
Write-Host @"
1. After Railway deployment, get the service URLs
2. Update Vercel environment:
   VITE_API_URL = https://node-service-xxxxx.railway.app/api
3. Update Railway Node.js environment:
   DOWNSTREAM_BASE_URL = https://flask-service-xxxxx.railway.app
   CORS_ORIGIN = https://your-project.vercel.app
4. Redeploy both services

Note: Replace xxxxx with actual Railway service IDs
"@ -ForegroundColor Green

# Step 6: Testing
Write-Host "`n✅ Step 6: Verify Deployment" -ForegroundColor Yellow
Write-Host @"
Test the following endpoints:

Frontend:
  https://your-project.vercel.app

Health Checks:
  curl https://your-project.vercel.app
  curl https://node-service-xxxxx.railway.app/healthz
  curl https://flask-service-xxxxx.railway.app/healthz

Expected response:
  { "status": "ok", "service": "...", "mongo": "connected" }

Manual Testing:
  1. Open frontend URL
  2. Try signing up
  3. Place an order
  4. Check browser DevTools (F12) → Network tab for API calls
"@ -ForegroundColor Green

# Summary
Write-Host "`n📋 DEPLOYMENT CHECKLIST" -ForegroundColor Cyan
Write-Host @"
BEFORE DEPLOYMENT:
  [ ] Code pushed to GitHub
  [ ] MongoDB Atlas cluster created
  [ ] GitHub account connected to Vercel
  [ ] GitHub account connected to Railway
  [ ] All secrets are safe (not in git)

DURING DEPLOYMENT:
  [ ] Vercel frontend deployed
  [ ] Railway Node.js service deployed
  [ ] Railway Flask service deployed
  [ ] MongoDB URI added to Railway services
  [ ] Environment variables configured in Vercel
  [ ] Environment variables configured in Railway
  [ ] Services connected (URLs updated)

AFTER DEPLOYMENT:
  [ ] Frontend loads (https://your-project.vercel.app)
  [ ] API health checks pass
  [ ] Can sign up / create account
  [ ] Can place orders
  [ ] Can view order history

PRODUCTION READY:
  [ ] JWT_SECRET changed to strong random value
  [ ] CORS_ORIGIN updated to production domain
  [ ] Error logging enabled
  [ ] Monitoring/alerts configured
  [ ] Database backups enabled
"@

Write-Host "`n📚 For detailed instructions, see: DEPLOYMENT_GUIDE.md`n" -ForegroundColor Cyan
