# Start React Frontend (Local Development)
Write-Host "⚛️  Starting React Frontend..." -ForegroundColor Cyan
Write-Host "Port: 5173" -ForegroundColor Yellow
Write-Host "URL: http://localhost:5173`n" -ForegroundColor Green

cd $PSScriptRoot

# Check if dependencies are installed
if (-not (Test-Path "node_modules")) {
    Write-Host "⚠️  Dependencies not found. Installing...`n" -ForegroundColor Yellow
    npm install
}

# Start Vite dev server
npm run dev
