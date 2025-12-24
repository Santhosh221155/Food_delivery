# Start Flask Service (Terminal 1)
Write-Host "Starting Flask Service on port 5000..." -ForegroundColor Green
Push-Location "D:\System Design\Food_delivery_app\backend\flask-service"
$env:PORT = "5000"
python app.py
