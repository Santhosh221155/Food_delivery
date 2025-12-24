# FoodDash - Start All Services
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Starting FoodDash Application" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if port is in use
function Test-Port {
    param($Port)
    $connection = Test-NetConnection -ComputerName 127.0.0.1 -Port $Port -InformationLevel Quiet -WarningAction SilentlyContinue
    return $connection
}

# Kill existing processes on ports
Write-Host "Checking for existing processes..." -ForegroundColor Yellow
$portsToCheck = @(5000, 3000, 5173)
foreach ($port in $portsToCheck) {
    $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
    if ($process) {
        Write-Host "Killing process on port $port..." -ForegroundColor Red
        Stop-Process -Id $process -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 1
    }
}

Write-Host ""

# Start Flask Service
Write-Host "[1/3] Starting Flask Service (Port 5000)..." -ForegroundColor Green
Push-Location "$PSScriptRoot\backend\flask-service"
$flaskProcess = Start-Process python -ArgumentList "app.py" -PassThru -WindowStyle Hidden
$env:FLASK_PID = $flaskProcess.Id
Pop-Location
Start-Sleep -Seconds 2

if (Test-Port 5000) {
    Write-Host "✓ Flask Service running on http://127.0.0.1:5000" -ForegroundColor Green
} else {
    Write-Host "✗ Flask Service failed to start" -ForegroundColor Red
}

Write-Host ""

# Start Node Service
Write-Host "[2/3] Starting Node Service (Port 3000)..." -ForegroundColor Green
Push-Location "$PSScriptRoot\backend\node-service"
$env:PORT = "3000"
$env:DOWNSTREAM_BASE_URL = "http://127.0.0.1:5000"
$nodeProcess = Start-Process node -ArgumentList "src/index.js" -PassThru -WindowStyle Hidden
$env:NODE_PID = $nodeProcess.Id
Pop-Location
Start-Sleep -Seconds 2

if (Test-Port 3000) {
    Write-Host "✓ Node Service running on http://127.0.0.1:3000" -ForegroundColor Green
} else {
    Write-Host "✗ Node Service failed to start" -ForegroundColor Red
}

Write-Host ""

# Start Frontend
Write-Host "[3/3] Starting Frontend (Port 5173)..." -ForegroundColor Green
Push-Location "$PSScriptRoot\frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "pnpm run dev" -WindowStyle Normal
Pop-Location
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "All Services Started!" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Service URLs:" -ForegroundColor Yellow
Write-Host "  Frontend:  http://localhost:5173" -ForegroundColor White
Write-Host "  Node API:  http://127.0.0.1:3000" -ForegroundColor White
Write-Host "  Flask API: http://127.0.0.1:5000" -ForegroundColor White
Write-Host ""
Write-Host "API Endpoints to test:" -ForegroundColor Yellow
Write-Host "  GET http://127.0.0.1:3000/healthz" -ForegroundColor White
Write-Host "  GET http://127.0.0.1:3000/api/restaurants" -ForegroundColor White
Write-Host "  GET http://127.0.0.1:3000/api/menu/res-4" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop this script (services will continue running)" -ForegroundColor Yellow
Write-Host "To stop all services, run: .\stop-all.ps1" -ForegroundColor Yellow
Write-Host ""

# Keep script running
while ($true) {
    Start-Sleep -Seconds 10
}
