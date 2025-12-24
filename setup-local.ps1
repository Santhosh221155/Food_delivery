#!/usr/bin/env powershell
<#
.SYNOPSIS
Setup and install dependencies for local development

.DESCRIPTION
Installs all npm and Python dependencies needed to run the app locally
#>

Write-Host "📦 Setting up Food Delivery App - Local Development" -ForegroundColor Cyan
Write-Host "===================================================`n" -ForegroundColor Cyan

# Check prerequisites
Write-Host "🔍 Checking prerequisites..." -ForegroundColor Yellow

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found! Please install from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Check Python
try {
    $pythonVersion = python --version
    Write-Host "✅ Python: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python not found! Please install from https://python.org" -ForegroundColor Red
    exit 1
}

# Check npm
try {
    $npmVersion = npm --version
    Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found!" -ForegroundColor Red
    exit 1
}

Write-Host "`n📦 Installing dependencies...`n" -ForegroundColor Yellow

# Install Node.js Backend Dependencies
Write-Host "🟢 Installing Node.js backend dependencies..." -ForegroundColor Green
Set-Location "$PSScriptRoot\backend\node-service"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install Node.js dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js dependencies installed`n" -ForegroundColor Green

# Install Python Backend Dependencies
Write-Host "🐍 Installing Flask backend dependencies..." -ForegroundColor Green
Set-Location "$PSScriptRoot\backend\flask-service"

# Create virtual environment if it doesn't exist
if (-not (Test-Path ".venv")) {
    Write-Host "Creating Python virtual environment..." -ForegroundColor Yellow
    python -m venv .venv
}

# Activate and install
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install Python dependencies" -ForegroundColor Red
    exit 1
}
deactivate
Write-Host "✅ Flask dependencies installed`n" -ForegroundColor Green

# Install Frontend Dependencies
Write-Host "⚛️  Installing React frontend dependencies..." -ForegroundColor Green
Set-Location "$PSScriptRoot\frontend"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Frontend dependencies installed`n" -ForegroundColor Green

# Return to root
Set-Location $PSScriptRoot

Write-Host "`n🎉 Setup Complete!" -ForegroundColor Green
Write-Host "`n📋 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Make sure MongoDB Atlas connection is working" -ForegroundColor White
Write-Host "   2. Run: .\start-local.ps1" -ForegroundColor White
Write-Host "   3. Open browser: http://localhost:5173`n" -ForegroundColor White
