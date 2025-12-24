# Start all services locally (no Docker)
# Runs Flask backend, Node.js backend, and React frontend in separate terminal windows

Write-Host "Starting Food Delivery App (Local Mode)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start Flask Service
Write-Host "Starting Flask Service (Port 5000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend\flask-service'; Write-Host 'Flask Menu Service' -ForegroundColor Green; python main.py"
Start-Sleep -Seconds 2

# Start Node.js Service
Write-Host "Starting Node.js Service (Port 3000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend\node-service'; Write-Host 'Node.js API Gateway' -ForegroundColor Green; npm start"
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "Starting React Frontend (Port 5173)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; Write-Host 'React Frontend' -ForegroundColor Cyan; npm run dev"

Write-Host ""
Write-Host "All services started in separate windows!" -ForegroundColor Green
Write-Host ""
Write-Host "Access points:" -ForegroundColor Cyan
Write-Host "  Frontend:     http://localhost:5173" -ForegroundColor White
Write-Host "  Node.js API:  http://localhost:3000" -ForegroundColor White
Write-Host "  Flask API:    http://localhost:5000" -ForegroundColor White
Write-Host ""
Write-Host "To stop: Close each terminal window or press Ctrl+C in each" -ForegroundColor Yellow
Write-Host ""
