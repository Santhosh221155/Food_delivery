# Start Node Service (Terminal 2)
Write-Host "Starting Node Service on port 3000..." -ForegroundColor Green
Push-Location "D:\System Design\Food_delivery_app\backend\node-service"
$env:PORT = "3000"
$env:DOWNSTREAM_BASE_URL = "http://127.0.0.1:5000"
npm start
