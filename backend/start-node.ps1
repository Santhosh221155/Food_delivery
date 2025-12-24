# Start Node.js Service (Local Development)
Write-Host "🟢 Starting Node.js API Gateway..." -ForegroundColor Green
Write-Host "Port: 3000" -ForegroundColor Yellow
Write-Host "Health: http://localhost:3000/healthz`n" -ForegroundColor Cyan

cd $PSScriptRoot\node-service

# Check if dependencies are installed
if (-not (Test-Path "node_modules")) {
    Write-Host "⚠️  Dependencies not found. Installing...`n" -ForegroundColor Yellow
    npm install
}

# Start Node.js
npm start
